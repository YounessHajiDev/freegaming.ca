// Builds public/data/game-instructions.json: { [source_id]: "How to play…" }
// from the GameMonetize public feed (plus the local feed snapshots in the repo root).
// Usage: node scripts/build-game-instructions.mjs [maxFeedPages]
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs'

const SUPABASE_URL = process.env.VITE_SUPABASE_URL ?? 'https://abcpnoldfloyfcrlmcns.supabase.co'
const ANON = process.env.VITE_SUPABASE_ANON_KEY ?? readFileSync('vite.config.ts', 'utf8').match(/'(eyJ[^']+)'/)[1]
const MAX_PAGES = Number(process.argv[2] ?? 80)
const OUT = 'public/data/game-instructions.json'

const ENTITY_WORDS = { rsquo: "'", lsquo: "'", rdquo: '"', ldquo: '"', mdash: '—', ndash: '–', hellip: '…', bull: '•', amp: '&', nbsp: ' ', quot: '"', times: '×', rarr: '→', larr: '←', uarr: '↑', darr: '↓' }

export function cleanInstructions(raw) {
  let s = String(raw ?? '')
  s = s.replace(/&([a-z]+);/gi, (m, w) => ENTITY_WORDS[w.toLowerCase()] ?? m)
  s = s.replace(/\b([a-z]+)\b/gi, (m, w) => (ENTITY_WORDS[w] && w === w.toLowerCase() && w.length > 3 ? ENTITY_WORDS[w] : m))
  s = s.replace(/\s+'\s*s\b/g, "'s").replace(/\s+'\s*(t|re|ll|ve|d|m)\b/g, "'$1")
  s = s.replace(/\s+/g, ' ').trim()
  return s
}

async function activeIds() {
  const ids = new Set()
  for (let from = 0; ; from += 1000) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/games?select=source_id&is_active=eq.true&source=eq.GAMEMONETIZE`, {
      headers: { apikey: ANON, Authorization: `Bearer ${ANON}`, Range: `${from}-${from + 999}` },
    })
    const rows = await res.json()
    rows.forEach(r => ids.add(String(r.source_id)))
    if (rows.length < 1000) break
  }
  return ids
}

function collect(list, ids, out) {
  for (const g of Array.isArray(list) ? list : [list]) {
    if (!g || typeof g !== 'object') continue
    const id = String(g.id)
    if (ids.has(id) && g.instructions && !out[id]) {
      const txt = cleanInstructions(g.instructions)
      if (txt.length >= 15) out[id] = txt
    }
  }
}

const ids = await activeIds()
const out = existsSync(OUT) ? JSON.parse(readFileSync(OUT, 'utf8')) : {}
for (const f of readdirSync('.').filter(f => /^(games_raw|games_extra|gm_page_\d+)\.json$/.test(f))) {
  for (const line of readFileSync(f, 'utf8').split('\n')) {
    const t = line.trim()
    if (!t.startsWith('[') && !t.startsWith('{')) continue
    try { collect(JSON.parse(t), ids, out) } catch { /* skip page separators */ }
  }
}
for (let page = 1; page <= MAX_PAGES && Object.keys(out).filter(k => ids.has(k)).length < ids.size; page++) {
  const res = await fetch(`https://gamemonetize.com/feed.php?format=0&num=100&page=${page}`)
  if (!res.ok) break
  const list = await res.json().catch(() => [])
  if (!Array.isArray(list) || list.length === 0) break
  collect(list, ids, out)
}
const final = Object.fromEntries(Object.entries(out).filter(([k]) => ids.has(k)).sort(([a], [b]) => Number(a) - Number(b)))
writeFileSync(OUT, JSON.stringify(final) + '\n')
console.log(`instructions: ${Object.keys(final).length}/${ids.size} active games`)

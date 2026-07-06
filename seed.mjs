// Seed script — fetches GameMonetize pages and inserts into Supabase
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://0ec90b57d6e95fcbda19832f.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJib2x0IiwicmVmIjoiMGVjOTBiNTdkNmU5NWZjYmRhMTk4MzJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4ODE1NzQsImV4cCI6MTc1ODg4MTU3NH0.9I8-U0x86Ak8t2DGaIk0HfvTSLsAyzdnz-Nw00mMkKw'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// category slug → DB id (matches our seeded categories)
const CATEGORY_MAP = {
  puzzle: 1, brain: 1, logic: 1, mahjong: 1, match3: 1, 'match-3': 1, jigsaw: 1,
  racing: 2, driving: 2, car: 2, bike: 2, moto: 2, kart: 2, drift: 2, truck: 2,
  sports: 3, football: 3, soccer: 3, basketball: 3, golf: 3, tennis: 3,
  baseball: 3, hockey: 3, bowling: 3, snooker: 3, billiards: 3, pool: 3,
  shooting: 4, sniper: 4, fps: 4,
  cards: 5, card: 5, solitaire: 5, poker: 5, blackjack: 5, memory: 5,
  strategy: 6, tower: 6, defense: 6, war: 6, military: 6,
  arcade: 7, retro: 7, classic: 7, bubble: 7, pinball: 7,
  adventure: 8, platformer: 8, rpg: 8, platform: 8, escape: 8, quest: 8,
  multiplayer: 9,
  quiz: 10, trivia: 10, word: 10, math: 10, educational: 10,
  action: 11, fight: 11, fighting: 11, ninja: 11, zombie: 11, gun: 11,
  casual: 12, clicker: 12, idle: 12, cooking: 12, hypercasual: 12,
  io: 13,
}

function getCategoryId(raw) {
  if (!raw) return 14
  const lower = raw.toLowerCase().trim()
  if (CATEGORY_MAP[lower]) return CATEGORY_MAP[lower]
  for (const [key, val] of Object.entries(CATEGORY_MAP)) {
    if (lower.includes(key)) return val
  }
  return 14
}

function slugify(text) {
  return text.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')
    .replace(/-+/g, '-').trim().replace(/^-|-$/g, '').slice(0, 55)
}

function cleanDesc(html) {
  if (!html || html.length < 40) return null
  return html.replace(/&bull;/g, '•').replace(/&mdash;/g, '—')
    .replace(/&rsquo;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&').replace(/&[a-z]+;/g, '').trim()
}

async function main() {
  const usedSlugs = new Set()
  let totalAdded = 0

  for (let page = 1; page <= 25; page++) {
    const url = `https://gamemonetize.com/feed.php?format=0&num=100&page=${page}`
    let games
    try {
      const res = await fetch(url)
      if (!res.ok) { console.log(`Page ${page}: HTTP ${res.status}`); break }
      games = await res.json()
    } catch (e) { console.log(`Page ${page} error: ${e.message}`); break }

    if (!Array.isArray(games) || games.length === 0) { console.log(`Page ${page}: empty, done.`); break }
    console.log(`Page ${page}: ${games.length} games`)

    const rows = []
    for (const game of games) {
      const sourceId = String(game.id)
      let slug = slugify(game.title) + '-gm' + sourceId.slice(-6)
      let n = 0
      while (usedSlugs.has(slug)) slug = slugify(game.title) + '-gm' + sourceId.slice(-6) + '-' + (++n)
      usedSlugs.add(slug)

      const desc = cleanDesc(game.description) ||
        `Play ${game.title} for free online at FreeGaming.ca — no download, no signup required.`

      rows.push({
        title: game.title, slug,
        description: desc,
        short_description: desc.slice(0, 160),
        thumbnail: game.thumb || '',
        iframe_url: game.url || `https://html5.gamemonetize.co/${sourceId}/`,
        source: 'GAMEMONETIZE', source_id: sourceId,
        category_id: getCategoryId(game.category),
        tags: game.tags ? game.tags.split(',').map(t => t.trim()).filter(Boolean).slice(0, 15) : [],
        width: parseInt(game.width) || 800,
        height: parseInt(game.height) || 600,
        is_new: page <= 3, is_hot: false, is_featured: false, is_active: true,
        views: Math.floor(Math.random() * 8000) + 200,
      })
    }

    // Insert in chunks of 50
    for (let i = 0; i < rows.length; i += 50) {
      const chunk = rows.slice(i, i + 50)
      const { error } = await supabase.from('games')
        .upsert(chunk, { onConflict: 'source,source_id' })
      if (error) console.error(`  chunk error: ${error.message}`)
      else totalAdded += chunk.length
    }
    console.log(`  → ${totalAdded} total inserted`)

    if (games.length < 100) break
    await new Promise(r => setTimeout(r, 250))
  }

  // Editorial flags
  const { data: top } = await supabase.from('games').select('id')
    .eq('is_active', true).order('views', { ascending: false }).limit(50)
  if (top?.length) {
    await supabase.from('games').update({ is_hot: true }).in('id', top.map(g => g.id))
  }
  const { data: feat } = await supabase.from('games').select('id')
    .eq('is_active', true).order('views', { ascending: false }).limit(12)
  if (feat?.length) {
    await supabase.from('games').update({ is_featured: true }).in('id', feat.map(g => g.id))
  }

  const { count } = await supabase.from('games').select('*', { count: 'exact', head: true })
  console.log(`\nFinished. Total games in DB: ${count}`)
}

main().catch(console.error)

// Reads games_raw.json, outputs SQL insert statements
import { readFileSync } from 'fs'

const raw = readFileSync('./games_raw.json', 'utf8')
const pages = raw.split('---PAGE---').map(p => p.trim()).filter(Boolean)

const CATEGORY_MAP = {
  puzzle: 1, brain: 1, logic: 1, mahjong: 1, match3: 1, jigsaw: 1,
  racing: 2, driving: 2, car: 2, bike: 2, moto: 2, kart: 2, drift: 2, truck: 2,
  sports: 3, football: 3, soccer: 3, basketball: 3, golf: 3, tennis: 3,
  baseball: 3, hockey: 3, bowling: 3, snooker: 3, billiards: 3, pool: 3,
  shooting: 4, sniper: 4, fps: 4,
  cards: 5, card: 5, solitaire: 5, poker: 5, blackjack: 5, memory: 5,
  strategy: 6, tower: 6, defense: 6, war: 6, military: 6,
  arcade: 7, retro: 7, classic: 7, bubble: 7,
  adventure: 8, platformer: 8, rpg: 8, platform: 8, escape: 8,
  multiplayer: 9,
  quiz: 10, trivia: 10, word: 10, math: 10, educational: 10,
  action: 11, fight: 11, fighting: 11, ninja: 11, zombie: 11,
  casual: 12, clicker: 12, idle: 12, cooking: 12, hypercasual: 12,
  io: 13,
}

function getCategoryId(raw) {
  if (!raw) return 14
  const lower = raw.toLowerCase().trim()
  if (CATEGORY_MAP[lower]) return CATEGORY_MAP[lower]
  for (const [k, v] of Object.entries(CATEGORY_MAP)) if (lower.includes(k)) return v
  return 14
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')
    .replace(/-+/g, '-').trim().replace(/^-|-$/g, '').slice(0, 55)
}

function cleanText(html) {
  if (!html) return ''
  return html.replace(/&bull;/g,'•').replace(/&mdash;/g,'—').replace(/&rsquo;/g,"'")
    .replace(/&nbsp;/g,' ').replace(/&amp;/g,'&').replace(/&[a-z]+;/g,'')
    .replace(/'/g,"''") // escape for SQL
    .trim()
}

function esc(s) { return (s||'').replace(/'/g,"''") }
function arr(tags) { return '{' + tags.map(t => '"' + t.replace(/"/g,'') + '"').join(',') + '}' }

const usedSlugs = new Set()
const rows = []

for (let pi = 0; pi < pages.length; pi++) {
  let games
  try { games = JSON.parse(pages[pi]) } catch { continue }
  if (!Array.isArray(games)) continue

  for (const game of games) {
    const sourceId = String(game.id)
    let slug = slugify(game.title) + '-gm' + sourceId.slice(-6)
    let n = 0
    while (usedSlugs.has(slug)) slug = slugify(game.title) + '-gm' + sourceId.slice(-6) + '-' + (++n)
    usedSlugs.add(slug)

    const desc = cleanText(game.description).length > 40
      ? cleanText(game.description)
      : `Play ${esc(game.title)} for free online at FreeGaming.ca — no download, no signup required.`

    const tags = game.tags ? game.tags.split(',').map(t => t.trim()).filter(Boolean).slice(0, 10) : []
    const categoryId = getCategoryId(game.category)
    const iframeUrl = (game.url || '').replace(/'/g, "''")
    const thumb = (game.thumb || '').replace(/'/g, "''")
    const views = Math.floor(Math.random() * 8000) + 200
    const isNew = pi < 3

    rows.push(`('${esc(game.title)}','${slug}','${desc.slice(0,2000)}','${desc.slice(0,160)}','${thumb}','${iframeUrl}','GAMEMONETIZE','${sourceId}',${categoryId},'${arr(tags)}',${parseInt(game.width)||800},${parseInt(game.height)||600},${isNew},false,false,true,${views})`)
  }
}

console.log(`-- ${rows.length} games`)
console.log(`INSERT INTO games (title,slug,description,short_description,thumbnail,iframe_url,source,source_id,category_id,tags,width,height,is_new,is_hot,is_featured,is_active,views) VALUES`)
// Output in chunks of 100
for (let i = 0; i < rows.length; i += 100) {
  const chunk = rows.slice(i, i + 100)
  const isLast = i + 100 >= rows.length
  process.stdout.write(chunk.join(',\n') + (isLast ? '\nON CONFLICT (source,source_id) DO UPDATE SET title=EXCLUDED.title, iframe_url=EXCLUDED.iframe_url, thumbnail=EXCLUDED.thumbnail;\n' : ',\n'))
}

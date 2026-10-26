// Statically prerenders every public route into dist/<route>/index.html so crawlers
// (Googlebot, AdSense) receive real page content and metadata without running JS.
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const DIST = resolve('dist')
const SSR_ENTRY = resolve('dist-ssr/entry-server.js')
const SITE_URL = 'https://www.freegaming.ca'
const CATEGORY_PAGE_SIZE = 20
const CARD_FIELDS = ['id', 'title', 'slug', 'thumbnail', 'short_description', 'is_new', 'is_hot', 'is_featured', 'views', 'category_id']

// supabase-js constructs a realtime client eagerly; Node < 22 has no global WebSocket and realtime is unused here.
globalThis.WebSocket ??= class { constructor() { throw new Error('WebSocket unavailable during prerender') } }

const ssr = await import(pathToFileURL(SSR_ENTRY).href)
const template = readFileSync(join(DIST, 'index.html'), 'utf8')

// Unrendered SPA shell for client-only routes (search, admin, games added after the last build).
writeFileSync(join(DIST, 'spa.html'), template)

const safeJson = value => JSON.stringify(value).replace(/</g, '\\u003c')

function buildHtml(path, data, { status } = {}) {
  const { html, head } = ssr.render(path, data)
  let page = template
  // Drop template defaults that the route's Helmet tags override (title, description, og:*, twitter:*).
  const overridden = new Set([...head.matchAll(/<meta[^>]*(?:name|property)="([^"]+)"/g)].map(m => m[1]))
  page = page.replace(/\s*<meta\s+(?:name|property)="([^"]+)"[^>]*>/g, (tag, key) => (overridden.has(key) ? '' : tag))
  if (head.includes('<title')) page = page.replace(/<title>[\s\S]*?<\/title>/, '')
  page = page.replace('</head>', `    ${head}\n  </head>`)
  const seed = status === 404 ? '' : `<script type="application/json" id="__PRERENDER_DATA__">${safeJson({ path, data })}</script>`
  page = page.replace('<div id="root"></div>', `<div id="root">${html}</div>${seed}`)
  return page
}

function write(path, html) {
  const file = path === '/' ? join(DIST, 'index.html') : join(DIST, path, 'index.html')
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, html)
}

async function safely(label, fn, fallback) {
  try { return await fn() } catch (err) {
    console.warn(`[prerender] ${label} failed: ${err instanceof Error ? err.message : err}`)
    return fallback
  }
}

async function fetchAllGames() {
  const rows = []
  for (let from = 0; ; from += 1000) {
    const { data, error } = await ssr.supabase.from('games').select('*, categories(name, slug)')
      .eq('is_active', true).order('views', { ascending: false }).range(from, from + 999)
    if (error) throw new Error(error.message)
    rows.push(...data)
    if (data.length < 1000) break
  }
  return rows
}

const instructions = existsSync(join(DIST, 'data/game-instructions.json'))
  ? JSON.parse(readFileSync(join(DIST, 'data/game-instructions.json'), 'utf8'))
  : {}

const pages = []
const add = (path, data = {}) => pages.push({ path, data })

add('/', await safely('home', async () => ({ home: await ssr.fetchHomeData() }), {}))
add('/popular/', await safely('popular', async () => ({ popular: await ssr.fetchPopularGames() }), {}))
add('/new-games/', await safely('new-games', async () => ({ 'new-games': await ssr.fetchNewGames() }), {}))
for (const p of ['/about/', '/contact/', '/privacy-policy/', '/terms-of-service/']) add(p)
for (const c of ssr.SEO_COLLECTION_PAGES) {
  add(c.path, await safely(c.path, async () => ({ [`collection:${SITE_URL}${c.path}`]: await ssr.fetchCollectionGames(c.categorySlugs) }), {}))
}

const { data: categories } = await safely('categories', () => ssr.supabase.from('categories').select('slug').order('order_num'), { data: [] })
for (const { slug } of categories ?? []) {
  const data = await safely(`category ${slug}`, () => ssr.fetchCategoryData(slug, 0, CATEGORY_PAGE_SIZE), null)
  if (data?.category) add(`/category/${slug}/`, { [`category:${slug}`]: data })
}

const games = await safely('games', fetchAllGames, [])
const byCategory = new Map()
for (const g of games) {
  if (!byCategory.has(g.category_id)) byCategory.set(g.category_id, [])
  byCategory.get(g.category_id).push(g)
}
const toCard = g => ({ ...Object.fromEntries(CARD_FIELDS.map(k => [k, g[k]])), categories: g.categories ? { name: g.categories.name } : undefined })
for (const game of games) {
  const related = (byCategory.get(game.category_id) ?? []).filter(g => g.id !== game.id).slice(0, 8).map(toCard)
  add(`/games/${game.slug}/`, { [`game:${game.slug}`]: { game, related, instructions: instructions[game.source_id] ?? null } })
}

for (const { path, data } of pages) write(path, buildHtml(path, data))
writeFileSync(join(DIST, '404.html'), buildHtml('/404-not-found/', {}, { status: 404 }))
rmSync(resolve('dist-ssr'), { recursive: true, force: true })

console.log(`[prerender] ${pages.length} routes (${games.length} games, ${categories?.length ?? 0} categories) + 404.html`)

import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
}

const SITE_DOMAIN = 'freegaming.ca'
const SITE_URL = 'https://freegaming.ca'

// ─── Category mapping ─────────────────────────────────────────────────────────

const CATEGORY_MAP: Record<string, string> = {
  // Puzzle
  puzzle: 'puzzle-games', brain: 'puzzle-games', logic: 'puzzle-games',
  mahjong: 'puzzle-games', match3: 'puzzle-games', 'match-3': 'puzzle-games',
  jigsaw: 'puzzle-games', block: 'puzzle-games', sliding: 'puzzle-games',
  // Racing
  racing: 'racing-games', driving: 'racing-games', car: 'racing-games',
  bike: 'racing-games', moto: 'racing-games', formula: 'racing-games',
  kart: 'racing-games', drift: 'racing-games', truck: 'racing-games',
  // Sports
  sports: 'sports-games', football: 'sports-games', soccer: 'sports-games',
  basketball: 'sports-games', golf: 'sports-games', tennis: 'sports-games',
  baseball: 'sports-games', hockey: 'sports-games', bowling: 'sports-games',
  snooker: 'sports-games', billiards: 'sports-games', pool: 'sports-games',
  // Shooting
  shooting: 'shooting-games', sniper: 'shooting-games', fps: 'shooting-games',
  // Action
  action: 'action-games', fight: 'action-games', fighting: 'action-games',
  beat: 'action-games', ninja: 'action-games', warrior: 'action-games',
  zombie: 'action-games', gun: 'action-games',
  // Card
  cards: 'card-games', card: 'card-games', solitaire: 'card-games',
  poker: 'card-games', blackjack: 'card-games', memory: 'card-games',
  // Strategy
  strategy: 'strategy-games', tower: 'strategy-games', 'tower-defense': 'strategy-games',
  defense: 'strategy-games', 'tower defense': 'strategy-games', war: 'strategy-games',
  military: 'strategy-games',
  // Arcade
  arcade: 'arcade-games', retro: 'arcade-games', classic: 'arcade-games',
  bubble: 'arcade-games', pinball: 'arcade-games',
  // Casual
  casual: 'casual-games', clicker: 'casual-games', idle: 'casual-games',
  tapping: 'casual-games', cutting: 'casual-games', cooking: 'casual-games',
  // Adventure
  adventure: 'adventure-games', platformer: 'adventure-games', rpg: 'adventure-games',
  platform: 'adventure-games', escape: 'adventure-games', quest: 'adventure-games',
  // Multiplayer
  multiplayer: 'multiplayer-games', '2player': 'multiplayer-games',
  '2-player': 'multiplayer-games', 'two player': 'multiplayer-games',
  // IO
  io: 'io-games', '.io': 'io-games',
  // Thinking
  quiz: 'thinking-games', trivia: 'thinking-games', word: 'thinking-games',
  crossword: 'thinking-games', educational: 'thinking-games', math: 'thinking-games',
}

function getCategorySlug(raw: string): string {
  if (!raw) return 'other-games'
  const lower = raw.toLowerCase().trim()
  if (CATEGORY_MAP[lower]) return CATEGORY_MAP[lower]
  // Try partial match
  for (const [key, val] of Object.entries(CATEGORY_MAP)) {
    if (lower.includes(key)) return val
  }
  return 'other-games'
}

function slugifyEn(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .replace(/^-|-$/g, '')
    .slice(0, 60)
}

function buildDescription(title: string, raw: string, category: string): string {
  if (raw && raw.length > 40) return raw
  return `Play ${title} for free online at FreeGaming.ca — no download, no signup required. Jump straight into this exciting ${category.toLowerCase()} game directly in your browser. Works on desktop, tablet, and mobile. Canada's best free gaming portal.`
}

// ─── Types ───────────────────────────────────────────────────────────────────

interface SyncResult { added: number; updated: number; errors: string[]; fetched: number }

interface CatMap { [slug: string]: number }

// ─── GameMonetize ─────────────────────────────────────────────────────────────

interface GMGame {
  id: string; title: string; description: string; url: string
  category: string; tags: string; thumb: string; width: string; height: string
}

async function syncGameMonetize(
  supabase: ReturnType<typeof createClient>,
  catMap: CatMap,
  maxPages = 20
): Promise<SyncResult> {
  let added = 0, updated = 0, fetched = 0
  const errors: string[] = []

  for (let page = 1; page <= maxPages; page++) {
    try {
      const url = `https://gamemonetize.com/feed.php?format=0&num=100&page=${page}`
      const res = await fetch(url, {
        signal: AbortSignal.timeout(25000),
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json, text/plain, */*',
        },
      })
      if (!res.ok) { errors.push(`GM page ${page}: HTTP ${res.status}`); break }

      let games: GMGame[]
      try {
        games = await res.json()
      } catch {
        errors.push(`GM page ${page}: invalid JSON`)
        break
      }
      if (!Array.isArray(games) || games.length === 0) break
      fetched += games.length

      for (const game of games) {
        try {
          const catSlug = getCategorySlug(game.category)
          const categoryId = catMap[catSlug] ?? catMap['other-games']
          if (!categoryId) continue

          const sourceId = String(game.id)
          // Use the url field from the feed directly (most reliable)
          const iframeUrl = game.url || `https://html5.gamemonetize.co/${sourceId}/`
          const description = buildDescription(game.title, game.description, game.category)
          const tags = game.tags ? game.tags.split(',').map((t: string) => t.trim()).filter(Boolean).slice(0, 15) : []
          const baseSlug = slugifyEn(game.title) + '-gm' + sourceId.slice(-6)

          const { data: existing } = await supabase
            .from('games').select('id').eq('source', 'GAMEMONETIZE').eq('source_id', sourceId).maybeSingle()

          const gameData = {
            title: game.title,
            description,
            short_description: description.slice(0, 160),
            thumbnail: game.thumb || `https://placehold.co/400x300/0f1a12/39ff14?text=${encodeURIComponent(game.title)}`,
            iframe_url: iframeUrl,
            source: 'GAMEMONETIZE',
            source_id: sourceId,
            category_id: categoryId,
            tags,
            width: parseInt(game.width) || 800,
            height: parseInt(game.height) || 600,
            is_new: page <= 3,
            is_active: true,
          }

          if (existing) {
            await supabase.from('games').update(gameData).eq('id', existing.id)
            updated++
          } else {
            let slug = baseSlug
            const { data: conflict } = await supabase.from('games').select('id').eq('slug', slug).maybeSingle()
            if (conflict) slug = slug + '-' + Math.random().toString(36).slice(2, 5)
            await supabase.from('games').insert({ ...gameData, slug })
            added++
          }
        } catch (e) {
          errors.push(`GM game ${game?.id}: ${String(e).slice(0, 80)}`)
        }
      }

      if (games.length < 100) break
      await new Promise(r => setTimeout(r, 400))
    } catch (e) {
      errors.push(`GM page ${page}: ${String(e).slice(0, 80)}`)
      break
    }
  }

  return { added, updated, errors, fetched }
}

// ─── GameDistribution ─────────────────────────────────────────────────────────

interface GDGame {
  id: string; title: string; description: string; category: string
  tags: string[]; thumb: string; width: number; height: number; md5: string
}

interface GDResponse { count: number; data: GDGame[] }

async function syncGameDistribution(
  supabase: ReturnType<typeof createClient>,
  catMap: CatMap,
  maxPages = 15
): Promise<SyncResult> {
  let added = 0, updated = 0, fetched = 0
  const errors: string[] = []
  const limit = 100

  for (let page = 0; page < maxPages; page++) {
    try {
      const url = `https://api.gamedistribution.com/api/game/get-list/?amount=${limit}&start=${page * limit}`
      const res = await fetch(url, {
        signal: AbortSignal.timeout(25000),
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Origin': SITE_URL,
          'Referer': SITE_URL + '/',
        },
      })
      if (!res.ok) { errors.push(`GD page ${page}: HTTP ${res.status}`); break }

      const body: GDResponse = await res.json()
      const games = body?.data ?? (Array.isArray(body) ? body : [])
      if (!games.length) break
      fetched += games.length

      for (const game of games as GDGame[]) {
        try {
          const catSlug = getCategorySlug(game.category ?? '')
          const categoryId = catMap[catSlug] ?? catMap['other-games']
          if (!categoryId) continue

          // GD iframe URL uses md5 or id
          const md5 = game.md5 || game.id
          const iframeUrl = `https://html5.gamedistribution.com/${md5}/?gd_sdk_referrer_url=${encodeURIComponent(`${SITE_URL}/games/`)}`
          const sourceId = String(game.id ?? game.md5)
          const description = buildDescription(game.title, game.description ?? '', game.category ?? '')
          const tags = Array.isArray(game.tags) ? game.tags.slice(0, 15) : []
          const baseSlug = slugifyEn(game.title) + '-gd' + sourceId.slice(-6)
          const thumbnail = game.thumb || `https://placehold.co/400x300/0f1a12/39ff14?text=${encodeURIComponent(game.title)}`

          const { data: existing } = await supabase
            .from('games').select('id').eq('source', 'GAMEDISTRIBUTION').eq('source_id', sourceId).maybeSingle()

          const gameData = {
            title: game.title,
            description,
            short_description: description.slice(0, 160),
            thumbnail,
            iframe_url: iframeUrl,
            source: 'GAMEDISTRIBUTION',
            source_id: sourceId,
            category_id: categoryId,
            tags,
            width: game.width || 800,
            height: game.height || 600,
            is_new: page === 0,
            is_active: true,
          }

          if (existing) {
            await supabase.from('games').update(gameData).eq('id', existing.id)
            updated++
          } else {
            let slug = baseSlug
            const { data: conflict } = await supabase.from('games').select('id').eq('slug', slug).maybeSingle()
            if (conflict) slug = slug + '-' + Math.random().toString(36).slice(2, 5)
            await supabase.from('games').insert({ ...gameData, slug })
            added++
          }
        } catch (e) {
          errors.push(`GD game ${game?.id}: ${String(e).slice(0, 80)}`)
        }
      }

      if (games.length < limit) break
      await new Promise(r => setTimeout(r, 400))
    } catch (e) {
      errors.push(`GD page ${page}: ${String(e).slice(0, 80)}`)
      break
    }
  }

  return { added, updated, errors, fetched }
}

// ─── HTML5Games.com ───────────────────────────────────────────────────────────

interface H5Game {
  id: string; title: string; description: string; category: string
  tags: string; thumb: string; url: string; width: string; height: string
}

async function syncHTML5Games(
  supabase: ReturnType<typeof createClient>,
  catMap: CatMap,
  maxPages = 10
): Promise<SyncResult> {
  let added = 0, updated = 0, fetched = 0
  const errors: string[] = []

  // HTML5Games.com API endpoint
  for (let page = 0; page < maxPages; page++) {
    try {
      const url = `https://www.htmlgames.com/json.php?start=${page * 100}&num=100`
      const res = await fetch(url, {
        signal: AbortSignal.timeout(25000),
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer': SITE_URL + '/',
        },
      })
      if (!res.ok) { errors.push(`H5 page ${page}: HTTP ${res.status}`); break }

      let games: H5Game[]
      try {
        games = await res.json()
      } catch {
        errors.push(`H5 page ${page}: invalid JSON`)
        break
      }

      if (!Array.isArray(games) || games.length === 0) break
      fetched += games.length

      for (const game of games) {
        try {
          if (!game.title || !game.url) continue
          const catSlug = getCategorySlug(game.category ?? '')
          const categoryId = catMap[catSlug] ?? catMap['other-games']
          if (!categoryId) continue

          const sourceId = String(game.id)
          // HTML5Games embed URL
          const iframeUrl = game.url.startsWith('http') ? game.url : `https://www.htmlgames.com${game.url}`
          const description = buildDescription(game.title, game.description ?? '', game.category ?? '')
          const tags = game.tags ? game.tags.split(',').map((t: string) => t.trim()).filter(Boolean).slice(0, 15) : []
          const baseSlug = slugifyEn(game.title) + '-h5' + sourceId.slice(-6)
          const thumbnail = game.thumb || `https://placehold.co/400x300/0f1a12/39ff14?text=${encodeURIComponent(game.title)}`

          const { data: existing } = await supabase
            .from('games').select('id').eq('source', 'HTML5GAMES').eq('source_id', sourceId).maybeSingle()

          const gameData = {
            title: game.title,
            description,
            short_description: description.slice(0, 160),
            thumbnail,
            iframe_url: iframeUrl,
            source: 'HTML5GAMES',
            source_id: sourceId,
            category_id: categoryId,
            tags,
            width: parseInt(game.width) || 800,
            height: parseInt(game.height) || 600,
            is_new: page === 0,
            is_active: true,
          }

          if (existing) {
            await supabase.from('games').update(gameData).eq('id', existing.id)
            updated++
          } else {
            let slug = baseSlug
            const { data: conflict } = await supabase.from('games').select('id').eq('slug', slug).maybeSingle()
            if (conflict) slug = slug + '-' + Math.random().toString(36).slice(2, 5)
            await supabase.from('games').insert({ ...gameData, slug })
            added++
          }
        } catch (e) {
          errors.push(`H5 game ${game?.id}: ${String(e).slice(0, 80)}`)
        }
      }

      if (games.length < 100) break
      await new Promise(r => setTimeout(r, 400))
    } catch (e) {
      errors.push(`H5 page ${page}: ${String(e).slice(0, 80)}`)
      break
    }
  }

  return { added, updated, errors, fetched }
}

// ─── Post-sync editorial flags ────────────────────────────────────────────────

async function applyEditorialFlags(supabase: ReturnType<typeof createClient>) {
  // Reset all flags first
  await supabase.from('games').update({ is_hot: false }).eq('is_hot', true)
  await supabase.from('games').update({ is_featured: false }).eq('is_featured', true)

  // Top 50 by views → HOT
  const { data: topGames } = await supabase
    .from('games').select('id').eq('is_active', true)
    .order('views', { ascending: false }).limit(50)
  if (topGames?.length) {
    await supabase.from('games')
      .update({ is_hot: true })
      .in('id', topGames.map((g: { id: number }) => g.id))
  }

  // Top 12 across different categories → FEATURED
  const { data: featuredGames } = await supabase
    .from('games').select('id')
    .eq('is_active', true)
    .order('views', { ascending: false })
    .limit(12)
  if (featuredGames?.length) {
    await supabase.from('games')
      .update({ is_featured: true })
      .in('id', featuredGames.map((g: { id: number }) => g.id))
  }

  // Newest 100 → NEW
  const cutoff = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
  await supabase.from('games')
    .update({ is_new: true })
    .gte('created_at', cutoff)
    .eq('is_active', true)
}

// ─── Main handler ─────────────────────────────────────────────────────────────

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders })
  }

  try {
    const body = await req.json().catch(() => ({})) as {
      source?: string
      maxPages?: number
    }
    const source = body.source ?? 'all'
    const maxPages = body.maxPages ?? 20

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Load category map
    const { data: catRows } = await supabase.from('categories').select('id, slug')
    const catMap: CatMap = {}
    for (const c of catRows ?? []) catMap[c.slug] = c.id

    const results: Record<string, SyncResult> = {}

    if (source === 'gamemonetize' || source === 'all') {
      console.log('Syncing GameMonetize...')
      results.gamemonetize = await syncGameMonetize(supabase, catMap, source === 'all' ? maxPages : maxPages)
      await supabase.from('sync_logs').insert({
        source: 'GAMEMONETIZE',
        total_fetched: results.gamemonetize.fetched,
        added: results.gamemonetize.added,
        updated: results.gamemonetize.updated,
        errors: results.gamemonetize.errors.slice(0, 5).join('; ') || null,
      })
    }

    if (source === 'gamedistribution' || source === 'all') {
      console.log('Syncing GameDistribution...')
      results.gamedistribution = await syncGameDistribution(supabase, catMap, source === 'all' ? 10 : maxPages)
      await supabase.from('sync_logs').insert({
        source: 'GAMEDISTRIBUTION',
        total_fetched: results.gamedistribution.fetched,
        added: results.gamedistribution.added,
        updated: results.gamedistribution.updated,
        errors: results.gamedistribution.errors.slice(0, 5).join('; ') || null,
      })
    }

    if (source === 'html5games' || source === 'all') {
      console.log('Syncing HTML5Games...')
      results.html5games = await syncHTML5Games(supabase, catMap, source === 'all' ? 10 : maxPages)
      await supabase.from('sync_logs').insert({
        source: 'HTML5GAMES',
        total_fetched: results.html5games.fetched,
        added: results.html5games.added,
        updated: results.html5games.updated,
        errors: results.html5games.errors.slice(0, 5).join('; ') || null,
      })
    }

    // Apply editorial flags after any sync
    await applyEditorialFlags(supabase)

    const totalAdded   = Object.values(results).reduce((s, r) => s + r.added, 0)
    const totalUpdated = Object.values(results).reduce((s, r) => s + r.updated, 0)
    const totalFetched = Object.values(results).reduce((s, r) => s + r.fetched, 0)
    const allErrors    = Object.entries(results).flatMap(([k, r]) => r.errors.map(e => `[${k}] ${e}`))

    return new Response(
      JSON.stringify({ success: true, added: totalAdded, updated: totalUpdated, fetched: totalFetched, errors: allErrors.slice(0, 10), perSource: results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err instanceof Error ? err.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

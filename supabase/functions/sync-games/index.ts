import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
}

const SITE_URL = 'https://www.freegaming.ca'

const CATEGORY_MAP: Record<string, string> = {
  puzzle: 'puzzle-games', brain: 'puzzle-games', logic: 'puzzle-games',
  mahjong: 'puzzle-games', 'match3': 'puzzle-games', 'match-3': 'puzzle-games',
  jigsaw: 'puzzle-games', block: 'puzzle-games', sliding: 'puzzle-games',
  sorting: 'puzzle-games', merge: 'puzzle-games',
  racing: 'racing-games', driving: 'racing-games', car: 'racing-games',
  bike: 'racing-games', moto: 'racing-games', formula: 'racing-games',
  kart: 'racing-games', drift: 'racing-games', truck: 'racing-games', bus: 'racing-games',
  sports: 'sports-games', football: 'sports-games', soccer: 'sports-games',
  basketball: 'sports-games', golf: 'sports-games', tennis: 'sports-games',
  baseball: 'sports-games', hockey: 'sports-games', bowling: 'sports-games',
  snooker: 'sports-games', billiards: 'sports-games', pool: 'sports-games',
  cricket: 'sports-games', volleyball: 'sports-games', rugby: 'sports-games',
  shooting: 'shooting-games', sniper: 'shooting-games', fps: 'shooting-games', gun: 'shooting-games',
  action: 'action-games', fight: 'action-games', fighting: 'action-games',
  beat: 'action-games', ninja: 'action-games', warrior: 'action-games',
  zombie: 'action-games', sword: 'action-games', hero: 'action-games', combat: 'action-games',
  cards: 'card-games', card: 'card-games', solitaire: 'card-games',
  poker: 'card-games', blackjack: 'card-games', memory: 'card-games', patience: 'card-games',
  strategy: 'strategy-games', tower: 'strategy-games', 'tower-defense': 'strategy-games',
  defense: 'strategy-games', war: 'strategy-games', military: 'strategy-games',
  chess: 'strategy-games', tactic: 'strategy-games', kingdom: 'strategy-games',
  arcade: 'arcade-games', retro: 'arcade-games', classic: 'arcade-games',
  bubble: 'arcade-games', pinball: 'arcade-games', runner: 'arcade-games',
  casual: 'casual-games', clicker: 'casual-games', idle: 'casual-games',
  tapping: 'casual-games', cutting: 'casual-games', cooking: 'casual-games',
  dress: 'casual-games', makeup: 'casual-games', fashion: 'casual-games',
  adventure: 'adventure-games', platformer: 'adventure-games', rpg: 'adventure-games',
  platform: 'adventure-games', escape: 'adventure-games', quest: 'adventure-games',
  dungeon: 'adventure-games', exploration: 'adventure-games',
  multiplayer: 'multiplayer-games', '2player': 'multiplayer-games',
  '2-player': 'multiplayer-games', 'two player': 'multiplayer-games',
  io: 'io-games', '.io': 'io-games',
  quiz: 'thinking-games', trivia: 'thinking-games', word: 'thinking-games',
  crossword: 'thinking-games', educational: 'thinking-games', math: 'thinking-games',
  science: 'thinking-games', geography: 'thinking-games',
}

function getCategorySlug(raw: string): string {
  if (!raw) return 'other-games'
  const lower = raw.toLowerCase().trim()
  if (CATEGORY_MAP[lower]) return CATEGORY_MAP[lower]
  for (const [key, val] of Object.entries(CATEGORY_MAP)) {
    if (lower.includes(key)) return val
  }
  return 'other-games'
}

function slugifyEn(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')
    .replace(/-+/g, '-').trim().replace(/^-|-$/g, '').slice(0, 55)
}

function buildDescription(title: string, raw: string, category: string): string {
  if (raw && raw.length > 60) return raw
  return `Play ${title} for free online at FreeGaming.ca — no download, no signup required. Jump straight into this exciting ${category.toLowerCase()} game in your browser. Works on desktop, tablet, and mobile.`
}

type CatMap = Record<string, number>

interface GMGame {
  id: string; title: string; description: string; url: string
  category: string; tags: string; thumb: string; width: string; height: string
}

interface GDGame {
  id: string; title: string; description: string; category: string
  tags: string[]; thumb: string; width: number; height: number; md5: string
}

interface H5Game {
  id: string; title: string; description: string; category: string
  tags: string; thumb: string; url: string; width: string; height: string
}

interface SyncResult { added: number; updated: number; errors: string[]; fetched: number }

async function syncGameMonetize(
  supabase: ReturnType<typeof createClient>,
  catMap: CatMap,
  startPage: number,
  maxPages: number,
): Promise<SyncResult> {
  let fetched = 0, added = 0
  const errors: string[] = []

  for (let page = startPage; page < startPage + maxPages; page++) {
    try {
      const res = await fetch(`https://gamemonetize.com/feed.php?format=0&num=100&page=${page}`, {
        signal: AbortSignal.timeout(20000),
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json, */*',
        },
      })
      if (!res.ok) { errors.push(`GM p${page}: HTTP ${res.status}`); break }

      let games: GMGame[]
      try { games = await res.json() } catch { errors.push(`GM p${page}: invalid JSON`); break }
      if (!Array.isArray(games) || games.length === 0) break
      fetched += games.length

      const rows = games.map(game => {
        const sourceId = String(game.id)
        return {
          title: game.title,
          slug: slugifyEn(game.title) + '-gm' + sourceId.slice(-8),
          description: buildDescription(game.title, game.description, game.category),
          short_description: buildDescription(game.title, game.description, game.category).slice(0, 160),
          thumbnail: game.thumb || '',
          iframe_url: game.url || `https://html5.gamemonetize.co/${sourceId}/`,
          source: 'GAMEMONETIZE',
          source_id: sourceId,
          category_id: catMap[getCategorySlug(game.category)] ?? catMap['other-games'] ?? 14,
          tags: game.tags ? game.tags.split(',').map((t: string) => t.trim()).filter(Boolean).slice(0, 15) : [],
          width: parseInt(game.width) || 800,
          height: parseInt(game.height) || 600,
          is_new: (page - startPage) < 3,
          is_active: true,
        }
      })

      const { error } = await supabase.from('games').upsert(rows, { onConflict: 'source,source_id' })
      if (error) errors.push(`GM p${page}: ${error.message}`)
      else added += rows.length

      if (games.length < 100) break
      await new Promise(r => setTimeout(r, 150))
    } catch (e) {
      errors.push(`GM p${page}: ${String(e).slice(0, 100)}`)
      break
    }
  }

  return { added, updated: 0, errors, fetched }
}

async function syncGameDistribution(
  supabase: ReturnType<typeof createClient>,
  catMap: CatMap,
  startPage: number,
  maxPages: number,
): Promise<SyncResult> {
  let fetched = 0, added = 0
  const errors: string[] = []
  const limit = 100

  for (let page = startPage; page < startPage + maxPages; page++) {
    try {
      const res = await fetch(`https://api.gamedistribution.com/api/game/get-list/?amount=${limit}&start=${page * limit}`, {
        signal: AbortSignal.timeout(20000),
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Origin': SITE_URL, 'Referer': SITE_URL + '/',
        },
      })
      if (!res.ok) { errors.push(`GD p${page}: HTTP ${res.status}`); break }

      const body = await res.json()
      const games: GDGame[] = body?.data ?? (Array.isArray(body) ? body : [])
      if (!games.length) break
      fetched += games.length

      const rows = games.map(game => {
        const sourceId = String(game.id ?? game.md5)
        const md5 = game.md5 || game.id
        return {
          title: game.title,
          slug: slugifyEn(game.title) + '-gd' + sourceId.slice(-8),
          description: buildDescription(game.title, game.description ?? '', game.category ?? ''),
          short_description: buildDescription(game.title, game.description ?? '', game.category ?? '').slice(0, 160),
          thumbnail: game.thumb || '',
          iframe_url: `https://html5.gamedistribution.com/${md5}/?gd_sdk_referrer_url=${encodeURIComponent(SITE_URL + '/games/')}`,
          source: 'GAMEDISTRIBUTION',
          source_id: sourceId,
          category_id: catMap[getCategorySlug(game.category ?? '')] ?? catMap['other-games'] ?? 14,
          tags: Array.isArray(game.tags) ? game.tags.slice(0, 15) : [],
          width: game.width || 800,
          height: game.height || 600,
          is_new: page - startPage === 0,
          is_active: true,
        }
      })

      const { error } = await supabase.from('games').upsert(rows, { onConflict: 'source,source_id' })
      if (error) errors.push(`GD p${page}: ${error.message}`)
      else added += rows.length

      if (games.length < limit) break
      await new Promise(r => setTimeout(r, 150))
    } catch (e) {
      errors.push(`GD p${page}: ${String(e).slice(0, 100)}`)
      break
    }
  }

  return { added, updated: 0, errors, fetched }
}

async function syncHTML5Games(
  supabase: ReturnType<typeof createClient>,
  catMap: CatMap,
  startPage: number,
  maxPages: number,
): Promise<SyncResult> {
  let fetched = 0, added = 0
  const errors: string[] = []

  for (let page = startPage; page < startPage + maxPages; page++) {
    try {
      const res = await fetch(`https://www.htmlgames.com/json.php?start=${page * 100}&num=100`, {
        signal: AbortSignal.timeout(20000),
        headers: { 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0', 'Referer': SITE_URL + '/' },
      })
      if (!res.ok) { errors.push(`H5 p${page}: HTTP ${res.status}`); break }

      let games: H5Game[]
      try { games = await res.json() } catch { errors.push(`H5 p${page}: invalid JSON`); break }
      if (!Array.isArray(games) || games.length === 0) break
      fetched += games.length

      const rows = games.filter(g => g.title && g.url).map(game => {
        const sourceId = String(game.id)
        return {
          title: game.title,
          slug: slugifyEn(game.title) + '-h5' + sourceId.slice(-8),
          description: buildDescription(game.title, game.description ?? '', game.category ?? ''),
          short_description: buildDescription(game.title, game.description ?? '', game.category ?? '').slice(0, 160),
          thumbnail: game.thumb || '',
          iframe_url: game.url.startsWith('http') ? game.url : `https://www.htmlgames.com${game.url}`,
          source: 'HTML5GAMES',
          source_id: sourceId,
          category_id: catMap[getCategorySlug(game.category ?? '')] ?? catMap['other-games'] ?? 14,
          tags: game.tags ? game.tags.split(',').map((t: string) => t.trim()).filter(Boolean).slice(0, 15) : [],
          width: parseInt(game.width) || 800,
          height: parseInt(game.height) || 600,
          is_new: page - startPage === 0,
          is_active: true,
        }
      })

      const { error } = await supabase.from('games').upsert(rows, { onConflict: 'source,source_id' })
      if (error) errors.push(`H5 p${page}: ${error.message}`)
      else added += rows.length

      if (games.length < 100) break
      await new Promise(r => setTimeout(r, 150))
    } catch (e) {
      errors.push(`H5 p${page}: ${String(e).slice(0, 100)}`)
      break
    }
  }

  return { added, updated: 0, errors, fetched }
}

async function applyEditorialFlags(supabase: ReturnType<typeof createClient>) {
  await supabase.from('games').update({ is_hot: false }).eq('is_hot', true)
  await supabase.from('games').update({ is_featured: false }).eq('is_featured', true)

  const { data: topGames } = await supabase.from('games').select('id').eq('is_active', true)
    .order('views', { ascending: false }).limit(60)
  if (topGames?.length) {
    await supabase.from('games').update({ is_hot: true }).in('id', topGames.map((g: { id: number }) => g.id))
  }

  const { data: featuredGames } = await supabase.from('games').select('id').eq('is_active', true)
    .order('views', { ascending: false }).limit(16)
  if (featuredGames?.length) {
    await supabase.from('games').update({ is_featured: true }).in('id', featuredGames.map((g: { id: number }) => g.id))
  }

  const cutoff = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
  await supabase.from('games').update({ is_new: true }).gte('created_at', cutoff).eq('is_active', true)
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { status: 200, headers: corsHeaders })

  try {
    const body = await req.json().catch(() => ({})) as {
      source?: string; maxPages?: number; startPage?: number
    }
    const source    = body.source    ?? 'gamemonetize'
    const maxPages  = Math.min(body.maxPages  ?? 20, 50)
    const startPage = Math.max(body.startPage ?? 1,  1)

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const { data: catRows } = await supabase.from('categories').select('id, slug')
    const catMap: CatMap = {}
    for (const c of catRows ?? []) catMap[c.slug] = c.id

    const results: Record<string, SyncResult> = {}

    if (source === 'gamemonetize' || source === 'all') {
      results.gamemonetize = await syncGameMonetize(supabase, catMap, startPage, maxPages)
      await supabase.from('sync_logs').insert({
        source: 'GAMEMONETIZE',
        total_fetched: results.gamemonetize.fetched,
        added: results.gamemonetize.added,
        updated: 0,
        errors: results.gamemonetize.errors.slice(0, 5).join('; ') || null,
      })
    }
    if (source === 'gamedistribution' || source === 'all') {
      results.gamedistribution = await syncGameDistribution(supabase, catMap, source === 'all' ? 0 : startPage, source === 'all' ? 15 : maxPages)
      await supabase.from('sync_logs').insert({
        source: 'GAMEDISTRIBUTION',
        total_fetched: results.gamedistribution.fetched,
        added: results.gamedistribution.added,
        updated: 0,
        errors: results.gamedistribution.errors.slice(0, 5).join('; ') || null,
      })
    }
    if (source === 'html5games' || source === 'all') {
      results.html5games = await syncHTML5Games(supabase, catMap, source === 'all' ? 0 : startPage, source === 'all' ? 10 : maxPages)
      await supabase.from('sync_logs').insert({
        source: 'HTML5GAMES',
        total_fetched: results.html5games.fetched,
        added: results.html5games.added,
        updated: 0,
        errors: results.html5games.errors.slice(0, 5).join('; ') || null,
      })
    }

    await applyEditorialFlags(supabase)

    const totalAdded   = Object.values(results).reduce((s, r) => s + r.added, 0)
    const totalFetched = Object.values(results).reduce((s, r) => s + r.fetched, 0)
    const allErrors    = Object.entries(results).flatMap(([k, r]) => r.errors.map(e => `[${k}] ${e}`))

    return new Response(
      JSON.stringify({ success: true, added: totalAdded, updated: 0, fetched: totalFetched, errors: allErrors.slice(0, 10), perSource: results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err instanceof Error ? err.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  }
})

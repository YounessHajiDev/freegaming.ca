import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
}

const SITE_DOMAIN = 'freegaming.ca'
const GM_FEED = 'https://gamemonetize.com/feed.php'

const CATEGORY_MAP: Record<string, string> = {
  puzzle: 'puzzle-games', brain: 'puzzle-games', logic: 'puzzle-games',
  mahjong: 'puzzle-games', match3: 'puzzle-games',
  racing: 'racing-games', driving: 'racing-games', car: 'racing-games', bike: 'racing-games',
  sports: 'sports-games', football: 'sports-games', soccer: 'sports-games',
  basketball: 'sports-games', golf: 'sports-games',
  shooting: 'shooting-games',
  action: 'action-games',
  cards: 'card-games', card: 'card-games', solitaire: 'card-games',
  strategy: 'strategy-games', tower: 'strategy-games',
  arcade: 'arcade-games',
  casual: 'casual-games', clicker: 'casual-games',
  adventure: 'adventure-games', platformer: 'adventure-games', rpg: 'adventure-games',
  multiplayer: 'multiplayer-games',
  io: 'io-games',
  quiz: 'thinking-games', trivia: 'thinking-games', word: 'thinking-games',
}

function getCategorySlug(raw: string): string {
  return CATEGORY_MAP[raw?.toLowerCase().trim()] ?? 'other-games'
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

interface GMGame {
  id: string
  title: string
  description: string
  url: string
  category: string
  tags: string
  thumb: string
  width: string
  height: string
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders })
  }

  try {
    const { source = 'gamemonetize' } = await req.json().catch(() => ({ source: 'gamemonetize' })) as { source: string }

    if (source !== 'gamemonetize') {
      return new Response(
        JSON.stringify({ error: 'Unsupported source. Use: gamemonetize' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Load all categories for lookup
    const { data: catRows } = await supabase.from('categories').select('id, slug')
    const catMap: Record<string, number> = {}
    for (const c of catRows ?? []) catMap[c.slug] = c.id

    let added = 0
    let updated = 0
    const errors: string[] = []
    let totalFetched = 0
    const maxPages = 5

    for (let page = 1; page <= maxPages; page++) {
      try {
        const url = `${GM_FEED}?format=0&num=100&page=${page}&category=all`
        const res = await fetch(url, { signal: AbortSignal.timeout(15000) })
        if (!res.ok) { errors.push(`Page ${page}: HTTP ${res.status}`); break }

        const games: GMGame[] = await res.json()
        if (!Array.isArray(games) || games.length === 0) break

        totalFetched += games.length

        for (const game of games) {
          try {
            const catSlug = getCategorySlug(game.category)
            const categoryId = catMap[catSlug] ?? catMap['other-games']
            if (!categoryId) continue

            const sourceId = String(game.id)
            const iframeUrl = `https://html5.gamemonetize.com/${sourceId}/?domain=${SITE_DOMAIN}`
            const description = buildDescription(game.title, game.description, game.category)
            const shortDescription = description.slice(0, 160)
            const tags = game.tags
              ? game.tags.split(',').map((t: string) => t.trim()).filter(Boolean).slice(0, 15)
              : []

            const baseSlug = slugifyEn(game.title) + '-' + sourceId.slice(0, 8)

            // Check for existing game by source+sourceId
            const { data: existing } = await supabase
              .from('games')
              .select('id, slug')
              .eq('source', 'GAMEMONETIZE')
              .eq('source_id', sourceId)
              .maybeSingle()

            const gameData = {
              title: game.title,
              description,
              short_description: shortDescription,
              thumbnail: game.thumb || `https://placehold.co/400x300/0f1a12/39ff14?text=${encodeURIComponent(game.title)}`,
              iframe_url: iframeUrl,
              source: 'GAMEMONETIZE',
              source_id: sourceId,
              category_id: categoryId,
              tags,
              width: parseInt(game.width) || 800,
              height: parseInt(game.height) || 600,
              is_new: page <= 2,
              is_active: true,
            }

            if (existing) {
              await supabase.from('games').update(gameData).eq('id', existing.id)
              updated++
            } else {
              // Ensure unique slug
              let slug = baseSlug
              const { data: conflict } = await supabase.from('games').select('id').eq('slug', slug).maybeSingle()
              if (conflict) slug = slug + '-' + Math.random().toString(36).slice(2, 5)

              await supabase.from('games').insert({ ...gameData, slug })
              added++
            }
          } catch (err) {
            errors.push(`Game ${game?.id}: ${String(err).slice(0, 100)}`)
          }
        }

        if (games.length < 100) break
        await new Promise(r => setTimeout(r, 600))
      } catch (err) {
        errors.push(`Page ${page}: ${String(err).slice(0, 100)}`)
        break
      }
    }

    // Mark top 30 by views as Hot
    const { data: topGames } = await supabase
      .from('games').select('id').eq('is_active', true)
      .order('views', { ascending: false }).limit(30)
    if (topGames?.length) {
      await supabase.from('games')
        .update({ is_hot: true })
        .in('id', topGames.map((g: { id: number }) => g.id))
    }

    // Mark first 8 featured
    const { data: featGames } = await supabase
      .from('games').select('id').eq('is_active', true).limit(8)
    if (featGames?.length) {
      await supabase.from('games')
        .update({ is_featured: true })
        .in('id', featGames.map((g: { id: number }) => g.id))
    }

    // Log sync
    await supabase.from('sync_logs').insert({
      source: 'GAMEMONETIZE',
      total_fetched: totalFetched,
      added,
      updated,
      errors: errors.length > 0 ? errors.slice(0, 10).join('; ') : null,
    })

    return new Response(
      JSON.stringify({ success: true, added, updated, totalFetched, errors: errors.slice(0, 5) }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: err instanceof Error ? err.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

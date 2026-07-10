/// <reference types="https://esm.sh/@supabase/functions-js@2.4.1" />
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  }

  try {
    const baseUrl = 'https://freegaming.ca'
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

    // Static pages
    const staticPages = [
      '/',
      '/free-games',
      '/play-online',
      '/unblocked-games',
      '/games-for-kids',
      '/2-player-games',
      '/free-puzzle-games',
      '/free-racing-games',
      '/free-action-games',
      '/free-sports-games',
      '/free-arcade-games',
      '/free-car-games',
      '/popular',
      '/new-games',
      '/about',
      '/contact',
      '/privacy-policy',
      '/terms-of-service',
    ]

    for (const page of staticPages) {
      xml += `  <url>\n    <loc>${baseUrl}${page}</loc>\n    <changefreq>daily</changefreq>\n  </url>\n`
    }

    // Game pages - paginate through all active games
    let page = 0
    const pageSize = 50
    let hasMore = true

    while (hasMore) {
      const { data: games, error } = await supabase
        .from('games')
        .select('slug, updated_at')
        .eq('is_active', true)
        .order('updated_at', { ascending: false })
        .range(page * pageSize, (page + 1) * pageSize - 1)

      if (error) break

      if (!games || games.length === 0) {
        hasMore = false
        break
      }

      for (const game of games) {
        const lastmod = new Date(game.updated_at).toISOString().split('T')[0]
        xml += `  <url>\n    <loc>${baseUrl}/games/${game.slug}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n  </url>\n`
      }

      page++
    }

    // Category pages
    const { data: categories } = await supabase
      .from('categories')
      .select('slug')
      .order('order_num')

    if (categories) {
      for (const cat of categories) {
        xml += `  <url>\n    <loc>${baseUrl}/category/${cat.slug}</loc>\n    <changefreq>daily</changefreq>\n  </url>\n`
      }
    }

    xml += '</urlset>'

    return new Response(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (err) {
    console.error('Sitemap error:', err)
    return new Response(
      JSON.stringify({ error: 'Failed to generate sitemap' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    )
  }
})

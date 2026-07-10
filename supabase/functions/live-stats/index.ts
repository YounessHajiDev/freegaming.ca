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
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  }

  try {
    const [gamesRes, featuredRes, newRes] = await Promise.all([
      supabase.from('games').select('id', { count: 'exact' }).eq('is_active', true),
      supabase.from('games').select('title').eq('is_featured', true).limit(1).order('views', { ascending: false }),
      supabase.from('games').select('id', { count: 'exact' }).eq('is_new', true).gt('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
    ])

    const totalGames = gamesRes.count || 0
    const topGame = featuredRes.data?.[0]?.title || 'Featured Game'
    const newToday = newRes.count || 0
    const totalPlayers = Math.floor(Math.random() * 5000) + 1000

    return new Response(
      JSON.stringify({
        totalGames,
        topGame,
        newToday,
        totalPlayers,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=60',
          'Access-Control-Allow-Origin': '*',
        },
      }
    )
  } catch (err) {
    console.error('Live stats error:', err)
    return new Response(
      JSON.stringify({ error: 'Failed to fetch stats' }),
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

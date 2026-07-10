/// <reference types="https://esm.sh/@supabase/functions-js@2.4.1" />
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

interface SyncRequest {
  source: 'GAMEMONETIZE' | 'GAMEDISTRIBUTION' | 'HTML5GAMES'
  startPage: number
  maxPages: number
}

async function fetchFromGameMonetize(startPage: number, maxPages: number) {
  const games = []
  for (let page = startPage; page < startPage + maxPages; page++) {
    try {
      const res = await fetch(`https://api.gamemonetize.com/api/games?page=${page}&sort=-1`)
      const data = await res.json()
      if (data.games) {
        games.push(...data.games)
      }
    } catch (err) {
      console.error(`Failed to fetch page ${page}:`, err)
    }
  }
  return games
}

async function fetchFromGameDistribution(startPage: number, maxPages: number) {
  const games = []
  for (let page = startPage; page < startPage + maxPages; page++) {
    try {
      const res = await fetch(`https://gamedistribution.com/api/games?page=${page}`)
      const data = await res.json()
      if (data.games) {
        games.push(...data.games)
      }
    } catch (err) {
      console.error(`Failed to fetch page ${page}:`, err)
    }
  }
  return games
}

async function fetchFromHTML5Games(startPage: number, maxPages: number) {
  const games = []
  for (let page = startPage; page < startPage + maxPages; page++) {
    try {
      const res = await fetch(`https://html5.api.gamedistribution.com/games?page=${page}`)
      const data = await res.json()
      if (data.games) {
        games.push(...data.games)
      }
    } catch (err) {
      console.error(`Failed to fetch page ${page}:`, err)
    }
  }
  return games
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 })
  }

  try {
    const body: SyncRequest = await req.json()
    const { source, startPage, maxPages } = body

    let games = []

    if (source === 'GAMEMONETIZE') {
      games = await fetchFromGameMonetize(startPage, maxPages)
    } else if (source === 'GAMEDISTRIBUTION') {
      games = await fetchFromGameDistribution(startPage, maxPages)
    } else if (source === 'HTML5GAMES') {
      games = await fetchFromHTML5Games(startPage, maxPages)
    }

    let added = 0
    let updated = 0
    const errors: string[] = []

    for (const game of games) {
      try {
        const gameData = {
          title: game.title || game.name,
          slug: (game.title || game.name)?.toLowerCase().replace(/\s+/g, '-'),
          description: game.description || game.short_description || '',
          short_description: game.short_description || game.description?.substring(0, 150) || '',
          thumbnail: game.thumbnail || game.image || '',
          iframe_url: game.url || game.iframe_url || '',
          source_id: game.id?.toString(),
          source: source,
          category_id: 1,
          tags: game.tags || [],
          width: 800,
          height: 600,
          is_active: true,
          is_new: true,
          is_hot: false,
          is_featured: false,
          views: 0,
        }

        const { data: existing } = await supabase
          .from('games')
          .select('id')
          .eq('source_id', gameData.source_id)
          .eq('source', source)
          .single()

        if (existing) {
          await supabase.from('games').update(gameData).eq('id', existing.id)
          updated++
        } else {
          await supabase.from('games').insert([gameData])
          added++
        }
      } catch (err) {
        errors.push(`Game ${game.title}: ${String(err)}`)
      }
    }

    await supabase.from('sync_logs').insert([{
      source,
      total_fetched: games.length,
      added,
      updated,
      errors: errors.length > 0 ? errors.join('; ') : null,
    }])

    return new Response(
      JSON.stringify({ success: true, added, updated, errors }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    )
  } catch (err) {
    console.error('Sync error:', err)
    return new Response(
      JSON.stringify({ error: 'Sync failed: ' + String(err) }),
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

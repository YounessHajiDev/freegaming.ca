import 'jsr:@supabase/functions-js/edge-runtime.d.ts'
import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const [totalRes, topGameRes, recentRes] = await Promise.all([
      supabase.from('games').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('games').select('title').eq('is_active', true).order('views', { ascending: false }).limit(1).maybeSingle(),
      supabase.from('games').select('*', { count: 'exact', head: true })
        .eq('is_active', true)
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
    ])

    const totalGames = totalRes.count ?? 0
    const topGame = topGameRes.data?.title ?? 'Rally Race Pro'
    const newToday = recentRes.count ?? 0

    // Simulate live player count
    const totalPlayers = Math.floor(totalGames * 8 + Math.random() * 500)

    return new Response(
      JSON.stringify({ totalPlayers, topGame, newToday, totalGames }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

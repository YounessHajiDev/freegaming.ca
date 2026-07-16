import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Sparkles } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { Game } from '../lib/types'
import GameGrid from '../components/games/GameGrid'

export default function NewGamesPage() {
  const [games, setGames] = useState<(Game & { categories?: { name: string } })[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('games')
      .select('id, title, slug, thumbnail, short_description, is_new, is_hot, is_featured, views, category_id, categories(name)')
      .eq('is_active', true)
      .eq('is_new', true)
      .order('created_at', { ascending: false })
      .limit(60)
      .then(({ data }) => {
        setGames((data ?? []) as (Game & { categories?: { name: string } })[])
        setLoading(false)
      })
  }, [])

  return (
    <>
      <Helmet>
        <title>New Free Online Games This Week | FreeGaming.ca</title>
        <meta name="description" content="Discover the newest free online games added to FreeGaming.ca this week. Fresh HTML5 browser games — no download required. New games added daily!" />
        <link rel="canonical" href="https://www.freegaming.ca/new-games/" />
      </Helmet>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles size={28} style={{ color: 'var(--neon-lime)' }} />
          <h1 className="font-display font-extrabold text-3xl md:text-4xl lg:text-5xl uppercase text-[var(--text-primary)] m-0">
            New Games This Week
          </h1>
        </div>
        <p className="text-[var(--text-secondary)] text-sm md:text-base">Fresh titles added to Canada's best free gaming portal</p>
      </div>

      <GameGrid games={games} loading={loading} columns={5} />
    </>
  )
}

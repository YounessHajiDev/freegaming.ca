import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Flame } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { Game } from '../lib/types'
import GameGrid from '../components/games/GameGrid'

export default function PopularPage() {
  const [games, setGames] = useState<(Game & { categories?: { name: string } })[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('games')
      .select('id, title, slug, thumbnail, short_description, is_new, is_hot, is_featured, views, category_id, categories(name)')
      .eq('is_active', true)
      .order('views', { ascending: false })
      .limit(60)
      .then(({ data }) => {
        setGames((data ?? []) as (Game & { categories?: { name: string } })[])
        setLoading(false)
      })
  }, [])

  return (
    <>
      <Helmet>
        <title>Most Popular Free Online Games | FreeGaming.ca</title>
        <meta name="description" content="Play the most popular free online games at FreeGaming.ca. Canada's top-rated browser games — no download, no signup required. See what Canadians are playing right now!" />
        <link rel="canonical" href="https://www.freegaming.ca/popular/" />
      </Helmet>

      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Flame size={28} style={{ color: 'var(--state-hot)' }} />
          <h1 className="font-display font-extrabold text-3xl md:text-4xl lg:text-5xl uppercase text-[var(--text-primary)] m-0">
            Most Popular Games
          </h1>
        </div>
        <p className="text-[var(--text-secondary)] text-sm md:text-base">The games Canadians are playing the most right now</p>
      </div>

      <GameGrid games={games} loading={loading} columns={5} />
    </>
  )
}

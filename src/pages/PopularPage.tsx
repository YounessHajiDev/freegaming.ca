import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { supabase } from '../lib/supabase'
import { Game } from '../lib/types'
import GameGrid from '../components/games/GameGrid'

export default function PopularPage() {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('games')
        .select('*, categories(*)')
        .eq('is_active', true)
        .order('views', { ascending: false })
        .limit(48)

      if (data) setGames(data)
      setLoading(false)
    }
    fetch()
  }, [])

  return (
    <>
      <Helmet>
        <title>Popular Free Games | FreeGaming.ca</title>
        <meta name="description" content="Play the most popular free online games. Trending games played by thousands of players." />
      </Helmet>

      <h1 style={{ marginBottom: '1rem', color: 'var(--neon-lime)' }}>Popular Games</h1>
      <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
        Discover the most played games on FreeGaming.ca
      </p>

      <GameGrid games={games} loading={loading} />
    </>
  )
}

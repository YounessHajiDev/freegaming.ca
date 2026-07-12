import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { supabase } from '../lib/supabase'
import { Game } from '../lib/types'
import GameGrid from '../components/games/GameGrid'

export default function NewGamesPage() {
  const [games, setGames] = useState<Game[]>([])

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await supabase
          .from('games')
          .select('*, categories(*)')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(48)

        if (data) setGames(data)
      } catch (err) {
        console.error('Failed to load new games:', err)
      } finally {
      }
    }
    fetch()
  }, [])

  return (
    <>
      <Helmet>
        <title>New Free Games | FreeGaming.ca</title>
        <meta name="description" content="Check out the latest free online games added to FreeGaming.ca. Fresh games added daily!" />
      </Helmet>

      <h1 style={{ marginBottom: '1rem', color: 'var(--neon-lime)' }}>New Games</h1>
      <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
        Latest games added to our collection
      </p>

      <GameGrid games={games} />
    </>
  )
}

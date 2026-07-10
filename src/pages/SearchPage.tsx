import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useSearchParams } from 'react-router-dom'
import Fuse from 'fuse.js'
import { supabase } from '../lib/supabase'
import { Game } from '../lib/types'
import GameGrid from '../components/games/GameGrid'

export default function SearchPage() {
  const [params] = useSearchParams()
  const query = params.get('q') || ''
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('games')
        .select('*, categories(*)')
        .eq('is_active', true)
        .limit(100)

      if (data && query) {
        const fuse = new Fuse(data, {
          keys: ['title', 'description', 'short_description', 'tags'],
          threshold: 0.3,
        })
        const results = fuse.search(query)
        setGames(results.map(r => r.item))
      } else if (data) {
        setGames(data)
      }

      setLoading(false)
    }
    fetch()
  }, [query])

  return (
    <>
      <Helmet>
        <title>Search Results - FreeGaming.ca</title>
        <meta name="description" content="Search free online games on FreeGaming.ca" />
        <meta name="robots" content="noindex" />
      </Helmet>

      <h1 style={{ marginBottom: '1rem', color: 'var(--neon-lime)' }}>
        Search Results {query && `for "${query}"`}
      </h1>

      {!query && (
        <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
          Enter a search query above to find games
        </p>
      )}

      {query && (
        <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
          Found {games.length} game{games.length !== 1 ? 's' : ''}
        </p>
      )}

      <GameGrid games={games} loading={loading} />
    </>
  )
}

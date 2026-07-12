import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { supabase } from '../lib/supabase'
import { Game } from '../lib/types'
import GameCarousel from '../components/games/GameCarousel'
import LiveTicker from '../components/layout/LiveTicker'

export default function HomePage() {
  const [featured, setFeatured] = useState<Game[]>([])
  const [hot, setHot] = useState<Game[]>([])
  const [recent, setRecent] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [f, h, r] = await Promise.all([
          supabase.from('games').select('*, categories(name)').eq('is_featured', true).eq('is_active', true).limit(8),
          supabase.from('games').select('*, categories(name)').eq('is_hot', true).eq('is_active', true).limit(8),
          supabase.from('games').select('*, categories(name)').eq('is_active', true).order('created_at', { ascending: false }).limit(8),
        ])
        if (f.data) setFeatured(f.data)
        if (h.data) setHot(h.data)
        if (r.data) setRecent(r.data)
      } catch (err) {
        console.error('Failed to load home games:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <>
      <Helmet>
        <title>FreeGaming.ca — Free Online Games</title>
        <meta name="description" content="Play hundreds of free online games. No registration required. Action, puzzle, racing, and more!" />
      </Helmet>

      <LiveTicker />

      <h1 style={{ marginBottom: '1.5rem', color: 'var(--neon-lime)' }}>Play Free Games Online</h1>

      {loading ? (
        <p style={{ color: 'var(--text-tertiary)', padding: '2rem 0' }}>Loading games…</p>
      ) : (
        <>
          {featured.length > 0 && <GameCarousel games={featured} title="Featured Games" />}
          {hot.length > 0 && <GameCarousel games={hot} title="Hot Games" />}
        </>
      )}

      {!loading && recent.length > 0 && <GameCarousel games={recent} title="Recently Added" />}
    </>
  )
}

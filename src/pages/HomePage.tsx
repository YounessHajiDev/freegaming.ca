import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { supabase } from '../lib/supabase'
import { Game } from '../lib/types'
import GameCarousel from '../components/games/GameCarousel'
import GameCardSkeleton from '../components/games/GameCardSkeleton'
import LiveTicker from '../components/layout/LiveTicker'
import SponsoredOffers from '../components/games/SponsoredOffers'

export default function HomePage() {
  const [featured, setFeatured] = useState<Game[]>([])
  const [hot, setHot] = useState<Game[]>([])
  const [recent, setRecent] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const [f, h, r] = await Promise.all([
        supabase.from('games').select('*, categories(name)').eq('is_featured', true).eq('is_active', true).limit(8),
        supabase.from('games').select('*, categories(name)').eq('is_hot', true).eq('is_active', true).limit(8),
        supabase.from('games').select('*, categories(name)').eq('is_active', true).order('created_at', { ascending: false }).limit(8),
      ])
      if (f.data) setFeatured(f.data)
      if (h.data) setHot(h.data)
      if (r.data) setRecent(r.data)
      setLoading(false)
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
        <section style={{ marginBottom: '2rem' }}>
          <div style={{ height: '2rem', width: '200px', background: 'var(--bg-elevated)', borderRadius: 'var(--r-sm)', marginBottom: '0.75rem' }} className="skeleton" />
          <div style={{ display: 'flex', gap: 'var(--space-sm)', overflowX: 'hidden' }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} style={{ flex: '0 0 200px' }}>
                <GameCardSkeleton />
              </div>
            ))}
          </div>
        </section>
      ) : (
        <>
          {featured.length > 0 && <GameCarousel games={featured} title="Featured Games" />}
          {hot.length > 0 && <GameCarousel games={hot} title="Hot Games" />}
        </>
      )}

      <SponsoredOffers />

      {!loading && recent.length > 0 && <GameCarousel games={recent} title="Recently Added" />}
    </>
  )
}

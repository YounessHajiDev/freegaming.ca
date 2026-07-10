import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { supabase } from '../lib/supabase'
import { Game } from '../lib/types'
import GameCarousel from '../components/games/GameCarousel'
import LiveTicker from '../components/layout/LiveTicker'
import SponsoredOffers from '../components/games/SponsoredOffers'

export default function HomePage() {
  const [featured, setFeatured] = useState<Game[]>([])
  const [hot, setHot] = useState<Game[]>([])
  const [recent, setRecent] = useState<Game[]>([])

  useEffect(() => {
    const fetch = async () => {
      const [f, h, r] = await Promise.all([
        supabase.from('games').select('*').eq('is_featured', true).limit(8),
        supabase.from('games').select('*').eq('is_hot', true).limit(8),
        supabase.from('games').select('*').order('created_at', { ascending: false }).limit(8),
      ])
      if (f.data) setFeatured(f.data)
      if (h.data) setHot(h.data)
      if (r.data) setRecent(r.data)
    }
    fetch()
  }, [])

  return (
    <>
      <Helmet>
        <title>FreeGaming.ca — Free Online Games</title>
        <meta name="description" content="Play hundreds of free online games. No registration required. Action, puzzle, racing, and more!" />
      </Helmet>

      <LiveTicker />

      <h1 style={{ marginBottom: '1rem', color: 'var(--neon-lime)' }}>Play Free Games Online</h1>

      {featured.length > 0 && <GameCarousel games={featured} title="Featured Games" />}
      {hot.length > 0 && <GameCarousel games={hot} title="Hot Games" />}

      <SponsoredOffers />

      {recent.length > 0 && <GameCarousel games={recent} title="Recently Added" />}
    </>
  )
}

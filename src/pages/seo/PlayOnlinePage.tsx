import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { supabase } from '../../lib/supabase'
import type { Game } from '../../lib/types'
import GameGrid from '../../components/games/GameGrid'

export default function PlayOnlinePage() {
  const [games, setGames] = useState<(Game & { categories?: { name: string } })[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('games')
      .select('id, title, slug, thumbnail, short_description, is_new, is_hot, is_featured, views, category_id, categories(name)')
      .eq('is_active', true)
      .order('views', { ascending: false })
      .limit(30)
      .then(({ data }) => { setGames((data ?? []) as (Game & { categories?: { name: string } })[]) ; setLoading(false) })
  }, [])

  return (
    <>
      <Helmet>
        <title>Play Games Online Free — Browser Games | FreeGaming.ca</title>
        <meta name="description" content="Play games online for free in your browser. FreeGaming.ca offers hundreds of HTML5 games — desktop and mobile. No download needed." />
        <link rel="canonical" href="https://www.freegaming.ca/play-online/" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.freegaming.ca/play-online/" />
        <meta property="og:title" content="Play Games Online Free — Browser Games | FreeGaming.ca" />
        <meta property="og:description" content="Play games online for free in your browser. FreeGaming.ca offers hundreds of HTML5 games — desktop and mobile. No download needed." />
        <meta property="og:image" content="https://www.freegaming.ca/og-image.png" />
        <meta property="og:locale" content="en_CA" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Play Games Online Free | FreeGaming.ca" />
        <meta name="twitter:description" content="Hundreds of free HTML5 browser games — desktop and mobile. Click and play instantly, no download required." />
        <meta name="twitter:image" content="https://www.freegaming.ca/og-image.png" />
      </Helmet>
      <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: 'clamp(2rem, 4vw, 3rem)', textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '1rem' }}>Play Games Online Free</h1>
      <div style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--line-subtle)' }}>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75', margin: 0 }}>
          Play games online free at FreeGaming.ca — no download, no registration, no fuss. Our browser-based gaming platform lets you jump into any game immediately from your desktop or mobile browser. We support Chrome, Firefox, Safari, and Edge on all operating systems.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75', marginBottom: 0, marginTop: '1rem' }}>
          Our online games use HTML5 technology — the same platform that powers professional gaming portals worldwide. This means buttery-smooth gameplay, instant loading, and compatibility with every modern device. Forget downloads and installers; playing online at FreeGaming.ca takes seconds from click to play.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75', marginBottom: 0, marginTop: '1rem' }}>
          Whether you have five minutes or five hours, our library has something for every mood. Quick puzzle games, epic racing challenges, sports simulations, multiplayer showdowns — all playable right now, directly in your browser, completely free.
        </p>
      </div>
      <GameGrid games={games} loading={loading} columns={5} />
    </>
  )
}

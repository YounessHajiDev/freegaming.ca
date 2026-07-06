import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { supabase } from '../../lib/supabase'
import type { Game } from '../../lib/types'
import GameGrid from '../../components/games/GameGrid'

export default function TwoPlayerPage() {
  const [games, setGames] = useState<(Game & { categories?: { name: string } })[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('games')
      .select('id, title, slug, thumbnail, short_description, is_new, is_hot, is_featured, views, category_id, categories!inner(name, slug)')
      .eq('is_active', true)
      .in('categories.slug', ['multiplayer-games', 'sports-games', 'io-games'])
      .order('views', { ascending: false })
      .limit(30)
      .then(({ data }) => { setGames((data ?? []) as (Game & { categories?: { name: string } })[]) ; setLoading(false) })
  }, [])

  return (
    <>
      <Helmet>
        <title>Free 2 Player Games Online — Play with Friends | FreeGaming.ca</title>
        <meta name="description" content="Play 2 player games online for free. Multiplayer browser games you can enjoy with friends — no download, no account required." />
        <link rel="canonical" href="https://www.freegaming.ca/2-player-games/" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.freegaming.ca/2-player-games/" />
        <meta property="og:title" content="Free 2 Player Games Online — Play with Friends | FreeGaming.ca" />
        <meta property="og:description" content="Play 2 player games online for free. Multiplayer browser games you can enjoy with friends — no download, no account required." />
        <meta property="og:image" content="https://www.freegaming.ca/og-image.png" />
        <meta property="og:locale" content="en_CA" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free 2 Player Games Online | FreeGaming.ca" />
        <meta name="twitter:description" content="Multiplayer and 2-player browser games — challenge a friend for free. No download needed." />
        <meta name="twitter:image" content="https://www.freegaming.ca/og-image.png" />
      </Helmet>
      <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: 'clamp(2rem, 4vw, 3rem)', textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '1rem' }}>2 Player Games</h1>
      <div style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--line-subtle)' }}>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75', margin: 0 }}>
          Challenge your friends with our collection of <strong style={{ color: 'var(--text-primary)' }}>free 2 player games online</strong>. From competitive sports showdowns to co-operative adventures, FreeGaming.ca has multiplayer browser games that work right from your web browser — no downloads, no accounts, no delays.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75', marginBottom: 0, marginTop: '1rem' }}>
          Our 2 player and multiplayer games are perfect for playing with a friend on the same device or through your local network. IO games let you compete against players worldwide in real-time. Sports games put you head-to-head in your favourite Canadian sports. All for free.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75', marginBottom: 0, marginTop: '1rem' }}>
          Gaming is better with friends, and FreeGaming.ca makes it easy. Share a link, choose your game, and start playing together in seconds. Our multiplayer games work on desktop and mobile browsers, so you can game together wherever you are in Canada.
        </p>
      </div>
      <GameGrid games={games} loading={loading} columns={5} />
    </>
  )
}

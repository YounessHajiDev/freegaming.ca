import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { supabase } from '../../lib/supabase'
import type { Game } from '../../lib/types'
import GameGrid from '../../components/games/GameGrid'

export default function UnblockedGamesPage() {
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
        <title>Unblocked Games — Play Free Online Anywhere | FreeGaming.ca</title>
        <meta name="description" content="Unblocked games you can play anywhere — at home, school, or work. Free browser games that work on any network. No VPN needed." />
        <link rel="canonical" href="https://www.freegaming.ca/unblocked-games/" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.freegaming.ca/unblocked-games/" />
        <meta property="og:title" content="Unblocked Games — Play Free Online Anywhere | FreeGaming.ca" />
        <meta property="og:description" content="Unblocked games you can play anywhere — at home, school, or work. Free browser games that work on any network. No VPN needed." />
        <meta property="og:image" content="https://www.freegaming.ca/og-image.png" />
        <meta property="og:locale" content="en_CA" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Unblocked Games — Play Free Anywhere | FreeGaming.ca" />
        <meta name="twitter:description" content="HTML5 games that work on any network — school, work, or home. No VPN, no plugins needed." />
        <meta name="twitter:image" content="https://www.freegaming.ca/og-image.png" />
      </Helmet>
      <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: 'clamp(2rem, 4vw, 3rem)', textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '1rem' }}>Unblocked Games</h1>
      <div style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--line-subtle)' }}>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75', margin: 0 }}>
          FreeGaming.ca hosts <strong style={{ color: 'var(--text-primary)' }}>unblocked games</strong> you can play anywhere — at home, at school, or at work. Our HTML5 browser games run on standard web technology, meaning they work on virtually any network without special access or a VPN.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75', marginBottom: 0, marginTop: '1rem' }}>
          Unlike older Flash-based games that were frequently blocked by firewalls and school content filters, HTML5 games load just like any regular website. As long as you can browse the web, you can play FreeGaming.ca games. No plugins, no installs, no requests to IT.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75', marginBottom: 0, marginTop: '1rem' }}>
          Our unblocked game library covers every genre popular with Canadian students and workers: puzzle games for mental breaks, racing games for quick thrills, io games for competitive play, and casual games to unwind. All completely free, all playable right now.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75', marginBottom: 0, marginTop: '1rem' }}>
          Bookmark FreeGaming.ca for reliable, unblocked gaming access. We're Canada's most trusted free gaming portal, and we keep our game library updated weekly so there's always something fresh to discover.
        </p>
      </div>
      <GameGrid games={games} loading={loading} columns={5} />
    </>
  )
}

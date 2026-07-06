import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { supabase } from '../../lib/supabase'
import type { Game } from '../../lib/types'
import GameGrid from '../../components/games/GameGrid'

export default function FreeGamesPage() {
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
        <title>Free Online Games — No Download, No Signup | FreeGaming.ca</title>
        <meta name="description" content="Play hundreds of free online games instantly. No download, no account needed. Canada's #1 free games portal — puzzle, racing, sports & more." />
        <link rel="canonical" href="https://www.freegaming.ca/free-games/" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.freegaming.ca/free-games/" />
        <meta property="og:title" content="Free Online Games — No Download, No Signup | FreeGaming.ca" />
        <meta property="og:description" content="Play hundreds of free online games instantly. No download, no account needed. Canada's #1 free games portal — puzzle, racing, sports &amp; more." />
        <meta property="og:image" content="https://www.freegaming.ca/og-image.png" />
        <meta property="og:locale" content="en_CA" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Online Games — No Download | FreeGaming.ca" />
        <meta name="twitter:description" content="Hundreds of free browser games — no download, no signup. Play now at Canada's #1 free gaming portal." />
        <meta name="twitter:image" content="https://www.freegaming.ca/og-image.png" />
      </Helmet>
      <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: 'clamp(2rem, 4vw, 3rem)', textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '1rem' }}>Free Online Games</h1>
      <div style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--line-subtle)' }}>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75', margin: 0 }}>
          Looking for free online games? You've found Canada's best destination. Every single game on FreeGaming.ca is <strong style={{ color: 'var(--neon-lime)' }}>100% free</strong> — no credit card, no subscription, no hidden fees. Just click any game and start playing instantly in your browser.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75', marginBottom: 0, marginTop: '1rem' }}>
          Our free games library includes hundreds of HTML5 titles spanning every genre: puzzle games, racing games, sports games, action games, arcade classics, strategy challenges, and casual games perfect for a quick break. New free games are added every week.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75', marginBottom: 0, marginTop: '1rem' }}>
          All games work directly in your web browser — Chrome, Firefox, Safari, and Edge are all supported. No plugins, no Flash, no Java required. FreeGaming.ca uses modern HTML5 technology to deliver smooth, fast gameplay on desktop, tablet, and mobile. Whether you're on a Windows PC, Mac, iPhone, or Android device, our free games work everywhere.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75', marginBottom: 0, marginTop: '1rem' }}>
          FreeGaming.ca is proudly Canadian. We've built this portal specifically for English-speaking Canadians who want great games without the hassle of downloads, installations, or creating yet another account. Play whenever you want, on any device, for free — forever.
        </p>
      </div>
      <GameGrid games={games} loading={loading} columns={5} />
    </>
  )
}

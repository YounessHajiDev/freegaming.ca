import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Sparkles } from 'lucide-react'
import { fetchNewGames, type CardGame } from '../lib/queries'
import { usePrerenderData } from '../lib/prerender'
import { SITE_URL, DEFAULT_OG_IMAGE, SITE_NAME } from '../lib/seo'
import GameGrid from '../components/games/GameGrid'

export default function NewGamesPage() {
  const seeded = usePrerenderData<CardGame[]>('new-games')
  const [games, setGames] = useState<CardGame[]>(seeded ?? [])
  const [loading, setLoading] = useState(!seeded)

  useEffect(() => {
    fetchNewGames().then(g => { setGames(g); setLoading(false) })
  }, [])

  return (
    <>
      <Helmet>
        <title>{`New Free Online Games This Week | ${SITE_NAME}`}</title>
        <meta name="description" content={`Discover the newest free online games added to ${SITE_NAME} this week. Fresh HTML5 browser games — no download required. New games added daily!`} />
        <link rel="canonical" href={`${SITE_URL}/new-games/`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/new-games/`} />
        <meta property="og:title" content={`New Free Online Games This Week | ${SITE_NAME}`} />
        <meta property="og:description" content={`Discover the newest free online games added to ${SITE_NAME} this week. Fresh HTML5 browser games — no download required.`} />
        <meta property="og:image" content={DEFAULT_OG_IMAGE} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_CA" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`New Free Online Games This Week | ${SITE_NAME}`} />
        <meta name="twitter:description" content={`Discover the newest free online games added to ${SITE_NAME} this week. Fresh HTML5 browser games — no download required.`} />
        <meta name="twitter:image" content={DEFAULT_OG_IMAGE} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": `${SITE_URL}/` },
            { "@type": "ListItem", "position": 2, "name": "New Games", "item": `${SITE_URL}/new-games/` }
          ]
        })}</script>
      </Helmet>

      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <Sparkles size={28} style={{ color: 'var(--neon-lime)' }} />
          <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: 'clamp(2rem, 4vw, 3rem)', textTransform: 'uppercase', color: 'var(--text-primary)', margin: 0 }}>
            New Games This Week
          </h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>The latest titles added to our free browser-games library</p>
      </div>

      <GameGrid games={games} loading={loading} columns={5} />
    </>
  )
}

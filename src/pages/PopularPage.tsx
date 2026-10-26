import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Flame } from 'lucide-react'
import { fetchPopularGames, type CardGame } from '../lib/queries'
import { usePrerenderData } from '../lib/prerender'
import { SITE_URL, DEFAULT_OG_IMAGE, SITE_NAME } from '../lib/seo'
import GameGrid from '../components/games/GameGrid'

export default function PopularPage() {
  const seeded = usePrerenderData<CardGame[]>('popular')
  const [games, setGames] = useState<CardGame[]>(seeded ?? [])
  const [loading, setLoading] = useState(!seeded)

  useEffect(() => {
    fetchPopularGames().then(g => { setGames(g); setLoading(false) })
  }, [])

  return (
    <>
      <Helmet>
        <title>{`Most Popular Free Online Games | ${SITE_NAME}`}</title>
        <meta name="description" content={`Play the most popular free online games at ${SITE_NAME}. The most-played browser games on our site — no download, no signup required.`} />
        <link rel="canonical" href={`${SITE_URL}/popular/`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/popular/`} />
        <meta property="og:title" content={`Most Popular Free Online Games | ${SITE_NAME}`} />
        <meta property="og:description" content={`Play the most popular free online games at ${SITE_NAME}. The most-played browser games on our site — no download, no signup required.`} />
        <meta property="og:image" content={DEFAULT_OG_IMAGE} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_CA" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Most Popular Free Online Games | ${SITE_NAME}`} />
        <meta name="twitter:description" content={`Play the most popular free online games at ${SITE_NAME}. The most-played browser games on our site — no download, no signup required.`} />
        <meta name="twitter:image" content={DEFAULT_OG_IMAGE} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": `${SITE_URL}/` },
            { "@type": "ListItem", "position": 2, "name": "Most Popular", "item": `${SITE_URL}/popular/` }
          ]
        })}</script>
      </Helmet>

      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <Flame size={28} style={{ color: 'var(--state-hot)' }} />
          <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: 'clamp(2rem, 4vw, 3rem)', textTransform: 'uppercase', color: 'var(--text-primary)', margin: 0 }}>
            Most Popular Games
          </h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>The games Canadians are playing the most right now</p>
      </div>

      <GameGrid games={games} loading={loading} columns={5} />
    </>
  )
}

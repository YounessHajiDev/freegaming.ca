import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Gift } from 'lucide-react'
import { fetchOGAdsOffers, type OGAdsOffer } from '../lib/ogads'
import { SITE_URL, DEFAULT_OG_IMAGE, SITE_NAME } from '../lib/seo'
import OfferGrid from '../components/offers/OfferGrid'

export default function OffersPage() {
  const [offers, setOffers] = useState<OGAdsOffer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchOGAdsOffers({ max: 50 }).then(res => {
      if (cancelled) return
      setLoading(false)
      if (!res.success) {
        setError(res.error ?? 'Failed to load offers')
        return
      }
      setOffers(res.offers)
    })
    return () => { cancelled = true }
  }, [])

  const pageTitle = `Mobile Game Offers | ${SITE_NAME}`
  const pageDesc = `Discover device-matched free game app offers on ${SITE_NAME}. Install and play top mobile games — offers are filtered for your device.`

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <link rel="canonical" href={`${SITE_URL}/offers/`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/offers/`} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:image" content={DEFAULT_OG_IMAGE} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_CA" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDesc} />
        <meta name="twitter:image" content={DEFAULT_OG_IMAGE} />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
            { '@type': 'ListItem', position: 2, name: 'Offers', item: `${SITE_URL}/offers/` },
          ],
        })}</script>
      </Helmet>

      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <Gift size={28} style={{ color: 'var(--neon-lime)' }} />
          <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: 'clamp(2rem, 4vw, 3rem)', textTransform: 'uppercase', color: 'var(--text-primary)', margin: 0 }}>
            Mobile Game Offers
          </h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
          Device-matched offers from OGAds. Install and play popular mobile games.
        </p>
      </div>

      {error && (
        <div style={{ padding: '1rem 1.25rem', borderRadius: '8px', background: 'rgba(255,61,87,0.07)', border: '1px solid var(--state-hot)', color: 'var(--state-hot)', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      {!loading && offers.length === 0 && !error && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          No offers available for your device or region right now. Check back later.
        </div>
      )}

      <OfferGrid offers={offers} loading={loading} columns={5} />
    </>
  )
}

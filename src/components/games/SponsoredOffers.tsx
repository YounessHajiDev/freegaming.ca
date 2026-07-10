import { useEffect, useState } from 'react'
import { ExternalLink, Gift, Smartphone, Monitor, Zap } from 'lucide-react'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string

interface Offer {
  offerid: number
  name: string
  name_short: string
  description: string
  adcopy: string
  picture: string
  payout: string
  country: string
  device: string
  link: string
  epc?: string
}

interface OGAdsResponse {
  success: boolean
  error: string | null
  offers: Offer[]
}

function OfferSkeleton() {
  return (
    <div style={{
      background: 'var(--bg-elevated)',
      border: '1px solid var(--line-subtle)',
      borderRadius: '12px',
      overflow: 'hidden',
    }}>
      <div className="skeleton" style={{ height: '140px', borderRadius: 0 }} />
      <div style={{ padding: '12px' }}>
        <div className="skeleton" style={{ height: '14px', borderRadius: '4px', marginBottom: '8px', width: '80%' }} />
        <div className="skeleton" style={{ height: '12px', borderRadius: '4px', marginBottom: '12px', width: '60%' }} />
        <div className="skeleton" style={{ height: '32px', borderRadius: '7px' }} />
      </div>
    </div>
  )
}

function DeviceIcon({ device }: { device: string }) {
  const d = device.toLowerCase()
  if (d.includes('android') || d.includes('ios') || d.includes('mobile')) {
    return <Smartphone size={11} />
  }
  return <Monitor size={11} />
}

export default function SponsoredOffers() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(
          `${SUPABASE_URL}/functions/v1/ogads-offers?max=6`,
          {
            headers: {
              // Pass the visitor's user-agent to the edge function via a custom header
              // The edge function reads x-visitor-user-agent or falls back to the request's own UA
              'x-visitor-user-agent': navigator.userAgent,
            },
          }
        )
        const data: OGAdsResponse = await res.json()
        if (data.success && Array.isArray(data.offers) && data.offers.length > 0) {
          setOffers(data.offers.slice(0, 6))
        } else {
          setHidden(true)
        }
      } catch {
        setHidden(true)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (hidden || (!loading && offers.length === 0)) return null

  return (
    <section style={{ marginTop: '2.5rem' }}>
      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Gift size={18} style={{ color: 'var(--ember)' }} />
          <h2 style={{
            fontFamily: 'Barlow Condensed, sans-serif',
            fontWeight: 800,
            fontSize: '1.375rem',
            textTransform: 'uppercase',
            color: 'var(--text-primary)',
            margin: 0,
            letterSpacing: '0.04em',
          }}>
            Earn Rewards
          </h2>
          <span style={{
            fontSize: '10px',
            fontFamily: 'Orbitron, monospace',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            padding: '3px 8px',
            borderRadius: '4px',
            background: 'rgba(255,140,0,0.12)',
            border: '1px solid rgba(255,140,0,0.3)',
            color: 'var(--ember)',
          }}>
            Sponsored
          </span>
        </div>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', margin: 0 }}>
          Complete offers to earn rewards
        </p>
      </div>

      {/* Offers grid */}
      <div className="offers-grid">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <OfferSkeleton key={i} />)
          : offers.map(offer => (
            <OfferCard key={offer.offerid} offer={offer} />
          ))
        }
      </div>

      <p style={{
        fontSize: '0.7rem',
        color: 'var(--text-tertiary)',
        marginTop: '0.75rem',
        opacity: 0.6,
      }}>
        Sponsored offers. Completing offers may require app install or account creation on third-party platforms.
      </p>
    </section>
  )
}

function OfferCard({ offer }: { offer: Offer }) {
  const payout = parseFloat(offer.payout || '0')

  return (
    <a
      href={offer.link}
      target="_blank"
      rel="noopener noreferrer sponsored"
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <div style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--line-subtle)',
        borderRadius: '12px',
        overflow: 'hidden',
        transition: 'border-color 0.2s, transform 0.2s',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
        onMouseEnter={e => {
          const el = e.currentTarget as HTMLDivElement
          el.style.borderColor = 'var(--ember)'
          el.style.transform = 'translateY(-2px)'
        }}
        onMouseLeave={e => {
          const el = e.currentTarget as HTMLDivElement
          el.style.borderColor = 'var(--line-subtle)'
          el.style.transform = 'none'
        }}
      >
        {/* Thumbnail */}
        <div style={{ position: 'relative', height: '130px', background: 'var(--bg-void)', flexShrink: 0 }}>
          {offer.picture ? (
            <img
              src={offer.picture}
              alt={offer.name_short}
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              onError={e => {
                (e.target as HTMLImageElement).style.display = 'none'
              }}
            />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={32} style={{ color: 'var(--ember)', opacity: 0.4 }} />
            </div>
          )}
          {/* Payout badge */}
          {payout > 0 && (
            <div style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              background: 'var(--ember)',
              color: 'var(--bg-void)',
              fontFamily: 'Barlow Condensed, sans-serif',
              fontWeight: 800,
              fontSize: '0.875rem',
              padding: '3px 8px',
              borderRadius: '6px',
              letterSpacing: '0.02em',
            }}>
              ${payout.toFixed(2)}
            </div>
          )}
          {/* Device badge */}
          <div style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'rgba(0,0,0,0.65)',
            color: 'var(--text-secondary)',
            fontSize: '10px',
            fontFamily: 'Orbitron, monospace',
            padding: '3px 7px',
            borderRadius: '5px',
            backdropFilter: 'blur(4px)',
          }}>
            <DeviceIcon device={offer.device} />
            {offer.device.replace('Android', 'Droid').replace('Desktop', 'PC')}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{
            fontFamily: 'Barlow Condensed, sans-serif',
            fontWeight: 700,
            fontSize: '1rem',
            textTransform: 'uppercase',
            color: 'var(--text-primary)',
            letterSpacing: '0.02em',
            lineHeight: 1.2,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          } as React.CSSProperties}>
            {offer.name_short || offer.name}
          </div>

          {offer.adcopy && (
            <p style={{
              fontSize: '0.75rem',
              color: 'var(--text-tertiary)',
              margin: 0,
              lineHeight: 1.4,
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            } as React.CSSProperties}>
              {offer.adcopy}
            </p>
          )}

          <div style={{ marginTop: 'auto' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '8px 12px',
              background: 'linear-gradient(135deg, var(--ember) 0%, #ff6b35 100%)',
              borderRadius: '7px',
              color: '#fff',
              fontFamily: 'Barlow Condensed, sans-serif',
              fontWeight: 700,
              fontSize: '0.9rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              <ExternalLink size={12} />
              Claim Offer
            </div>
          </div>
        </div>
      </div>
    </a>
  )
}

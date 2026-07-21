import { ExternalLink } from 'lucide-react'
import type { OGAdsOffer } from '../../lib/ogads'

interface Props {
  offer: OGAdsOffer
  size?: 'sm' | 'md' | 'lg'
}

export default function OfferCard({ offer, size = 'md' }: Props) {
  const imgHeight = size === 'lg' ? 200 : size === 'sm' ? 120 : 160

  return (
    <a
      href={offer.link}
      target="_blank"
      rel="noopener noreferrer"
      className="game-card"
      style={{ display: 'block', textDecoration: 'none' }}
    >
      <div style={{ position: 'relative', width: '100%', height: `${imgHeight}px`, overflow: 'hidden', backgroundColor: 'var(--bg-elevated)' }}>
        <img
          src={offer.icon || `https://placehold.co/400x300/0f1a12/39ff14?text=${encodeURIComponent(offer.name)}`}
          alt={offer.name}
          width={400}
          height={300}
          loading="lazy"
          decoding="async"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.3s ease' }}
          onError={e => { (e.target as HTMLImageElement).src = `https://placehold.co/400x300/0f1a12/39ff14?text=${encodeURIComponent(offer.name)}` }}
        />
        <div style={{ position: 'absolute', top: '8px', right: '8px', display: 'flex', gap: '4px' }}>
          <span className="badge badge-hot" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <ExternalLink size={10} />
            {offer.payout > 0 ? `$${offer.payout.toFixed(2)}` : 'Free'}
          </span>
        </div>
      </div>

      <div style={{ padding: size === 'sm' ? '8px' : '12px' }}>
        <h3 style={{
          margin: 0, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700,
          textTransform: 'uppercase', fontSize: size === 'sm' ? '0.85rem' : '1rem',
          color: 'var(--text-primary)', letterSpacing: '0.02em',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {offer.name}
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'Space Grotesk, sans-serif' }}>
            {offer.category || 'Offer'}
          </span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontFamily: 'Orbitron, monospace' }}>
            {offer.device || offer.country || 'All devices'}
          </span>
        </div>
      </div>
    </a>
  )
}

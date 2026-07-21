import type { CSSProperties } from 'react'
import OfferCard from './OfferCard'
import type { OGAdsOffer } from '../../lib/ogads'

interface Props {
  offers: OGAdsOffer[]
  loading?: boolean
  columns?: number
}

export default function OfferGrid({ offers, loading = false, columns = 5 }: Props) {
  const cols = Math.min(columns, 5)
  const gridStyle: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
    gap: '1rem',
  }
  const responsiveStyle = `
    @media (max-width: 1280px) { .offer-grid-${cols} { grid-template-columns: repeat(4, minmax(0,1fr)) !important; } }
    @media (max-width: 1024px) { .offer-grid-${cols} { grid-template-columns: repeat(3, minmax(0,1fr)) !important; } }
    @media (max-width: 640px)  { .offer-grid-${cols} { grid-template-columns: repeat(2, minmax(0,1fr)) !important; } }
  `

  return (
    <>
      <style>{responsiveStyle}</style>
      <div className={`offer-grid-${cols}`} style={gridStyle}>
        {loading
          ? Array.from({ length: cols * 2 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: '220px', borderRadius: '12px' }} />
            ))
          : offers.map(offer => <OfferCard key={offer.id} offer={offer} />)
        }
      </div>
    </>
  )
}

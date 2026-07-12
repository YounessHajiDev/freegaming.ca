import { Link } from 'react-router-dom'
import type { Game } from '../../lib/types'

interface Props {
  game: Game & { categories?: { name: string } }
  size?: 'sm' | 'md' | 'lg'
}

export default function GameCard({ game, size = 'md' }: Props) {
  const imgHeight = size === 'lg' ? 200 : size === 'sm' ? 120 : 160

  return (
    <Link to={`/games/${game.slug}`} className="game-card" style={{ display: 'block', textDecoration: 'none' }}>
      <div style={{ position: 'relative', width: '100%', height: `${imgHeight}px`, overflow: 'hidden', backgroundColor: 'var(--bg-elevated)' }}>
        <img
          src={game.thumbnail || `https://placehold.co/400x300/0f1a12/39ff14?text=${encodeURIComponent(game.title)}`}
          alt={game.title}
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.3s ease' }}
          onError={e => { (e.target as HTMLImageElement).src = `https://placehold.co/400x300/0f1a12/39ff14?text=${encodeURIComponent(game.title)}` }}
        />
        {/* Badges */}
        <div style={{ position: 'absolute', top: '8px', left: '8px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {game.is_featured && <span className="badge badge-featured">Featured</span>}
          {game.is_hot     && <span className="badge badge-hot">Hot</span>}
          {game.is_new     && <span className="badge badge-new">New</span>}
        </div>
      </div>

      <div style={{ padding: size === 'sm' ? '8px' : '12px' }}>
        <h3 style={{
          margin: 0, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700,
          textTransform: 'uppercase', fontSize: size === 'sm' ? '0.85rem' : '1rem',
          color: 'var(--text-primary)', letterSpacing: '0.02em',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {game.title}
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'Space Grotesk, sans-serif' }}>
            {game.categories?.name || ''}
          </span>
          {game.views > 0 && (
            <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontFamily: 'Orbitron, monospace' }}>
              {game.views >= 1000 ? `${(game.views / 1000).toFixed(1)}k` : game.views}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

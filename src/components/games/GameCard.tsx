import { Link } from 'react-router-dom'
import { Eye } from 'lucide-react'
import type { Game } from '../../lib/types'

interface GameCardProps {
  game: Game
}

export default function GameCard({ game }: GameCardProps) {
  return (
    <Link to={`/games/${game.slug}`} className="game-card" style={{ display: 'flex', flexDirection: 'column', textDecoration: 'none' }}>
      <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '16/10', background: 'var(--bg-void)' }}>
        <img
          src={game.thumbnail}
          alt={game.title}
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.3s ease' }}
          onError={e => { (e.target as HTMLImageElement).src = `https://placehold.co/320x200/0f1a12/39ff14?text=${encodeURIComponent(game.title.slice(0, 12))}` }}
        />
        <div style={{ position: 'absolute', top: '6px', left: '6px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {game.is_hot      && <span className="badge badge-hot">Hot</span>}
          {game.is_new      && <span className="badge badge-new">New</span>}
          {game.is_featured && <span className="badge badge-featured">Featured</span>}
        </div>
      </div>
      <div style={{ padding: '10px', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <h3 style={{
          fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700,
          fontSize: 'clamp(0.85rem, 2vw, 1rem)', textTransform: 'uppercase',
          color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis',
          whiteSpace: 'nowrap', margin: 0, letterSpacing: '0.02em',
        }}>
          {game.title}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
            {game.categories?.name ?? ''}
          </span>
          {game.views > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
              <Eye size={11} />
              {game.views >= 1000 ? `${(game.views / 1000).toFixed(1)}k` : game.views}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

import { Link } from 'react-router-dom'
import type { Game } from '../../lib/types'

interface Props {
  game: Game & { categories?: { name: string } }
  size?: 'sm' | 'md' | 'lg'
}

export default function GameCard({ game, size = 'md' }: Props) {
  const titleClass = size === 'sm'
    ? 'text-xs md:text-sm'
    : 'text-sm md:text-base'

  return (
    <Link to={`/games/${game.slug}`} className="game-card block no-underline">
      <div className="game-card-image relative bg-[var(--bg-elevated)] overflow-hidden group">
        <img
          src={game.thumbnail || `https://placehold.co/400x300/0f1a12/39ff14?text=${encodeURIComponent(game.title)}`}
          alt={game.title}
          loading="lazy"
          className="w-full h-full object-cover block transition-transform duration-300 group-hover:scale-105"
          onError={e => { (e.target as HTMLImageElement).src = `https://placehold.co/400x300/0f1a12/39ff14?text=${encodeURIComponent(game.title)}` }}
        />
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          {game.is_featured && <span className="badge badge-featured">Featured</span>}
          {game.is_hot     && <span className="badge badge-hot">Hot</span>}
          {game.is_new     && <span className="badge badge-new">New</span>}
        </div>
      </div>

      <div className={size === 'sm' ? 'p-2' : 'p-3'}>
        <h3 className={`m-0 font-display font-bold uppercase tracking-wide text-[var(--text-primary)] line-clamp-1 ${titleClass}`}>
          {game.title}
        </h3>

        <div className="flex items-center justify-between mt-1 gap-2">
          <span className="text-xs text-[var(--text-secondary)] font-body truncate">
            {game.categories?.name || ''}
          </span>
          {game.views > 0 && (
            <span className="text-[0.65rem] text-[var(--text-tertiary)] font-data flex-shrink-0">
              {game.views >= 1000 ? `${(game.views / 1000).toFixed(1)}k` : game.views}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

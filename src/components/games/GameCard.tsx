import { Link } from 'react-router-dom'
import { Eye } from 'lucide-react'
import { Game } from '../../lib/types'

interface GameCardProps {
  game: Game
}

export default function GameCard({ game }: GameCardProps) {
  return (
    <Link to={`/games/${game.slug}`} style={cardStyles.card} className="game-card">
      <div style={cardStyles.imageContainer}>
        <img src={game.thumbnail} alt={game.title} style={cardStyles.image} />
        <div style={cardStyles.badges}>
          {game.is_hot && <span className="badge-hot">HOT</span>}
          {game.is_new && <span className="badge-new">NEW</span>}
          {game.is_featured && <span className="badge-featured">FEATURED</span>}
        </div>
      </div>
      <div style={cardStyles.content}>
        <h3 style={cardStyles.title}>{game.title}</h3>
        <p style={cardStyles.category}>{game.categories?.name || 'Game'}</p>
        <div style={cardStyles.stats}>
          <div style={cardStyles.stat}>
            <Eye size={14} style={{ color: 'var(--neon-lime)' }} />
            <span>{(game.views / 1000).toFixed(1)}K</span>
          </div>
          <span className="badge-free">FREE</span>
        </div>
      </div>
    </Link>
  )
}

const cardStyles = {
  card: {
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100%',
    textDecoration: 'none',
  },
  imageContainer: {
    position: 'relative' as const,
    overflow: 'hidden',
    borderRadius: '0.5rem 0.5rem 0 0',
  },
  image: {
    width: '100%',
    height: '160px',
    objectFit: 'cover' as const,
    display: 'block',
  },
  badges: {
    position: 'absolute' as const,
    top: '0.5rem',
    left: '0.5rem',
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap' as const,
  },
  content: {
    padding: '0.75rem',
    flex: 1,
    display: 'flex',
    flexDirection: 'column' as const,
  },
  title: {
    fontSize: '0.95rem',
    fontWeight: 700,
    marginBottom: '0.25rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    color: 'var(--text-primary)',
  },
  category: {
    fontSize: '0.75rem',
    color: 'var(--text-tertiary)',
    marginBottom: '0.5rem',
  },
  stats: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
  } as const,
  stat: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
  } as const,
}

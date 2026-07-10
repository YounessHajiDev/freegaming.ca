import { Game } from '../../lib/types'
import GameCard from './GameCard'
import GameCardSkeleton from './GameCardSkeleton'

interface GameGridProps {
  games: Game[]
  loading?: boolean
  columns?: 3 | 4
}

export default function GameGrid({ games, loading = false, columns = 4 }: GameGridProps) {
  const skeletonCount = columns * 2

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(auto-fill, minmax(${columns === 3 ? '280px' : '250px'}, 1fr))`,
      gap: '1.5rem',
    }}>
      {loading ? (
        Array.from({ length: skeletonCount }).map((_, i) => (
          <GameCardSkeleton key={i} />
        ))
      ) : (
        games.map(game => (
          <GameCard key={game.id} game={game} />
        ))
      )}
    </div>
  )
}

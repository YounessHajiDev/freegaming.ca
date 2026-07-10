import { Game } from '../../lib/types'
import GameCard from './GameCard'
import GameCardSkeleton from './GameCardSkeleton'

interface GameGridProps {
  games: Game[]
  loading?: boolean
  columns?: 3 | 4
}

export default function GameGrid({ games, loading = false, columns = 4 }: GameGridProps) {
  const skeletonCount = columns === 3 ? 6 : 8

  return (
    <div className={`game-grid${columns === 3 ? ' game-grid-3' : ''}`}>
      {loading
        ? Array.from({ length: skeletonCount }).map((_, i) => <GameCardSkeleton key={i} />)
        : games.map(game => <GameCard key={game.id} game={game} />)
      }
    </div>
  )
}

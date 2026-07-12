import { Game } from '../../lib/types'
import GameCard from './GameCard'
import GameCardSkeleton from './GameCardSkeleton'

interface GameGridProps {
  games: Game[]
  columns?: 3 | 4
  loading?: boolean
}

export default function GameGrid({ games, columns = 4, loading }: GameGridProps) {
  if (loading) {
    return (
      <div className={`game-grid${columns === 3 ? ' game-grid-3' : ''}`}>
        {Array.from({ length: 8 }).map((_, i) => <GameCardSkeleton key={i} />)}
      </div>
    )
  }

  return (
    <div className={`game-grid${columns === 3 ? ' game-grid-3' : ''}`}>
      {games.map(game => <GameCard key={game.id} game={game} />)}
    </div>
  )
}

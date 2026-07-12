import { Game } from '../../lib/types'
import GameCard from './GameCard'

interface GameGridProps {
  games: Game[]
  columns?: 3 | 4
}

export default function GameGrid({ games, columns = 4 }: GameGridProps) {
  return (
    <div className={`game-grid${columns === 3 ? ' game-grid-3' : ''}`}>
      {games.map(game => <GameCard key={game.id} game={game} />)}
    </div>
  )
}

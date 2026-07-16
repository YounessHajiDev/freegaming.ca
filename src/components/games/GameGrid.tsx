import GameCard from './GameCard'
import GameCardSkeleton from './GameCardSkeleton'
import type { Game } from '../../lib/types'

interface Props {
  games: (Game & { categories?: { name: string } })[]
  loading?: boolean
  columns?: number
}

const COLS_CLASS: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-2 md:grid-cols-3',
  4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  5: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5',
}

export default function GameGrid({ games, loading = false, columns = 5 }: Props) {
  const cols = Math.min(columns, 5)

  return (
    <div className={`grid gap-4 ${COLS_CLASS[cols]}`}>
      {loading
        ? <GameCardSkeleton count={cols * 2} />
        : games.map(g => <GameCard key={g.id} game={g} />)
      }
    </div>
  )
}

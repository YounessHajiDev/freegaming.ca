import GameCard from './GameCard'
import GameCardSkeleton from './GameCardSkeleton'
import type { Game } from '../../lib/types'

interface Props {
  games: (Game & { categories?: { name: string } })[]
  loading?: boolean
  columns?: number
}

export default function GameGrid({ games, loading = false, columns = 5 }: Props) {
  const cols = Math.min(columns, 5)
  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
    gap: '1rem',
  }
  const responsiveStyle = `
    @media (max-width: 1280px) { .game-grid-${cols} { grid-template-columns: repeat(4, minmax(0,1fr)) !important; } }
    @media (max-width: 1024px) { .game-grid-${cols} { grid-template-columns: repeat(3, minmax(0,1fr)) !important; } }
    @media (max-width: 640px)  { .game-grid-${cols} { grid-template-columns: repeat(2, minmax(0,1fr)) !important; } }
  `

  return (
    <>
      <style>{responsiveStyle}</style>
      <div className={`game-grid-${cols}`} style={gridStyle}>
        {loading
          ? <GameCardSkeleton count={cols * 2} />
          : games.map(g => <GameCard key={g.id} game={g} />)
        }
      </div>
    </>
  )
}

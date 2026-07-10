import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Game } from '../../lib/types'
import GameCard from './GameCard'

interface GameCarouselProps {
  games: Game[]
  title: string
}

export default function GameCarousel({ games, title }: GameCarouselProps) {
  const [scroll, setScroll] = useState(0)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const scroll_amount = 300

  const handleScroll = (direction: 'left' | 'right') => {
    const container = document.getElementById(`carousel-${title}`)
    if (container) {
      const newScroll = direction === 'left' ? scroll - scroll_amount : scroll + scroll_amount
      container.scrollLeft = newScroll
      setScroll(newScroll)
      setCanScrollLeft(newScroll > 0)
      setCanScrollRight(newScroll < container.scrollWidth - container.clientWidth)
    }
  }

  return (
    <div style={{ marginBottom: '3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ color: 'var(--neon-lime)' }}>{title}</h2>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            className="btn-ghost"
            style={{ opacity: canScrollLeft ? 1 : 0.5 }}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => handleScroll('right')}
            disabled={!canScrollRight}
            className="btn-ghost"
            style={{ opacity: canScrollRight ? 1 : 0.5 }}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div
        id={`carousel-${title}`}
        style={{
          display: 'flex',
          gap: '1.5rem',
          overflowX: 'auto',
          scrollBehavior: 'smooth',
          paddingBottom: '1rem',
          scrollbarWidth: 'none',
        }}
      >
        {games.map(game => (
          <div key={game.id} style={{ flex: '0 0 250px' }}>
            <GameCard game={game} />
          </div>
        ))}
      </div>
    </div>
  )
}

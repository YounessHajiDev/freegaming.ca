import { useRef, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Game } from '../../lib/types'
import GameCard from './GameCard'

interface GameCarouselProps {
  games: Game[]
  title: string
}

export default function GameCarousel({ games, title }: GameCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(true)

  const updateArrows = () => {
    const el = trackRef.current
    if (!el) return
    setCanLeft(el.scrollLeft > 4)
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    updateArrows()
    el.addEventListener('scroll', updateArrows, { passive: true })
    const ro = new ResizeObserver(updateArrows)
    ro.observe(el)
    return () => { el.removeEventListener('scroll', updateArrows); ro.disconnect() }
  }, [games])

  const scroll = (dir: 'left' | 'right') => {
    const el = trackRef.current
    if (!el) return
    const amount = el.clientWidth * 0.75
    el.scrollBy({ left: dir === 'right' ? amount : -amount, behavior: 'smooth' })
  }

  return (
    <section style={{ marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', gap: '0.5rem' }}>
        <h2 style={{ color: 'var(--neon-lime)', fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', margin: 0 }}>{title}</h2>
        <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
          <button
            onClick={() => scroll('left')}
            disabled={!canLeft}
            className="btn-ghost"
            style={{ padding: '6px 10px', opacity: canLeft ? 1 : 0.35, minHeight: '36px' }}
            aria-label="Scroll left"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canRight}
            className="btn-ghost"
            style={{ padding: '6px 10px', opacity: canRight ? 1 : 0.35, minHeight: '36px' }}
            aria-label="Scroll right"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div ref={trackRef} className="carousel-track">
        {games.map(game => (
          <div key={game.id} className="carousel-card">
            <GameCard game={game} />
          </div>
        ))}
      </div>
    </section>
  )
}

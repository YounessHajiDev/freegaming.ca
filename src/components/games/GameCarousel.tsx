import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import GameCard from './GameCard'
import type { Game } from '../../lib/types'

interface Props {
  games: (Game & { categories?: { name: string } })[]
  title: string
  icon?: React.ReactNode
  accentColor?: string
  linkTo?: string
  linkLabel?: string
}

export default function GameCarousel({ games, title, icon, accentColor = 'var(--neon-lime)', linkTo, linkLabel = 'See All' }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return
    const amount = scrollRef.current.clientWidth < 640 ? 170 : 280
    scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' })
  }

  return (
    <section className="mb-10">
      <div className="section-header">
        <div className="section-title">
          {icon && <span style={{ color: accentColor }}>{icon}</span>}
          {title}
        </div>
        <div className="flex items-center gap-2">
          {linkTo && (
            <Link to={linkTo} className="section-link hidden sm:inline">{linkLabel} →</Link>
          )}
          <button onClick={() => scroll('left')} className="p-1.5 rounded-md border border-[var(--line-visible)] bg-[var(--bg-surface)] text-[var(--text-secondary)] flex items-center transition-colors hover:border-[var(--ice)] hover:text-[var(--ice)]">
            <ChevronLeft size={16} />
          </button>
          <button onClick={() => scroll('right')} className="p-1.5 rounded-md border border-[var(--line-visible)] bg-[var(--bg-surface)] text-[var(--text-secondary)] flex items-center transition-colors hover:border-[var(--ice)] hover:text-[var(--ice)]">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="carousel-scroll">
        {games.map(g => (
          <div key={g.id} className="w-36 sm:w-44 md:w-52 flex-shrink-0">
            <GameCard game={g} size="sm" />
          </div>
        ))}
      </div>
    </section>
  )
}

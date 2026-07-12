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
    scrollRef.current.scrollBy({ left: dir === 'left' ? -280 : 280, behavior: 'smooth' })
  }

  return (
    <section style={{ marginBottom: '2.5rem' }}>
      <div className="section-header">
        <div className="section-title">
          {icon && <span style={{ color: accentColor }}>{icon}</span>}
          {title}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {linkTo && (
            <Link to={linkTo} className="section-link">{linkLabel} →</Link>
          )}
          <button onClick={() => scroll('left')} style={{
            background: 'var(--bg-surface)', border: '1px solid var(--line-visible)',
            color: 'var(--text-secondary)', borderRadius: '6px', padding: '5px',
            cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'all 0.2s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--ice)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--ice)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--line-visible)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)' }}
          ><ChevronLeft size={16} /></button>
          <button onClick={() => scroll('right')} style={{
            background: 'var(--bg-surface)', border: '1px solid var(--line-visible)',
            color: 'var(--text-secondary)', borderRadius: '6px', padding: '5px',
            cursor: 'pointer', display: 'flex', alignItems: 'center', transition: 'all 0.2s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--ice)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--ice)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--line-visible)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)' }}
          ><ChevronRight size={16} /></button>
        </div>
      </div>

      <div ref={scrollRef} className="carousel-scroll" style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '8px' }}>
        {games.map(g => (
          <div key={g.id} style={{ width: '200px', flexShrink: 0 }}>
            <GameCard game={g} size="sm" />
          </div>
        ))}
      </div>
    </section>
  )
}

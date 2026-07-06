import { useState } from 'react'
import { Play, Maximize2 } from 'lucide-react'
import type { Game } from '../../lib/types'

interface Props {
  game: Game
}

export default function GamePlayer({ game }: Props) {
  const [playing, setPlaying] = useState(false)

  if (!playing) {
    return (
      <div
        style={{
          position: 'relative', borderRadius: '12px', overflow: 'hidden',
          aspectRatio: '16/10', backgroundColor: 'var(--bg-surface)',
          cursor: 'pointer', border: '1px solid var(--line-visible)',
        }}
        onClick={() => setPlaying(true)}
      >
        <img
          src={game.thumbnail}
          alt={game.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'brightness(0.5)' }}
          onError={e => { (e.target as HTMLImageElement).src = `https://placehold.co/800x500/0f1a12/39ff14?text=${encodeURIComponent(game.title)}` }}
        />
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: '1rem',
        }}>
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            backgroundColor: 'var(--neon-lime)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 40px var(--neon-lime-glow)', transition: 'transform 0.2s',
          }}
            onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.transform = 'scale(1.1)')}
            onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.transform = 'scale(1)')}
          >
            <Play size={36} fill="var(--bg-void)" color="var(--bg-void)" style={{ marginLeft: '4px' }} />
          </div>
          <span style={{
            fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700,
            fontSize: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.1em',
            color: 'var(--text-primary)',
          }}>PLAY FREE</span>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>No download · No signup</span>
        </div>
      </div>
    )
  }

  return (
    <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--line-visible)' }}>
      <div style={{ position: 'absolute', top: '8px', right: '8px', zIndex: 10 }}>
        <button
          onClick={() => {
            const el = document.getElementById('game-iframe-container')
            if (el?.requestFullscreen) el.requestFullscreen()
          }}
          style={{
            background: 'rgba(0,0,0,0.7)', border: '1px solid var(--line-visible)',
            color: 'var(--text-secondary)', borderRadius: '6px', padding: '6px',
            cursor: 'pointer', display: 'flex', alignItems: 'center',
          }}
          title="Fullscreen"
        >
          <Maximize2 size={16} />
        </button>
      </div>
      <div id="game-iframe-container" style={{ width: '100%', aspectRatio: `${game.width}/${game.height}`, minHeight: '400px', background: '#000' }}>
        <iframe
          src={game.iframe_url}
          title={game.title}
          width="100%"
          height="100%"
          style={{ border: 'none', display: 'block' }}
          allow="autoplay; fullscreen; payment"
          referrerPolicy="unsafe-url"
          allowFullScreen
        />
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import { Play, Maximize2 } from 'lucide-react'
import type { Game } from '../../lib/types'

interface Props {
  game: Game
}

function extractGmToken(iframeUrl: string): string | null {
  try {
    return new URL(iframeUrl).pathname.split('/').filter(Boolean)[0] ?? null
  } catch {
    return null
  }
}

export default function GamePlayer({ game }: Props) {
  const [playing, setPlaying] = useState(false)
  const [adPaused, setAdPaused] = useState(false)

  const gmToken = game.source === 'GAMEMONETIZE' ? extractGmToken(game.iframe_url) : null

  useEffect(() => {
    if (!playing || !gmToken) return

    ;(window as Window & { SDK_OPTIONS?: unknown }).SDK_OPTIONS = {
      gameId: gmToken,
      onEvent(e: { name: string }) {
        if (e.name === 'SDK_GAME_PAUSE') setAdPaused(true)
        if (e.name === 'SDK_GAME_START') setAdPaused(false)
        if (e.name === 'SDK_READY') {
          const sdk = (window as Window & { sdk?: { showBanner(): void } }).sdk
          sdk?.showBanner()
        }
      },
    }

    if (!document.getElementById('gamemonetize-sdk')) {
      const s = document.createElement('script')
      s.id = 'gamemonetize-sdk'
      s.src = 'https://api.gamemonetize.com/sdk.js'
      document.head.appendChild(s)
    }

    return () => {
      document.getElementById('gamemonetize-sdk')?.remove()
      delete (window as Window & { SDK_OPTIONS?: unknown }).SDK_OPTIONS
      setAdPaused(false)
    }
  }, [playing, gmToken])

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

      <div id="game-iframe-container" style={{ width: '100%', aspectRatio: `${game.width}/${game.height}`, minHeight: 'var(--game-player-min-height)', background: '#000', position: 'relative' }}>
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

        {/* Overlay when SDK shows an ad */}
        {adPaused && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 20,
            backgroundColor: 'rgba(8,13,10,0.85)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '40px', height: '40px', border: '3px solid var(--neon-lime)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
              <p style={{ color: 'var(--text-secondary)', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.875rem', margin: 0 }}>Ad playing — game will resume shortly</p>
            </div>
          </div>
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

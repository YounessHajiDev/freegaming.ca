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
        className="relative rounded-xl overflow-hidden aspect-[16/10] min-h-[220px] md:min-h-[340px] bg-[var(--bg-surface)] cursor-pointer border border-[var(--line-visible)]"
        onClick={() => setPlaying(true)}
      >
        <img
          src={game.thumbnail}
          alt={game.title}
          className="w-full h-full object-cover block brightness-50"
          onError={e => { (e.target as HTMLImageElement).src = `https://placehold.co/800x500/0f1a12/39ff14?text=${encodeURIComponent(game.title)}` }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 md:gap-4 p-4 text-center">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[var(--neon-lime)] flex items-center justify-center shadow-[0_0_40px_var(--neon-lime-glow)] transition-transform hover:scale-110">
            <Play size={36} fill="var(--bg-void)" color="var(--bg-void)" className="ml-1" />
          </div>
          <span className="font-display font-bold text-lg md:text-xl uppercase tracking-widest text-[var(--text-primary)]">PLAY FREE</span>
          <span className="text-xs md:text-sm text-[var(--text-secondary)]">No download · No signup</span>
        </div>
      </div>
    )
  }

  return (
    <div className="relative rounded-xl overflow-hidden border border-[var(--line-visible)]">
      <div className="absolute top-2 right-2 z-10">
        <button
          onClick={() => {
            const el = document.getElementById('game-iframe-container')
            if (el?.requestFullscreen) el.requestFullscreen()
          }}
          className="bg-black/70 border border-[var(--line-visible)] text-[var(--text-secondary)] rounded-md p-1.5 cursor-pointer flex items-center hover:text-[var(--neon-lime)] hover:border-[var(--neon-lime)] transition-colors"
          title="Fullscreen"
        >
          <Maximize2 size={16} />
        </button>
      </div>

      <div id="game-iframe-container" className="w-full min-h-[260px] md:min-h-[400px] bg-black relative" style={{ aspectRatio: `${game.width}/${game.height}` }}>
        <iframe
          src={game.iframe_url}
          title={game.title}
          width="100%"
          height="100%"
          className="border-none block"
          allow="autoplay; fullscreen; payment"
          referrerPolicy="unsafe-url"
          allowFullScreen
        />

        {/* Overlay when SDK shows an ad */}
        {adPaused && (
          <div className="absolute inset-0 z-20 bg-[rgba(8,13,10,0.85)] flex items-center justify-center">
            <div className="text-center px-4">
              <div className="w-10 h-10 border-[3px] border-[var(--neon-lime)] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-[var(--text-secondary)] font-body m-0">Ad playing — game will resume shortly</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

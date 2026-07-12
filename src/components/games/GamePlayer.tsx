import { useState } from 'react'
import { X, Maximize2 } from 'lucide-react'

interface GamePlayerProps {
  iframeUrl: string
  title: string
  width?: number
  height?: number
}

export default function GamePlayer({ iframeUrl, title, width = 800, height = 600 }: GamePlayerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Calculate aspect ratio for responsive container
  const aspectRatio = height / width
  const paddingTop = `${(aspectRatio * 100).toFixed(2)}%`

  if (isFullscreen) {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 10000, background: 'var(--bg-void)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', borderBottom: '1px solid var(--line-visible)', flexShrink: 0 }}>
          <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1.125rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</span>
          <button
            onClick={() => setIsFullscreen(false)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', background: 'var(--bg-elevated)', border: '1px solid var(--line-visible)', borderRadius: '6px', color: 'var(--text-secondary)', cursor: 'pointer', flexShrink: 0, fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.875rem' }}
          >
            <X size={15} /> Exit
          </button>
        </div>
        <iframe
          src={iframeUrl}
          title={title}
          style={{ flex: 1, width: '100%', border: 'none', display: 'block' }}
          allowFullScreen
          allow="gamepad *; autoplay"
        />
      </div>
    )
  }

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      {/* Responsive aspect-ratio container */}
      <div style={{
        position: 'relative', width: '100%', paddingTop, background: 'var(--bg-void)',
        borderRadius: '10px', overflow: 'hidden', border: '2px solid var(--line-visible)',
      }}>
        <iframe
          src={iframeUrl}
          title={title}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none', display: 'block' }}
          allowFullScreen
          allow="gamepad *; autoplay"
        />
      </div>

      {/* Controls bar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
        <button
          onClick={() => setIsFullscreen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', background: 'var(--bg-elevated)', border: '1px solid var(--line-visible)', borderRadius: '6px', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.8125rem', transition: 'border-color 0.15s, color 0.15s', minHeight: '40px' }}
          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--neon-lime)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--neon-lime)' }}
          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--line-visible)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)' }}
        >
          <Maximize2 size={13} /> Fullscreen
        </button>
      </div>
    </div>
  )
}

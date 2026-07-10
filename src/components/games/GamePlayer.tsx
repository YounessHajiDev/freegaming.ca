import { useState } from 'react'
import { X } from 'lucide-react'

interface GamePlayerProps {
  iframeUrl: string
  title: string
  width?: number
  height?: number
}

export default function GamePlayer({ iframeUrl, title, width = 800, height = 600 }: GamePlayerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const containerStyle = isFullscreen ? {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 10000,
    background: 'var(--bg-void)',
  } : {
    position: 'relative' as const,
    width: '100%',
    marginBottom: '2rem',
  }

  const playerStyle = isFullscreen ? {
    width: '100%',
    height: '100%',
  } : {
    width: '100%',
    maxWidth: `${width}px`,
    height: `${height}px`,
    border: '2px solid var(--line-visible)',
    borderRadius: '0.5rem',
  }

  return (
    <div style={containerStyle}>
      {isFullscreen && (
        <button
          onClick={handleFullscreen}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'rgba(0,0,0,0.7)',
            color: 'var(--neon-lime)',
            padding: '0.5rem',
            borderRadius: '0.25rem',
            zIndex: 10001,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <X size={24} />
        </button>
      )}
      <iframe
        src={iframeUrl}
        title={title}
        style={playerStyle as React.CSSProperties}
        allowFullScreen
        allow="gamepad *"
      />
    </div>
  )
}

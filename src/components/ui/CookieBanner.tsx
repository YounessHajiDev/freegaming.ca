import { useState, useEffect } from 'react'
import { Cookie, X } from 'lucide-react'

export default function CookieBanner() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const accepted = localStorage.getItem('cookies-accepted')
    if (!accepted) {
      setShow(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookies-accepted', 'true')
    setShow(false)
  }

  if (!show) return null

  return (
    <div style={bannerStyles.container}>
      <div style={bannerStyles.content}>
        <div style={bannerStyles.header}>
          <Cookie size={20} style={{ color: 'var(--neon-lime)' }} />
          <span style={bannerStyles.title}>Cookie Consent</span>
        </div>
        <p style={bannerStyles.text}>
          We use cookies to enhance your experience and analyze site traffic. By continuing to browse, you consent to our use of cookies.
        </p>
        <div style={bannerStyles.actions}>
          <button onClick={handleAccept} className="btn-primary">
            Accept All
          </button>
          <button
            onClick={() => setShow(false)}
            className="btn-ghost"
            style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
          >
            Dismiss
          </button>
        </div>
      </div>
      <button
        onClick={() => setShow(false)}
        style={bannerStyles.close}
      >
        <X size={20} />
      </button>
    </div>
  )
}

const bannerStyles = {
  container: {
    position: 'fixed' as const,
    bottom: '1rem',
    left: '1rem',
    right: '1rem',
    maxWidth: '400px',
    background: 'var(--bg-elevated)',
    border: '2px solid var(--neon-lime)',
    borderRadius: '0.5rem',
    padding: '1.5rem',
    zIndex: 9999,
    boxShadow: '0 0 30px rgba(57, 255, 20, 0.2)',
  },
  content: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  title: {
    fontSize: '1rem',
    fontWeight: 700,
    color: 'var(--neon-lime)',
    fontFamily: "'Barlow Condensed', sans-serif",
  },
  text: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.5,
  },
  actions: {
    display: 'flex',
    gap: '0.75rem',
  },
  close: {
    position: 'absolute' as const,
    top: '0.5rem',
    right: '0.5rem',
    background: 'transparent',
    color: 'var(--text-secondary)',
    padding: '0.25rem',
    border: 'none',
    cursor: 'pointer',
    transition: 'color 0.2s ease',
  } as const,
}

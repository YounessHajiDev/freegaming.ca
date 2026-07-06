import { useState, useEffect } from 'react'

const CONSENT_KEY = 'fg_cookie_consent'

export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY)
    if (!consent) setVisible(true)
  }, [])

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, 'accepted')
    setVisible(false)
    // Enable GA if configured
    if (typeof window !== 'undefined' && (window as Window & { gtag?: (...args: unknown[]) => void }).gtag) {
      (window as Window & { gtag?: (...args: unknown[]) => void }).gtag?.('consent', 'update', { analytics_storage: 'granted', ad_storage: 'granted' })
    }
  }

  const decline = () => {
    localStorage.setItem(CONSENT_KEY, 'declined')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed', bottom: '70px', left: 0, right: 0, zIndex: 60,
      padding: '1rem 1.5rem',
      backgroundColor: 'var(--bg-elevated)', borderTop: '1px solid var(--line-visible)',
      boxShadow: '0 -4px 24px rgba(0,0,0,0.4)',
    }}
      className="cookie-banner-desktop"
    >
      <style>{`@media(min-width:640px){.cookie-banner-desktop{bottom:0!important}}`}</style>
      <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem' }}>
        <p style={{ flex: 1, fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0, minWidth: '280px' }}>
          FreeGaming.ca uses cookies to improve your experience and show relevant ads (Google AdSense).
          In compliance with <strong style={{ color: 'var(--text-primary)' }}>PIPEDA</strong> (Canada's privacy law), your consent is required.{' '}
          <a href="/privacy-policy" style={{ color: 'var(--neon-lime)', textDecoration: 'underline' }}>Privacy Policy</a>
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', flexShrink: 0 }}>
          <button onClick={decline} className="btn-ghost">Decline</button>
          <button onClick={accept} className="btn-primary" style={{ padding: '10px 20px', fontSize: '0.875rem' }}>Accept All</button>
        </div>
      </div>
    </div>
  )
}

export function useConsent() {
  return localStorage.getItem(CONSENT_KEY) === 'accepted'
}

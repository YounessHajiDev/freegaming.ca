import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={footerStyles.container}>
      <div style={footerStyles.content}>
        <div style={footerStyles.brand}>
          <h3 style={{ color: 'var(--neon-lime)', marginBottom: '0.5rem' }}>FreeGaming.ca</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Discover and play hundreds of free online games. No registration required.
          </p>
        </div>

        <div style={footerStyles.links}>
          <h4 style={footerStyles.heading}>Company</h4>
          <Link to="/about" style={footerStyles.link}>About</Link>
          <Link to="/contact" style={footerStyles.link}>Contact</Link>
        </div>

        <div style={footerStyles.links}>
          <h4 style={footerStyles.heading}>Legal</h4>
          <Link to="/privacy-policy" style={footerStyles.link}>Privacy Policy</Link>
          <Link to="/terms-of-service" style={footerStyles.link}>Terms of Service</Link>
        </div>
      </div>

      <div style={footerStyles.bottom}>
        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>
          © 2026 FreeGaming.ca. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

const footerStyles = {
  container: {
    background: 'var(--bg-elevated)',
    borderTop: '1px solid var(--line-visible)',
    padding: 'clamp(2rem, 6vw, 3rem) 1rem 1rem',
    marginTop: 'auto',
  },
  content: {
    maxWidth: '1400px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: 'clamp(1.5rem, 4vw, 2rem)',
    marginBottom: '2rem',
  } as const,
  brand: {
    lineHeight: 1.6,
  },
  links: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
  },
  heading: {
    fontSize: '0.95rem',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    color: 'var(--text-secondary)',
    marginBottom: '0.5rem',
  },
  link: {
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
    transition: 'color 0.2s ease',
  } as const,
  bottom: {
    textAlign: 'center' as const,
    paddingTop: '1rem',
    borderTop: '1px solid var(--line-subtle)',
  },
}

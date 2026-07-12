import { Link } from 'react-router-dom'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer style={{
      borderTop: '1px solid var(--line-subtle)',
      backgroundColor: 'var(--bg-elevated)',
      padding: '2.5rem 1.5rem 1.5rem',
      marginBottom: '60px',
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
          <div>
            <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: '1.25rem', marginBottom: '0.75rem' }}>
              <span style={{ color: 'var(--ember)' }}>FREE</span>
              <span style={{ color: 'var(--text-primary)' }}>GAMING</span>
              <span style={{ color: 'var(--neon-lime)', fontSize: '0.9rem' }}>.CA</span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.6', maxWidth: '220px' }}>
              Canada's free online games portal. Thousands of browser games — no download, no signup required.
            </p>
          </div>

          <div>
            <h4 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>Games</h4>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {[
                ['/popular', 'Most Popular'],
                ['/new-games', 'New Games'],
                ['/category/puzzle-games', 'Puzzle Games'],
                ['/category/racing-games', 'Racing Games'],
                ['/category/action-games', 'Action Games'],
              ].map(([href, label]) => (
                <Link key={href} to={href} style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--neon-lime)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                >{label}</Link>
              ))}
            </nav>
          </div>

          <div>
            <h4 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>Browse</h4>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {[
                ['/free-games', 'Free Games'],
                ['/play-online', 'Play Online'],
                ['/unblocked-games', 'Unblocked Games'],
                ['/games-for-kids', 'Games for Kids'],
                ['/2-player-games', '2 Player Games'],
              ].map(([href, label]) => (
                <Link key={href} to={href} style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--neon-lime)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                >{label}</Link>
              ))}
            </nav>
          </div>

          <div>
            <h4 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>Company</h4>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {[
                ['/about', 'About Us'],
                ['/contact', 'Contact'],
                ['/privacy-policy', 'Privacy Policy'],
                ['/terms-of-service', 'Terms of Service'],
              ].map(([href, label]) => (
                <Link key={href} to={href} style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--neon-lime)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                >{label}</Link>
              ))}
            </nav>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--line-subtle)', paddingTop: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>
            © {year} FreeGaming.ca — Proudly Canadian 🍁. All rights reserved.
          </p>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>
            Free to play. No download required. For Canadians, by Canadians.
          </p>
        </div>
      </div>
    </footer>
  )
}

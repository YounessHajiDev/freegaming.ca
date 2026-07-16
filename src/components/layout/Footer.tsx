import { Link } from 'react-router-dom'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-[var(--line-subtle)] bg-[var(--bg-elevated)] pt-10 pb-6 px-6 mb-16 md:mb-0">
      <div className="max-w-[1400px] mx-auto">
        <div className="footer-grid mb-8">
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
                <Link key={href} to={href} className="text-sm text-[var(--text-secondary)] no-underline transition-colors hover:text-[var(--neon-lime)]">{label}</Link>
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
                <Link key={href} to={href} className="text-sm text-[var(--text-secondary)] no-underline transition-colors hover:text-[var(--neon-lime)]">{label}</Link>
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
                <Link key={href} to={href} className="text-sm text-[var(--text-secondary)] no-underline transition-colors hover:text-[var(--neon-lime)]">{label}</Link>
              ))}
            </nav>
          </div>
        </div>

        <div className="border-t border-[var(--line-subtle)] pt-5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-[var(--text-tertiary)] text-center sm:text-left">
            © {year} FreeGaming.ca — Proudly Canadian 🍁. All rights reserved.
          </p>
          <p className="text-xs text-[var(--text-tertiary)] text-center sm:text-right">
            Free to play. No download required. For Canadians, by Canadians.
          </p>
        </div>
      </div>
    </footer>
  )
}

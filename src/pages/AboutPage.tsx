import { Helmet } from 'react-helmet-async'
import { Gamepad2, Globe, Zap, Shield } from 'lucide-react'
import { SITE_URL, DEFAULT_OG_IMAGE, SITE_NAME } from '../lib/seo'

export default function AboutPage() {
  return (
    <>
      <Helmet>
        <title>About {SITE_NAME} — Canada's Free Online Games Portal</title>
        <meta name="description" content={`${SITE_NAME} is Canada's largest free online games portal. Thousands of browser games with no download, no signup — just click and play.`} />
        <link rel="canonical" href={`${SITE_URL}/about/`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/about/`} />
        <meta property="og:title" content={`About ${SITE_NAME} — Canada's Free Online Games Portal`} />
        <meta property="og:description" content={`${SITE_NAME} is Canada's largest free online games portal. Thousands of browser games with no download, no signup — just click and play.`} />
        <meta property="og:image" content={DEFAULT_OG_IMAGE} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_CA" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`About ${SITE_NAME}`} />
        <meta name="twitter:description" content={`${SITE_NAME} is Canada's largest free online games portal. Thousands of browser games with no download, no signup.`} />
        <meta name="twitter:image" content={DEFAULT_OG_IMAGE} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": `${SITE_URL}/` },
            { "@type": "ListItem", "position": 2, "name": "About Us", "item": `${SITE_URL}/about/` }
          ]
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": `${SITE_URL}/#organization`,
          "name": SITE_NAME,
          "url": SITE_URL,
          "description": "Canada's free online games portal. Play thousands of browser games with no download.",
          "areaServed": { "@type": "Country", "name": "Canada" },
          "inLanguage": "en-CA"
        })}</script>
      </Helmet>

      <div style={{ maxWidth: '780px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: '2.25rem', textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          About <span style={{ color: 'var(--ember)' }}>FreeGaming</span><span style={{ color: 'var(--neon-lime)' }}>.ca</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2.5rem' }}>
          Canada's home for free browser-based games — no download, no account, no cost.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2.5rem' }}>
          {[
            { icon: <Gamepad2 size={22} />, label: 'Thousands of Games', desc: 'New titles added every day across dozens of categories.' },
            { icon: <Zap size={22} />, label: 'Instant Play', desc: 'Click once and play. No downloads, no plugins, no installs.' },
            { icon: <Globe size={22} />, label: 'Works Everywhere', desc: 'Desktop, tablet, and mobile — any device, any browser.' },
            { icon: <Shield size={22} />, label: 'Safe & Free', desc: 'No account required, no personal data collected to play.' },
          ].map(item => (
            <div key={item.label} style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--line-subtle)', borderRadius: '10px', padding: '1.25rem' }}>
              <div style={{ color: 'var(--neon-lime)', marginBottom: '8px' }}>{item.icon}</div>
              <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1rem', textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '4px' }}>{item.label}</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{item.desc}</div>
            </div>
          ))}
        </div>

        <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--line-subtle)', borderRadius: '12px', padding: '2rem', marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1.375rem', textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '1rem' }}>Our Mission</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}>
            FreeGaming.ca launched with one goal: give Canadians — and players everywhere — a clean, fast, and completely free place to play online games. We believe great gaming shouldn't cost a thing or require you to hand over your email address.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}>
            We curate HTML5 browser games across dozens of categories, from puzzle and strategy to racing and action. Our catalogue is updated daily with fresh content sourced from the world's leading HTML5 game publishers, and every game runs directly in your browser.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            The site is kept free through non-intrusive advertising. We carefully balance monetization with user experience so you can enjoy your game without excessive interruption.
          </p>
        </div>

        <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--line-subtle)', borderRadius: '12px', padding: '2rem' }}>
          <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1.375rem', textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '1rem' }}>Game Publishers</h2>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1rem' }}>
            All games on FreeGaming.ca are provided under licence from their respective HTML5 game publishers through established distribution partnerships. We work with platforms including GameMonetize, GameDistribution, and HTML5Games.com to bring you a diverse and regularly refreshed library.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
            If you are a game developer or publisher and would like to feature your title on our platform, please reach out via our <a href="/contact" style={{ color: 'var(--neon-lime)', textDecoration: 'none' }}>contact page</a>.
          </p>
        </div>
      </div>
    </>
  )
}

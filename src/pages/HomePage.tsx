import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { Flame, Sparkles, Puzzle, Car, Trophy, Zap, Gamepad2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { Game } from '../lib/types'
import GameGrid from '../components/games/GameGrid'
import GameCarousel from '../components/games/GameCarousel'

const FAQ = [
  { q: 'Are all games on FreeGaming.ca really free?', a: 'Yes — every single game on FreeGaming.ca is 100% free to play. No hidden fees, no subscriptions, no in-app purchases required to enjoy the full game.' },
  { q: 'Do I need to download anything to play?', a: 'No downloads are ever required. All games run directly in your web browser using HTML5 technology. Just click Play and enjoy instantly.' },
  { q: 'Do I need to create an account?', a: 'No account or registration is required. You can play any game on FreeGaming.ca immediately without signing up.' },
  { q: 'Does FreeGaming.ca work on mobile devices?', a: 'Yes! FreeGaming.ca and all of our HTML5 games work on smartphones and tablets running iOS or Android, as well as desktop browsers.' },
  { q: 'Is FreeGaming.ca safe for kids?', a: 'FreeGaming.ca hosts age-appropriate arcade and casual games from vetted publishers. We recommend parental guidance for younger children. Our games-for-kids section features family-friendly titles.' },
]

export default function HomePage() {
  const [featured, setFeatured] = useState<(Game & { categories?: { name: string } })[]>([])
  const [popular, setPopular] = useState<(Game & { categories?: { name: string } })[]>([])
  const [newGames, setNewGames] = useState<(Game & { categories?: { name: string } })[]>([])
  const [byCategory, setByCategory] = useState<Record<string, (Game & { categories?: { name: string } })[]>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const select = 'id, title, slug, thumbnail, short_description, is_new, is_hot, is_featured, views, category_id, categories(name)'

    Promise.all([
      supabase.from('games').select(select).eq('is_active', true).eq('is_featured', true).order('views', { ascending: false }).limit(10),
      supabase.from('games').select(select).eq('is_active', true).order('views', { ascending: false }).limit(12),
      supabase.from('games').select(select).eq('is_active', true).eq('is_new', true).order('created_at', { ascending: false }).limit(10),
    ]).then(([featRes, popRes, newRes]) => {
      setFeatured((featRes.data ?? []) as (Game & { categories?: { name: string } })[])
      setPopular((popRes.data ?? []) as (Game & { categories?: { name: string } })[])
      setNewGames((newRes.data ?? []) as (Game & { categories?: { name: string } })[])
      setLoading(false)
    })

    // Category carousels
    const cats = [
      { slug: 'puzzle-games',    label: 'Puzzle Games' },
      { slug: 'racing-games',    label: 'Racing Games' },
      { slug: 'sports-games',    label: 'Sports Games' },
      { slug: 'action-games',    label: 'Action Games' },
      { slug: 'arcade-games',    label: 'Arcade Games' },
      { slug: 'strategy-games',  label: 'Strategy Games' },
    ]

    Promise.all(
      cats.map(cat =>
        supabase
          .from('games')
          .select(`id, title, slug, thumbnail, short_description, is_new, is_hot, is_featured, views, category_id, categories!inner(name, slug)`)
          .eq('is_active', true)
          .eq('categories.slug', cat.slug)
          .order('views', { ascending: false })
          .limit(10)
          .then(({ data }) => ({ slug: cat.slug, games: (data ?? []) as (Game & { categories?: { name: string } })[] }))
      )
    ).then(results => {
      const map: Record<string, (Game & { categories?: { name: string } })[]> = {}
      results.forEach(r => { map[r.slug] = r.games })
      setByCategory(map)
    })
  }, [])

  const featuredMain = featured[0]
  const featuredRest = featured.slice(1, 5)

  return (
    <>
      <Helmet>
        <title>FreeGaming.ca — Free Online Games for Canadians | No Download Required</title>
        <meta name="description" content="Play thousands of free online games at FreeGaming.ca — Canada's #1 free gaming portal. No download, no signup. Puzzle, racing, sports, shooting & more. Play now!" />
        <link rel="canonical" href="https://www.freegaming.ca/" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.freegaming.ca/" />
        <meta property="og:title" content="FreeGaming.ca — Free Online Games for Canadians | No Download Required" />
        <meta property="og:description" content="Play thousands of free online games at FreeGaming.ca — Canada's #1 free gaming portal. No download, no signup. Puzzle, racing, sports, shooting &amp; more." />
        <meta property="og:image" content="https://www.freegaming.ca/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_CA" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="FreeGaming.ca — Free Online Games for Canadians" />
        <meta name="twitter:description" content="Play thousands of free online games — Canada's #1 free gaming portal. No download, no signup." />
        <meta name="twitter:image" content="https://www.freegaming.ca/og-image.png" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "@id": "https://www.freegaming.ca/#website",
          "name": "FreeGaming.ca",
          "url": "https://www.freegaming.ca",
          "potentialAction": { "@type": "SearchAction", "target": { "@type": "EntryPoint", "urlTemplate": "https://www.freegaming.ca/search?q={search_term_string}" }, "query-input": "required name=search_term_string" }
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": "https://www.freegaming.ca/#organization",
          "name": "FreeGaming.ca",
          "url": "https://www.freegaming.ca",
          "description": "Canada's free online games portal. Play thousands of browser games with no download.",
          "foundingDate": "2026",
          "areaServed": { "@type": "Country", "name": "Canada" },
          "inLanguage": "en-CA"
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": FAQ.map(f => ({
            "@type": "Question",
            "name": f.q,
            "acceptedAnswer": { "@type": "Answer", "text": f.a }
          }))
        })}</script>
      </Helmet>

      {/* Hero / Featured */}
      {(featured.length > 0 || loading) && (
        <section style={{ marginBottom: '2.5rem' }}>
          <div className="section-header">
            <div className="section-title"><Gamepad2 size={20} style={{ color: 'var(--ember)' }} />Featured Games</div>
          </div>
          {loading ? (
            <div className="featured-skeleton">
              <div className="skeleton" style={{ height: '220px', borderRadius: '12px' }} />
              {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton" style={{ height: '220px', borderRadius: '12px' }} />)}
            </div>
          ) : (
            <div className="featured-grid">
              {featuredMain && (
                <div className="featured-main">
                  <Link to={`/games/${featuredMain.slug}`} className="game-card" style={{ display: 'block', textDecoration: 'none' }}>
                    <div className="featured-card">
                      <img src={featuredMain.thumbnail} alt={featuredMain.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.5rem', background: 'linear-gradient(transparent, rgba(8,13,10,0.95))' }}>
                        <span className="badge badge-featured" style={{ marginBottom: '6px', display: 'inline-block' }}>Featured</span>
                        <h2 style={{ margin: 0, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: '1.5rem', textTransform: 'uppercase', color: 'var(--text-primary)' }}>{featuredMain.title}</h2>
                        <p style={{ margin: '4px 0 0', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{featuredMain.short_description}</p>
                      </div>
                    </div>
                  </Link>
                </div>
              )}
              {featuredRest.map(g => (
                <Link key={g.id} to={`/games/${g.slug}`} className="game-card" style={{ display: 'block', textDecoration: 'none' }}>
                  <div className="featured-card">
                    <img src={g.thumbnail} alt={g.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1rem', background: 'linear-gradient(transparent, rgba(8,13,10,0.9))' }}>
                      {g.is_hot && <span className="badge badge-hot" style={{ marginBottom: '4px', display: 'inline-block' }}>Hot</span>}
                      <h3 style={{ margin: 0, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1rem', textTransform: 'uppercase', color: 'var(--text-primary)' }}>{g.title}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Popular */}
      {(popular.length > 0 || loading) && (
        <GameCarousel games={popular} title="Most Popular" icon={<Flame size={18} />} accentColor="var(--state-hot)" linkTo="/popular" />
      )}

      {/* New This Week */}
      {(newGames.length > 0 || loading) && (
        <section style={{ marginBottom: '2.5rem' }}>
          <div className="section-header">
            <div className="section-title"><Sparkles size={18} style={{ color: 'var(--neon-lime)' }} />New This Week</div>
            <Link to="/new-games" className="section-link">See all new games →</Link>
          </div>
          <GameGrid games={newGames} loading={loading} columns={5} />
        </section>
      )}

      {/* Category carousels */}
      {byCategory['puzzle-games']?.length > 0 && <GameCarousel games={byCategory['puzzle-games']} title="Puzzle Games" icon={<Puzzle size={18} />} linkTo="/category/puzzle-games" />}
      {byCategory['racing-games']?.length > 0 && <GameCarousel games={byCategory['racing-games']} title="Racing Games" icon={<Car size={18} />} linkTo="/category/racing-games" />}
      {byCategory['sports-games']?.length > 0 && <GameCarousel games={byCategory['sports-games']} title="Sports Games" icon={<Trophy size={18} />} linkTo="/category/sports-games" />}
      {byCategory['action-games']?.length > 0 && <GameCarousel games={byCategory['action-games']} title="Action Games" icon={<Zap size={18} />} linkTo="/category/action-games" />}
      {byCategory['arcade-games']?.length > 0 && <GameCarousel games={byCategory['arcade-games']} title="Arcade Games" icon={<Gamepad2 size={18} />} linkTo="/category/arcade-games" />}
      {byCategory['strategy-games']?.length > 0 && <GameCarousel games={byCategory['strategy-games']} title="Strategy Games" icon={<Gamepad2 size={18} />} linkTo="/category/strategy-games" />}

      {/* SEO Text Block */}
      <section className="content-card" style={{ marginTop: '3rem' }}>
        <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1.5rem', textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '1rem' }}>
          Canada's #1 Free Online Games Portal
        </h2>
        <div style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', lineHeight: '1.75', display: 'grid', gap: '1rem' }}>
          <p>Welcome to FreeGaming.ca — the best free online games destination built specifically for Canadians. Whether you're in Toronto, Vancouver, Montreal, Calgary, or anywhere across Canada, our portal delivers hundreds of high-quality HTML5 browser games you can play instantly, with zero downloads and zero sign-ups required.</p>
          <p>Our catalogue spans every genre: puzzle games to sharpen your mind, racing games to get your heart pumping, sports games to channel your inner athlete, action games for pure adrenaline, and casual games perfect for a quick break. We add new games every week and curate our top picks so you always find something worth playing.</p>
          <p>FreeGaming.ca is proudly Canadian. We know what Canadian gamers love — intense competition, clever strategy, and games that work on any device. Every game in our library is playable on desktop, tablet, and mobile browsers. No Flash, no plugins, no nonsense. Just click and play.</p>
          <p>Our games come from top-tier HTML5 game publishers including GameMonetize and GameDistribution, the same networks that power the world's biggest free gaming portals. We've curated the best titles and made them available to Canadian players under one convenient roof — all for free, forever.</p>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ marginTop: '2.5rem' }}>
        <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1.5rem', textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
          Frequently Asked Questions
        </h2>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {FAQ.map((item, i) => (
            <details key={i} style={{
              backgroundColor: 'var(--bg-surface)', border: '1px solid var(--line-subtle)',
              borderRadius: '8px', padding: '1rem 1.25rem',
            }}>
              <summary style={{ cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, color: 'var(--text-primary)', fontSize: '1rem', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {item.q}
                <span style={{ color: 'var(--neon-lime)', marginLeft: '1rem', flexShrink: 0 }}>+</span>
              </summary>
              <p style={{ marginTop: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: '1.65', marginBottom: 0 }}>{item.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  )
}

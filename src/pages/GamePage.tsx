import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Eye } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { Game } from '../lib/types'
import GamePlayer from '../components/games/GamePlayer'
import GameCard from '../components/games/GameCard'
import GameCardSkeleton from '../components/games/GameCardSkeleton'

export default function GamePage() {
  const { slug } = useParams<{ slug: string }>()
  const [game, setGame] = useState<Game & { categories?: { name: string; slug: string } } | null>(null)
  const [related, setRelated] = useState<(Game & { categories?: { name: string } })[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const loadGame = useCallback(async () => {
    if (!slug) return
    setLoading(true)

    const { data, error } = await supabase
      .from('games')
      .select('*, categories(name, slug)')
      .eq('slug', slug)
      .eq('is_active', true)
      .maybeSingle()

    if (error || !data) { setNotFound(true); setLoading(false); return }

    setGame(data as Game & { categories?: { name: string; slug: string } })
    setLoading(false)

    // Increment view count
    const newViews = (data as Game).views + 1
    await (supabase.from('games') as ReturnType<typeof supabase.from>).update({ views: newViews }).eq('id', (data as Game).id)

    // Load related games
    const { data: rel } = await supabase
      .from('games')
      .select('id, title, slug, thumbnail, short_description, is_new, is_hot, is_featured, views, category_id, categories(name)')
      .eq('is_active', true)
      .eq('category_id', (data as Game).category_id)
      .neq('id', (data as Game).id)
      .order('views', { ascending: false })
      .limit(8)

    setRelated((rel ?? []) as (Game & { categories?: { name: string } })[])
  }, [slug])

  useEffect(() => { loadGame() }, [loadGame])

  if (notFound) return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
      <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '2rem', color: 'var(--text-primary)' }}>Game Not Found</h1>
      <Link to="/" className="btn-primary" style={{ display: 'inline-flex', marginTop: '1.5rem' }}>Back to Home</Link>
    </div>
  )

  if (loading || !game) return (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      <div className="skeleton" style={{ height: '40px', width: '60%', borderRadius: '8px' }} />
      <div className="skeleton" style={{ height: '500px', borderRadius: '12px' }} />
    </div>
  )

  const catName = (game as Game & { categories?: { name: string; slug: string } }).categories?.name ?? ''
  const catSlug = (game as Game & { categories?: { name: string; slug: string } }).categories?.slug ?? ''
  const pageTitle = `${game.title} — Play Free Online | ${catName} | FreeGaming.ca`
  const pageDesc = `Play ${game.title} for free online at FreeGaming.ca. No download, no signup — just click and play! ${catName} game for desktop and mobile.`

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc.slice(0, 165)} />
        <link rel="canonical" href={`https://www.freegaming.ca/games/${game.slug}/`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://www.freegaming.ca/games/${game.slug}/`} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc.slice(0, 165)} />
        <meta property="og:image" content={game.thumbnail} />
        <meta property="og:locale" content="en_CA" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${game.title} — Play Free Online | FreeGaming.ca`} />
        <meta name="twitter:description" content={`Play ${game.title} free in your browser. No download needed.`} />
        <meta name="twitter:image" content={game.thumbnail} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "VideoGame",
          "name": game.title,
          "description": game.description,
          "image": game.thumbnail,
          "isAccessibleForFree": true,
          "applicationCategory": "Game",
          "operatingSystem": "Web Browser",
          "gamePlatform": ["Web Browser", "Mobile Browser"],
          "offers": { "@type": "Offer", "price": "0", "priceCurrency": "CAD" }
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.freegaming.ca/" },
            { "@type": "ListItem", "position": 2, "name": catName, "item": `https://www.freegaming.ca/category/${catSlug}/` },
            { "@type": "ListItem", "position": 3, "name": game.title, "item": `https://www.freegaming.ca/games/${game.slug}/` },
          ]
        })}</script>
      </Helmet>

      {/* Breadcrumb */}
      <nav style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '1.25rem', fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>
        <Link to="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Home</Link>
        <span>/</span>
        <Link to={`/category/${catSlug}`} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>{catName}</Link>
        <span>/</span>
        <span style={{ color: 'var(--text-primary)' }}>{game.title}</span>
      </nav>

      <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: 'clamp(1.75rem, 4vw, 3rem)', textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '1.25rem', letterSpacing: '0.02em' }}>
        {game.title}
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: '1.5rem', alignItems: 'start' }}>
        <div style={{ minWidth: 0 }}>
          <GamePlayer game={game} />

          <div style={{ marginTop: '1.5rem', padding: '1.5rem', backgroundColor: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--line-subtle)' }}>
            <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1.25rem', textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>About This Game</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: '1.7', margin: 0 }}>{game.description}</p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1.25rem' }}>
              {game.tags.map(tag => (
                <span key={tag} style={{
                  fontSize: '0.75rem', padding: '4px 10px', borderRadius: '100px',
                  backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--line-subtle)',
                  color: 'var(--text-secondary)', fontFamily: 'Space Grotesk, sans-serif',
                }}>#{tag}</span>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--line-subtle)', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>
                <Link to={`/category/${catSlug}`} style={{ color: 'var(--ice)', textDecoration: 'none' }}>{catName}</Link>
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>
                <Eye size={13} /> {game.views.toLocaleString('en-CA')} plays
              </span>
              <span className="badge badge-free">Free</span>
            </div>
          </div>

          {/* Walkthrough — GameMonetize games only */}
          {game.source === 'GAMEMONETIZE' && game.source_id && (
            <GameWalkthrough gameId={game.source_id} title={game.title} />
          )}
        </div>

        {/* Sidebar — related games */}
        <aside>
          <h3 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.75rem', letterSpacing: '0.08em' }}>Similar Games</h3>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {related.length > 0
              ? related.map(g => (
                <Link key={g.id} to={`/games/${g.slug}`} style={{ display: 'flex', gap: '10px', textDecoration: 'none', alignItems: 'center', padding: '8px', borderRadius: '8px', background: 'var(--bg-surface)', border: '1px solid var(--line-subtle)', transition: 'border-color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--line-visible)')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--line-subtle)')}
                >
                  <img src={g.thumbnail} alt={g.title} style={{ width: '60px', height: '45px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{g.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{g.categories?.name}</div>
                  </div>
                </Link>
              ))
              : <GameCardSkeleton count={4} />
            }
          </div>
        </aside>
      </div>

      {/* You might also like */}
      {related.length > 0 && (
        <section style={{ marginTop: '2.5rem' }}>
          <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1.5rem', textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '1rem' }}>You Might Also Like</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
            {related.map(g => <GameCard key={g.id} game={g} size="sm" />)}
          </div>
        </section>
      )}
    </>
  )
}

function GameWalkthrough({ gameId, title }: { gameId: string; title: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [hasContent, setHasContent] = useState<boolean | null>(null) // null = loading

  useEffect(() => {
    setHasContent(null)
    const container = containerRef.current
    if (!container) return

    container.innerHTML = ''

    const scriptId = `gm-walkthrough-${gameId}`
    const existing = document.getElementById(scriptId)
    if (existing) existing.remove()

    const target = document.createElement('div')
    target.id = 'gamemonetize-video'
    container.appendChild(target)

    // Watch for the script injecting content into the target div
    const observer = new MutationObserver(() => {
      if (target.children.length > 0 || target.innerHTML.trim() !== '') {
        setHasContent(true)
        observer.disconnect()
      }
    })
    observer.observe(target, { childList: true, subtree: true, characterData: true })

    // If nothing appears within 4 seconds, the game has no walkthrough
    const timeout = setTimeout(() => {
      observer.disconnect()
      setHasContent(prev => prev === null ? false : prev)
    }, 4000)

    ;(window as Window & typeof globalThis & { gm_walkthrough?: object }).gm_walkthrough = {
      game: gameId,
      width: '100%',
      height: '480',
      color: '#007bff',
      getAds: 'true',
    }

    const script = document.createElement('script')
    script.id = scriptId
    script.src = 'https://gamemonetize.com/walkthrough.js'
    script.async = true
    container.appendChild(script)

    return () => {
      clearTimeout(timeout)
      observer.disconnect()
      script.remove()
      container.innerHTML = ''
    }
  }, [gameId])

  if (hasContent === false) return null

  return (
    <div style={{ marginTop: '1.5rem', padding: '1.5rem', backgroundColor: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--line-subtle)' }}>
      <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1.25rem', textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '1rem' }}>
        {title} — Walkthrough
      </h2>
      <div ref={containerRef} style={{ minHeight: hasContent ? undefined : '60px' }} />
    </div>
  )
}

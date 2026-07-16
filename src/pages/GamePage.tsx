import { useEffect, useState, useCallback } from 'react'
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

  const multiplayerTags = ['multiplayer', '2-player', 'two-player', 'co-op', 'coop', 'pvp', 'versus', 'online']
  const isMultiplayer = game.tags?.some(t => multiplayerTags.includes(t.toLowerCase()))
  const datePublished = game.created_at?.split('T')[0]
  const dateModified  = game.updated_at?.split('T')[0]

  const gameSchema = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    "name": game.title,
    "description": game.description,
    "image": game.thumbnail,
    "screenshot": { "@type": "ImageObject", "url": game.thumbnail, "description": `Screenshot of ${game.title}` },
    "url": `https://www.freegaming.ca/games/${game.slug}/`,
    "genre": catName,
    "keywords": game.tags?.join(', ') || undefined,
    "applicationCategory": "GameApplication",
    "operatingSystem": "Web Browser",
    "gamePlatform": ["Web Browser", "Mobile Browser"],
    "playMode": isMultiplayer ? "MultiPlayer" : "SinglePlayer",
    "numberOfPlayers": { "@type": "QuantitativeValue", "minValue": 1, "maxValue": isMultiplayer ? 2 : 1 },
    "contentRating": "Everyone",
    "interactivityType": "active",
    "isAccessibleForFree": true,
    "isFamilyFriendly": true,
    "inLanguage": "en",
    "datePublished": datePublished || undefined,
    "dateModified": dateModified || undefined,
    "publisher": { "@type": "Organization", "name": "FreeGaming.ca", "url": "https://www.freegaming.ca" },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "CAD",
      "availability": "https://schema.org/InStock",
      "url": `https://www.freegaming.ca/games/${game.slug}/`
    },
    "mainEntityOfPage": { "@type": "WebPage", "@id": `https://www.freegaming.ca/games/${game.slug}/` }
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.freegaming.ca/" },
      { "@type": "ListItem", "position": 2, "name": catName, "item": `https://www.freegaming.ca/category/${catSlug}/` },
      { "@type": "ListItem", "position": 3, "name": game.title, "item": `https://www.freegaming.ca/games/${game.slug}/` },
    ]
  }

  return (
    <>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc.slice(0, 165)} />
        {game.tags?.length > 0 && <meta name="keywords" content={game.tags.slice(0, 10).join(', ')} />}
        <link rel="canonical" href={`https://www.freegaming.ca/games/${game.slug}/`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://www.freegaming.ca/games/${game.slug}/`} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDesc.slice(0, 165)} />
        <meta property="og:image" content={game.thumbnail} />
        <meta property="og:image:width" content="512" />
        <meta property="og:image:height" content="384" />
        <meta property="og:image:alt" content={`Play ${game.title} free online`} />
        <meta property="og:locale" content="en_CA" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${game.title} — Play Free Online | FreeGaming.ca`} />
        <meta name="twitter:description" content={`Play ${game.title} free in your browser. No download needed.`} />
        <meta name="twitter:image" content={game.thumbnail} />
        <meta name="twitter:image:alt" content={`${game.title} game screenshot`} />
        <script type="application/ld+json">{JSON.stringify(gameSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
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

      <div className="game-page-layout">
        <div className="min-w-0">
          <GamePlayer game={game} />

          <div className="mt-6 p-4 md:p-6 rounded-xl bg-[var(--bg-surface)] border border-[var(--line-subtle)]">
            <h2 className="font-display font-bold text-lg uppercase text-[var(--text-primary)] mb-3">About This Game</h2>
            <p className="text-[var(--text-secondary)] text-sm md:text-base leading-relaxed m-0">{game.description}</p>

            <div className="flex flex-wrap gap-2 mt-5">
              {game.tags.map(tag => (
                <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-[var(--bg-elevated)] border border-[var(--line-subtle)] text-[var(--text-secondary)] font-body">#{tag}</span>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 mt-5 pt-4 border-t border-[var(--line-subtle)]">
              <span className="text-sm text-[var(--text-tertiary)]">
                <Link to={`/category/${catSlug}`} className="text-[var(--ice)] no-underline hover:underline">{catName}</Link>
              </span>
              <span className="flex items-center gap-1 text-sm text-[var(--text-tertiary)]">
                <Eye size={13} /> {game.views.toLocaleString('en-CA')} plays
              </span>
              <span className="badge badge-free">Free</span>
            </div>
          </div>

          {/* Walkthrough — GameMonetize games only */}
          {game.source === 'GAMEMONETIZE' && game.iframe_url && (() => {
            try {
              const token = new URL(game.iframe_url).pathname.split('/').filter(Boolean)[0]
              return token ? <GameWalkthrough gameId={token} title={game.title} /> : null
            } catch { return null }
          })()}
        </div>

        {/* Sidebar — related games */}
        <aside>
          <h3 className="font-display font-bold text-sm uppercase text-[var(--text-secondary)] mb-3 tracking-widest">Similar Games</h3>
          <div className="grid gap-3">
            {related.length > 0
              ? related.map(g => (
                <Link key={g.id} to={`/games/${g.slug}`} className="flex gap-2.5 items-center p-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--line-subtle)] no-underline transition-colors hover:border-[var(--line-visible)]">
                  <img src={g.thumbnail} alt={g.title} className="w-[60px] h-[45px] object-cover rounded flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-[var(--text-primary)] font-body truncate">{g.title}</div>
                    <div className="text-xs text-[var(--text-tertiary)]">{g.categories?.name}</div>
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
        <section className="mt-10">
          <h2 className="font-display font-bold text-xl uppercase text-[var(--text-primary)] mb-4">You Might Also Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {related.map(g => <GameCard key={g.id} game={g} size="sm" />)}
          </div>
        </section>
      )}
    </>
  )
}

function GameWalkthrough({ gameId, title }: { gameId: string; title: string }) {
  const [visible, setVisible] = useState<'pending' | 'show' | 'hide'>('pending')
  const iframeRef = useCallback((node: HTMLIFrameElement | null) => {
    if (!node) return
    // Give the GameMonetize video API up to 8s to inject content, then hide if empty
    const timer = setTimeout(() => setVisible('hide'), 8000)
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === 'gm-wt') {
        clearTimeout(timer)
        setVisible(e.data.ok ? 'show' : 'hide')
      }
    }
    window.addEventListener('message', handleMessage)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('message', handleMessage)
    }
  }, [gameId])

  const script = [
    `window.VIDEO_OPTIONS={gameid:"${gameId}",width:"100%",height:"480px",color:"#1a56db",getAds:"false"};`,
    `(function(a,b,c){var d=a.getElementsByTagName(b)[0];a.getElementById(c)||(a=a.createElement(b),a.id=c,a.src="https://api.gamemonetize.com/video.js?v="+Date.now(),d.parentNode.insertBefore(a,d))})(document,"script","gm-video-api");`,
    `var _n=0,_iv=setInterval(function(){`,
    `var el=document.getElementById("gamemonetize-video");`,
    `if(el&&el.children.length>0){clearInterval(_iv);window.parent.postMessage({type:"gm-wt",ok:true},"*");}`,
    `else if(++_n>40){clearInterval(_iv);window.parent.postMessage({type:"gm-wt",ok:false},"*");}`,
    `},200);`,
  ].join('')

  const html = [
    '<!DOCTYPE html><html><head>',
    '<style>*{box-sizing:border-box}body{margin:0;padding:0;background:#000}</style>',
    '</head><body>',
    '<div id="gamemonetize-video"></div>',
    `<script>${script}<\/script>`,
    '</body></html>',
  ].join('')

  const src = `data:text/html;charset=utf-8,${encodeURIComponent(html)}`

  if (visible === 'hide') return null

  return (
    <div style={{ marginTop: '1.5rem', padding: '1.5rem', backgroundColor: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--line-subtle)' }}>
      <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1.25rem', textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '1rem' }}>
        {title} — Walkthrough
      </h2>
      <iframe
        ref={iframeRef}
        src={src}
        style={{ width: '100%', height: '500px', border: 'none', display: 'block', borderRadius: '8px' }}
        allow="autoplay"
        sandbox="allow-scripts allow-same-origin"
        title={`${title} walkthrough`}
      />
    </div>
  )
}

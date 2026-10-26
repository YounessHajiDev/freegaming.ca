import { useEffect, useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { fetchCategoryData, type CardGame, type CategoryData } from '../lib/queries'
import { usePrerenderData } from '../lib/prerender'
import { CATEGORY_CONTENT } from '../data/categoryContent'
import { SITE_URL, DEFAULT_OG_IMAGE } from '../lib/seo'
import type { Category } from '../lib/types'
import GameGrid from '../components/games/GameGrid'

const PAGE_SIZE = 20

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>()
  const seeded = usePrerenderData<CategoryData>(`category:${slug}`)
  const [category, setCategory] = useState<Category | null>(seeded?.category ?? null)
  const [games, setGames] = useState<CardGame[]>(seeded?.games ?? [])
  const [total, setTotal] = useState(seeded?.total ?? 0)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(!seeded)

  const loadData = useCallback(async () => {
    if (!slug) return
    setLoading(true)
    const d = await fetchCategoryData(slug, page, PAGE_SIZE)
    setCategory(d.category)
    setTotal(d.total)
    setGames(d.games)
    setLoading(false)
  }, [slug, page])

  useEffect(() => { loadData() }, [loadData])
  useEffect(() => { setPage(0) }, [slug])

  if (!loading && !category) return (
    <div style={{ textAlign: 'center', padding: '4rem' }}>
      <Helmet>
        <title>Category Not Found | FreeGaming.ca</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '2rem', color: 'var(--text-primary)' }}>Category Not Found</h1>
      <Link to="/" className="btn-primary" style={{ display: 'inline-flex', marginTop: '1.5rem' }}>Back to Home</Link>
    </div>
  )

  const siteName = 'FreeGaming.ca'
  const content = slug ? CATEGORY_CONTENT[slug] : undefined
  const title = `Free ${category?.name ?? ''} Online — ${total}+ Games | ${siteName}`
  const desc = `Play ${total}+ free ${(category?.name ?? '').toLowerCase()} online at ${siteName}. No download required. Browser games for desktop and mobile.`

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={desc.slice(0, 165)} />
        <link rel="canonical" href={`${SITE_URL}/category/${slug}/`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/category/${slug}/`} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc.slice(0, 165)} />
        <meta property="og:image" content={DEFAULT_OG_IMAGE} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={`Play free ${category?.name ?? ''} games online`} />
        <meta property="og:locale" content="en_CA" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={desc.slice(0, 165)} />
        <meta name="twitter:image" content={DEFAULT_OG_IMAGE} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": `Free ${category?.name ?? ''} Online`,
          "description": desc.slice(0, 165),
          "url": `${SITE_URL}/category/${slug}/`,
          "isPartOf": { "@type": "WebSite", "url": SITE_URL }
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": `Free ${category?.name ?? ''} Games`,
          "url": `${SITE_URL}/category/${slug}/`,
          "numberOfItems": total,
          "itemListElement": games.slice(0, 10).map((g, i) => ({
            "@type": "ListItem",
            "position": i + 1 + page * PAGE_SIZE,
            "name": g.title,
            "url": `${SITE_URL}/games/${g.slug}/`,
            "image": g.thumbnail
          }))
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": `${SITE_URL}/` },
            { "@type": "ListItem", "position": 2, "name": category?.name ?? '', "item": `${SITE_URL}/category/${slug}/` }
          ]
        })}</script>
      </Helmet>

      <nav style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '1.25rem', fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>
        <Link to="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Home</Link>
        <span>/</span>
        <span style={{ color: 'var(--text-primary)' }}>{category?.name}</span>
      </nav>

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: 'clamp(2rem, 4vw, 3rem)', textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          {category?.name ?? <span className="skeleton" style={{ display: 'inline-block', width: '300px', height: '48px' }} />}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem' }}>
          {total > 0 ? `${total.toLocaleString('en-CA')} free games — no download, no signup required` : 'Loading games...'}
        </p>
      </div>

      {content && (
        <section className="content-card" style={{ marginBottom: '2rem' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.75, margin: 0 }}>{content.intro}</p>
          <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1.125rem', textTransform: 'uppercase', color: 'var(--text-primary)', margin: '1.25rem 0 0.5rem' }}>Tips before you play</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9375rem', lineHeight: 1.75, margin: 0 }}>{content.lookFor}</p>
        </section>
      )}

      <GameGrid games={games} loading={loading} columns={5} />

      {/* Pagination */}
      {total > PAGE_SIZE && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginTop: '2rem' }}>
          <button
            className="btn-ghost"
            disabled={page === 0}
            onClick={() => setPage(p => Math.max(0, p - 1))}
            style={{ opacity: page === 0 ? 0.4 : 1 }}
          >← Previous</button>
          <span style={{ padding: '8px 16px', color: 'var(--text-secondary)', fontSize: '0.875rem', fontFamily: 'Orbitron, monospace' }}>
            {page + 1} / {Math.ceil(total / PAGE_SIZE)}
          </span>
          <button
            className="btn-ghost"
            disabled={(page + 1) * PAGE_SIZE >= total}
            onClick={() => setPage(p => p + 1)}
            style={{ opacity: (page + 1) * PAGE_SIZE >= total ? 0.4 : 1 }}
          >Next →</button>
        </div>
      )}
    </>
  )
}

import { useEffect, useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { supabase } from '../lib/supabase'
import type { Game, Category } from '../lib/types'
import GameGrid from '../components/games/GameGrid'

const PAGE_SIZE = 20

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>()
  const [category, setCategory] = useState<Category | null>(null)
  const [games, setGames] = useState<(Game & { categories?: { name: string } })[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    if (!slug) return
    setLoading(true)

    const [catRes, gamesRes] = await Promise.all([
      supabase.from('categories').select('*').eq('slug', slug).maybeSingle(),
      supabase.from('games')
        .select('id, title, slug, thumbnail, short_description, is_new, is_hot, is_featured, views, category_id, categories!inner(name, slug)')
        .eq('is_active', true)
        .eq('categories.slug', slug)
        .order('views', { ascending: false })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1),
    ])

    setCategory(catRes.data as Category | null)

    const { count } = await supabase.from('games')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)
      .eq('category_id', (catRes.data as Category | null)?.id ?? 0)

    setTotal(count ?? 0)
    setGames((gamesRes.data ?? []) as (Game & { categories?: { name: string } })[])
    setLoading(false)
  }, [slug, page])

  useEffect(() => { loadData() }, [loadData])
  useEffect(() => { setPage(0); setGames([]) }, [slug])

  if (!loading && !category) return (
    <div style={{ textAlign: 'center', padding: '4rem' }}>
      <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '2rem', color: 'var(--text-primary)' }}>Category Not Found</h1>
      <Link to="/" className="btn-primary" style={{ display: 'inline-flex', marginTop: '1.5rem' }}>Back to Home</Link>
    </div>
  )

  const title = `Free ${category?.name ?? ''} Online — ${total}+ Games | FreeGaming.ca`
  const desc = `Play ${total}+ free ${(category?.name ?? '').toLowerCase()} online at FreeGaming.ca. No download required. Canada's best selection of free browser ${(category?.name ?? '').toLowerCase()}.`

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={desc.slice(0, 165)} />
        <link rel="canonical" href={`https://www.freegaming.ca/category/${slug}/`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://www.freegaming.ca/category/${slug}/`} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc.slice(0, 165)} />
        <meta property="og:image" content="https://www.freegaming.ca/og-image.png" />
        <meta property="og:locale" content="en_CA" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={desc.slice(0, 165)} />
        <meta name="twitter:image" content="https://www.freegaming.ca/og-image.png" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": `Free ${category?.name ?? ''} Online`,
          "description": desc.slice(0, 165),
          "url": `https://www.freegaming.ca/category/${slug}/`,
          "isPartOf": { "@type": "WebSite", "url": "https://www.freegaming.ca" }
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          "name": `Free ${category?.name ?? ''} Games`,
          "url": `https://www.freegaming.ca/category/${slug}/`,
          "numberOfItems": total,
          "itemListElement": games.slice(0, 10).map((g, i) => ({
            "@type": "ListItem",
            "position": i + 1 + page * PAGE_SIZE,
            "name": g.title,
            "url": `https://www.freegaming.ca/games/${g.slug}/`,
            "image": g.thumbnail
          }))
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.freegaming.ca/" },
            { "@type": "ListItem", "position": 2, "name": category?.name ?? '', "item": `https://www.freegaming.ca/category/${slug}/` }
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

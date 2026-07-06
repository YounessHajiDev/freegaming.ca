import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import type { Game } from '../../lib/types'
import GameGrid from '../games/GameGrid'

interface FaqItem { q: string; a: string }

interface SeoPageConfig {
  title: string
  metaDescription: string
  canonical: string
  h1: string
  intro: React.ReactNode
  faqs: FaqItem[]
  categorySlugs?: string[]
  relatedLinks?: { href: string; label: string }[]
  collectionName: string
}

export default function SeoGamePageTemplate({ cfg }: { cfg: SeoPageConfig }) {
  const [games, setGames] = useState<(Game & { categories?: { name: string } })[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let q = supabase
      .from('games')
      .select('id, title, slug, thumbnail, short_description, is_new, is_hot, is_featured, views, category_id, categories!inner(name, slug)')
      .eq('is_active', true)
      .order('views', { ascending: false })

    if (cfg.categorySlugs?.length) {
      q = q.in('categories.slug', cfg.categorySlugs)
    }

    q.limit(48).then(({ data }) => {
      setGames((data ?? []) as (Game & { categories?: { name: string } })[])
      setLoading(false)
    })
  }, [cfg.categorySlugs?.join(',')])

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: cfg.collectionName,
    description: cfg.metaDescription,
    url: cfg.canonical,
    isPartOf: { '@type': 'WebSite', url: 'https://www.freegaming.ca' },
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: cfg.faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.freegaming.ca/' },
      { '@type': 'ListItem', position: 2, name: cfg.collectionName, item: cfg.canonical },
    ],
  }

  return (
    <>
      <Helmet>
        <title>{cfg.title}</title>
        <meta name="description" content={cfg.metaDescription} />
        <link rel="canonical" href={cfg.canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={cfg.canonical} />
        <meta property="og:title" content={cfg.title} />
        <meta property="og:description" content={cfg.metaDescription} />
        <meta property="og:image" content="https://www.freegaming.ca/og-image.png" />
        <meta property="og:locale" content="en_CA" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={cfg.title} />
        <meta name="twitter:description" content={cfg.metaDescription} />
        <meta name="twitter:image" content="https://www.freegaming.ca/og-image.png" />
        <script type="application/ld+json">{JSON.stringify(collectionSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <nav style={{ display: 'flex', gap: '6px', alignItems: 'center', marginBottom: '1.25rem', fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>
        <Link to="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Home</Link>
        <span>/</span>
        <span style={{ color: 'var(--text-primary)' }}>{cfg.collectionName}</span>
      </nav>

      <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: 'clamp(2rem, 4vw, 3rem)', textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '1rem' }}>
        {cfg.h1}
      </h1>

      <div style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--line-subtle)' }}>
        {cfg.intro}
      </div>

      <GameGrid games={games} loading={loading} columns={5} />

      {cfg.relatedLinks && cfg.relatedLinks.length > 0 && (
        <div style={{ marginTop: '2.5rem', padding: '1.5rem', backgroundColor: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--line-subtle)' }}>
          <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1.25rem', textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '1rem' }}>
            More Game Collections
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {cfg.relatedLinks.map(l => (
              <Link key={l.href} to={l.href} style={{
                padding: '6px 14px', borderRadius: '100px',
                border: '1px solid var(--line-visible)', color: 'var(--text-secondary)',
                textDecoration: 'none', fontSize: '0.875rem',
                transition: 'all 0.15s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--neon-lime)'; e.currentTarget.style.color = 'var(--neon-lime)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line-visible)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
              >{l.label}</Link>
            ))}
          </div>
        </div>
      )}

      <section style={{ marginTop: '2.5rem' }}>
        <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1.5rem', textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
          Frequently Asked Questions
        </h2>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {cfg.faqs.map((item, i) => (
            <details key={i} style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--line-subtle)', borderRadius: '8px', padding: '1rem 1.25rem' }}>
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

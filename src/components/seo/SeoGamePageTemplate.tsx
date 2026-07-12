import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { ChevronDown } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { Game } from '../../lib/types'
import GameGrid from '../games/GameGrid'

export interface SeoPageConfig {
  title: string
  metaDescription: string
  canonical: string
  h1: string
  intro: React.ReactNode
  faqs: { q: string; a: string }[]
  categorySlugs?: string[]
  relatedLinks?: { href: string; label: string }[]
  collectionName: string
}

interface SeoGamePageTemplateProps {
  cfg: SeoPageConfig
}

export default function SeoGamePageTemplate({ cfg: config }: SeoGamePageTemplateProps) {
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [breadcrumbs, setBreadcrumbs] = useState<{ label: string; path: string }[]>([])

  useEffect(() => {
    const fetchGames = async () => {
      try {
        let query = supabase
          .from('games')
          .select('*')
          .eq('is_active', true)

        if (config.categorySlugs && config.categorySlugs.length > 0) {
          const { data: categories } = await supabase
            .from('categories')
            .select('id')
            .in('slug', config.categorySlugs)

          if (categories && categories.length > 0) {
            const categoryIds = categories.map(c => c.id)
            query = query.in('category_id', categoryIds)
          }
        }

        const { data } = await query.limit(48).order('views', { ascending: false })
        if (data) setGames(data)
      } catch (err) {
        console.error('Failed to fetch games:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchGames()
    setBreadcrumbs([
      { label: 'Home', path: '/' },
      { label: config.collectionName, path: window.location.pathname }
    ])
  }, [config])

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: config.title,
    description: config.metaDescription,
    url: `https://freegaming.ca${config.canonical}`,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((b, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: b.label,
        item: `https://freegaming.ca${b.path}`
      }))
    },
    mainEntity: {
      '@type': 'FAQPage',
      mainEntity: config.faqs.map(faq => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.a
        }
      }))
    }
  }

  return (
    <>
      <Helmet>
        <title>{config.title}</title>
        <meta name="description" content={config.metaDescription} />
        <link rel="canonical" href={`https://freegaming.ca${config.canonical}`} />
        <meta property="og:title" content={config.title} />
        <meta property="og:description" content={config.metaDescription} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      </Helmet>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        <nav style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          {breadcrumbs.map((b, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <a href={b.path} style={{ color: 'var(--neon-lime)' }}>{b.label}</a>
              {i < breadcrumbs.length - 1 && <span style={{ color: 'var(--text-tertiary)' }}>/</span>}
            </div>
          ))}
        </nav>

        <h1 style={{ marginBottom: '1rem', color: 'var(--neon-lime)' }}>{config.h1}</h1>

        <div style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--line-visible)',
          borderRadius: '0.5rem',
          padding: '1.5rem',
          marginBottom: '2rem',
        }}>
          {config.intro}
        </div>

        <GameGrid games={games} loading={loading} />

        {config.relatedLinks && config.relatedLinks.length > 0 && (
          <div style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--line-visible)',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            marginTop: '2rem',
            marginBottom: '2rem',
          }}>
            <h2 style={{ marginBottom: '1rem' }}>Related Links</h2>
            <ul style={{ listStyle: 'none', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              {config.relatedLinks.map((link, i) => (
                <li key={i}>
                  <a href={link.href} className="btn-ghost" style={{ display: 'block', textAlign: 'center' }}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div style={{
          background: 'var(--bg-elevated)',
          border: '1px solid var(--line-visible)',
          borderRadius: '0.5rem',
          padding: '1.5rem',
          marginBottom: '2rem',
        }}>
          <h2 style={{ marginBottom: '1rem' }}>Frequently Asked Questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {config.faqs.map((faq, i) => (
              <div key={i} style={{
                border: '1px solid var(--line-subtle)',
                borderRadius: '0.25rem',
                overflow: 'hidden',
              }}>
                <button
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    background: expandedFaq === i ? 'var(--bg-surface)' : 'transparent',
                    border: 'none',
                    color: 'var(--text-primary)',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span style={{ fontWeight: 600 }}>{faq.q}</span>
                  <ChevronDown
                    size={20}
                    style={{
                      transform: expandedFaq === i ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                      color: 'var(--neon-lime)',
                    }}
                  />
                </button>
                {expandedFaq === i && (
                  <div style={{ padding: '0 1rem 1rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

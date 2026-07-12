import { useEffect, useRef, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Search } from 'lucide-react'
import Fuse from 'fuse.js'
import { supabase } from '../lib/supabase'
import type { Game } from '../lib/types'
import GameCard from '../components/games/GameCard'
import GameCardSkeleton from '../components/games/GameCardSkeleton'

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const q = searchParams.get('q') ?? ''

  const [input, setInput] = useState(q)
  const [loading, setLoading] = useState(true)
  const fuseRef = useRef<Fuse<Game> | null>(null)

  useEffect(() => {
    supabase
      .from('games')
      .select('id, title, slug, thumbnail, short_description, is_new, is_hot, is_featured, views, category_id, categories(name)')
      .eq('is_active', true)
      .limit(1000)
      .then(({ data }) => {
        if (data) {
          fuseRef.current = new Fuse(data as Game[], {
            keys: ['title', 'short_description', 'tags'],
            threshold: 0.35,
          })
        }
        setLoading(false)
      })
  }, [])

  const results: (Game & { categories?: { name: string } })[] = q.trim() && fuseRef.current
    ? fuseRef.current.search(q).map(r => r.item) as (Game & { categories?: { name: string } })[]
    : []

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) setSearchParams({ q: input.trim() })
  }

  return (
    <>
      <Helmet>
        <title>{q ? `"${q}" — Search Results | FreeGaming.ca` : 'Search Games | FreeGaming.ca'}</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: '2rem', textTransform: 'uppercase', color: 'var(--text-primary)', margin: '0 0 1rem' }}>
          Search Games
        </h1>

        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', maxWidth: '600px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', pointerEvents: 'none' }} />
            <input
              autoFocus
              type="search"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Search by title, category, or tag…"
              style={{
                width: '100%', paddingLeft: '40px', paddingRight: '16px', height: '44px',
                background: 'var(--bg-surface)', border: '1px solid var(--line-visible)',
                borderRadius: '8px', color: 'var(--text-primary)', fontSize: '1rem',
                fontFamily: 'Space Grotesk, sans-serif', outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              padding: '0 20px', height: '44px', borderRadius: '8px', border: 'none',
              background: 'var(--ember)', color: '#000',
              fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700,
              fontSize: '1rem', textTransform: 'uppercase', cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            Search
          </button>
        </form>
      </div>

      {loading && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' }}>
          {Array.from({ length: 12 }).map((_, i) => <GameCardSkeleton key={i} />)}
        </div>
      )}

      {!loading && q.trim() && (
        <>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
            {results.length > 0
              ? <><span style={{ color: 'var(--neon-lime)', fontWeight: 600 }}>{results.length}</span> result{results.length !== 1 ? 's' : ''} for "<span style={{ color: 'var(--text-primary)' }}>{q}</span>"</>
              : <>No results for "<span style={{ color: 'var(--text-primary)' }}>{q}</span>"</>
            }
          </p>

          {results.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' }}>
              {results.map(g => <GameCard key={g.id} game={g} />)}
            </div>
          ) : (
            <div style={{ padding: '3rem', textAlign: 'center', backgroundColor: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--line-subtle)' }}>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Try a different search term or browse by category.</p>
              <Link to="/" className="btn-primary" style={{ display: 'inline-flex' }}>Browse All Games</Link>
            </div>
          )}
        </>
      )}

      {!loading && !q.trim() && (
        <div style={{ padding: '3rem', textAlign: 'center', backgroundColor: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--line-subtle)' }}>
          <Search size={40} style={{ color: 'var(--text-tertiary)', marginBottom: '1rem' }} />
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Type a game title, category, or tag to find games.</p>
        </div>
      )}
    </>
  )
}

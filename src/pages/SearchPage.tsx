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

      <div className="mb-6">
        <h1 className="font-display font-extrabold text-2xl md:text-3xl uppercase text-[var(--text-primary)] mb-4">Search Games</h1>

        <form onSubmit={handleSubmit} className="flex gap-2 max-w-[600px]">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] pointer-events-none" />
            <input
              autoFocus
              type="search"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Search by title, category, or tag…"
              className="search-input w-full h-11 pl-10 pr-4 rounded-lg bg-[var(--bg-surface)] border border-[var(--line-visible)] text-[var(--text-primary)] text-base font-body outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-5 h-11 rounded-lg border-none bg-[var(--ember)] text-black font-display font-bold text-base uppercase cursor-pointer flex-shrink-0"
          >
            Search
          </button>
        </form>
      </div>

      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 12 }).map((_, i) => <GameCardSkeleton key={i} />)}
        </div>
      )}

      {!loading && q.trim() && (
        <>
          <p className="text-sm md:text-base text-[var(--text-secondary)] mb-5">
            {results.length > 0
              ? <><span className="text-[var(--neon-lime)] font-semibold">{results.length}</span> result{results.length !== 1 ? 's' : ''} for "<span className="text-[var(--text-primary)]">{q}</span>"</>
              : <>No results for "<span className="text-[var(--text-primary)]">{q}</span>"</>
            }
          </p>

          {results.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {results.map(g => <GameCard key={g.id} game={g} />)}
            </div>
          ) : (
            <div className="p-12 text-center rounded-xl bg-[var(--bg-surface)] border border-[var(--line-subtle)]">
              <p className="text-[var(--text-secondary)] mb-4">Try a different search term or browse by category.</p>
              <Link to="/" className="btn-primary inline-flex">Browse All Games</Link>
            </div>
          )}
        </>
      )}

      {!loading && !q.trim() && (
        <div className="p-12 text-center rounded-xl bg-[var(--bg-surface)] border border-[var(--line-subtle)]">
          <Search size={40} className="text-[var(--text-tertiary)] mx-auto mb-4" />
          <p className="text-[var(--text-secondary)]">Type a game title, category, or tag to find games.</p>
        </div>
      )}
    </>
  )
}

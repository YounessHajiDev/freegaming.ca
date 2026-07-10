import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Home, Flame, Dices, Search, LayoutGrid, X, ArrowRight } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import Fuse from 'fuse.js'
import type { Game } from '../../lib/types'

export default function MobileNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<(Game & { categories?: { name: string } })[]>([])
  const fuseRef = useRef<Fuse<Game> | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const isActive = (path: string) => location.pathname === path

  useEffect(() => {
    // Close search overlay on route change
    setSearchOpen(false)
    setQuery('')
    setResults([])
  }, [location.pathname])

  useEffect(() => {
    if (!searchOpen) return
    // Load games for search when overlay opens
    if (fuseRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50)
      return
    }
    supabase
      .from('games')
      .select('id, title, slug, thumbnail, short_description, category_id, categories(name)')
      .eq('is_active', true)
      .limit(500)
      .then(({ data, error }) => {
        if (error) {
          console.error('Search load error:', error)
          return
        }
        if (data) {
          fuseRef.current = new Fuse(data as unknown as Game[], { keys: ['title', 'short_description'], threshold: 0.35 })
        }
        setTimeout(() => inputRef.current?.focus(), 50)
      })
  }, [searchOpen])

  const handleSearch = (value: string) => {
    setQuery(value)
    if (!value.trim() || !fuseRef.current) { setResults([]); return }
    setResults(fuseRef.current.search(value).slice(0, 12).map(r => r.item) as (Game & { categories?: { name: string } })[])
  }

  const handleRandomGame = async () => {
    const { count } = await supabase.from('games').select('*', { count: 'exact', head: true }).eq('is_active', true)
    if (!count) return
    const offset = Math.floor(Math.random() * count)
    const { data } = await supabase.from('games').select('slug').eq('is_active', true).range(offset, offset).returns<{ slug: string }[]>()
    if (data?.[0]) navigate(`/games/${data[0].slug}`)
  }

  const itemStyle = (active: boolean): React.CSSProperties => ({
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px',
    padding: '8px 12px', borderRadius: '8px', textDecoration: 'none',
    color: active ? 'var(--neon-lime)' : 'var(--text-secondary)',
    fontSize: '10px', fontFamily: 'Space Grotesk, sans-serif',
    background: active ? 'rgba(57,255,20,0.07)' : 'transparent',
    border: 'none', cursor: 'pointer',
  })

  return (
    <>
      <style>{`@media(min-width:640px){.mobile-nav-bar,.mobile-search-overlay{display:none!important}}`}</style>

      {/* Search overlay */}
      {searchOpen && (
        <div className="mobile-search-overlay" style={{
          position: 'fixed', inset: 0, zIndex: 60,
          backgroundColor: 'var(--bg-void)', display: 'flex', flexDirection: 'column',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px', borderBottom: '1px solid var(--line-visible)', flexShrink: 0 }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', pointerEvents: 'none' }} />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={e => handleSearch(e.target.value)}
                placeholder="Search games…"
                onKeyDown={e => {
                  if (e.key === 'Enter' && query.trim()) {
                    setSearchOpen(false)
                    navigate(`/search?q=${encodeURIComponent(query.trim())}`)
                  }
                }}
                style={{
                  width: '100%', paddingLeft: '36px', paddingRight: '12px', height: '44px',
                  background: 'var(--bg-elevated)', border: '1px solid var(--line-visible)',
                  borderRadius: '8px', color: 'var(--text-primary)', fontSize: '1rem',
                  fontFamily: 'Space Grotesk, sans-serif', outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>
            <button
              onClick={() => { setSearchOpen(false); setQuery(''); setResults([]) }}
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '8px', display: 'flex', alignItems: 'center', flexShrink: 0 }}
            >
              <X size={22} />
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
            {query.trim() && results.length === 0 && (
              <p style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>No results for "{query}"</p>
            )}
            {results.map(g => (
              <Link
                key={g.id}
                to={`/games/${g.slug}`}
                style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', textDecoration: 'none', borderBottom: '1px solid var(--line-subtle)' }}
              >
                <img src={g.thumbnail} alt={g.title} style={{ width: '52px', height: '40px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.9375rem', color: 'var(--text-primary)', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{g.title}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '2px' }}>{g.categories?.name}</div>
                </div>
                <ArrowRight size={14} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
              </Link>
            ))}
            {query.trim() && results.length > 0 && (
              <button
                onClick={() => { setSearchOpen(false); navigate(`/search?q=${encodeURIComponent(query.trim())}`) }}
                style={{ display: 'block', width: '100%', padding: '14px', background: 'none', border: 'none', color: 'var(--ember)', fontSize: '0.875rem', cursor: 'pointer', textAlign: 'center', fontWeight: 600 }}
              >
                See all results for "{query}"
              </button>
            )}
          </div>
        </div>
      )}

      {/* Bottom nav bar */}
      <nav className="mobile-nav-bar" style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
        backgroundColor: 'var(--bg-elevated)', borderTop: '1px solid var(--line-visible)',
        display: 'flex', justifyContent: 'space-around', alignItems: 'center',
        padding: '6px 8px', height: '60px',
      }}>
        <Link to="/" style={itemStyle(isActive('/'))}>
          <Home size={20} />
          Home
        </Link>
        <Link to="/popular" style={itemStyle(isActive('/popular'))}>
          <Flame size={20} />
          Popular
        </Link>
        <button onClick={handleRandomGame} style={itemStyle(false) as React.CSSProperties}>
          <Dices size={20} />
          Random
        </button>
        <button onClick={() => setSearchOpen(true)} style={itemStyle(searchOpen)}>
          <Search size={20} />
          Search
        </button>
        <Link to="/category/action-games" style={itemStyle(location.pathname.startsWith('/category'))}>
          <LayoutGrid size={20} />
          Browse
        </Link>
      </nav>
    </>
  )
}

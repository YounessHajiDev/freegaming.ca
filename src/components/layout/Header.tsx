import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Dices, Menu, X, Home, Flame, Sparkles, Gamepad2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import Fuse from 'fuse.js'
import type { Game, Category } from '../../lib/types'

export default function Header() {
  const [query, setQuery]         = useState('')
  const [results, setResults]     = useState<Game[]>([])
  const [dropOpen, setDropOpen]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const fuseRef = useRef<Fuse<Game> | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    supabase
      .from('games')
      .select('id, title, slug, thumbnail, short_description, category_id, categories(name)')
      .eq('is_active', true)
      .limit(500)
      .then(({ data }) => {
        if (data) {
          fuseRef.current = new Fuse(data as Game[], {
            keys: ['title', 'short_description'],
            threshold: 0.35,
          })
        }
      })
    supabase.from('categories').select('*').order('order_num').then(({ data }) => {
      if (data) setCategories(data as Category[])
    })
  }, [])

  const handleSearch = (value: string) => {
    setQuery(value)
    if (!value.trim() || !fuseRef.current) { setResults([]); setDropOpen(false); return }
    const hits = fuseRef.current.search(value).slice(0, 8).map(r => r.item)
    setResults(hits)
    setDropOpen(hits.length > 0)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setDropOpen(false)
      if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const handleRandomGame = async () => {
    const { count } = await supabase.from('games').select('*', { count: 'exact', head: true }).eq('is_active', true)
    if (!count) return
    const offset = Math.floor(Math.random() * count)
    const { data } = await supabase.from('games').select('slug').eq('is_active', true).range(offset, offset).returns<{ slug: string }[]>()
    if (data?.[0]) navigate(`/games/${data[0].slug}`)
  }

  return (
    <>
      <header
        className="sticky top-0 z-40 border-b border-[var(--line-visible)] bg-[var(--bg-glass)] backdrop-blur-md"
        style={{ backgroundColor: 'var(--bg-glass)' }}
      >
        <div className="max-w-[1400px] mx-auto h-16 flex items-center gap-4 px-4 lg:px-6">
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', flexShrink: 0 }} onClick={() => setMenuOpen(false)}>
            <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: '1.5rem', letterSpacing: '0.02em' }}>
              <span style={{ color: 'var(--ember)' }}>FREE</span>
              <span style={{ color: 'var(--text-primary)' }}>GAMING</span>
              <span style={{ color: 'var(--neon-lime)', fontSize: '1.1rem' }}>.CA</span>
            </span>
          </Link>

          {/* Search */}
          <div className="hidden sm:block flex-1 max-w-[480px] relative">
            <div className="relative">
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
              <input
                type="search"
                className="search-input w-full h-10 pl-10 pr-4 rounded-lg bg-[var(--bg-surface)] border border-[var(--line-visible)] text-[var(--text-primary)] text-sm font-body outline-none"
                placeholder="Search games..."
                value={query}
                onChange={e => handleSearch(e.target.value)}
                onFocus={() => results.length > 0 && setDropOpen(true)}
                onBlur={() => setTimeout(() => setDropOpen(false), 150)}
                onKeyDown={handleKeyDown}
              />
            </div>
            {dropOpen && results.length > 0 && (
              <div style={{
                position: 'absolute', top: '44px', left: 0, right: 0, zIndex: 50,
                background: 'var(--bg-elevated)', border: '1px solid var(--line-visible)',
                borderRadius: '8px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              }}>
                {results.map(g => (
                  <Link key={g.id} to={`/games/${g.slug}`}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', textDecoration: 'none', transition: 'background 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-surface)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <img src={g.thumbnail} alt={g.title} style={{ width: 40, height: 30, objectFit: 'cover', borderRadius: '4px', flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-primary)', fontWeight: 500 }}>{g.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{(g as Game & { categories?: { name: string } }).categories?.name}</div>
                    </div>
                  </Link>
                ))}
                <Link
                  to={`/search?q=${encodeURIComponent(query)}`}
                  style={{ display: 'block', padding: '9px 12px', fontSize: '0.8125rem', color: 'var(--ember)', textDecoration: 'none', borderTop: '1px solid var(--line-subtle)', textAlign: 'center' }}
                >
                  See all results for "{query}"
                </Link>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto' }}>
            <button
              onClick={handleRandomGame}
              title="Random Game"
              className="hidden sm:flex items-center justify-center p-2 rounded-lg border border-[var(--line-visible)] text-[var(--text-secondary)] bg-transparent transition-colors hover:border-[var(--neon-lime)] hover:text-[var(--neon-lime)]"
            >
              <Dices size={18} />
            </button>
            {/* Hamburger — hidden on desktop where sidebar is visible */}
            <button
              onClick={() => setMenuOpen(m => !m)}
              className="header-hamburger items-center justify-center p-2 rounded-lg border border-[var(--line-visible)] text-[var(--text-secondary)] bg-transparent transition-colors hover:border-[var(--neon-lime)] hover:text-[var(--neon-lime)]"
              aria-label="Toggle navigation"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile navigation drawer */}
      {menuOpen && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setMenuOpen(false)}
            style={{ position: 'fixed', inset: 0, top: '65px', zIndex: 35, backgroundColor: 'rgba(0,0,0,0.6)' }}
          />
          {/* Drawer */}
          <nav style={{
            position: 'fixed', top: '65px', left: 0, bottom: 0, width: '260px', zIndex: 36,
            backgroundColor: 'var(--bg-elevated)', borderRight: '1px solid var(--line-visible)',
            overflowY: 'auto', padding: '1rem 0.75rem',
          }}>
            {[
              { to: '/', label: 'All Games', icon: <Gamepad2 size={15} /> },
              { to: '/popular', label: 'Most Popular', icon: <Flame size={15} /> },
              { to: '/new-games', label: 'New Games', icon: <Sparkles size={15} /> },
              { to: '/search', label: 'Search', icon: <Search size={15} /> },
            ].map(item => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMenuOpen(false)}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 14px', borderRadius: '8px', textDecoration: 'none', fontSize: '0.9rem', fontFamily: 'Space Grotesk, sans-serif', color: 'var(--text-secondary)', marginBottom: '2px', transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(57,255,20,0.07)'; e.currentTarget.style.color = 'var(--neon-lime)' }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)' }}
              >
                <span style={{ color: 'var(--text-tertiary)' }}>{item.icon}</span>
                {item.label}
              </Link>
            ))}

            <div style={{ height: '1px', background: 'var(--line-subtle)', margin: '10px 0' }} />
            <div style={{ fontSize: '0.6875rem', fontFamily: 'Orbitron, monospace', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-tertiary)', padding: '0 14px', marginBottom: '8px' }}>Categories</div>

            {categories.map(cat => (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                onClick={() => setMenuOpen(false)}
                style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 14px', borderRadius: '8px', textDecoration: 'none', fontSize: '0.875rem', fontFamily: 'Space Grotesk, sans-serif', color: 'var(--text-secondary)', marginBottom: '2px', transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(57,255,20,0.07)'; e.currentTarget.style.color = 'var(--neon-lime)' }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)' }}
              >
                <Home size={13} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
                {cat.name}
              </Link>
            ))}
          </nav>
        </>
      )}

    </>
  )
}

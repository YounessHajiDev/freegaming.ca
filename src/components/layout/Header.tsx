import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Dices, Menu, X } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import Fuse from 'fuse.js'
import type { Game } from '../../lib/types'

export default function Header() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Game[]>([])
  const [allGames, setAllGames] = useState<Game[]>([])
  const [open, setOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
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
          setAllGames(data as Game[])
          fuseRef.current = new Fuse(data as Game[], {
            keys: ['title', 'short_description'],
            threshold: 0.35,
          })
        }
      })
  }, [])

  const handleSearch = (value: string) => {
    setQuery(value)
    if (!value.trim() || !fuseRef.current) { setResults([]); setOpen(false); return }
    const hits = fuseRef.current.search(value).slice(0, 8).map(r => r.item)
    setResults(hits)
    setOpen(hits.length > 0)
  }

  const handleRandomGame = async () => {
    const { count } = await supabase.from('games').select('*', { count: 'exact', head: true }).eq('is_active', true)
    if (!count) return
    const offset = Math.floor(Math.random() * count)
    const { data } = await supabase.from('games').select('slug').eq('is_active', true).range(offset, offset).returns<{ slug: string }[]>()
    if (data?.[0]) navigate(`/games/${data[0].slug}`)
  }

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 40,
      backgroundColor: 'var(--bg-glass)', backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--line-visible)',
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1.5rem', height: '64px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: '1.5rem', letterSpacing: '0.02em' }}>
            <span style={{ color: 'var(--ember)' }}>FREE</span>
            <span style={{ color: 'var(--text-primary)' }}>GAMING</span>
            <span style={{ color: 'var(--neon-lime)', fontSize: '1.1rem' }}>.CA</span>
          </span>
        </Link>

        {/* Search */}
        <div style={{ flex: 1, maxWidth: '480px', position: 'relative' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
            <input
              type="search"
              placeholder="Search games..."
              value={query}
              onChange={e => handleSearch(e.target.value)}
              onFocus={() => results.length > 0 && setOpen(true)}
              onBlur={() => setTimeout(() => setOpen(false), 150)}
              style={{
                width: '100%', paddingLeft: '40px', paddingRight: '16px', height: '40px',
                background: 'var(--bg-surface)', border: '1px solid var(--line-visible)',
                borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.875rem',
                fontFamily: 'Space Grotesk, sans-serif', outline: 'none',
                transition: 'border-color 0.2s',
              }}
              onKeyDown={e => {
                if (e.key === 'Enter' && results.length > 0) navigate(`/games/${results[0].slug}`)
              }}
            />
          </div>
          {open && results.length > 0 && (
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
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto' }}>
          <button
            onClick={handleRandomGame}
            title="Random Game"
            style={{
              background: 'transparent', border: '1px solid var(--line-visible)',
              color: 'var(--text-secondary)', borderRadius: '8px', padding: '8px',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--neon-lime)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--neon-lime)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--line-visible)'; (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)' }}
          >
            <Dices size={18} />
          </button>
          <button
            onClick={() => setMenuOpen(m => !m)}
            className="md:hidden"
            style={{
              background: 'transparent', border: '1px solid var(--line-visible)',
              color: 'var(--text-secondary)', borderRadius: '8px', padding: '8px',
              cursor: 'pointer', display: 'flex', alignItems: 'center',
            }}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      {/* suppress unused */}
      {allGames.length === 0 && false && null}
    </header>
  )
}

import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Search, Menu, X } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import type { Category } from '../../lib/types'

export default function Header() {
  const [categories, setCategories] = useState<Category[]>([])
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileSearch, setMobileSearch] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const mobileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    supabase.from('categories').select('*').order('order_num').limit(14)
      .then(({ data }) => { if (data) setCategories(data) })
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const handleDesktopSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) { navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`); setSearchQuery('') }
  }

  const handleMobileSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (mobileSearch.trim()) { navigate(`/search?q=${encodeURIComponent(mobileSearch.trim())}`); setMobileSearch('') }
  }

  const openMobile = () => {
    setMobileOpen(true)
    setTimeout(() => mobileInputRef.current?.focus(), 300)
  }

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <Link to="/" className="header-logo">FreeGaming.ca</Link>

          {/* Desktop nav */}
          <nav className="header-nav">
            <Link to="/free-games" className="header-nav-link">Free Games</Link>

            <div className="header-dropdown">
              <button className="header-nav-link">Categories ▾</button>
              <div className="header-dropdown-menu">
                {categories.map(cat => (
                  <Link key={cat.id} to={`/category/${cat.slug}`} className="header-dropdown-item">
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            <Link to="/popular" className="header-nav-link">Popular</Link>
            <Link to="/new-games" className="header-nav-link">New Games</Link>
          </nav>

          {/* Desktop search */}
          <form className="header-search" onSubmit={handleDesktopSearch}>
            <input
              type="search"
              placeholder="Search games…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="header-search-btn" aria-label="Search">
              <Search size={16} />
            </button>
          </form>

          {/* Hamburger */}
          <button
            className="hamburger-btn"
            onClick={openMobile}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      <div className={`mobile-menu${mobileOpen ? ' open' : ''}`} aria-hidden={!mobileOpen}>
        <div className="mobile-menu-header">
          <Link to="/" className="header-logo" onClick={() => setMobileOpen(false)}>FreeGaming.ca</Link>
          <button className="hamburger-btn" onClick={() => setMobileOpen(false)} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <div className="mobile-menu-body">
          {/* Search */}
          <form className="mobile-search" onSubmit={handleMobileSearch}>
            <Search size={16} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
            <input
              ref={mobileInputRef}
              type="search"
              placeholder="Search games…"
              value={mobileSearch}
              onChange={e => setMobileSearch(e.target.value)}
            />
          </form>

          {/* Nav links */}
          <Link to="/" className="mobile-nav-link">Home</Link>
          <Link to="/free-games" className="mobile-nav-link">Free Games</Link>
          <Link to="/popular" className="mobile-nav-link">Popular</Link>
          <Link to="/new-games" className="mobile-nav-link">New Games</Link>
          <Link to="/search" className="mobile-nav-link">Search</Link>

          {/* Category grid */}
          <div className="mobile-cat-section">
            <div className="mobile-cat-title">Categories</div>
            <div className="mobile-cat-grid">
              {categories.map(cat => (
                <Link key={cat.id} to={`/category/${cat.slug}`} className="mobile-cat-item">
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

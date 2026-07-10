import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Menu, X } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { Category } from '../../lib/types'


export default function Header() {
  const [categories, setCategories] = useState<Category[]>([])
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase
        .from('categories')
        .select('*')
        .order('order_num')
        .limit(10)
      if (data) setCategories(data)
    }
    fetchCategories()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
    }
  }

  return (
    <header style={headerStyles.container}>
      <div style={headerStyles.content}>
        <Link to="/" style={headerStyles.logo}>
          FreeGaming.ca
        </Link>

        <nav style={headerStyles.nav} className={mobileMenuOpen ? 'mobile-open' : ''}>
          <Link to="/free-games" style={headerStyles.navLink}>Free Games</Link>

          <div style={headerStyles.dropdown}>
            <button style={headerStyles.navLink}>Categories</button>
            <div style={headerStyles.dropdownMenu}>
              {categories.map(cat => (
                <Link key={cat.id} to={`/category/${cat.slug}`} style={headerStyles.dropdownItem}>
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          <Link to="/popular" style={headerStyles.navLink}>Popular</Link>
          <Link to="/new-games" style={headerStyles.navLink}>New Games</Link>
        </nav>

        <form onSubmit={handleSearch} style={headerStyles.search}>
          <input
            type="text"
            placeholder="Search games..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={headerStyles.searchInput}
          />
          <button type="submit" style={headerStyles.searchButton}>
            <Search size={20} />
          </button>
        </form>

        <button
          style={headerStyles.hamburger}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="hamburger"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  )
}

const headerStyles = {
  container: {
    background: 'var(--bg-elevated)',
    borderBottom: '1px solid var(--line-visible)',
    padding: '1rem 0',
    position: 'sticky' as const,
    top: 0,
    zIndex: 100,
  },
  content: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '2rem',
  },
  logo: {
    fontSize: '1.5rem',
    fontFamily: "'Barlow Condensed', sans-serif",
    fontWeight: 800,
    color: 'var(--neon-lime)',
    whiteSpace: 'nowrap',
    textShadow: '0 0 10px rgba(57, 255, 20, 0.3)',
  },
  nav: {
    display: 'flex',
    gap: '2rem',
    flex: 1,
    alignItems: 'center',
  } as const,
  navLink: {
    color: 'var(--text-primary)',
    padding: '0.5rem 0',
    fontSize: '0.95rem',
    fontWeight: 500,
  } as const,
  dropdown: {
    position: 'relative' as const,
  },
  dropdownMenu: {
    position: 'absolute' as const,
    top: '100%',
    left: 0,
    background: 'var(--bg-surface)',
    border: '1px solid var(--line-visible)',
    borderRadius: '0.25rem',
    minWidth: '200px',
    opacity: 0,
    pointerEvents: 'none' as const,
    transition: 'opacity 0.2s ease',
    marginTop: '0.5rem',
    zIndex: 1000,
  },
  dropdownItem: {
    display: 'block',
    padding: '0.75rem 1rem',
    color: 'var(--text-primary)',
    fontSize: '0.9rem',
    borderBottom: '1px solid var(--line-subtle)',
  } as const,
  search: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
    background: 'var(--bg-surface)',
    border: '1px solid var(--line-visible)',
    borderRadius: '0.25rem',
    padding: '0.5rem',
  } as const,
  searchInput: {
    background: 'transparent',
    border: 'none',
    color: 'var(--text-primary)',
    outline: 'none',
    padding: '0.5rem',
    minWidth: '150px',
  } as const,
  searchButton: {
    background: 'transparent',
    color: 'var(--neon-lime)',
    padding: '0.5rem',
    display: 'flex',
    alignItems: 'center',
  } as const,
  hamburger: {
    display: 'none',
    background: 'transparent',
    color: 'var(--neon-lime)',
    padding: '0.5rem',
  } as const,
}

const stylesheet = document.createElement('style')
stylesheet.textContent = `
  @media (max-width: 1024px) {
    [style*="headerStyles.nav"] {
      display: none;
    }
    [style*="headerStyles.search"] {
      display: none;
    }
    [style*="headerStyles.hamburger"] {
      display: flex !important;
    }
  }

  nav:has(+ div .hamburger:hover) {
    opacity: 1;
  }

  div[style*="dropdown"]:hover > div[style*="dropdownMenu"] {
    opacity: 1;
    pointer-events: auto !important;
  }
`
if (typeof document !== 'undefined') {
  document.head.appendChild(stylesheet)
}

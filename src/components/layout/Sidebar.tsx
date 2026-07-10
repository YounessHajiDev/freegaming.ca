import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Category, Game } from '../../lib/types'

export default function Sidebar() {
  const [categories, setCategories] = useState<Category[]>([])
  const [hotGames, setHotGames] = useState<Game[]>([])

  useEffect(() => {
    const fetch = async () => {
      const [catsRes, gamesRes] = await Promise.all([
        supabase
          .from('categories')
          .select('*')
          .order('order_num')
          .limit(8),
        supabase
          .from('games')
          .select('*')
          .eq('is_hot', true)
          .eq('is_active', true)
          .limit(5)
          .order('views', { ascending: false })
      ])
      if (catsRes.data) setCategories(catsRes.data)
      if (gamesRes.data) setHotGames(gamesRes.data)
    }
    fetch()
  }, [])

  return (
    <aside style={sidebarStyles.container}>
      <div style={sidebarStyles.section}>
        <h3 style={sidebarStyles.heading}>Top Categories</h3>
        <ul style={sidebarStyles.list}>
          {categories.map(cat => (
            <li key={cat.id}>
              <Link to={`/category/${cat.slug}`} style={sidebarStyles.link}>
                {cat.icon} {cat.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div style={sidebarStyles.section}>
        <h3 style={sidebarStyles.heading}>Hot Games</h3>
        <ul style={sidebarStyles.gameList}>
          {hotGames.map(game => (
            <li key={game.id}>
              <Link to={`/games/${game.slug}`} style={sidebarStyles.gameLink}>
                <img src={game.thumbnail} alt={game.title} style={sidebarStyles.gameThumbnail} />
                <span style={sidebarStyles.gameTitle}>{game.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  )
}

const sidebarStyles = {
  container: {
    width: '280px',
    display: 'none',
    flexDirection: 'column' as const,
    gap: '2rem',
    padding: '1.5rem 0',
  },
  section: {
    background: 'var(--bg-elevated)',
    border: '1px solid var(--line-subtle)',
    borderRadius: '0.5rem',
    padding: '1rem',
  },
  heading: {
    fontSize: '1rem',
    fontWeight: 700,
    fontFamily: "'Barlow Condensed', sans-serif",
    marginBottom: '1rem',
    color: 'var(--neon-lime)',
  },
  list: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: 'var(--text-secondary)',
    fontSize: '0.9rem',
    padding: '0.5rem',
    borderRadius: '0.25rem',
    transition: 'all 0.2s ease',
  } as const,
  gameList: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.75rem',
  },
  gameLink: {
    display: 'flex',
    gap: '0.75rem',
    alignItems: 'flex-start',
    color: 'var(--text-primary)',
    fontSize: '0.85rem',
    transition: 'all 0.2s ease',
  } as const,
  gameThumbnail: {
    width: '50px',
    height: '50px',
    objectFit: 'cover' as const,
    borderRadius: '0.25rem',
    flexShrink: 0,
  },
  gameTitle: {
    display: 'line-clamp',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'pre-wrap' as const,
  },
}

if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = `
    @media (min-width: 1024px) {
      [style*="sidebarStyles.container"] {
        display: flex !important;
      }
    }
  `
  document.head.appendChild(style)
}

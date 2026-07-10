import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import type { Category, Game } from '../../lib/types'

export default function Sidebar() {
  const [categories, setCategories] = useState<Category[]>([])
  const [hotGames, setHotGames] = useState<Game[]>([])

  useEffect(() => {
    Promise.all([
      supabase.from('categories').select('*').order('order_num').limit(10),
      supabase.from('games').select('*').eq('is_hot', true).eq('is_active', true).order('views', { ascending: false }).limit(5),
    ]).then(([cats, games]) => {
      if (cats.data) setCategories(cats.data)
      if (games.data) setHotGames(games.data)
    }).catch(err => console.error('Failed to load sidebar:', err))
  }, [])

  return (
    <aside className="sidebar">
      <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--line-subtle)', borderRadius: '10px', padding: '1rem' }}>
        <h3 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1rem', textTransform: 'uppercase', color: 'var(--neon-lime)', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
          Categories
        </h3>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {categories.map(cat => (
            <li key={cat.id}>
              <Link
                to={`/category/${cat.slug}`}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', borderRadius: '6px', color: 'var(--text-secondary)', fontSize: '0.875rem', textDecoration: 'none', transition: 'color 0.15s, background 0.15s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-primary)'; (e.currentTarget as HTMLAnchorElement).style.background = 'var(--bg-void)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--text-secondary)'; (e.currentTarget as HTMLAnchorElement).style.background = 'transparent' }}
              >
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {hotGames.length > 0 && (
        <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--line-subtle)', borderRadius: '10px', padding: '1rem' }}>
          <h3 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1rem', textTransform: 'uppercase', color: 'var(--state-hot)', letterSpacing: '0.06em', marginBottom: '0.75rem' }}>
            Hot Right Now
          </h3>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {hotGames.map(game => (
              <li key={game.id}>
                <Link
                  to={`/games/${game.slug}`}
                  style={{ display: 'flex', gap: '10px', alignItems: 'center', textDecoration: 'none', transition: 'opacity 0.15s' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.opacity = '0.8')}
                  onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.opacity = '1')}
                >
                  <img
                    src={game.thumbnail}
                    alt={game.title}
                    style={{ width: '52px', height: '40px', objectFit: 'cover', borderRadius: '5px', flexShrink: 0, background: 'var(--bg-void)' }}
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                  <span style={{ fontSize: '0.8125rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.4 }}>
                    {game.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  )
}

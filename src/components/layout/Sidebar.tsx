import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Gamepad2, Flame, Sparkles, Puzzle, Car, Trophy, Crosshair,
  Layers, Brain, MapPin, Users, Lightbulb, Zap, Smile, Globe, Gamepad, Gift,
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import type { Category } from '../../lib/types'

const NAV_ICONS: Record<string, React.ReactNode> = {
  'puzzle':    <Puzzle size={15} />,
  'car':       <Car size={15} />,
  'trophy':    <Trophy size={15} />,
  'crosshair': <Crosshair size={15} />,
  'layers':    <Layers size={15} />,
  'brain':     <Brain size={15} />,
  'gamepad-2': <Gamepad2 size={15} />,
  'map':       <MapPin size={15} />,
  'users':     <Users size={15} />,
  'lightbulb': <Lightbulb size={15} />,
  'zap':       <Zap size={15} />,
  'smile':     <Smile size={15} />,
  'globe':     <Globe size={15} />,
  'gamepad':   <Gamepad size={15} />,
}

export default function Sidebar() {
  const [categories, setCategories] = useState<Category[]>([])
  const location = useLocation()

  useEffect(() => {
    supabase.from('categories').select('*').order('order_num').then(({ data }) => {
      if (data) setCategories(data as Category[])
    })
  }, [])

  const isActive = (path: string) => location.pathname === path

  const navItemStyle = (active: boolean): React.CSSProperties => ({
    display: 'flex', alignItems: 'center', gap: '10px',
    padding: '9px 14px', borderRadius: '8px', textDecoration: 'none',
    fontSize: '0.875rem', fontFamily: 'Space Grotesk, sans-serif',
    fontWeight: active ? 600 : 400,
    color: active ? 'var(--neon-lime)' : 'var(--text-secondary)',
    background: active ? 'rgba(57,255,20,0.07)' : 'transparent',
    borderLeft: active ? '2px solid var(--neon-lime)' : '2px solid transparent',
    transition: 'all 0.15s ease',
    marginBottom: '2px',
  })

  return (
    <aside style={{
      width: '230px', flexShrink: 0, borderRight: '1px solid var(--line-subtle)',
      padding: '1.25rem 0.75rem', position: 'sticky', top: '100px', height: 'calc(100vh - 100px)',
      overflowY: 'auto', display: 'none',
    }}
      className="sidebar-desktop"
    >
      <style>{`@media (min-width:1024px){.sidebar-desktop{display:block!important}}`}</style>

      <Link to="/" style={navItemStyle(isActive('/'))}>
        <Gamepad2 size={15} />
        All Games
      </Link>
      <Link to="/popular" style={navItemStyle(isActive('/popular'))}>
        <Flame size={15} />
        Most Popular
      </Link>
      <Link to="/new-games" style={navItemStyle(isActive('/new-games'))}>
        <Sparkles size={15} />
        New Games
      </Link>
      <Link to="/offers" style={navItemStyle(isActive('/offers'))}>
        <Gift size={15} />
        Offers
      </Link>

      <div style={{ height: '1px', background: 'var(--line-subtle)', margin: '12px 0' }} />

      {categories.map(cat => (
        <Link key={cat.id} to={`/category/${cat.slug}`} style={navItemStyle(isActive(`/category/${cat.slug}`))}>
          {NAV_ICONS[cat.icon] || <Gamepad size={15} />}
          {cat.name}
        </Link>
      ))}
    </aside>
  )
}

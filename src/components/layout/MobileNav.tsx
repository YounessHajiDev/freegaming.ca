import { Link, useLocation } from 'react-router-dom'
import { Home, Flame, Dices, Search, LayoutGrid } from 'lucide-react'
import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useNavigate } from 'react-router-dom'

export default function MobileNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const [searching, setSearching] = useState(false)

  const isActive = (path: string) => location.pathname === path

  const handleRandom = async () => {
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
      <style>{`@media(min-width:640px){.mobile-nav{display:none!important}}`}</style>
      <nav className="mobile-nav" style={{
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
        <button onClick={handleRandom} style={itemStyle(false) as React.CSSProperties}>
          <Dices size={20} />
          Random
        </button>
        <button onClick={() => setSearching(s => !s)} style={itemStyle(searching)}>
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

import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { LayoutDashboard, Gamepad2, PlusCircle, Tag, RefreshCw, ExternalLink, LogOut, TrendingUp, Flame, Star, Sparkles, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { Category } from '../lib/types'
import AdminGameManager from '../components/admin/AdminGameManager'
import AdminAddGame from '../components/admin/AdminAddGame'
import AdminCategories from '../components/admin/AdminCategories'
import AdminSync from '../components/admin/AdminSync'
import { ADMIN_PASSWORD, isAdminPassword } from '../lib/adminAuth'

type Tab = 'dashboard' | 'games' | 'add-game' | 'categories' | 'sync'

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'dashboard',  label: 'Dashboard',   icon: <LayoutDashboard size={15} /> },
  { id: 'games',      label: 'Games',        icon: <Gamepad2 size={15} /> },
  { id: 'add-game',   label: 'Add Game',     icon: <PlusCircle size={15} /> },
  { id: 'categories', label: 'Categories',   icon: <Tag size={15} /> },
  { id: 'sync',       label: 'Sync Games',   icon: <RefreshCw size={15} /> },
]

interface Stats {
  total: number; active: number; inactive: number
  gamemonetize: number; gamedistribution: number; html5games: number; manual: number
  hot: number; featured: number; newGames: number; totalViews: number
}

function StatCard({ label, value, color, sub }: { label: string; value: string | number; color: string; sub?: string }) {
  return (
    <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--line-subtle)', borderRadius: '10px', padding: '1.25rem 1.5rem' }}>
      <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '1.625rem', fontWeight: 700, color, marginBottom: '4px', letterSpacing: '-0.02em' }}>
        {typeof value === 'number' ? value.toLocaleString('en-CA') : value}
      </div>
      <div style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', fontFamily: 'Space Grotesk, sans-serif' }}>{label}</div>
      {sub && <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '2px', opacity: 0.7 }}>{sub}</div>}
    </div>
  )
}

function Dashboard({ stats, onRefresh }: { stats: Stats | null; onRefresh: () => void }) {
  if (!stats) return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
      {Array.from({ length: 10 }).map((_, i) => <div key={i} className="skeleton" style={{ height: '88px', borderRadius: '10px' }} />)}
    </div>
  )

  const pct = (n: number) => stats.total > 0 ? `${((n / stats.total) * 100).toFixed(1)}%` : '0%'

  return (
    <div>
      {/* Overview row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <StatCard label="Total Games"     value={stats.total}          color="var(--neon-lime)" />
        <StatCard label="Active"          value={stats.active}         color="var(--neon-lime)"   sub={pct(stats.active)} />
        <StatCard label="Hidden"          value={stats.inactive}       color="var(--text-tertiary)" sub={pct(stats.inactive)} />
        <StatCard label="Total Plays"     value={stats.totalViews}     color="var(--ice)" />
        <StatCard label="Hot"             value={stats.hot}            color="var(--state-hot)" />
        <StatCard label="Featured"        value={stats.featured}       color="var(--ember)" />
        <StatCard label="New"             value={stats.newGames}       color="var(--ice)" />
        <StatCard label="Manual Games"    value={stats.manual}         color="var(--text-secondary)" />
      </div>

      {/* Source breakdown */}
      <h3 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1.1rem', textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <TrendingUp size={15} style={{ color: 'var(--neon-lime)' }} /> Source Breakdown
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'GameMonetize',   value: stats.gamemonetize,   color: 'var(--neon-lime)' },
          { label: 'GameDistribution', value: stats.gamedistribution, color: 'var(--ice)' },
          { label: 'HTML5Games.com', value: stats.html5games,     color: 'var(--ember)' },
          { label: 'Manual (yours)', value: stats.manual,         color: 'var(--state-hot)' },
        ].map(s => <StatCard key={s.label} {...s} sub={pct(s.value)} />)}
      </div>

      {/* Flag overview */}
      <h3 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1.1rem', textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
        Editorial Flags
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Hot Games', value: stats.hot, color: 'var(--state-hot)', icon: <Flame size={16} />, tip: 'Shown in Hot section on homepage' },
          { label: 'Featured', value: stats.featured, color: 'var(--ember)', icon: <Star size={16} />, tip: 'Highlighted with Featured badge' },
          { label: 'New Games', value: stats.newGames, color: 'var(--ice)', icon: <Sparkles size={16} />, tip: 'Shown on New Games page' },
          { label: 'Active Games', value: stats.active, color: 'var(--neon-lime)', icon: <Eye size={16} />, tip: 'Visible on the site' },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--bg-surface)', border: '1px solid var(--line-subtle)', borderRadius: '10px', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: s.color }}>
              {s.icon}
              <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--text-primary)' }}>{s.label}</span>
            </div>
            <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '1.5rem', fontWeight: 700, color: s.color }}>{s.value.toLocaleString('en-CA')}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>{s.tip}</div>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <h3 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1.1rem', textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>Quick Links</h3>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        {[
          { href: '/', label: 'Homepage' },
          { href: '/popular', label: 'Popular' },
          { href: '/new-games', label: 'New Games' },
          { href: '/free-games', label: 'Free Games SEO' },
          { href: '/admin/pinterest', label: 'Pinterest Pins' },
        ].map(l => (
          <a key={l.href} href={l.href} target="_blank" rel="noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: 'var(--bg-elevated)', border: '1px solid var(--line-visible)', borderRadius: '8px', color: 'var(--text-secondary)', textDecoration: 'none', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.875rem', transition: 'border-color 0.15s, color 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--neon-lime)'; e.currentTarget.style.color = 'var(--neon-lime)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line-visible)'; e.currentTarget.style.color = 'var(--text-secondary)' }}>
            <ExternalLink size={12} /> {l.label}
          </a>
        ))}
        <button onClick={onRefresh}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: 'var(--bg-elevated)', border: '1px solid var(--line-visible)', borderRadius: '8px', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.875rem', transition: 'border-color 0.15s, color 0.15s' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--ice)'; e.currentTarget.style.color = 'var(--ice)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--line-visible)'; e.currentTarget.style.color = 'var(--text-secondary)' }}>
          <RefreshCw size={12} /> Refresh
        </button>
      </div>
    </div>
  )
}

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)
  const [wrongPw, setWrongPw] = useState(false)
  const [tab, setTab] = useState<Tab>('dashboard')
  const [stats, setStats] = useState<Stats | null>(null)
  const [categories, setCategories] = useState<Category[]>([])

  const loadStats = async () => {
    const [total, active, inactive, gm, gd, h5, manual, hot, featured, newG, views] = await Promise.all([
      supabase.from('games').select('*', { count: 'exact', head: true }),
      supabase.from('games').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('games').select('*', { count: 'exact', head: true }).eq('is_active', false),
      supabase.from('games').select('*', { count: 'exact', head: true }).eq('source', 'GAMEMONETIZE'),
      supabase.from('games').select('*', { count: 'exact', head: true }).eq('source', 'GAMEDISTRIBUTION'),
      supabase.from('games').select('*', { count: 'exact', head: true }).eq('source', 'HTML5GAMES'),
      supabase.from('games').select('*', { count: 'exact', head: true }).eq('source', 'MANUAL'),
      supabase.from('games').select('*', { count: 'exact', head: true }).eq('is_hot', true),
      supabase.from('games').select('*', { count: 'exact', head: true }).eq('is_featured', true),
      supabase.from('games').select('*', { count: 'exact', head: true }).eq('is_new', true),
      supabase.from('games').select('views').limit(5000),
    ])
    const totalViews = (views.data ?? []).reduce((sum: number, g: { views: number }) => sum + (g.views || 0), 0)
    setStats({
      total: total.count ?? 0,
      active: active.count ?? 0,
      inactive: inactive.count ?? 0,
      gamemonetize: gm.count ?? 0,
      gamedistribution: gd.count ?? 0,
      html5games: h5.count ?? 0,
      manual: manual.count ?? 0,
      hot: hot.count ?? 0,
      featured: featured.count ?? 0,
      newGames: newG.count ?? 0,
      totalViews,
    })
  }

  const loadCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('order_num')
    setCategories((data ?? []) as Category[])
  }

  useEffect(() => {
    if (authed) { loadStats(); loadCategories() }
  }, [authed])

  const handleAuth = () => {
    if (isAdminPassword(password)) { setAuthed(true); setWrongPw(false) }
    else setWrongPw(true)
  }

  if (!authed) {
    return (
      <div style={{ maxWidth: '420px', margin: '5rem auto', padding: '2.5rem', backgroundColor: 'var(--bg-surface)', borderRadius: '14px', border: '1px solid var(--line-visible)', boxShadow: '0 8px 40px rgba(0,0,0,0.4)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '48px', height: '48px', background: 'var(--neon-lime)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
            <LayoutDashboard size={24} color="var(--bg-void)" />
          </div>
          <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: '1.75rem', textTransform: 'uppercase', color: 'var(--text-primary)', margin: 0 }}>Admin Dashboard</h1>
          <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem', marginTop: '6px' }}>FreeGaming.ca Management Portal</p>
        </div>
        <input
          type="password"
          placeholder="Admin password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAuth()}
          style={{ width: '100%', padding: '12px 14px', background: 'var(--bg-void)', border: `1px solid ${wrongPw ? 'var(--state-hot)' : 'var(--line-visible)'}`, borderRadius: '8px', color: 'var(--text-primary)', fontSize: '1rem', marginBottom: '0.75rem', boxSizing: 'border-box', fontFamily: 'Space Grotesk, sans-serif', outline: 'none' }}
          autoFocus
        />
        {!ADMIN_PASSWORD && <p style={{ color: 'var(--state-hot)', fontSize: '0.8125rem', marginBottom: '0.75rem' }}>Admin password not configured. Set VITE_ADMIN_PASSWORD in your environment.</p>}
        {wrongPw && ADMIN_PASSWORD && <p style={{ color: 'var(--state-hot)', fontSize: '0.8125rem', marginBottom: '0.75rem' }}>Incorrect password. Try again.</p>}
        <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleAuth}>
          Enter Dashboard
        </button>
      </div>
    )
  }

  const tabLabels: Record<Tab, string> = {
    dashboard: 'Dashboard', games: 'Game Manager', 'add-game': 'Add Custom Game', categories: 'Categories', sync: 'Sync Games'
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard | FreeGaming.ca</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="description" content="FreeGaming.ca admin dashboard." />
      </Helmet>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: '2rem', textTransform: 'uppercase', color: 'var(--text-primary)', margin: '0 0 2px' }}>
            Admin Dashboard
          </h1>
          <p style={{ margin: 0, color: 'var(--text-tertiary)', fontSize: '0.8125rem' }}>FreeGaming.ca · {stats?.total.toLocaleString('en-CA') ?? '…'} games</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Link to="/admin/pinterest"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: 'var(--bg-elevated)', border: '1px solid var(--line-visible)', borderRadius: '8px', color: 'var(--text-secondary)', textDecoration: 'none', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase', transition: 'border-color 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--line-visible)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--line-visible)')}>
            <ExternalLink size={13} /> Pinterest
          </Link>
          <button
            onClick={() => setAuthed(false)}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: 'var(--bg-elevated)', border: '1px solid var(--line-visible)', borderRadius: '8px', color: 'var(--text-tertiary)', cursor: 'pointer', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase' }}>
            <LogOut size={13} /> Log Out
          </button>
        </div>
      </div>

      {/* Tab nav */}
      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '1.5rem', background: 'var(--bg-surface)', padding: '6px', borderRadius: '10px', border: '1px solid var(--line-subtle)' }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: '7px',
              padding: '8px 16px', borderRadius: '7px', border: 'none', cursor: 'pointer',
              fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700,
              fontSize: '0.9375rem', textTransform: 'uppercase', letterSpacing: '0.04em',
              transition: 'all 0.15s',
              background: tab === t.id ? 'var(--neon-lime)' : 'transparent',
              color: tab === t.id ? 'var(--bg-void)' : 'var(--text-secondary)',
            }}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Section heading */}
      <div style={{ marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--line-subtle)' }}>
        <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1.375rem', textTransform: 'uppercase', color: 'var(--text-primary)', margin: 0 }}>
          {tabLabels[tab]}
        </h2>
      </div>

      {/* Tab content */}
      {tab === 'dashboard' && <Dashboard stats={stats} onRefresh={loadStats} />}
      {tab === 'games' && <AdminGameManager categories={categories} />}
      {tab === 'add-game' && <AdminAddGame categories={categories} onAdded={() => { loadStats(); setTab('games') }} />}
      {tab === 'categories' && <AdminCategories categories={categories} onRefresh={loadCategories} />}
      {tab === 'sync' && <AdminSync onSynced={loadStats} />}
    </>
  )
}

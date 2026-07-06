import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { RefreshCw, Database, Zap, CheckCircle, XCircle, Clock } from 'lucide-react'
import { supabase } from '../lib/supabase'
import type { SyncLog } from '../lib/types'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY as string

interface Stats {
  total: number
  gamemonetize: number
  gamedistribution: number
  html5games: number
  manual: number
  hot: number
  featured: number
  newGames: number
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [logs, setLogs] = useState<SyncLog[]>([])
  const [syncing, setSyncing] = useState(false)
  const [syncResult, setSyncResult] = useState<{ success: boolean; message: string } | null>(null)
  const [password, setPassword] = useState('')
  const [authed, setAuthed] = useState(false)

  const ADMIN_PW = 'freegaming2026'

  const loadStats = async () => {
    const [total, gm, gd, h5, manual, hot, featured, newG] = await Promise.all([
      supabase.from('games').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('games').select('*', { count: 'exact', head: true }).eq('source', 'GAMEMONETIZE'),
      supabase.from('games').select('*', { count: 'exact', head: true }).eq('source', 'GAMEDISTRIBUTION'),
      supabase.from('games').select('*', { count: 'exact', head: true }).eq('source', 'HTML5GAMES'),
      supabase.from('games').select('*', { count: 'exact', head: true }).eq('source', 'MANUAL'),
      supabase.from('games').select('*', { count: 'exact', head: true }).eq('is_hot', true),
      supabase.from('games').select('*', { count: 'exact', head: true }).eq('is_featured', true),
      supabase.from('games').select('*', { count: 'exact', head: true }).eq('is_new', true),
    ])
    setStats({
      total: total.count ?? 0,
      gamemonetize: gm.count ?? 0,
      gamedistribution: gd.count ?? 0,
      html5games: h5.count ?? 0,
      manual: manual.count ?? 0,
      hot: hot.count ?? 0,
      featured: featured.count ?? 0,
      newGames: newG.count ?? 0,
    })

    const { data: logsData } = await supabase.from('sync_logs').select('*').order('created_at', { ascending: false }).limit(10)
    setLogs((logsData ?? []) as SyncLog[])
  }

  useEffect(() => { if (authed) loadStats() }, [authed])

  const triggerSync = async (source: 'gamemonetize') => {
    setSyncing(true)
    setSyncResult(null)
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/sync-games`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${SUPABASE_ANON}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ source }),
      })
      const data = await res.json() as { success: boolean; added?: number; updated?: number; error?: string }
      if (!res.ok || !data.success) throw new Error(data.error ?? 'Sync failed')
      setSyncResult({ success: true, message: `Sync complete: ${data.added} added, ${data.updated} updated` })
      await loadStats()
    } catch (err) {
      setSyncResult({ success: false, message: err instanceof Error ? err.message : 'Unknown error' })
    } finally {
      setSyncing(false)
    }
  }

  if (!authed) {
    return (
      <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem', backgroundColor: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--line-visible)' }}>
        <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: '1.75rem', textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '1.5rem', textAlign: 'center' }}>Admin Access</h1>
        <input
          type="password"
          placeholder="Admin password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && password === ADMIN_PW && setAuthed(true)}
          style={{ width: '100%', padding: '12px', background: 'var(--bg-void)', border: '1px solid var(--line-visible)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '1rem', marginBottom: '1rem', boxSizing: 'border-box' }}
        />
        <button
          className="btn-primary"
          style={{ width: '100%', justifyContent: 'center' }}
          onClick={() => { if (password === ADMIN_PW) setAuthed(true) }}
        >
          Enter Dashboard
        </button>
      </div>
    )
  }

  return (
    <>
      <Helmet><title>Admin Dashboard | FreeGaming.ca</title></Helmet>

      <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: '2rem', textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
        Admin Dashboard
      </h1>

      {/* Stats grid */}
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'Total Games', value: stats.total, color: 'var(--neon-lime)' },
            { label: 'GameMonetize', value: stats.gamemonetize, color: 'var(--text-secondary)' },
            { label: 'GameDistribution', value: stats.gamedistribution, color: 'var(--text-secondary)' },
            { label: 'HTML5Games', value: stats.html5games, color: 'var(--text-secondary)' },
            { label: 'Manual', value: stats.manual, color: 'var(--text-secondary)' },
            { label: 'Hot Games', value: stats.hot, color: 'var(--state-hot)' },
            { label: 'Featured', value: stats.featured, color: 'var(--ember)' },
            { label: 'New Games', value: stats.newGames, color: 'var(--ice)' },
          ].map(s => (
            <div key={s.label} style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--line-subtle)', borderRadius: '10px', padding: '1.25rem' }}>
              <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '1.5rem', fontWeight: 700, color: s.color, marginBottom: '4px' }}>{s.value.toLocaleString('en-CA')}</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', fontFamily: 'Space Grotesk, sans-serif' }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Sync controls */}
      <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--line-subtle)', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1.25rem', textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Database size={18} style={{ color: 'var(--neon-lime)' }} /> Sync Games
        </h2>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            className="btn-primary"
            onClick={() => triggerSync('gamemonetize')}
            disabled={syncing}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: syncing ? 0.7 : 1 }}
          >
            <RefreshCw size={16} className={syncing ? 'animate-spin' : ''} />
            {syncing ? 'Syncing...' : 'Sync GameMonetize'}
          </button>
        </div>

        {syncResult && (
          <div style={{
            marginTop: '1rem', padding: '12px 16px', borderRadius: '8px',
            backgroundColor: syncResult.success ? 'rgba(57,255,20,0.08)' : 'rgba(255,61,87,0.08)',
            border: `1px solid ${syncResult.success ? 'var(--neon-lime)' : 'var(--state-hot)'}`,
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            {syncResult.success ? <CheckCircle size={16} style={{ color: 'var(--neon-lime)' }} /> : <XCircle size={16} style={{ color: 'var(--state-hot)' }} />}
            <span style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>{syncResult.message}</span>
          </div>
        )}
      </div>

      {/* Recent sync logs */}
      {logs.length > 0 && (
        <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--line-subtle)', borderRadius: '12px', padding: '1.5rem' }}>
          <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1.25rem', textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={18} style={{ color: 'var(--ice)' }} /> Recent Syncs
          </h2>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {logs.map(log => (
              <div key={log.id} style={{ display: 'grid', gridTemplateColumns: '140px 100px 80px 80px 1fr', gap: '0.75rem', alignItems: 'center', padding: '10px 12px', borderRadius: '8px', backgroundColor: 'var(--bg-elevated)', fontSize: '0.8125rem' }}>
                <span style={{ fontFamily: 'Orbitron, monospace', fontSize: '10px', color: 'var(--text-tertiary)' }}>{new Date(log.created_at).toLocaleString('en-CA')}</span>
                <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{log.source}</span>
                <span style={{ color: 'var(--neon-lime)' }}>+{log.added} added</span>
                <span style={{ color: 'var(--ice)' }}>{log.updated} updated</span>
                <span style={{ color: log.errors ? 'var(--state-hot)' : 'var(--text-tertiary)', fontSize: '0.75rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{log.errors ?? '—'}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`.animate-spin { animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <Zap size={0} style={{ display: 'none' }} />
    </>
  )
}

import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { RefreshCw, Database, Clock, CheckCircle, XCircle, Zap, Globe, Layers, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { SyncLog } from '../lib/types'

const SUPABASE_URL  = import.meta.env.VITE_SUPABASE_URL  as string
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY as string

const ADMIN_PW = 'freegaming2026'

type SyncSource = 'gamemonetize' | 'gamedistribution' | 'html5games' | 'all'

interface PerSourceResult {
  added: number; updated: number; fetched: number; errors: string[]
}
interface SyncResponse {
  success: boolean
  added: number; updated: number; fetched: number
  errors: string[]
  perSource?: Record<string, PerSourceResult>
  error?: string
}

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

interface SyncStatus {
  running: boolean
  source: SyncSource | null
  result: SyncResponse | null
}

const SOURCE_META: { id: SyncSource; label: string; icon: React.ReactNode; desc: string }[] = [
  {
    id: 'gamemonetize',
    label: 'GameMonetize',
    icon: <Zap size={16} />,
    desc: 'Bulk upsert — up to 50 pages × 100 = 5,000 games per call. Uses startPage for batching.',
  },
  {
    id: 'gamedistribution',
    label: 'GameDistribution',
    icon: <Globe size={16} />,
    desc: 'Bulk upsert — up to 15 pages × 100 = 1,500 games per call.',
  },
  {
    id: 'html5games',
    label: 'HTML5Games.com',
    icon: <Layers size={16} />,
    desc: 'Bulk upsert — up to 10 pages × 100 = 1,000 games per call.',
  },
  {
    id: 'all',
    label: 'Sync All Sources',
    icon: <RefreshCw size={16} />,
    desc: 'Runs GM (20 pp) + GD (15 pp) + H5 (10 pp) in sequence — up to 4,500 games.',
  },
]

export default function AdminPage() {
  const [stats, setStats]     = useState<Stats | null>(null)
  const [logs, setLogs]       = useState<SyncLog[]>([])
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({ running: false, source: null, result: null })
  const [password, setPassword]   = useState('')
  const [authed, setAuthed]       = useState(false)
  const [wrongPw, setWrongPw]     = useState(false)
  const [startPage, setStartPage] = useState(1)
  const [maxPages, setMaxPages]   = useState(20)

  const loadStats = async () => {
    const [total, gm, gd, h5, manual, hot, featured, newG, logsRes] = await Promise.all([
      supabase.from('games').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('games').select('*', { count: 'exact', head: true }).eq('source', 'GAMEMONETIZE'),
      supabase.from('games').select('*', { count: 'exact', head: true }).eq('source', 'GAMEDISTRIBUTION'),
      supabase.from('games').select('*', { count: 'exact', head: true }).eq('source', 'HTML5GAMES'),
      supabase.from('games').select('*', { count: 'exact', head: true }).eq('source', 'MANUAL'),
      supabase.from('games').select('*', { count: 'exact', head: true }).eq('is_hot', true),
      supabase.from('games').select('*', { count: 'exact', head: true }).eq('is_featured', true),
      supabase.from('games').select('*', { count: 'exact', head: true }).eq('is_new', true),
      supabase.from('sync_logs').select('*').order('created_at', { ascending: false }).limit(15),
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
    setLogs((logsRes.data ?? []) as SyncLog[])
  }

  useEffect(() => { if (authed) loadStats() }, [authed])

  const triggerSync = async (source: SyncSource) => {
    setSyncStatus({ running: true, source, result: null })
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/sync-games`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${SUPABASE_ANON}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ source, startPage: source === 'all' ? 1 : startPage, maxPages: source === 'all' ? 20 : maxPages }),
      })
      const data = await res.json() as SyncResponse
      setSyncStatus({ running: false, source, result: data })
      await loadStats()
    } catch (err) {
      setSyncStatus({
        running: false, source,
        result: { success: false, added: 0, updated: 0, fetched: 0, errors: [], error: err instanceof Error ? err.message : 'Network error' },
      })
    }
  }

  const handleAuth = () => {
    if (password === ADMIN_PW) { setAuthed(true); setWrongPw(false) }
    else setWrongPw(true)
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
          onKeyDown={e => e.key === 'Enter' && handleAuth()}
          style={{ width: '100%', padding: '12px', background: 'var(--bg-void)', border: `1px solid ${wrongPw ? 'var(--state-hot)' : 'var(--line-visible)'}`, borderRadius: '8px', color: 'var(--text-primary)', fontSize: '1rem', marginBottom: '0.75rem', boxSizing: 'border-box', fontFamily: 'Space Grotesk, sans-serif' }}
        />
        {wrongPw && <p style={{ color: 'var(--state-hot)', fontSize: '0.8125rem', marginBottom: '0.75rem' }}>Incorrect password.</p>}
        <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleAuth}>
          Enter Dashboard
        </button>
      </div>
    )
  }

  const { running, source: runningSource, result } = syncStatus

  return (
    <>
      <Helmet><title>Admin Dashboard | FreeGaming.ca</title></Helmet>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: '2rem', textTransform: 'uppercase', color: 'var(--text-primary)', margin: 0 }}>
          Admin Dashboard
        </h1>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Link
            to="/admin/pinterest"
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 16px', borderRadius: '8px',
              background: 'var(--bg-elevated)', border: '1px solid var(--line-visible)',
              color: 'var(--text-secondary)', textDecoration: 'none',
              fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700,
              fontSize: '0.9375rem', textTransform: 'uppercase',
              transition: 'border-color 0.15s, color 0.15s',
            }}
          >
            <ExternalLink size={14} /> Pinterest Pins
          </Link>
          <button className="btn-ghost" onClick={loadStats}>Refresh Stats</button>
        </div>
      </div>

      {/* Stats grid */}
      {stats ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {[
            { label: 'Total Active Games', value: stats.total,          color: 'var(--neon-lime)' },
            { label: 'GameMonetize',        value: stats.gamemonetize,   color: 'var(--text-primary)' },
            { label: 'GameDistribution',    value: stats.gamedistribution, color: 'var(--text-primary)' },
            { label: 'HTML5Games.com',      value: stats.html5games,     color: 'var(--text-primary)' },
            { label: 'Manual',              value: stats.manual,          color: 'var(--text-secondary)' },
            { label: 'Hot Games',           value: stats.hot,             color: 'var(--state-hot)' },
            { label: 'Featured',            value: stats.featured,        color: 'var(--ember)' },
            { label: 'New Games',           value: stats.newGames,        color: 'var(--ice)' },
          ].map(s => (
            <div key={s.label} style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--line-subtle)', borderRadius: '10px', padding: '1.25rem' }}>
              <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '1.5rem', fontWeight: 700, color: s.color, marginBottom: '4px' }}>
                {s.value.toLocaleString('en-CA')}
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', fontFamily: 'Space Grotesk, sans-serif' }}>{s.label}</div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton" style={{ height: '86px', borderRadius: '10px' }} />)}
        </div>
      )}

      {/* Sync controls */}
      <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--line-subtle)', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1.25rem', textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Database size={18} style={{ color: 'var(--neon-lime)' }} /> Import Games
        </h2>

        {/* Batch controls */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', marginBottom: '1.25rem', flexWrap: 'wrap', padding: '1rem', backgroundColor: 'var(--bg-elevated)', borderRadius: '8px', border: '1px solid var(--line-subtle)' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontFamily: 'Orbitron, monospace', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Start Page</div>
            <input type="number" min={1} max={999} value={startPage} onChange={e => setStartPage(Math.max(1, parseInt(e.target.value) || 1))}
              style={{ width: '90px', padding: '8px 10px', background: 'var(--bg-void)', border: '1px solid var(--line-visible)', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '0.9rem', fontFamily: 'Orbitron, monospace', textAlign: 'center' }} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontFamily: 'Orbitron, monospace', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Max Pages</div>
            <input type="number" min={1} max={50} value={maxPages} onChange={e => setMaxPages(Math.min(50, Math.max(1, parseInt(e.target.value) || 1)))}
              style={{ width: '90px', padding: '8px 10px', background: 'var(--bg-void)', border: '1px solid var(--line-visible)', borderRadius: '6px', color: 'var(--text-primary)', fontSize: '0.9rem', fontFamily: 'Orbitron, monospace', textAlign: 'center' }} />
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', lineHeight: 1.5, maxWidth: '320px' }}>
            To get all GM games: run multiple syncs with startPage 1, 21, 41, 61… Each call fetches up to <span style={{ color: 'var(--neon-lime)', fontWeight: 600 }}>{maxPages * 100}</span> games.
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
          {SOURCE_META.map(s => {
            const isRunning = running && runningSource === s.id
            const isDisabled = running
            return (
              <div key={s.id} style={{
                border: `1px solid ${s.id === 'all' ? 'var(--ember)' : 'var(--line-visible)'}`,
                borderRadius: '10px', padding: '1.25rem',
                backgroundColor: s.id === 'all' ? 'rgba(255,140,0,0.05)' : 'var(--bg-elevated)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', color: s.id === 'all' ? 'var(--ember)' : 'var(--neon-lime)' }}>
                  {s.icon}
                  <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-primary)' }}>
                    {s.label}
                  </span>
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', marginBottom: '1rem', lineHeight: '1.5' }}>{s.desc}</p>
                <button
                  onClick={() => triggerSync(s.id)}
                  disabled={isDisabled}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    background: s.id === 'all' ? 'var(--ember)' : 'var(--neon-lime)',
                    color: 'var(--bg-void)',
                    fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700,
                    textTransform: 'uppercase', fontSize: '0.875rem',
                    padding: '9px 18px', borderRadius: '7px', border: 'none',
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                    opacity: isDisabled && !isRunning ? 0.5 : 1,
                    width: '100%', justifyContent: 'center',
                    transition: 'opacity 0.2s',
                  }}
                >
                  <RefreshCw size={14} style={isRunning ? { animation: 'spin 1s linear infinite' } : undefined} />
                  {isRunning ? 'Syncing...' : 'Run Sync'}
                </button>
              </div>
            )
          })}
        </div>

        {/* Result banner */}
        {result && !running && (
          <div style={{
            marginTop: '1.25rem', padding: '1rem 1.25rem', borderRadius: '8px',
            backgroundColor: result.success ? 'rgba(57,255,20,0.07)' : 'rgba(255,61,87,0.07)',
            border: `1px solid ${result.success ? 'var(--neon-lime)' : 'var(--state-hot)'}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              {result.success
                ? <CheckCircle size={18} style={{ color: 'var(--neon-lime)', flexShrink: 0, marginTop: '1px' }} />
                : <XCircle size={18} style={{ color: 'var(--state-hot)', flexShrink: 0, marginTop: '1px' }} />
              }
              <div style={{ flex: 1 }}>
                {result.success ? (
                  <>
                    <p style={{ margin: '0 0 6px', color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.9375rem' }}>
                      Sync complete — {result.added.toLocaleString('en-CA')} added · {result.updated.toLocaleString('en-CA')} updated · {result.fetched.toLocaleString('en-CA')} fetched
                    </p>
                    {Object.entries(result.perSource ?? {}).map(([src, r]) => (
                      <div key={src} style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '2px' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)', textTransform: 'uppercase', fontSize: '0.75rem', fontFamily: 'Orbitron, monospace' }}>{src}</span>
                        {' '}— {r.added} added, {r.updated} updated
                        {r.errors?.length > 0 && <span style={{ color: 'var(--state-hot)', marginLeft: '8px' }}>{r.errors.length} errors</span>}
                      </div>
                    ))}
                    {result.errors?.length > 0 && (
                      <details style={{ marginTop: '8px' }}>
                        <summary style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', cursor: 'pointer' }}>Show errors ({result.errors.length})</summary>
                        <div style={{ marginTop: '6px', fontSize: '0.75rem', color: 'var(--state-hot)', lineHeight: '1.6' }}>
                          {result.errors.map((e, i) => <div key={i}>{e}</div>)}
                        </div>
                      </details>
                    )}
                  </>
                ) : (
                  <p style={{ margin: 0, color: 'var(--state-hot)', fontSize: '0.9375rem' }}>
                    {result.error ?? 'Sync failed — check the error log'}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* In-progress indicator */}
        {running && (
          <div style={{ marginTop: '1.25rem', padding: '1rem 1.25rem', borderRadius: '8px', backgroundColor: 'rgba(57,255,20,0.04)', border: '1px solid var(--line-visible)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <RefreshCw size={18} style={{ color: 'var(--neon-lime)', animation: 'spin 1s linear infinite', flexShrink: 0 }} />
            <div>
              <p style={{ margin: 0, color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.9375rem' }}>
                Syncing {runningSource === 'all' ? 'all sources' : runningSource}…
              </p>
              <p style={{ margin: '2px 0 0', color: 'var(--text-tertiary)', fontSize: '0.8125rem' }}>
                This may take 2–5 minutes for a full sync. Please wait.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Sync log */}
      {logs.length > 0 && (
        <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--line-subtle)', borderRadius: '12px', padding: '1.5rem' }}>
          <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1.25rem', textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={18} style={{ color: 'var(--ice)' }} /> Sync History
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem', fontFamily: 'Space Grotesk, sans-serif' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--line-visible)' }}>
                  {['Time', 'Source', 'Fetched', 'Added', 'Updated', 'Errors'].map(h => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--text-tertiary)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'Orbitron, monospace', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log.id} style={{ borderBottom: '1px solid var(--line-subtle)' }}>
                    <td style={{ padding: '10px 12px', color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>
                      {new Date(log.created_at).toLocaleString('en-CA', { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{ fontFamily: 'Orbitron, monospace', fontSize: '9px', padding: '3px 7px', borderRadius: '4px', backgroundColor: 'var(--bg-elevated)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        {log.source}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>{log.total_fetched.toLocaleString('en-CA')}</td>
                    <td style={{ padding: '10px 12px', color: 'var(--neon-lime)', fontWeight: 600 }}>+{log.added}</td>
                    <td style={{ padding: '10px 12px', color: 'var(--ice)' }}>{log.updated}</td>
                    <td style={{ padding: '10px 12px', color: log.errors ? 'var(--state-hot)' : 'var(--text-tertiary)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {log.errors ?? '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </>
  )
}

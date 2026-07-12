import { useEffect, useState } from 'react'
import { RefreshCw, Clock, CheckCircle, XCircle, Zap, Globe, Layers } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import type { SyncLog } from '../../lib/types'

const SUPABASE_URL  = import.meta.env.VITE_SUPABASE_URL  as string
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY as string

type SyncSource = 'gamemonetize' | 'gamedistribution' | 'html5games' | 'all'

interface PerSourceResult { added: number; updated: number; fetched: number; errors: string[] }
interface SyncResponse {
  success: boolean; added: number; updated: number; fetched: number
  errors: string[]; perSource?: Record<string, PerSourceResult>; error?: string
}
interface SyncStatus { running: boolean; source: SyncSource | null; result: SyncResponse | null }

const SOURCE_META: { id: SyncSource; label: string; icon: React.ReactNode; desc: string; accent: string }[] = [
  { id: 'gamemonetize', label: 'GameMonetize', icon: <Zap size={16} />, desc: 'Up to 50 pages × 100 = 5,000 games. Use Start Page to batch large imports.', accent: 'var(--neon-lime)' },
  { id: 'gamedistribution', label: 'GameDistribution', icon: <Globe size={16} />, desc: 'Up to 15 pages × 100 = 1,500 games per call.', accent: 'var(--ice)' },
  { id: 'html5games', label: 'HTML5Games.com', icon: <Layers size={16} />, desc: 'Up to 10 pages × 100 = 1,000 games per call.', accent: 'var(--ember)' },
  { id: 'all', label: 'Sync All Sources', icon: <RefreshCw size={16} />, desc: 'Runs GM (20pp) + GD (15pp) + H5 (10pp) in sequence — up to 4,500 games.', accent: 'var(--ember)' },
]

export default function AdminSync({ onSynced }: { onSynced?: () => void }) {
  const [logs, setLogs] = useState<SyncLog[]>([])
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({ running: false, source: null, result: null })
  const [startPage, setStartPage] = useState(1)
  const [maxPages, setMaxPages] = useState(20)

  const loadLogs = async () => {
    const { data } = await supabase.from('sync_logs').select('*').order('created_at', { ascending: false }).limit(20)
    setLogs((data ?? []) as SyncLog[])
  }

  useEffect(() => { loadLogs() }, [])

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
      await loadLogs()
      onSynced?.()
    } catch (err) {
      setSyncStatus({
        running: false, source,
        result: { success: false, added: 0, updated: 0, fetched: 0, errors: [], error: err instanceof Error ? err.message : 'Network error' },
      })
    }
  }

  const { running, source: runningSource, result } = syncStatus

  return (
    <div>
      {/* Batch controls */}
      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-end', flexWrap: 'wrap', marginBottom: '1.5rem', padding: '1.25rem', background: 'var(--bg-elevated)', borderRadius: '10px', border: '1px solid var(--line-subtle)' }}>
        <div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontFamily: 'Orbitron, monospace', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Start Page</div>
          <input type="number" min={1} max={999} value={startPage}
            onChange={e => setStartPage(Math.max(1, parseInt(e.target.value) || 1))}
            style={{ width: '90px', padding: '9px 12px', background: 'var(--bg-void)', border: '1px solid var(--line-visible)', borderRadius: '7px', color: 'var(--text-primary)', fontSize: '0.9rem', fontFamily: 'Orbitron, monospace', textAlign: 'center' }} />
        </div>
        <div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontFamily: 'Orbitron, monospace', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Max Pages</div>
          <input type="number" min={1} max={50} value={maxPages}
            onChange={e => setMaxPages(Math.min(50, Math.max(1, parseInt(e.target.value) || 1)))}
            style={{ width: '90px', padding: '9px 12px', background: 'var(--bg-void)', border: '1px solid var(--line-visible)', borderRadius: '7px', color: 'var(--text-primary)', fontSize: '0.9rem', fontFamily: 'Orbitron, monospace', textAlign: 'center' }} />
        </div>
        <div style={{ flex: 1, fontSize: '0.8125rem', color: 'var(--text-tertiary)', lineHeight: 1.6, minWidth: '200px' }}>
          Each call fetches up to <span style={{ color: 'var(--neon-lime)', fontWeight: 700 }}>{maxPages * 100} games</span>. To import all GM games, run multiple syncs with Start Page 1, 21, 41, 61…
        </div>
      </div>

      {/* Source cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(230px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {SOURCE_META.map(s => {
          const isRunning = running && runningSource === s.id
          const isDisabled = running
          return (
            <div key={s.id} style={{ border: `1px solid ${s.id === 'all' ? 'var(--ember)' : 'var(--line-visible)'}`, borderRadius: '10px', padding: '1.25rem', background: s.id === 'all' ? 'rgba(255,140,0,0.04)' : 'var(--bg-elevated)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', color: s.accent }}>
                {s.icon}
                <span style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-primary)' }}>{s.label}</span>
              </div>
              <p style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', lineHeight: '1.5', flex: 1, marginBottom: '1rem' }}>{s.desc}</p>
              <button
                onClick={() => triggerSync(s.id)} disabled={isDisabled}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', padding: '9px 18px', borderRadius: '7px', border: 'none', cursor: isDisabled ? 'not-allowed' : 'pointer', opacity: isDisabled && !isRunning ? 0.5 : 1, transition: 'opacity 0.2s', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, textTransform: 'uppercase', fontSize: '0.875rem', background: s.accent, color: 'var(--bg-void)' }}>
                <RefreshCw size={14} style={isRunning ? { animation: 'spin 1s linear infinite' } : undefined} />
                {isRunning ? 'Syncing…' : 'Run Sync'}
              </button>
            </div>
          )
        })}
      </div>

      {/* Running indicator */}
      {running && (
        <div style={{ padding: '1rem 1.25rem', borderRadius: '8px', background: 'rgba(57,255,20,0.04)', border: '1px solid var(--line-visible)', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
          <RefreshCw size={18} style={{ color: 'var(--neon-lime)', animation: 'spin 1s linear infinite', flexShrink: 0 }} />
          <div>
            <p style={{ margin: 0, color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.9375rem' }}>Syncing {runningSource === 'all' ? 'all sources' : runningSource}…</p>
            <p style={{ margin: '2px 0 0', color: 'var(--text-tertiary)', fontSize: '0.8125rem' }}>May take 2–5 minutes for a full sync. Please wait.</p>
          </div>
        </div>
      )}

      {/* Result */}
      {result && !running && (
        <div style={{ padding: '1rem 1.25rem', borderRadius: '8px', marginBottom: '1.5rem', background: result.success ? 'rgba(57,255,20,0.06)' : 'rgba(255,61,87,0.07)', border: `1px solid ${result.success ? 'var(--neon-lime)' : 'var(--state-hot)'}` }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            {result.success
              ? <CheckCircle size={18} style={{ color: 'var(--neon-lime)', flexShrink: 0, marginTop: '1px' }} />
              : <XCircle size={18} style={{ color: 'var(--state-hot)', flexShrink: 0, marginTop: '1px' }} />}
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
                <p style={{ margin: 0, color: 'var(--state-hot)', fontSize: '0.9375rem' }}>{result.error ?? 'Sync failed'}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sync History */}
      {logs.length > 0 && (
        <div>
          <h3 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1.1rem', textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={16} style={{ color: 'var(--ice)' }} /> Sync History
          </h3>
          <div style={{ overflowX: 'auto', borderRadius: '10px', border: '1px solid var(--line-subtle)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem', fontFamily: 'Space Grotesk, sans-serif', minWidth: '600px' }}>
              <thead>
                <tr style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--line-visible)' }}>
                  {['Time', 'Source', 'Fetched', 'Added', 'Updated', 'Notes'].map(h => (
                    <th key={h} style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--text-tertiary)', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'Orbitron, monospace', whiteSpace: 'nowrap' }}>{h}</th>
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
                      <span style={{ fontFamily: 'Orbitron, monospace', fontSize: '9px', padding: '2px 7px', borderRadius: '4px', background: 'var(--bg-elevated)', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{log.source}</span>
                    </td>
                    <td style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>{log.total_fetched.toLocaleString('en-CA')}</td>
                    <td style={{ padding: '10px 12px', color: 'var(--neon-lime)', fontWeight: 600 }}>+{log.added}</td>
                    <td style={{ padding: '10px 12px', color: 'var(--ice)' }}>{log.updated}</td>
                    <td style={{ padding: '10px 12px', color: log.errors ? 'var(--state-hot)' : 'var(--text-tertiary)', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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
    </div>
  )
}

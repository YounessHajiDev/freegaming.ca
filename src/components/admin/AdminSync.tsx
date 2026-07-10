import { useState } from 'react'

type GameSource = 'GAMEMONETIZE' | 'GAMEDISTRIBUTION' | 'HTML5GAMES'

export default function AdminSync() {
  const [source, setSource] = useState<GameSource>('GAMEMONETIZE')
  const [startPage, setStartPage] = useState(1)
  const [maxPages, setMaxPages] = useState(5)
  const [loading, setLoading] = useState(false)
  const [lastSync, setLastSync] = useState<string | null>(null)

  const handleSync = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/sync-games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source, startPage, maxPages })
      })

      const data = await res.json()

      if (data.success) {
        setLastSync(`${data.added} added, ${data.updated} updated at ${new Date().toLocaleTimeString()}`)
        alert(`Sync complete!\nAdded: ${data.added}\nUpdated: ${data.updated}`)
      } else {
        alert('Sync failed: ' + (data.error || 'Unknown error'))
      }
    } catch (err) {
      alert('Failed to sync: ' + String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem' }}>Sync Games</h2>

      <div style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--line-visible)',
        borderRadius: '0.5rem',
        padding: '2rem',
        maxWidth: '600px',
      }}>
        <form onSubmit={handleSync}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Game Source</label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value as GameSource)}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'var(--bg-surface)',
                border: '1px solid var(--line-visible)',
                borderRadius: '0.25rem',
                color: 'var(--text-primary)',
              }}
            >
              <option value="GAMEMONETIZE">GameMonetize</option>
              <option value="GAMEDISTRIBUTION">GameDistribution</option>
              <option value="HTML5GAMES">HTML5Games</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Start Page</label>
              <input
                type="number"
                min="1"
                value={startPage}
                onChange={(e) => setStartPage(parseInt(e.target.value))}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--line-visible)',
                  borderRadius: '0.25rem',
                  color: 'var(--text-primary)',
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Max Pages</label>
              <input
                type="number"
                min="1"
                max="50"
                value={maxPages}
                onChange={(e) => setMaxPages(parseInt(e.target.value))}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--line-visible)',
                  borderRadius: '0.25rem',
                  color: 'var(--text-primary)',
                }}
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%' }}>
            {loading ? 'Syncing...' : 'Start Sync'}
          </button>
        </form>

        {lastSync && (
          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            background: 'var(--bg-surface)',
            border: '1px solid var(--line-visible)',
            borderRadius: '0.25rem',
            color: 'var(--neon-lime)',
          }}>
            Last sync: {lastSync}
          </div>
        )}
      </div>

      <div style={{
        marginTop: '2rem',
        background: 'var(--bg-elevated)',
        border: '1px solid var(--line-visible)',
        borderRadius: '0.5rem',
        padding: '1.5rem',
      }}>
        <h3 style={{ marginBottom: '1rem' }}>Sync Information</h3>
        <ul style={{ listStyle: 'none', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
          <li>- GameMonetize: Popular gaming platform with hundreds of titles</li>
          <li>- GameDistribution: Large catalog of browser-based games</li>
          <li>- HTML5Games: Specialized in HTML5 game distribution</li>
          <li>- Adjust start page and max pages to control which games are fetched</li>
          <li>- Each sync operation updates or adds games to your database</li>
        </ul>
      </div>
    </div>
  )
}

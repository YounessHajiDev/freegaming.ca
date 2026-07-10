import { useEffect, useState } from 'react'
import { LiveStats } from '../../lib/types'

export default function LiveTicker() {
  const [stats, setStats] = useState<LiveStats | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/live-stats')
        const data = await res.json()
        setStats(data)
      } catch (err) {
        console.error('Failed to fetch live stats:', err)
      }
    }

    fetchStats()
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [])

  if (!stats) return null

  return (
    <div style={tickerStyles.container}>
      <div style={tickerStyles.stat}>
        <span style={tickerStyles.label}>Players Online</span>
        <span style={tickerStyles.value}>{stats.totalPlayers.toLocaleString()}</span>
      </div>
      <div style={tickerStyles.stat}>
        <span style={tickerStyles.label}>Total Games</span>
        <span style={tickerStyles.value}>{stats.totalGames.toLocaleString()}</span>
      </div>
      <div style={tickerStyles.stat}>
        <span style={tickerStyles.label}>New Today</span>
        <span style={tickerStyles.value}>{stats.newToday}</span>
      </div>
      <div style={tickerStyles.stat}>
        <span style={tickerStyles.label}>Trending</span>
        <span style={tickerStyles.value}>{stats.topGame}</span>
      </div>
    </div>
  )
}

const tickerStyles = {
  container: {
    background: 'linear-gradient(90deg, var(--bg-surface), var(--bg-elevated))',
    border: '1px solid var(--line-visible)',
    padding: '1rem',
    borderRadius: '0.5rem',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem',
  } as const,
  stat: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.25rem',
    textAlign: 'center' as const,
  },
  label: {
    fontSize: '0.75rem',
    color: 'var(--text-tertiary)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    fontWeight: 600,
  },
  value: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: 'var(--neon-lime)',
    fontFamily: "'Barlow Condensed', sans-serif",
  },
}

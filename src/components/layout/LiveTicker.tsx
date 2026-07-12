import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

interface LiveStats {
  totalGames: number
  newToday: number
  topGame: string
}

export default function LiveTicker() {
  const [stats, setStats] = useState<LiveStats | null>(null)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [{ count: total }, { count: newToday }, { data: topData }] = await Promise.all([
          supabase.from('games').select('*', { count: 'exact', head: true }).eq('is_active', true),
          supabase.from('games').select('*', { count: 'exact', head: true }).eq('is_active', true)
            .gte('created_at', new Date(Date.now() - 86400000).toISOString()),
          supabase.from('games').select('title').eq('is_active', true).order('views', { ascending: false }).limit(1),
        ])
        setStats({
          totalGames: total ?? 0,
          newToday: newToday ?? 0,
          topGame: topData?.[0]?.title ?? 'Loading…',
        })
      } catch {
        // silently fail — ticker is non-critical
      }
    }

    fetchStats()
  }, [])

  if (!stats) return null

  return (
    <div style={tickerStyles.container}>
      <div style={tickerStyles.stat}>
        <span style={tickerStyles.label}>Total Games</span>
        <span style={tickerStyles.value}>{stats.totalGames.toLocaleString()}</span>
      </div>
      <div style={tickerStyles.stat}>
        <span style={tickerStyles.label}>New Today</span>
        <span style={tickerStyles.value}>{stats.newToday}</span>
      </div>
      <div style={tickerStyles.stat}>
        <span style={tickerStyles.label}>Top Game</span>
        <span style={tickerStyles.value}>{stats.topGame}</span>
      </div>
      <div style={tickerStyles.stat}>
        <span style={tickerStyles.label}>Access</span>
        <span style={tickerStyles.value}>FREE</span>
      </div>
    </div>
  )
}

const tickerStyles = {
  container: {
    background: 'linear-gradient(90deg, var(--bg-surface), var(--bg-elevated))',
    border: '1px solid var(--line-visible)',
    padding: 'clamp(0.75rem, 2vw, 1rem)',
    borderRadius: '0.5rem',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
    gap: 'clamp(0.5rem, 2vw, 1rem)',
    marginBottom: '1.5rem',
  } as const,
  stat: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.25rem',
    textAlign: 'center' as const,
    minHeight: '44px',
    justifyContent: 'center',
  },
  label: {
    fontSize: 'clamp(0.65rem, 1.5vw, 0.75rem)',
    color: 'var(--text-tertiary)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    fontWeight: 600,
  },
  value: {
    fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
    fontWeight: 700,
    color: 'var(--neon-lime)',
    fontFamily: "'Barlow Condensed', sans-serif",
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap' as const,
  },
}

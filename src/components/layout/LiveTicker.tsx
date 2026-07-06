'use client'
import { useEffect, useState } from 'react'
import type { LiveStats } from '../../lib/types'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export default function LiveTicker() {
  const [stats, setStats] = useState<string[]>([
    '⚡ Loading live stats...',
  ])

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${SUPABASE_URL}/functions/v1/live-stats`, {
          headers: { Authorization: `Bearer ${SUPABASE_ANON}`, 'Content-Type': 'application/json' },
        })
        if (!res.ok) return
        const data: LiveStats = await res.json()
        setStats([
          `⚡ ${data.totalPlayers.toLocaleString('en-CA')} players online right now`,
          `🔥 Most played today: ${data.topGame}`,
          `✨ ${data.newToday} new games added this week`,
          `🎮 ${data.totalGames.toLocaleString('en-CA')} free games in our library`,
          `🍁 Canada's #1 free gaming portal`,
          `⚡ No download. No signup. Just play.`,
        ])
      } catch {
        setStats([
          `🎮 Thousands of free games — no download required`,
          `🍁 Canada's #1 free online gaming portal`,
          `⚡ No signup. Just play.`,
        ])
      }
    }
    load()
  }, [])

  return (
    <div style={{
      width: '100%', height: '36px', display: 'flex', alignItems: 'center',
      overflow: 'hidden', borderBottom: '1px solid var(--line-visible)',
      backgroundColor: 'var(--bg-elevated)', position: 'sticky', top: '64px', zIndex: 39,
    }}>
      {/* LIVE label */}
      <div style={{
        flexShrink: 0, display: 'flex', alignItems: 'center', gap: '8px',
        padding: '0 16px', borderRight: '1px solid var(--line-visible)', height: '100%',
      }}>
        <span style={{
          width: '8px', height: '8px', borderRadius: '50%',
          backgroundColor: 'var(--neon-lime)', display: 'inline-block',
          animation: 'pulse 2s ease-in-out infinite',
        }} />
        <span style={{
          fontFamily: 'Orbitron, monospace', fontSize: '10px',
          color: 'var(--neon-lime)', textTransform: 'uppercase', letterSpacing: '0.15em',
        }}>LIVE</span>
      </div>

      {/* Scrolling content */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <div className="animate-ticker" style={{ display: 'flex', gap: '64px', whiteSpace: 'nowrap' }}>
          {[...stats, ...stats].map((stat, i) => (
            <span key={i} style={{
              color: 'var(--text-secondary)', fontSize: '12px',
              fontFamily: 'Space Grotesk, sans-serif',
            }}>{stat}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

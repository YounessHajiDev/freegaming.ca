import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import AdminGameManager from '../components/admin/AdminGameManager'
import AdminAddGame from '../components/admin/AdminAddGame'
import AdminCategories from '../components/admin/AdminCategories'
import AdminSync from '../components/admin/AdminSync'
import AdminOGAds from '../components/admin/AdminOGAds'

type Tab = 'dashboard' | 'games' | 'add' | 'categories' | 'sync' | 'ogads'

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'freegaming2026') {
      setAuthenticated(true)
      setPassword('')
    } else {
      alert('Invalid password')
      setPassword('')
    }
  }

  if (!authenticated) {
    return (
      <>
        <Helmet>
          <title>Admin - FreeGaming.ca</title>
          <meta name="robots" content="noindex" />
        </Helmet>

        <div style={{
          maxWidth: '400px',
          margin: '2rem auto',
          background: 'var(--bg-elevated)',
          border: '1px solid var(--line-visible)',
          borderRadius: '0.5rem',
          padding: '2rem',
        }}>
          <h1 style={{ marginBottom: '1.5rem', color: 'var(--neon-lime)' }}>Admin Login</h1>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--line-visible)',
                  borderRadius: '0.25rem',
                  color: 'var(--text-primary)',
                }}
                autoFocus
              />
            </div>
            <button type="submit" className="btn-primary" style={{ width: '100%' }}>
              Login
            </button>
          </form>
        </div>
      </>
    )
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - FreeGaming.ca</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1 style={{ color: 'var(--neon-lime)' }}>Admin Dashboard</h1>
          <button
            onClick={() => setAuthenticated(false)}
            className="btn-ghost"
          >
            Logout
          </button>
        </div>

        <div style={{
          display: 'flex',
          gap: '1rem',
          borderBottom: '1px solid var(--line-visible)',
          marginBottom: '2rem',
          overflowX: 'auto',
        }}>
          {['dashboard', 'games', 'add', 'categories', 'sync', 'ogads'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as typeof activeTab)}
              style={{
                padding: '1rem',
                background: activeTab === tab ? 'var(--neon-lime)' : 'transparent',
                color: activeTab === tab ? 'var(--bg-void)' : 'var(--text-primary)',
                border: 'none',
                cursor: 'pointer',
                fontWeight: activeTab === tab ? 700 : 500,
                borderBottom: activeTab === tab ? '2px solid var(--neon-lime)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              {tab === 'ogads' ? 'OGAds' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === 'dashboard' && (
          <div style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--line-visible)',
            borderRadius: '0.5rem',
            padding: '2rem',
          }}>
            <h2>Welcome to the Admin Dashboard</h2>
            <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
              Use the tabs above to manage games, categories, and sync data from external sources.
            </p>
          </div>
        )}

        {activeTab === 'games' && <AdminGameManager />}
        {activeTab === 'add' && <AdminAddGame />}
        {activeTab === 'categories' && <AdminCategories />}
        {activeTab === 'sync' && <AdminSync />}
        {activeTab === 'ogads' && <AdminOGAds />}
      </div>
    </>
  )
}

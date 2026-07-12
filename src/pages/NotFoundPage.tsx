import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Gamepad2 } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <>
      <Helmet><title>Page Not Found | FreeGaming.ca</title></Helmet>
      <div style={{ textAlign: 'center', padding: '6rem 2rem' }}>
        <Gamepad2 size={64} style={{ color: 'var(--text-tertiary)', marginBottom: '1.5rem' }} />
        <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: '4rem', textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          404
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', marginBottom: '2rem' }}>
          This page respawned somewhere else. Let's get you back in the game.
        </p>
        <Link to="/" className="btn-primary">Back to Home</Link>
      </div>
    </>
  )
}

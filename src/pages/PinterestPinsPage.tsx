import { useState } from 'react'

export default function PinterestPinsPage() {
  const [pins, setPins] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const generatePins = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/pinterest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate' })
      })
      const data = await res.json()
      setPins(data.pins || [])
    } catch (err) {
      console.error('Failed to generate pins:', err)
      alert('Failed to generate pins')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 style={{ marginBottom: '1rem', color: 'var(--neon-lime)' }}>Pinterest Pins</h1>

      <div style={{ marginBottom: '2rem' }}>
        <button
          onClick={generatePins}
          disabled={loading}
          className="btn-primary"
        >
          {loading ? 'Generating...' : 'Generate New Pins'}
        </button>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '1.5rem',
      }}>
        {pins.map((pin, i) => (
          <div
            key={i}
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--line-visible)',
              borderRadius: '0.5rem',
              overflow: 'hidden',
            }}
          >
            <img
              src={pin.image}
              alt={pin.title}
              style={{ width: '100%', height: '200px', objectFit: 'cover' }}
            />
            <div style={{ padding: '1rem' }}>
              <h3 style={{ marginBottom: '0.5rem' }}>{pin.title}</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                {pin.description}
              </p>
              <a href={pin.url} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ display: 'inline-block', marginTop: '0.5rem' }}>
                View
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

import { Helmet } from 'react-helmet-async'

export default function ContactPage() {
  return (
    <>
      <Helmet>
        <title>Contact - FreeGaming.ca</title>
        <meta name="description" content="Contact FreeGaming.ca" />
      </Helmet>

      <h1 style={{ marginBottom: '1rem', color: 'var(--neon-lime)' }}>Contact Us</h1>

      <div style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--line-visible)',
        borderRadius: '0.5rem',
        padding: '2rem',
        maxWidth: '600px',
      }}>
        <form onSubmit={(e) => {
          e.preventDefault()
          alert('Thank you for your message! We will get back to you soon.')
        }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-primary)', fontWeight: 600 }}>
              Name
            </label>
            <input
              type="text"
              required
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

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-primary)', fontWeight: 600 }}>
              Email
            </label>
            <input
              type="email"
              required
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

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-primary)', fontWeight: 600 }}>
              Message
            </label>
            <textarea
              required
              rows={5}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'var(--bg-surface)',
                border: '1px solid var(--line-visible)',
                borderRadius: '0.25rem',
                color: 'var(--text-primary)',
                fontFamily: 'inherit',
              }}
            />
          </div>

          <button type="submit" className="btn-primary">
            Send Message
          </button>
        </form>
      </div>
    </>
  )
}

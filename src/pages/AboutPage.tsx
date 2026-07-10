import { Helmet } from 'react-helmet-async'

export default function AboutPage() {
  return (
    <>
      <Helmet>
        <title>About FreeGaming.ca</title>
        <meta name="description" content="About FreeGaming.ca - Free online games portal" />
      </Helmet>

      <h1 style={{ marginBottom: '1rem', color: 'var(--neon-lime)' }}>About FreeGaming.ca</h1>

      <div style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--line-visible)',
        borderRadius: '0.5rem',
        padding: '2rem',
        lineHeight: 1.8,
        color: 'var(--text-secondary)',
      }}>
        <h2>Our Mission</h2>
        <p>
          FreeGaming.ca is dedicated to providing Canadians with access to the best free online games
          without requiring registration or downloads.
        </p>

        <h2 style={{ marginTop: '1.5rem' }}>What We Offer</h2>
        <ul style={{ marginLeft: '1.5rem' }}>
          <li>Hundreds of free online games</li>
          <li>No registration required</li>
          <li>No downloads necessary</li>
          <li>Constantly updated game library</li>
          <li>Games for all ages and interests</li>
        </ul>

        <h2 style={{ marginTop: '1.5rem' }}>Our Commitment</h2>
        <p>
          We're committed to providing a safe, fun, and engaging gaming experience for players across Canada.
        </p>
      </div>
    </>
  )
}

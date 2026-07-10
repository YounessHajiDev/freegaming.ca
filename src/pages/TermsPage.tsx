import { Helmet } from 'react-helmet-async'

export default function TermsPage() {
  return (
    <>
      <Helmet>
        <title>Terms of Service - FreeGaming.ca</title>
        <meta name="description" content="Terms of Service for FreeGaming.ca" />
      </Helmet>

      <h1 style={{ marginBottom: '1rem', color: 'var(--neon-lime)' }}>Terms of Service</h1>

      <div style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--line-visible)',
        borderRadius: '0.5rem',
        padding: '2rem',
        lineHeight: 1.8,
        color: 'var(--text-secondary)',
      }}>
        <h2>Agreement to Terms</h2>
        <p>
          By accessing and using FreeGaming.ca, you accept and agree to be bound by the terms and provision of this agreement.
        </p>

        <h2 style={{ marginTop: '1.5rem' }}>Use License</h2>
        <p>
          Permission is granted to temporarily download one copy of the materials (information or software) on FreeGaming.ca
          for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
        </p>

        <h2 style={{ marginTop: '1.5rem' }}>Disclaimer</h2>
        <p>
          The materials on FreeGaming.ca are provided on an 'as is' basis. FreeGaming.ca makes no warranties, expressed or implied,
          and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability,
          fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
        </p>

        <h2 style={{ marginTop: '1.5rem' }}>Limitations</h2>
        <p>
          In no event shall FreeGaming.ca or its suppliers be liable for any damages (including, without limitation, damages for loss of data
          or profit, or due to business interruption) arising out of the use or inability to use the materials on FreeGaming.ca.
        </p>

        <h2 style={{ marginTop: '1.5rem' }}>Accuracy of Materials</h2>
        <p>
          The materials appearing on FreeGaming.ca could include technical, typographical, or photographic errors.
          FreeGaming.ca does not warrant that any of the materials on the site are accurate, complete, or current.
        </p>

        <h2 style={{ marginTop: '1.5rem' }}>Contact Us</h2>
        <p>
          If you have any questions about these Terms of Service, please contact us at support@freegaming.ca
        </p>
      </div>
    </>
  )
}

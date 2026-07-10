import { Helmet } from 'react-helmet-async'

export default function PrivacyPolicyPage() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy - FreeGaming.ca</title>
        <meta name="description" content="Privacy Policy for FreeGaming.ca" />
      </Helmet>

      <h1 style={{ marginBottom: '1rem', color: 'var(--neon-lime)' }}>Privacy Policy</h1>

      <div style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--line-visible)',
        borderRadius: '0.5rem',
        padding: '2rem',
        lineHeight: 1.8,
        color: 'var(--text-secondary)',
      }}>
        <h2>Introduction</h2>
        <p>
          FreeGaming.ca ("we," "us," "our," or "Company") respects the privacy of our users ("user" or "you").
          This Privacy Policy explains how we collect, use, disclose, and safeguard your information.
        </p>

        <h2 style={{ marginTop: '1.5rem' }}>Information We Collect</h2>
        <p>
          We may collect information about you in a variety of ways. The information we may collect on the site includes:
        </p>
        <ul style={{ marginLeft: '1.5rem' }}>
          <li>Device information (browser type, IP address)</li>
          <li>Cookies and usage data</li>
          <li>Information you voluntarily provide (contact forms)</li>
        </ul>

        <h2 style={{ marginTop: '1.5rem' }}>Use of Your Information</h2>
        <p>
          Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience.
          Specifically, we may use information collected about you via the site to:
        </p>
        <ul style={{ marginLeft: '1.5rem' }}>
          <li>Generate analytics about site usage</li>
          <li>Improve and maintain our site</li>
          <li>Monitor for fraud or abuse</li>
        </ul>

        <h2 style={{ marginTop: '1.5rem' }}>Cookies</h2>
        <p>
          We use cookies to enhance your experience while using our site. You can instruct your browser to refuse all cookies
          or to indicate when a cookie is being sent.
        </p>

        <h2 style={{ marginTop: '1.5rem' }}>Contact Us</h2>
        <p>
          If you have questions or comments about this Privacy Policy, please contact us at support@freegaming.ca
        </p>
      </div>
    </>
  )
}

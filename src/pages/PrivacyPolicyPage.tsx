import { Helmet } from 'react-helmet-async'

const UPDATED = 'July 1, 2026'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1.25rem', textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
        {title}
      </h2>
      <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8, fontSize: '0.9375rem' }}>{children}</div>
    </div>
  )
}

export default function PrivacyPolicyPage() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | FreeGaming.ca</title>
        <meta name="description" content="Read the FreeGaming.ca privacy policy. We are committed to protecting your privacy and being transparent about data use." />
        <link rel="canonical" href="https://www.freegaming.ca/privacy-policy/" />
      </Helmet>

      <div style={{ maxWidth: '780px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: '2.25rem', textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          Privacy Policy
        </h1>
        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem', marginBottom: '2.5rem' }}>
          Last updated: {UPDATED}
        </p>

        <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--line-subtle)', borderRadius: '12px', padding: '2rem' }}>
          <Section title="Overview">
            <p>FreeGaming.ca ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains what information we collect, how we use it, and your rights in relation to that information. By using our website, you agree to the practices described herein.</p>
          </Section>

          <Section title="Information We Collect">
            <p style={{ marginBottom: '0.75rem' }}>We do not require registration or account creation to use FreeGaming.ca. We collect limited data automatically:</p>
            <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li><strong style={{ color: 'var(--text-primary)' }}>Usage Data:</strong> Pages visited, games played, time on site, device type, browser, and referring URL — collected via standard web server logs and analytics.</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Cookies:</strong> We use cookies to improve your experience and serve relevant advertising. You may control cookie preferences via your browser settings or through our cookie consent banner.</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Advertising Data:</strong> Third-party advertising partners (including Google AdSense and GameMonetize) may use cookies and similar technologies to display relevant ads and measure performance.</li>
            </ul>
          </Section>

          <Section title="How We Use Your Information">
            <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li>To operate and improve the website and game catalogue</li>
              <li>To analyse usage patterns and optimise content</li>
              <li>To serve advertising that funds the free operation of the site</li>
              <li>To comply with applicable legal obligations</li>
            </ul>
          </Section>

          <Section title="Third-Party Services">
            <p style={{ marginBottom: '0.75rem' }}>We use the following third-party services, each governed by their own privacy policies:</p>
            <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li><strong style={{ color: 'var(--text-primary)' }}>Google Analytics:</strong> Website analytics</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Google AdSense:</strong> Display advertising</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>GameMonetize / GameDistribution:</strong> Game content and in-game advertising</li>
              <li><strong style={{ color: 'var(--text-primary)' }}>Supabase:</strong> Backend infrastructure (no personal user data is stored)</li>
            </ul>
          </Section>

          <Section title="Your Rights (PIPEDA & CASL)">
            <p>As a Canadian-based service, we comply with the Personal Information Protection and Electronic Documents Act (PIPEDA). You have the right to access, correct, or request deletion of any personal information we hold about you. To exercise these rights, contact us at <a href="mailto:legal@freegaming.ca" style={{ color: 'var(--ember)', textDecoration: 'none' }}>legal@freegaming.ca</a>.</p>
          </Section>

          <Section title="Children's Privacy">
            <p>FreeGaming.ca is intended for general audiences. We do not knowingly collect personal information from children under 13. If you believe a child has provided personal information, please contact us and we will promptly delete it.</p>
          </Section>

          <Section title="Data Retention">
            <p>We retain anonymised analytics data for up to 26 months. Server logs are retained for up to 90 days for security and operational purposes. No personally identifiable information is retained beyond what is necessary.</p>
          </Section>

          <Section title="Changes to This Policy">
            <p>We may update this Privacy Policy from time to time. We will post the updated version with a revised date. Continued use of the site after changes constitutes acceptance of the updated policy.</p>
          </Section>

          <Section title="Contact">
            <p>For privacy-related inquiries: <a href="mailto:legal@freegaming.ca" style={{ color: 'var(--ember)', textDecoration: 'none' }}>legal@freegaming.ca</a></p>
          </Section>
        </div>
      </div>
    </>
  )
}

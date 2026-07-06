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

export default function TermsPage() {
  return (
    <>
      <Helmet>
        <title>Terms of Service | FreeGaming.ca</title>
        <meta name="description" content="Read the FreeGaming.ca Terms of Service. By using our site you agree to these terms." />
        <link rel="canonical" href="https://www.freegaming.ca/terms-of-service/" />
      </Helmet>

      <div style={{ maxWidth: '780px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: '2.25rem', textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          Terms of Service
        </h1>
        <p style={{ color: 'var(--text-tertiary)', fontSize: '0.875rem', marginBottom: '2.5rem' }}>
          Last updated: {UPDATED}
        </p>

        <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--line-subtle)', borderRadius: '12px', padding: '2rem' }}>
          <Section title="Acceptance of Terms">
            <p>By accessing or using FreeGaming.ca (the "Site"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use the Site.</p>
          </Section>

          <Section title="Use of the Site">
            <p style={{ marginBottom: '0.75rem' }}>You may use FreeGaming.ca for personal, non-commercial entertainment purposes only. You agree not to:</p>
            <ul style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li>Reproduce, redistribute, or commercially exploit any game, content, or artwork from the Site without written permission</li>
              <li>Attempt to reverse-engineer, scrape, or systematically harvest game content or data from the Site</li>
              <li>Use automated bots or scripts to interact with the Site or its games</li>
              <li>Circumvent or interfere with any advertising or monetisation mechanisms</li>
              <li>Use the Site in any way that violates applicable Canadian or international law</li>
            </ul>
          </Section>

          <Section title="Intellectual Property">
            <p>All games available on FreeGaming.ca remain the property of their respective developers and publishers. FreeGaming.ca operates under licence agreements with game distribution platforms. The FreeGaming.ca brand, logo, and website code are owned by FreeGaming.ca and may not be copied or reproduced without permission.</p>
          </Section>

          <Section title="Advertising">
            <p>FreeGaming.ca displays third-party advertisements to fund the free operation of the Site. By using the Site, you consent to the display of such advertising. We are not responsible for the content of third-party advertisements. Ad blocking may degrade site functionality.</p>
          </Section>

          <Section title="Disclaimer of Warranties">
            <p>The Site and all games are provided "as is" without warranties of any kind, express or implied. We do not warrant that the Site will be error-free, uninterrupted, or free of viruses or other harmful components. Your use of the Site is at your sole risk.</p>
          </Section>

          <Section title="Limitation of Liability">
            <p>To the maximum extent permitted by applicable law, FreeGaming.ca shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Site or any game accessible through it.</p>
          </Section>

          <Section title="Links to Third-Party Sites">
            <p>The Site may contain links to third-party websites. These links are provided for convenience only. FreeGaming.ca does not endorse and is not responsible for the content, privacy practices, or terms of any linked third-party site.</p>
          </Section>

          <Section title="Modifications">
            <p>We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting. Continued use of the Site after any modification constitutes acceptance of the updated Terms.</p>
          </Section>

          <Section title="Governing Law">
            <p>These Terms are governed by and construed in accordance with the laws of the Province of Ontario and the federal laws of Canada applicable therein, without regard to conflict of law principles.</p>
          </Section>

          <Section title="Contact">
            <p>For questions about these Terms: <a href="mailto:legal@freegaming.ca" style={{ color: 'var(--ember)', textDecoration: 'none' }}>legal@freegaming.ca</a></p>
          </Section>
        </div>
      </div>
    </>
  )
}

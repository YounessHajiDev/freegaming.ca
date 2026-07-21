import { Helmet } from 'react-helmet-async'
import { Mail, Clock } from 'lucide-react'
import { SITE_URL, DEFAULT_OG_IMAGE, SITE_NAME } from '../lib/seo'

export default function ContactPage() {
  return (
    <>
      <Helmet>
        <title>Contact {SITE_NAME}</title>
        <meta name="description" content={`Get in touch with the ${SITE_NAME} team for business inquiries, game submissions, or general questions.`} />
        <link rel="canonical" href={`${SITE_URL}/contact/`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/contact/`} />
        <meta property="og:title" content={`Contact ${SITE_NAME}`} />
        <meta property="og:description" content={`Get in touch with the ${SITE_NAME} team for business inquiries, game submissions, or general questions.`} />
        <meta property="og:image" content={DEFAULT_OG_IMAGE} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_CA" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`Contact ${SITE_NAME}`} />
        <meta name="twitter:description" content={`Get in touch with the ${SITE_NAME} team for business inquiries, game submissions, or general questions.`} />
        <meta name="twitter:image" content={DEFAULT_OG_IMAGE} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": `${SITE_URL}/` },
            { "@type": "ListItem", "position": 2, "name": "Contact", "item": `${SITE_URL}/contact/` }
          ]
        })}</script>
      </Helmet>

      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: '2.25rem', textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          Contact Us
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2.5rem' }}>
          We'd love to hear from you. Reach out for any of the topics below.
        </p>

        <div style={{ display: 'grid', gap: '1rem', marginBottom: '2.5rem' }}>
          {[
            {
              title: 'General Inquiries',
              desc: 'Questions about the site, content, or anything else.',
              email: 'hello@freegaming.ca',
            },
            {
              title: 'Game Submissions',
              desc: 'Are you a developer or publisher wanting to feature your game?',
              email: 'games@freegaming.ca',
            },
            {
              title: 'Advertising & Partnerships',
              desc: 'Sponsorships, media partnerships, or advertising opportunities.',
              email: 'ads@freegaming.ca',
            },
            {
              title: 'DMCA / Copyright',
              desc: 'Report infringing or incorrectly licensed content.',
              email: 'legal@freegaming.ca',
            },
          ].map(item => (
            <div key={item.title} style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--line-subtle)', borderRadius: '10px', padding: '1.25rem', display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'rgba(57,255,20,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Mail size={16} style={{ color: 'var(--neon-lime)' }} />
              </div>
              <div>
                <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1rem', textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '4px' }}>{item.title}</div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '6px' }}>{item.desc}</div>
                <a href={`mailto:${item.email}`} style={{ fontSize: '0.875rem', color: 'var(--ember)', textDecoration: 'none', fontWeight: 500 }}>{item.email}</a>
              </div>
            </div>
          ))}
        </div>

        <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--line-subtle)', borderRadius: '10px', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Clock size={18} style={{ color: 'var(--text-tertiary)', flexShrink: 0 }} />
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, margin: 0 }}>
            We typically respond within 1–3 business days. FreeGaming.ca is based in Canada and operates Monday – Friday.
          </p>
        </div>
      </div>
    </>
  )
}

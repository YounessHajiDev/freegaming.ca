import { useState } from 'react'
import { Key, CheckCircle, XCircle, RefreshCw, ExternalLink, Gift, Copy, Check } from 'lucide-react'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string

interface Offer {
  offerid: number
  name: string
  name_short: string
  picture: string
  payout: string
  country: string
  device: string
  link: string
  adcopy: string
}

export default function AdminOGAds() {
  const [copied, setCopied] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<{ ok: boolean; offers: Offer[]; error?: string } | null>(null)

  const copySecretName = () => {
    navigator.clipboard.writeText('OGADS_API_KEY')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const testOffers = async () => {
    setTesting(true); setTestResult(null)
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/ogads-offers?max=4`, {
        headers: { 'x-visitor-user-agent': navigator.userAgent },
      })
      const data = await res.json()
      if (data.success && data.offers?.length > 0) {
        setTestResult({ ok: true, offers: data.offers as Offer[] })
      } else {
        setTestResult({ ok: false, offers: [], error: data.error ?? 'No offers returned. Check that your API key is configured.' })
      }
    } catch (err) {
      setTestResult({ ok: false, offers: [], error: err instanceof Error ? err.message : 'Fetch failed' })
    }
    setTesting(false)
  }

  return (
    <div style={{ maxWidth: '760px' }}>
      {/* Overview */}
      <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--line-subtle)', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
          <Gift size={18} style={{ color: 'var(--ember)' }} />
          <h3 style={{ margin: 0, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1.1rem', textTransform: 'uppercase', color: 'var(--text-primary)' }}>
            OGAds Offer Wall
          </h3>
        </div>
        <p style={{ margin: '0 0 0.75rem', color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 1.6 }}>
          The <strong style={{ color: 'var(--text-primary)' }}>Earn Rewards</strong> section on the homepage shows offers from OGAds.
          Visitors complete tasks (app installs, sign-ups) and you earn a commission per conversion.
          Offers are loaded via a secure Supabase Edge Function — your API key is never exposed to the browser.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <a href="https://members.ogads.com" target="_blank" rel="noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', background: 'var(--bg-void)', border: '1px solid var(--line-visible)', borderRadius: '7px', color: 'var(--text-secondary)', textDecoration: 'none', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.8125rem', transition: 'color 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--ember)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}>
            <ExternalLink size={12} /> OGAds Dashboard
          </a>
          <a href="https://members.ogads.com/tools/offer-api" target="_blank" rel="noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', background: 'var(--bg-void)', border: '1px solid var(--line-visible)', borderRadius: '7px', color: 'var(--text-secondary)', textDecoration: 'none', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.8125rem', transition: 'color 0.15s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--ember)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}>
            <Key size={12} /> Get API Key
          </a>
        </div>
      </div>

      {/* API Key setup instructions */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--line-subtle)', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h3 style={{ margin: '0 0 0.25rem', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1rem', textTransform: 'uppercase', color: 'var(--text-primary)' }}>
          API Key Setup
        </h3>
        <p style={{ margin: '0 0 1.25rem', color: 'var(--text-tertiary)', fontSize: '0.8125rem' }}>
          Add your OGAds API key as an edge function secret. Secrets are stored securely server-side and never exposed to browsers.
        </p>

        <ol style={{ margin: '0 0 1.25rem', paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: 2 }}>
          <li>Go to <a href="https://members.ogads.com/tools/offer-api" target="_blank" rel="noreferrer" style={{ color: 'var(--ember)', textDecoration: 'none' }}>OGAds → Tools → Offer API</a> and generate your API key</li>
          <li>In your Supabase project, go to <strong style={{ color: 'var(--text-primary)' }}>Edge Functions → Secrets</strong></li>
          <li>Add a new secret with the name below and your API key as the value</li>
          <li>The <strong style={{ color: 'var(--text-primary)' }}>ogads-offers</strong> function will automatically use it</li>
        </ol>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', background: 'var(--bg-void)', border: '1px solid var(--line-visible)', borderRadius: '8px', flex: 1, minWidth: '200px' }}>
            <Key size={14} style={{ color: 'var(--ember)', flexShrink: 0 }} />
            <code style={{ fontFamily: 'Orbitron, monospace', fontSize: '0.875rem', color: 'var(--ember)', letterSpacing: '0.05em', flex: 1 }}>OGADS_API_KEY</code>
            <button
              onClick={copySecretName}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: copied ? 'var(--neon-lime)' : 'var(--text-tertiary)', display: 'flex', padding: '2px', transition: 'color 0.2s', flexShrink: 0 }}
              title="Copy secret name"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
          <a
            href="https://supabase.com/dashboard/project/_/functions"
            target="_blank"
            rel="noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 16px', background: 'var(--ember)', border: 'none', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase', whiteSpace: 'nowrap' }}
          >
            <ExternalLink size={13} /> Open Supabase Secrets
          </a>
        </div>
      </div>

      {/* Test / Preview */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--line-subtle)', borderRadius: '12px', padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <h3 style={{ margin: '0 0 2px', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1rem', textTransform: 'uppercase', color: 'var(--text-primary)' }}>Live Preview</h3>
            <p style={{ margin: 0, color: 'var(--text-tertiary)', fontSize: '0.8125rem' }}>Fetch live offers from OGAds and preview how they appear.</p>
          </div>
          <button
            onClick={testOffers}
            disabled={testing}
            style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '9px 18px', background: 'var(--bg-elevated)', border: '1px solid var(--ember)', borderRadius: '8px', color: 'var(--ember)', cursor: testing ? 'not-allowed' : 'pointer', opacity: testing ? 0.7 : 1, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase' }}>
            <RefreshCw size={13} style={testing ? { animation: 'spin 1s linear infinite' } : undefined} />
            {testing ? 'Loading…' : 'Fetch Offers'}
          </button>
        </div>

        {testResult && (
          testResult.ok ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem', padding: '8px 12px', borderRadius: '7px', background: 'rgba(57,255,20,0.07)', border: '1px solid var(--neon-lime)' }}>
                <CheckCircle size={14} style={{ color: 'var(--neon-lime)' }} />
                <span style={{ color: 'var(--neon-lime)', fontSize: '0.875rem', fontWeight: 600 }}>
                  {testResult.offers.length} offers loaded successfully
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' }}>
                {testResult.offers.map(offer => (
                  <div key={offer.offerid} style={{ background: 'var(--bg-elevated)', border: '1px solid var(--line-visible)', borderRadius: '10px', overflow: 'hidden' }}>
                    {offer.picture && (
                      <img src={offer.picture} alt={offer.name_short} style={{ width: '100%', height: '100px', objectFit: 'cover', display: 'block' }}
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                    )}
                    <div style={{ padding: '10px' }}>
                      <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '4px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                        {offer.name_short}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                        <span style={{ color: 'var(--ember)', fontWeight: 700 }}>${parseFloat(offer.payout || '0').toFixed(2)}</span>
                        <span style={{ color: 'var(--text-tertiary)' }}>{offer.device}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '10px 14px', borderRadius: '8px', background: 'rgba(255,61,87,0.07)', border: '1px solid var(--state-hot)' }}>
              <XCircle size={15} style={{ color: 'var(--state-hot)', flexShrink: 0, marginTop: '1px' }} />
              <span style={{ fontSize: '0.8125rem', color: 'var(--state-hot)' }}>{testResult.error}</span>
            </div>
          )
        )}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

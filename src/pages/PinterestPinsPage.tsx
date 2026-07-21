import { useEffect, useState, useMemo } from 'react'
import { Helmet } from 'react-helmet-async'
import { Download, ChevronRight, Search, Check, Image as ImageIcon } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { ADMIN_PASSWORD, isAdminPassword } from '../lib/adminAuth'
import type { Game, Category } from '../lib/types'

const SITE_URL = 'https://www.freegaming.ca'

// ─── Pin Templates ───────────────────────────────────────────────────────────

interface PinTemplate {
  id: string
  name: string
  sub: string
  bg: string
  accent: string
  text: string
}

const TEMPLATES: PinTemplate[] = [
  { id: 'neon',    name: 'Neon Gamer',  sub: 'Dark bg, neon green',   bg: 'linear-gradient(160deg,#080d0a 0%,#0f1a12 100%)',  accent: '#39ff14', text: '#eef2ee' },
  { id: 'clean',   name: 'Clean Play',  sub: 'Light bg, minimal',     bg: 'linear-gradient(160deg,#f8faf8 0%,#e8f5e9 100%)',  accent: '#2e7d32', text: '#1a1a1a' },
  { id: 'fire',    name: 'Fire Mode',   sub: 'Orange/red, intense',   bg: 'linear-gradient(160deg,#1a0500 0%,#7a1800 100%)',  accent: '#ff8c00', text: '#fff3e0' },
  { id: 'ice',     name: 'Ice Cold',    sub: 'Blue tones, cool',      bg: 'linear-gradient(160deg,#0a1628 0%,#1e3a5f 100%)',  accent: '#a8d8ea', text: '#e3f2fd' },
  { id: 'gold',    name: 'Dark Elite',  sub: 'Dark gold, premium',    bg: 'linear-gradient(160deg,#0d0900 0%,#1c1400 100%)',  accent: '#c9a227', text: '#fff8e1' },
  { id: 'vivid',   name: 'Vivid Pop',   sub: 'Bright, eye-catching',  bg: 'linear-gradient(160deg,#0d0021 0%,#001a2c 100%)',  accent: '#e040fb', text: '#f3e5f5' },
]

// ─── Copywriting Styles ───────────────────────────────────────────────────────

interface CopyStyle {
  id: string
  label: string
  makeTitle: (g: Game, cat: string) => string
  makeDesc: (g: Game, cat: string) => string
}

const COPY_STYLES: CopyStyle[] = [
  {
    id: 'curiosity',
    label: 'Curiosity',
    makeTitle: (g) => `Can you beat ${g.title}?`,
    makeDesc: (g, cat) =>
      `Think you have what it takes? ${g.title} is one of the most addictive ${cat} games online right now — 100% free to play, no download needed. Test your skills and see how far you get! Play free at FreeGaming.ca`,
  },
  {
    id: 'urgency',
    label: 'Urgency',
    makeTitle: (g) => `PLAY NOW: ${g.title} — Free!`,
    makeDesc: (g, cat) =>
      `Don't miss out! ${g.title} is trending in the ${cat} category. Jump in instantly — free to play, no sign-up, no download. Thousands of players are already hooked. Your next favourite game is waiting at FreeGaming.ca`,
  },
  {
    id: 'challenge',
    label: 'Challenge',
    makeTitle: (g) => `${g.title} — Prove Your Skills`,
    makeDesc: (g, cat) =>
      `Only the best players master ${g.title}. This ${cat} game will push your reaction time and strategy to the limit. Are you up for the challenge? Play free online at FreeGaming.ca — no download required.`,
  },
  {
    id: 'trending',
    label: 'Trending',
    makeTitle: (g) => `${g.title} is Taking Over 🔥`,
    makeDesc: (g, cat) =>
      `Everyone is talking about ${g.title}! The hottest ${cat} game online right now — play free instantly on any device. Join thousands of gamers having a blast at FreeGaming.ca`,
  },
  {
    id: 'free',
    label: 'Free Play',
    makeTitle: (g) => `${g.title} — 100% Free Online`,
    makeDesc: (g, cat) =>
      `Play ${g.title} completely free — no download, no registration, no ads. Pure ${cat} fun straight in your browser. FreeGaming.ca brings you the best free online games updated daily.`,
  },
  {
    id: 'bold',
    label: 'Bold Claim',
    makeTitle: (g, cat) => `The Best Free ${cat} Game — ${g.title}`,
    makeDesc: (g, cat) =>
      `${g.title} is hands-down one of the best free ${cat} games you can play right now. No download, no cost, just non-stop fun. Start playing instantly at FreeGaming.ca`,
  },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function exportCSV(pins: PinRow[]) {
  const headers = ['Title', 'Description', 'Media URL', 'Destination Link', 'Alt Text', 'Keywords', 'Board']
  const rows = pins.map(p => [
    `"${p.title.replace(/"/g, '""')}"`,
    `"${p.description.replace(/"/g, '""')}"`,
    `"${p.mediaUrl}"`,
    `"${p.link}"`,
    `"${p.altText.replace(/"/g, '""')}"`,
    `"${p.keywords}"`,
    `"${p.board}"`,
  ])
  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `freegaming-pinterest-pins-${Date.now()}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

interface PinRow {
  gameId: number
  title: string
  description: string
  mediaUrl: string
  link: string
  altText: string
  keywords: string
  board: string
}

function buildPin(game: Game, catName: string, style: CopyStyle): PinRow {
  const cat = catName || 'Online'
  return {
    gameId: game.id,
    title: style.makeTitle(game, cat).slice(0, 100),
    description: style.makeDesc(game, cat).slice(0, 500),
    mediaUrl: game.thumbnail,
    link: `${SITE_URL}/games/${game.slug}`,
    altText: `Play ${game.title} free online`,
    keywords: (game.tags ?? []).slice(0, 10).join(', '),
    board: `Free ${cat} Games`,
  }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TemplateCard({ t, selected, onSelect }: { t: PinTemplate; selected: boolean; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      style={{
        position: 'relative',
        border: selected ? `2px solid ${t.accent}` : '2px solid var(--line-visible)',
        borderRadius: '10px',
        overflow: 'hidden',
        cursor: 'pointer',
        background: 'none',
        padding: 0,
        transition: 'border-color 0.15s',
      }}
    >
      <div style={{ height: '130px', background: t.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '12px' }}>
        <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', color: t.accent, letterSpacing: '0.08em', textAlign: 'center' }}>FREEGAMING.CA</div>
        <div style={{ width: '40px', height: '3px', background: t.accent, borderRadius: '2px' }} />
        <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '10px', color: t.text, textAlign: 'center', lineHeight: 1.3 }}>Game Title Here</div>
      </div>
      <div style={{ padding: '8px 10px', backgroundColor: 'var(--bg-elevated)' }}>
        <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)', fontFamily: 'Barlow Condensed, sans-serif', textTransform: 'uppercase' }}>{t.name}</div>
        <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginTop: '2px' }}>{t.sub}</div>
      </div>
      {selected && (
        <div style={{ position: 'absolute', top: '8px', right: '8px', width: '20px', height: '20px', borderRadius: '50%', backgroundColor: t.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Check size={12} color={t.bg.includes('#f8') ? '#000' : '#000'} strokeWidth={3} />
        </div>
      )}
    </button>
  )
}

function PinPreviewCard({ pin, template }: { pin: PinRow; template: PinTemplate }) {
  return (
    <div style={{ borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--line-visible)', backgroundColor: 'var(--bg-elevated)' }}>
      <div style={{ height: '180px', background: template.bg, position: 'relative', overflow: 'hidden' }}>
        {pin.mediaUrl ? (
          <img src={pin.mediaUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ImageIcon size={32} style={{ color: template.accent, opacity: 0.5 }} />
          </div>
        )}
        <div style={{ position: 'absolute', inset: 0, background: template.bg, opacity: 0.6 }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '14px' }}>
          <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: template.accent, letterSpacing: '0.1em', marginBottom: '4px' }}>FREEGAMING.CA</div>
          <div style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: '15px', fontWeight: 800, textTransform: 'uppercase', color: template.text, lineHeight: 1.2 }}>{pin.title}</div>
        </div>
      </div>
      <div style={{ padding: '10px 12px' }}>
        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 8px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {pin.description}
        </p>
        <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>Board: <span style={{ color: template.accent }}>{pin.board}</span></div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function PinterestPinsPage() {
  const [password, setPassword]   = useState('')
  const [authed, setAuthed]       = useState(false)
  const [wrongPw, setWrongPw]     = useState(false)

  const [games, setGames]         = useState<Game[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading]     = useState(true)

  const [step, setStep]           = useState<1 | 2 | 3>(1)
  const [selected, setSelected]   = useState<Set<number>>(new Set())
  const [templateId, setTemplateId] = useState('neon')
  const [copyStyleId, setCopyStyleId] = useState('bold')

  // Filters
  const [search, setSearch]         = useState('')
  const [catFilter, setCatFilter]   = useState('')
  const [statusFilter, setStatusFilter] = useState('')  // 'hot' | 'new' | 'featured' | ''

  const handleAuth = () => {
    if (isAdminPassword(password)) { setAuthed(true); setWrongPw(false) }
    else setWrongPw(true)
  }

  useEffect(() => {
    if (!authed) return
    const load = async () => {
      setLoading(true)
      const [gRes, cRes] = await Promise.all([
        supabase.from('games').select('id,title,slug,thumbnail,tags,source,category_id,is_hot,is_new,is_featured,is_active').eq('is_active', true).order('title').limit(500),
        supabase.from('categories').select('*').order('name'),
      ])
      setGames((gRes.data ?? []) as Game[])
      setCategories((cRes.data ?? []) as Category[])
      setLoading(false)
    }
    load()
  }, [authed])

  const catMap = useMemo<Record<number, string>>(() =>
    Object.fromEntries(categories.map(c => [c.id, c.name])), [categories])

  const filteredGames = useMemo(() => {
    return games.filter(g => {
      if (search && !g.title.toLowerCase().includes(search.toLowerCase())) return false
      if (catFilter && g.category_id !== Number(catFilter)) return false
      if (statusFilter === 'hot' && !g.is_hot) return false
      if (statusFilter === 'new' && !g.is_new) return false
      if (statusFilter === 'featured' && !g.is_featured) return false
      return true
    })
  }, [games, search, catFilter, statusFilter])

  const template = TEMPLATES.find(t => t.id === templateId) ?? TEMPLATES[0]
  const copyStyle = COPY_STYLES.find(s => s.id === copyStyleId) ?? COPY_STYLES[0]

  const generatedPins = useMemo<PinRow[]>(() =>
    filteredGames
      .filter(g => selected.has(g.id))
      .map(g => buildPin(g, catMap[g.category_id] ?? '', copyStyle)),
    [filteredGames, selected, catMap, copyStyle])

  const toggleGame = (id: number) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const selectAll = () => setSelected(new Set(filteredGames.map(g => g.id)))
  const clearAll  = () => setSelected(new Set())

  const selectedCount = selected.size

  // ── Auth gate ───────────────────────────────────────────────────────────────

  if (!authed) {
    return (
      <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem', backgroundColor: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--line-visible)' }}>
        <Helmet>
          <title>Pinterest Pins | FreeGaming.ca</title>
          <meta name="robots" content="noindex, nofollow" />
          <meta name="description" content="FreeGaming.ca Pinterest pin generator." />
        </Helmet>
        <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: '1.75rem', textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '1.5rem', textAlign: 'center' }}>Admin Access</h1>
        <input
          type="password"
          placeholder="Admin password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAuth()}
          style={{ width: '100%', padding: '12px', background: 'var(--bg-void)', border: `1px solid ${wrongPw ? 'var(--state-hot)' : 'var(--line-visible)'}`, borderRadius: '8px', color: 'var(--text-primary)', fontSize: '1rem', marginBottom: '0.75rem', boxSizing: 'border-box', fontFamily: 'Space Grotesk, sans-serif' }}
        />
        {!ADMIN_PASSWORD && <p style={{ color: 'var(--state-hot)', fontSize: '0.8125rem', marginBottom: '0.75rem' }}>Admin password not configured. Set VITE_ADMIN_PASSWORD in your environment.</p>}
        {wrongPw && ADMIN_PASSWORD && <p style={{ color: 'var(--state-hot)', fontSize: '0.8125rem', marginBottom: '0.75rem' }}>Incorrect password.</p>}
        <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleAuth}>Enter Dashboard</button>
      </div>
    )
  }

  // ── Step labels ─────────────────────────────────────────────────────────────

  const steps = [
    { n: 1 as const, label: `1. Select Games (${selectedCount})` },
    { n: 2 as const, label: `2. Preview Pins (${generatedPins.length})` },
    { n: 3 as const, label: '3. Export CSV' },
  ]

  return (
    <>
      <Helmet>
        <title>Pinterest Pin Generator | FreeGaming.ca</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="description" content="FreeGaming.ca Pinterest pin generator." />
      </Helmet>

      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: '2rem', textTransform: 'uppercase', color: 'var(--text-primary)', margin: '0 0 4px' }}>
          Pinterest Pin Generator
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>
          Select games, choose a template &amp; style, then export ready-to-upload Pinterest pins.
        </p>
      </div>

      {/* Step nav */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {steps.map(s => (
          <button
            key={s.n}
            onClick={() => setStep(s.n)}
            style={{
              padding: '8px 18px', borderRadius: '8px', border: 'none', cursor: 'pointer',
              fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.9375rem', textTransform: 'uppercase',
              background: step === s.n ? 'var(--ember)' : 'var(--bg-elevated)',
              color: step === s.n ? '#000' : 'var(--text-secondary)',
              transition: 'background 0.15s, color 0.15s',
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* ── STEP 1 ── */}
      {step === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Filters */}
          <Section title="Filters">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
              <div style={{ position: 'relative' }}>
                <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', pointerEvents: 'none' }} />
                <input
                  placeholder="Search games…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  style={inputStyle}
                />
              </div>

              <select value={catFilter} onChange={e => setCatFilter(e.target.value)} style={selectStyle}>
                <option value="">All Categories</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>

              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={selectStyle}>
                <option value="">All Games</option>
                <option value="hot">Hot Games</option>
                <option value="new">New Games</option>
                <option value="featured">Featured</option>
              </select>
            </div>
          </Section>

          {/* Templates */}
          <Section title="Pin Template">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px' }}>
              {TEMPLATES.map(t => (
                <TemplateCard key={t.id} t={t} selected={templateId === t.id} onSelect={() => setTemplateId(t.id)} />
              ))}
            </div>
          </Section>

          {/* Copywriting */}
          <Section title="Copywriting Style">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {COPY_STYLES.map(s => (
                <button
                  key={s.id}
                  onClick={() => setCopyStyleId(s.id)}
                  style={{
                    padding: '8px 16px', borderRadius: '8px',
                    border: `1px solid ${copyStyleId === s.id ? 'var(--ember)' : 'var(--line-visible)'}`,
                    background: copyStyleId === s.id ? 'var(--ember)' : 'var(--bg-elevated)',
                    color: copyStyleId === s.id ? '#000' : 'var(--text-secondary)',
                    fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700,
                    fontSize: '0.9375rem', textTransform: 'uppercase', cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </Section>

          {/* Game list */}
          <Section title={`Games (${filteredGames.length})`} action={
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={selectAll} style={smallBtnStyle}>Select All</button>
              <button onClick={clearAll} style={{ ...smallBtnStyle, color: 'var(--state-hot)', borderColor: 'var(--state-hot)' }}>Clear</button>
              <button
                onClick={() => setStep(2)}
                disabled={selectedCount === 0}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '7px 16px', borderRadius: '7px', border: 'none',
                  background: selectedCount > 0 ? 'var(--ember)' : 'var(--bg-elevated)',
                  color: selectedCount > 0 ? '#000' : 'var(--text-tertiary)',
                  fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700,
                  fontSize: '0.9375rem', textTransform: 'uppercase', cursor: selectedCount > 0 ? 'pointer' : 'not-allowed',
                  transition: 'all 0.15s',
                }}
              >
                Generate {selectedCount} Pins <ChevronRight size={14} />
              </button>
            </div>
          }>
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton" style={{ height: '56px', borderRadius: '8px' }} />)}
              </div>
            ) : (
              <div style={{ maxHeight: '500px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {filteredGames.map(g => {
                  const isSelected = selected.has(g.id)
                  return (
                    <label
                      key={g.id}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        padding: '10px 12px', borderRadius: '8px', cursor: 'pointer',
                        backgroundColor: isSelected ? 'rgba(255,140,0,0.07)' : 'transparent',
                        border: `1px solid ${isSelected ? 'rgba(255,140,0,0.25)' : 'transparent'}`,
                        transition: 'all 0.1s',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleGame(g.id)}
                        style={{ width: '16px', height: '16px', accentColor: 'var(--ember)', cursor: 'pointer', flexShrink: 0 }}
                      />
                      <img
                        src={g.thumbnail}
                        alt=""
                        style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover', flexShrink: 0 }}
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {g.title}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '1px' }}>
                          {catMap[g.category_id] ?? 'Uncategorized'}
                          {g.is_hot && <span style={{ marginLeft: '6px', color: 'var(--state-hot)', fontWeight: 600 }}>HOT</span>}
                          {g.is_new && <span style={{ marginLeft: '6px', color: 'var(--neon-lime)', fontWeight: 600 }}>NEW</span>}
                        </div>
                      </div>
                    </label>
                  )
                })}
                {filteredGames.length === 0 && (
                  <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>No games match the current filters.</div>
                )}
              </div>
            )}
          </Section>
        </div>
      )}

      {/* ── STEP 2 ── */}
      {step === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1.25rem', textTransform: 'uppercase', color: 'var(--text-primary)', margin: 0 }}>
                {generatedPins.length} Pin{generatedPins.length !== 1 ? 's' : ''} Generated
              </h2>
              <p style={{ color: 'var(--text-tertiary)', fontSize: '0.8125rem', margin: '4px 0 0' }}>
                Template: <span style={{ color: 'var(--text-secondary)' }}>{template.name}</span> &nbsp;·&nbsp;
                Style: <span style={{ color: 'var(--text-secondary)' }}>{copyStyle.label}</span>
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => setStep(1)} style={smallBtnStyle}>Back</button>
              <button
                onClick={() => setStep(3)}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 18px', borderRadius: '8px', border: 'none', background: 'var(--ember)', color: '#000', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.9375rem', textTransform: 'uppercase', cursor: 'pointer' }}
              >
                Export CSV <ChevronRight size={14} />
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
            {generatedPins.map(pin => (
              <PinPreviewCard key={pin.gameId} pin={pin} template={template} />
            ))}
          </div>

          {generatedPins.length === 0 && (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-tertiary)', backgroundColor: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--line-subtle)' }}>
              No games selected. Go back and select some games first.
            </div>
          )}
        </div>
      )}

      {/* ── STEP 3 ── */}
      {step === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Section title="Export Summary">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              {[
                { label: 'Total Pins', value: generatedPins.length.toString(), color: 'var(--ember)' },
                { label: 'Template', value: template.name, color: 'var(--ice)' },
                { label: 'Style', value: copyStyle.label, color: 'var(--neon-lime)' },
                { label: 'Unique Boards', value: [...new Set(generatedPins.map(p => p.board))].length.toString(), color: 'var(--text-primary)' },
              ].map(s => (
                <div key={s.label} style={{ backgroundColor: 'var(--bg-elevated)', borderRadius: '10px', padding: '1rem', border: '1px solid var(--line-visible)' }}>
                  <div style={{ fontFamily: 'Orbitron, monospace', fontSize: '1.25rem', fontWeight: 700, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ backgroundColor: 'var(--bg-elevated)', borderRadius: '10px', padding: '1.25rem', border: '1px solid var(--line-visible)', marginBottom: '1.5rem' }}>
              <h3 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>CSV Columns Included</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {['Title', 'Description', 'Media URL', 'Destination Link', 'Alt Text', 'Keywords', 'Board'].map(col => (
                  <span key={col} style={{ padding: '4px 10px', borderRadius: '5px', backgroundColor: 'var(--bg-surface)', color: 'var(--text-secondary)', fontSize: '0.8125rem', border: '1px solid var(--line-visible)' }}>
                    {col}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button onClick={() => setStep(2)} style={smallBtnStyle}>Back to Preview</button>
              <button
                onClick={() => exportCSV(generatedPins)}
                disabled={generatedPins.length === 0}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '11px 24px', borderRadius: '8px', border: 'none',
                  background: generatedPins.length > 0 ? 'var(--ember)' : 'var(--bg-elevated)',
                  color: generatedPins.length > 0 ? '#000' : 'var(--text-tertiary)',
                  fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700,
                  fontSize: '1rem', textTransform: 'uppercase', cursor: generatedPins.length > 0 ? 'pointer' : 'not-allowed',
                  transition: 'all 0.15s',
                }}
              >
                <Download size={16} />
                Download {generatedPins.length} Pins CSV
              </button>
            </div>
          </Section>

          {/* Preview table */}
          <Section title="Pin Data Preview">
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem', fontFamily: 'Space Grotesk, sans-serif' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--line-visible)' }}>
                    {['Thumbnail', 'Title', 'Description', 'Board'].map(h => (
                      <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--text-tertiary)', fontWeight: 600, fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'Orbitron, monospace', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {generatedPins.map(pin => (
                    <tr key={pin.gameId} style={{ borderBottom: '1px solid var(--line-subtle)' }}>
                      <td style={{ padding: '8px 12px' }}>
                        <img src={pin.mediaUrl} alt="" style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '5px' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                      </td>
                      <td style={{ padding: '8px 12px', color: 'var(--text-primary)', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{pin.title}</td>
                      <td style={{ padding: '8px 12px', color: 'var(--text-secondary)', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{pin.description}</td>
                      <td style={{ padding: '8px 12px', color: 'var(--ember)', whiteSpace: 'nowrap' }}>{pin.board}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>
        </div>
      )}
    </>
  )
}

// ─── Shared style helpers ─────────────────────────────────────────────────────

function Section({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--line-subtle)', borderRadius: '12px', padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', gap: '12px', flexWrap: 'wrap' }}>
        <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1.1rem', textTransform: 'uppercase', color: 'var(--ember)', margin: 0, letterSpacing: '0.05em' }}>
          {title}
        </h2>
        {action}
      </div>
      {children}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '9px 10px 9px 32px',
  background: 'var(--bg-void)',
  border: '1px solid var(--line-visible)',
  borderRadius: '7px',
  color: 'var(--text-primary)',
  fontSize: '0.875rem',
  fontFamily: 'Space Grotesk, sans-serif',
  outline: 'none',
  boxSizing: 'border-box',
}

const selectStyle: React.CSSProperties = {
  width: '100%',
  padding: '9px 10px',
  background: 'var(--bg-void)',
  border: '1px solid var(--line-visible)',
  borderRadius: '7px',
  color: 'var(--text-primary)',
  fontSize: '0.875rem',
  fontFamily: 'Space Grotesk, sans-serif',
  outline: 'none',
  cursor: 'pointer',
}

const smallBtnStyle: React.CSSProperties = {
  padding: '7px 14px',
  borderRadius: '7px',
  border: '1px solid var(--line-visible)',
  background: 'var(--bg-elevated)',
  color: 'var(--text-secondary)',
  fontFamily: 'Barlow Condensed, sans-serif',
  fontWeight: 700,
  fontSize: '0.9375rem',
  textTransform: 'uppercase',
  cursor: 'pointer',
}

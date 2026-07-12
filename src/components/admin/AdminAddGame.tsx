import { useState } from 'react'
import { Plus, CheckCircle, ExternalLink } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import type { Category } from '../../lib/types'

interface Props {
  categories: Category[]
  onAdded?: () => void
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function Label({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontFamily: 'Orbitron, monospace', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>{children}</div>
}

function FieldInput({ value, onChange, placeholder, type }: { value: string | number; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <input
      type={type || 'text'}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-void)', border: '1px solid var(--line-visible)', borderRadius: '8px', color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.875rem', boxSizing: 'border-box', transition: 'border-color 0.15s', outline: 'none' }}
      onFocus={e => (e.target.style.borderColor = 'var(--neon-lime)')}
      onBlur={e => (e.target.style.borderColor = 'var(--line-visible)')}
    />
  )
}

const EMPTY_FORM = {
  title: '',
  slug: '',
  description: '',
  short_description: '',
  iframe_url: '',
  thumbnail: '',
  category_id: 0,
  tags: '',
  width: 800,
  height: 600,
  is_new: true,
  is_hot: false,
  is_featured: false,
  is_active: true,
}

export default function AdminAddGame({ categories, onAdded }: Props) {
  const [form, setForm] = useState({ ...EMPTY_FORM, category_id: categories[0]?.id ?? 0 })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [saved, setSaved] = useState('')
  const [slugManual, setSlugManual] = useState(false)

  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }))

  const handleTitle = (v: string) => {
    set('title', v)
    if (!slugManual) set('slug', slugify(v))
  }

  const handleSlug = (v: string) => {
    setSlugManual(true)
    set('slug', slugify(v))
  }

  const validate = () => {
    if (!form.title.trim()) return 'Title is required.'
    if (!form.iframe_url.trim()) return 'Iframe URL is required.'
    if (!form.slug.trim()) return 'Slug is required.'
    if (!form.category_id) return 'Category is required.'
    try { new URL(form.iframe_url) } catch { return 'Iframe URL must be a valid URL.' }
    return ''
  }

  const save = async () => {
    const err = validate()
    if (err) { setError(err); return }
    setSaving(true); setError(''); setSaved('')

    const slug = form.slug.trim()
    const { error: dbErr } = await supabase.from('games').insert([{
      title: form.title.trim(),
      slug,
      description: form.description.trim(),
      short_description: form.short_description.trim().slice(0, 165),
      iframe_url: form.iframe_url.trim(),
      thumbnail: form.thumbnail.trim(),
      category_id: Number(form.category_id),
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      width: Number(form.width) || 800,
      height: Number(form.height) || 600,
      is_new: form.is_new,
      is_hot: form.is_hot,
      is_featured: form.is_featured,
      is_active: form.is_active,
      source: 'MANUAL' as const,
      source_id: `manual-${slug}-${Date.now()}`,
      views: 0,
    }] as never[])

    setSaving(false)
    if (dbErr) { setError(dbErr.message); return }
    setSaved(`/games/${slug}`)
    setForm({ ...EMPTY_FORM, category_id: categories[0]?.id ?? 0 })
    setSlugManual(false)
    onAdded?.()
  }

  return (
    <div style={{ maxWidth: '760px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        {/* Title */}
        <div style={{ gridColumn: '1/-1' }}>
          <Label>Title <span style={{ color: 'var(--state-hot)' }}>*</span></Label>
          <FieldInput value={form.title} onChange={handleTitle} placeholder="My Awesome Game" />
        </div>

        {/* Slug */}
        <div style={{ gridColumn: '1/-1' }}>
          <Label>Slug <span style={{ color: 'var(--state-hot)' }}>*</span> <span style={{ color: 'var(--text-tertiary)', fontWeight: 400, textTransform: 'none', fontSize: '0.7rem' }}>— auto-generated, edit to override</span></Label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)', fontSize: '0.875rem', fontFamily: 'Space Grotesk, sans-serif', pointerEvents: 'none' }}>freegaming.ca/games/</span>
            <input
              type="text"
              value={form.slug}
              onChange={e => handleSlug(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', paddingLeft: '174px', background: 'var(--bg-void)', border: '1px solid var(--line-visible)', borderRadius: '8px', color: 'var(--neon-lime)', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.875rem', boxSizing: 'border-box' }}
            />
          </div>
        </div>

        {/* Iframe URL */}
        <div style={{ gridColumn: '1/-1' }}>
          <Label>Iframe / Embed URL <span style={{ color: 'var(--state-hot)' }}>*</span></Label>
          <FieldInput value={form.iframe_url} onChange={v => set('iframe_url', v)} placeholder="https://games.example.com/game/index.html" />
        </div>

        {/* Thumbnail */}
        <div style={{ gridColumn: '1/-1' }}>
          <Label>Thumbnail URL</Label>
          <FieldInput value={form.thumbnail} onChange={v => set('thumbnail', v)} placeholder="https://example.com/thumb.jpg" />
          {form.thumbnail && (
            <div style={{ marginTop: '8px' }}>
              <img src={form.thumbnail} alt="preview" style={{ height: '80px', borderRadius: '6px', objectFit: 'cover' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
            </div>
          )}
        </div>

        {/* Short description */}
        <div style={{ gridColumn: '1/-1' }}>
          <Label>Short Description <span style={{ color: 'var(--text-tertiary)', fontWeight: 400 }}>({form.short_description.length}/165 chars — shown in cards)</span></Label>
          <FieldInput value={form.short_description} onChange={v => set('short_description', v.slice(0, 165))} placeholder="A quick, punchy description…" />
        </div>

        {/* Long description */}
        <div style={{ gridColumn: '1/-1' }}>
          <Label>Full Description <span style={{ color: 'var(--text-tertiary)', fontWeight: 400 }}>(used for SEO)</span></Label>
          <textarea
            value={form.description}
            onChange={e => set('description', e.target.value)}
            rows={5}
            placeholder="Detailed game description for SEO and the game page…"
            style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-void)', border: '1px solid var(--line-visible)', borderRadius: '8px', color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.875rem', resize: 'vertical', boxSizing: 'border-box', outline: 'none' }}
            onFocus={e => (e.target.style.borderColor = 'var(--neon-lime)')}
            onBlur={e => (e.target.style.borderColor = 'var(--line-visible)')}
          />
        </div>

        {/* Category */}
        <div>
          <Label>Category <span style={{ color: 'var(--state-hot)' }}>*</span></Label>
          <select
            value={form.category_id}
            onChange={e => set('category_id', Number(e.target.value))}
            style={{ width: '100%', padding: '10px 12px', background: 'var(--bg-void)', border: '1px solid var(--line-visible)', borderRadius: '8px', color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.875rem' }}
          >
            <option value={0} disabled>Select category…</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        {/* Tags */}
        <div>
          <Label>Tags <span style={{ color: 'var(--text-tertiary)', fontWeight: 400 }}>(comma-separated)</span></Label>
          <FieldInput value={form.tags} onChange={v => set('tags', v)} placeholder="action, multiplayer, fun" />
        </div>

        {/* Width / Height */}
        <div>
          <Label>Iframe Width (px)</Label>
          <FieldInput type="number" value={form.width} onChange={v => set('width', v)} />
        </div>
        <div>
          <Label>Iframe Height (px)</Label>
          <FieldInput type="number" value={form.height} onChange={v => set('height', v)} />
        </div>

        {/* Flags */}
        <div style={{ gridColumn: '1/-1' }}>
          <Label>Flags</Label>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', padding: '1rem', background: 'var(--bg-elevated)', borderRadius: '8px', border: '1px solid var(--line-subtle)' }}>
            {[
              { key: 'is_active', label: 'Active (visible on site)', color: 'var(--neon-lime)' },
              { key: 'is_new', label: 'New badge', color: 'var(--ice)' },
              { key: 'is_hot', label: 'Hot badge', color: 'var(--state-hot)' },
              { key: 'is_featured', label: 'Featured badge', color: 'var(--ember)' },
            ].map(({ key, label, color }) => (
              <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', userSelect: 'none' }}>
                <input
                  type="checkbox"
                  checked={form[key as keyof typeof form] as boolean}
                  onChange={e => set(key, e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: color, cursor: 'pointer' }}
                />
                <span style={{ fontSize: '0.875rem', color, fontWeight: 600, fontFamily: 'Space Grotesk, sans-serif' }}>{label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {error && (
        <div style={{ marginTop: '1.25rem', padding: '12px 16px', background: 'rgba(255,61,87,0.08)', border: '1px solid var(--state-hot)', borderRadius: '8px', color: 'var(--state-hot)', fontSize: '0.875rem' }}>
          {error}
        </div>
      )}

      {saved && (
        <div style={{ marginTop: '1.25rem', padding: '12px 16px', background: 'rgba(57,255,20,0.07)', border: '1px solid var(--neon-lime)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckCircle size={16} style={{ color: 'var(--neon-lime)', flexShrink: 0 }} />
            <span style={{ color: 'var(--neon-lime)', fontWeight: 600, fontSize: '0.9375rem' }}>Game added successfully!</span>
          </div>
          <a href={saved} target="_blank" rel="noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--neon-lime)', fontSize: '0.875rem', textDecoration: 'none', fontFamily: 'Space Grotesk, sans-serif' }}>
            <ExternalLink size={13} /> View game page
          </a>
        </div>
      )}

      <div style={{ marginTop: '1.5rem', display: 'flex', gap: '10px' }}>
        <button
          onClick={save}
          disabled={saving}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 28px', background: 'var(--neon-lime)', border: 'none', borderRadius: '8px', color: 'var(--bg-void)', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', transition: 'opacity 0.2s' }}
        >
          <Plus size={16} />{saving ? 'Adding Game…' : 'Add Game'}
        </button>
        <button
          onClick={() => { setForm({ ...EMPTY_FORM, category_id: categories[0]?.id ?? 0 }); setError(''); setSaved(''); setSlugManual(false) }}
          style={{ padding: '12px 20px', background: 'var(--bg-elevated)', border: '1px solid var(--line-visible)', borderRadius: '8px', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '1rem', textTransform: 'uppercase' }}
        >
          Clear
        </button>
      </div>
    </div>
  )
}

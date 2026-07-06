import { useEffect, useState, useRef } from 'react'
import { Search, CreditCard as Edit2, Trash2, Eye, EyeOff, Flame, Star, Sparkles, ChevronLeft, ChevronRight, X, Save, ExternalLink } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import type { Game, Category } from '../../lib/types'

interface Props {
  categories: Category[]
}

const PAGE_SIZE = 25

const SOURCES = ['ALL', 'GAMEMONETIZE', 'GAMEDISTRIBUTION', 'HTML5GAMES', 'MANUAL'] as const

function FlagBtn({ active, color, icon, title, onClick }: { active: boolean; color: string; icon: React.ReactNode; title: string; onClick: () => void }) {
  return (
    <button
      title={title}
      onClick={onClick}
      style={{
        background: 'none', border: 'none', cursor: 'pointer', padding: '4px',
        color: active ? color : 'var(--line-visible)', transition: 'color 0.15s',
        display: 'flex', alignItems: 'center',
      }}
    >
      {icon}
    </button>
  )
}

function EditModal({ game, categories, onClose, onSaved }: {
  game: Game; categories: Category[]; onClose: () => void; onSaved: () => void
}) {
  const [form, setForm] = useState({
    title: game.title,
    slug: game.slug,
    description: game.description,
    short_description: game.short_description,
    thumbnail: game.thumbnail,
    iframe_url: game.iframe_url,
    category_id: game.category_id,
    tags: (game.tags ?? []).join(', '),
    width: game.width,
    height: game.height,
    is_new: game.is_new,
    is_hot: game.is_hot,
    is_featured: game.is_featured,
    is_active: game.is_active,
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }))

  const save = async () => {
    if (!form.title.trim() || !form.iframe_url.trim()) { setError('Title and Iframe URL are required.'); return }
    setSaving(true); setError('')
    const { error: err } = await supabase.from('games').update({
      title: form.title.trim(),
      slug: form.slug.trim(),
      description: form.description.trim(),
      short_description: form.short_description.trim().slice(0, 165),
      thumbnail: form.thumbnail.trim(),
      iframe_url: form.iframe_url.trim(),
      category_id: Number(form.category_id),
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      width: Number(form.width) || 800,
      height: Number(form.height) || 600,
      is_new: form.is_new,
      is_hot: form.is_hot,
      is_featured: form.is_featured,
      is_active: form.is_active,
    } as never).eq('id', game.id)
    setSaving(false)
    if (err) { setError(err.message); return }
    onSaved()
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }} onClick={onClose} />
      <div style={{ position: 'relative', width: '100%', maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto', background: 'var(--bg-surface)', border: '1px solid var(--line-visible)', borderRadius: '14px', padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h2 style={{ margin: 0, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: '1.5rem', textTransform: 'uppercase', color: 'var(--text-primary)' }}>Edit Game</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', padding: '4px' }}><X size={20} /></button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ gridColumn: '1/-1' }}>
            <Label>Title</Label>
            <Input value={form.title} onChange={v => set('title', v)} />
          </div>
          <div style={{ gridColumn: '1/-1' }}>
            <Label>Slug</Label>
            <Input value={form.slug} onChange={v => set('slug', v)} />
          </div>
          <div style={{ gridColumn: '1/-1' }}>
            <Label>Iframe URL</Label>
            <Input value={form.iframe_url} onChange={v => set('iframe_url', v)} placeholder="https://..." />
          </div>
          <div style={{ gridColumn: '1/-1' }}>
            <Label>Thumbnail URL</Label>
            <Input value={form.thumbnail} onChange={v => set('thumbnail', v)} placeholder="https://..." />
          </div>
          <div style={{ gridColumn: '1/-1' }}>
            <Label>Short Description <span style={{ color: 'var(--text-tertiary)', fontWeight: 400 }}>({form.short_description.length}/165)</span></Label>
            <Input value={form.short_description} onChange={v => set('short_description', v.slice(0, 165))} />
          </div>
          <div style={{ gridColumn: '1/-1' }}>
            <Label>Description</Label>
            <textarea
              value={form.description}
              onChange={e => set('description', e.target.value)}
              rows={4}
              style={{ width: '100%', padding: '10px', background: 'var(--bg-void)', border: '1px solid var(--line-visible)', borderRadius: '8px', color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.875rem', resize: 'vertical', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <Label>Category</Label>
            <select
              value={form.category_id}
              onChange={e => set('category_id', Number(e.target.value))}
              style={{ width: '100%', padding: '10px', background: 'var(--bg-void)', border: '1px solid var(--line-visible)', borderRadius: '8px', color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.875rem' }}
            >
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <Label>Tags <span style={{ color: 'var(--text-tertiary)', fontWeight: 400 }}>(comma-separated)</span></Label>
            <Input value={form.tags} onChange={v => set('tags', v)} placeholder="action, arcade, fun" />
          </div>
          <div>
            <Label>Width (px)</Label>
            <Input type="number" value={form.width} onChange={v => set('width', v)} />
          </div>
          <div>
            <Label>Height (px)</Label>
            <Input type="number" value={form.height} onChange={v => set('height', v)} />
          </div>
          <div style={{ gridColumn: '1/-1', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            {[
              { key: 'is_active', label: 'Active', color: 'var(--neon-lime)' },
              { key: 'is_hot', label: 'Hot', color: 'var(--state-hot)' },
              { key: 'is_featured', label: 'Featured', color: 'var(--ember)' },
              { key: 'is_new', label: 'New', color: 'var(--ice)' },
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

        {error && <p style={{ marginTop: '1rem', color: 'var(--state-hot)', fontSize: '0.875rem' }}>{error}</p>}

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
          <button onClick={onClose} style={{ padding: '10px 20px', background: 'var(--bg-elevated)', border: '1px solid var(--line-visible)', borderRadius: '8px', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.9375rem', textTransform: 'uppercase' }}>Cancel</button>
          <button
            onClick={save} disabled={saving}
            style={{ padding: '10px 24px', background: 'var(--neon-lime)', border: 'none', borderRadius: '8px', color: 'var(--bg-void)', cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1, fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.9375rem', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Save size={14} />{saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontFamily: 'Orbitron, monospace', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>{children}</div>
}

function Input({ value, onChange, placeholder, type }: { value: string | number; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <input
      type={type || 'text'}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{ width: '100%', padding: '10px', background: 'var(--bg-void)', border: '1px solid var(--line-visible)', borderRadius: '8px', color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.875rem', boxSizing: 'border-box' }}
    />
  )
}

export default function AdminGameManager({ categories }: Props) {
  const [games, setGames] = useState<Game[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [sourceFilter, setSourceFilter] = useState<string>('ALL')
  const [categoryFilter, setCategoryFilter] = useState<number>(0)
  const [flagFilter, setFlagFilter] = useState<string>('all')
  const [loading, setLoading] = useState(false)
  const [editGame, setEditGame] = useState<Game | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const searchTimer = useRef<ReturnType<typeof setTimeout>>()

  const load = async (p = page, q = search, src = sourceFilter, cat = categoryFilter, flag = flagFilter) => {
    setLoading(true)
    let query = supabase.from('games').select('*, categories(name)', { count: 'exact' })
    if (q) query = query.ilike('title', `%${q}%`)
    if (src !== 'ALL') query = query.eq('source', src)
    if (cat > 0) query = query.eq('category_id', cat)
    if (flag === 'active') query = query.eq('is_active', true)
    if (flag === 'inactive') query = query.eq('is_active', false)
    if (flag === 'hot') query = query.eq('is_hot', true)
    if (flag === 'featured') query = query.eq('is_featured', true)
    if (flag === 'new') query = query.eq('is_new', true)
    query = query.order('id', { ascending: false }).range(p * PAGE_SIZE, (p + 1) * PAGE_SIZE - 1)
    const { data, count } = await query
    setGames((data ?? []) as Game[])
    setTotal(count ?? 0)
    setLoading(false)
  }

  useEffect(() => { load(0, search, sourceFilter, categoryFilter, flagFilter) }, [])

  const handleSearch = (val: string) => {
    setSearchInput(val)
    clearTimeout(searchTimer.current)
    searchTimer.current = setTimeout(() => {
      setSearch(val); setPage(0)
      load(0, val, sourceFilter, categoryFilter, flagFilter)
    }, 350)
  }

  const applyFilter = (src: string, cat: number, flag: string) => {
    setSourceFilter(src); setCategoryFilter(cat); setFlagFilter(flag); setPage(0)
    load(0, search, src, cat, flag)
  }

  const goPage = (p: number) => {
    setPage(p); load(p, search, sourceFilter, categoryFilter, flagFilter)
  }

  const toggleFlag = async (game: Game, flag: 'is_active' | 'is_hot' | 'is_featured' | 'is_new') => {
    const newVal = !game[flag]
    setGames(gs => gs.map(g => g.id === game.id ? { ...g, [flag]: newVal } : g))
    await supabase.from('games').update({ [flag]: newVal } as never).eq('id', game.id)
  }

  const deleteGame = async (id: number) => {
    await supabase.from('games').delete().eq('id', id)
    setDeleteId(null)
    load(page, search, sourceFilter, categoryFilter, flagFilter)
  }

  const totalPages = Math.ceil(total / PAGE_SIZE)
  const sourceColor: Record<string, string> = {
    GAMEMONETIZE: 'var(--neon-lime)', GAMEDISTRIBUTION: 'var(--ice)', HTML5GAMES: 'var(--ember)', MANUAL: 'var(--state-hot)'
  }

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem', alignItems: 'flex-end' }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '220px' }}>
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
          <input
            value={searchInput}
            onChange={e => handleSearch(e.target.value)}
            placeholder="Search games…"
            style={{ width: '100%', paddingLeft: '36px', paddingRight: '12px', paddingTop: '9px', paddingBottom: '9px', background: 'var(--bg-void)', border: '1px solid var(--line-visible)', borderRadius: '8px', color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.875rem', boxSizing: 'border-box' }}
          />
        </div>
        <select value={sourceFilter} onChange={e => applyFilter(e.target.value, categoryFilter, flagFilter)}
          style={{ padding: '9px 12px', background: 'var(--bg-void)', border: '1px solid var(--line-visible)', borderRadius: '8px', color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.875rem' }}>
          {SOURCES.map(s => <option key={s} value={s}>{s === 'ALL' ? 'All Sources' : s}</option>)}
        </select>
        <select value={categoryFilter} onChange={e => applyFilter(sourceFilter, Number(e.target.value), flagFilter)}
          style={{ padding: '9px 12px', background: 'var(--bg-void)', border: '1px solid var(--line-visible)', borderRadius: '8px', color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.875rem' }}>
          <option value={0}>All Categories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={flagFilter} onChange={e => applyFilter(sourceFilter, categoryFilter, e.target.value)}
          style={{ padding: '9px 12px', background: 'var(--bg-void)', border: '1px solid var(--line-visible)', borderRadius: '8px', color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.875rem' }}>
          <option value="all">All Flags</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="hot">Hot</option>
          <option value="featured">Featured</option>
          <option value="new">New</option>
        </select>
        <div style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', alignSelf: 'center', whiteSpace: 'nowrap' }}>
          {total.toLocaleString('en-CA')} games
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto', borderRadius: '10px', border: '1px solid var(--line-subtle)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem', fontFamily: 'Space Grotesk, sans-serif', minWidth: '800px' }}>
          <thead>
            <tr style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--line-visible)' }}>
              {['Game', 'Category', 'Source', 'Views', 'Active', 'Hot', 'Feat.', 'New', 'Actions'].map(h => (
                <th key={h} style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--text-tertiary)', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'Orbitron, monospace', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--line-subtle)' }}>
                  {Array.from({ length: 9 }).map((_, j) => <td key={j} style={{ padding: '12px' }}><div className="skeleton" style={{ height: '16px', borderRadius: '4px', width: j === 0 ? '200px' : '60px' }} /></td>)}
                </tr>
              ))
            ) : games.length === 0 ? (
              <tr><td colSpan={9} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>No games found</td></tr>
            ) : games.map(game => (
              <tr key={game.id} style={{ borderBottom: '1px solid var(--line-subtle)', transition: 'background 0.1s' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-elevated)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <td style={{ padding: '10px 12px', maxWidth: '240px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={game.thumbnail} alt="" style={{ width: '48px', height: '36px', objectFit: 'cover', borderRadius: '4px', flexShrink: 0, background: 'var(--bg-elevated)' }} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{game.title}</span>
                  </div>
                </td>
                <td style={{ padding: '10px 12px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                  {(game as Game & { categories?: { name: string } }).categories?.name ?? '—'}
                </td>
                <td style={{ padding: '10px 12px' }}>
                  <span style={{ fontSize: '9px', fontFamily: 'Orbitron, monospace', padding: '2px 6px', borderRadius: '4px', background: 'var(--bg-elevated)', color: sourceColor[game.source] ?? 'var(--text-tertiary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    {game.source.replace('GAMEMONETIZE', 'GM').replace('GAMEDISTRIBUTION', 'GD').replace('HTML5GAMES', 'H5')}
                  </span>
                </td>
                <td style={{ padding: '10px 12px', color: 'var(--text-tertiary)', fontFamily: 'Orbitron, monospace', fontSize: '0.75rem' }}>
                  {game.views >= 1000 ? `${(game.views / 1000).toFixed(1)}k` : game.views}
                </td>
                <td style={{ padding: '6px 12px' }}>
                  <FlagBtn active={game.is_active} color="var(--neon-lime)" icon={game.is_active ? <Eye size={14} /> : <EyeOff size={14} />} title={game.is_active ? 'Active (click to hide)' : 'Hidden (click to show)'} onClick={() => toggleFlag(game, 'is_active')} />
                </td>
                <td style={{ padding: '6px 12px' }}>
                  <FlagBtn active={game.is_hot} color="var(--state-hot)" icon={<Flame size={14} />} title="Hot" onClick={() => toggleFlag(game, 'is_hot')} />
                </td>
                <td style={{ padding: '6px 12px' }}>
                  <FlagBtn active={game.is_featured} color="var(--ember)" icon={<Star size={14} />} title="Featured" onClick={() => toggleFlag(game, 'is_featured')} />
                </td>
                <td style={{ padding: '6px 12px' }}>
                  <FlagBtn active={game.is_new} color="var(--ice)" icon={<Sparkles size={14} />} title="New" onClick={() => toggleFlag(game, 'is_new')} />
                </td>
                <td style={{ padding: '6px 12px' }}>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <a href={`/games/${game.slug}`} target="_blank" rel="noreferrer" title="View page" style={{ color: 'var(--text-tertiary)', display: 'flex', padding: '4px', transition: 'color 0.15s' }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-tertiary)')}>
                      <ExternalLink size={14} />
                    </a>
                    <button title="Edit" onClick={() => setEditGame(game)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', padding: '4px', display: 'flex', transition: 'color 0.15s' }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'var(--ice)')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-tertiary)')}>
                      <Edit2 size={14} />
                    </button>
                    <button title="Delete" onClick={() => setDeleteId(game.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', padding: '4px', display: 'flex', transition: 'color 0.15s' }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'var(--state-hot)')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-tertiary)')}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem' }}>
          <button onClick={() => goPage(page - 1)} disabled={page === 0}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: 'var(--bg-elevated)', border: '1px solid var(--line-visible)', borderRadius: '7px', color: page === 0 ? 'var(--line-visible)' : 'var(--text-secondary)', cursor: page === 0 ? 'not-allowed' : 'pointer', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.875rem' }}>
            <ChevronLeft size={14} /> Previous
          </button>
          <span style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>
            Page {page + 1} of {totalPages}
          </span>
          <button onClick={() => goPage(page + 1)} disabled={page >= totalPages - 1}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: 'var(--bg-elevated)', border: '1px solid var(--line-visible)', borderRadius: '7px', color: page >= totalPages - 1 ? 'var(--line-visible)' : 'var(--text-secondary)', cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.875rem' }}>
            Next <ChevronRight size={14} />
          </button>
        </div>
      )}

      {/* Edit modal */}
      {editGame && (
        <EditModal
          game={editGame}
          categories={categories}
          onClose={() => setEditGame(null)}
          onSaved={() => { setEditGame(null); load(page, search, sourceFilter, categoryFilter, flagFilter) }}
        />
      )}

      {/* Delete confirm */}
      {deleteId !== null && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.75)' }} onClick={() => setDeleteId(null)} />
          <div style={{ position: 'relative', background: 'var(--bg-surface)', border: '1px solid var(--state-hot)', borderRadius: '14px', padding: '2rem', maxWidth: '400px', width: '100%', margin: '1rem' }}>
            <h3 style={{ margin: '0 0 0.75rem', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: '1.25rem', textTransform: 'uppercase', color: 'var(--state-hot)' }}>Delete Game?</h3>
            <p style={{ margin: '0 0 1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>This permanently removes the game from the database and cannot be undone.</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button onClick={() => setDeleteId(null)} style={{ padding: '9px 18px', background: 'var(--bg-elevated)', border: '1px solid var(--line-visible)', borderRadius: '8px', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.9375rem', textTransform: 'uppercase' }}>Cancel</button>
              <button onClick={() => deleteGame(deleteId)} style={{ padding: '9px 18px', background: 'var(--state-hot)', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.9375rem', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

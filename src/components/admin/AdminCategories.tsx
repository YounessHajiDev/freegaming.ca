import { useState } from 'react'
import { Plus, CreditCard as Edit2, Check, X, Trash2, GripVertical } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import type { Category } from '../../lib/types'

interface Props {
  categories: Category[]
  onRefresh: () => void
}

const ICON_OPTIONS = [
  'puzzle', 'car', 'trophy', 'crosshair', 'layers', 'brain', 'gamepad-2',
  'map', 'users', 'lightbulb', 'zap', 'smile', 'globe', 'gamepad',
  'sword', 'target', 'dice', 'joystick', 'rocket', 'basketball',
]

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function InlineEdit({ cat, onSave, onCancel }: {
  cat: Partial<Category>
  onSave: (data: Partial<Category>) => void
  onCancel: () => void
}) {
  const [form, setForm] = useState({ name: cat.name ?? '', slug: cat.slug ?? '', icon: cat.icon ?? 'gamepad', description: cat.description ?? '', order_num: cat.order_num ?? 0 })
  const [slugManual, setSlugManual] = useState(!!cat.id)

  const setName = (v: string) => {
    setForm(f => ({ ...f, name: v, slug: slugManual ? f.slug : slugify(v) }))
  }

  return (
    <tr style={{ background: 'rgba(57,255,20,0.04)', borderBottom: '1px solid var(--line-subtle)' }}>
      <td style={{ padding: '10px 12px' }}>
        <input value={form.name} onChange={e => setName(e.target.value)} placeholder="Category Name"
          style={{ width: '100%', padding: '7px 10px', background: 'var(--bg-void)', border: '1px solid var(--neon-lime)', borderRadius: '6px', color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.875rem' }} />
      </td>
      <td style={{ padding: '10px 12px' }}>
        <input value={form.slug} onChange={e => { setSlugManual(true); setForm(f => ({ ...f, slug: slugify(e.target.value) })) }} placeholder="slug"
          style={{ width: '100%', padding: '7px 10px', background: 'var(--bg-void)', border: '1px solid var(--line-visible)', borderRadius: '6px', color: 'var(--neon-lime)', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.875rem' }} />
      </td>
      <td style={{ padding: '10px 12px' }}>
        <select value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}
          style={{ padding: '7px 10px', background: 'var(--bg-void)', border: '1px solid var(--line-visible)', borderRadius: '6px', color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.875rem' }}>
          {ICON_OPTIONS.map(i => <option key={i} value={i}>{i}</option>)}
        </select>
      </td>
      <td style={{ padding: '10px 12px' }}>
        <input type="number" value={form.order_num} onChange={e => setForm(f => ({ ...f, order_num: Number(e.target.value) }))}
          style={{ width: '70px', padding: '7px 10px', background: 'var(--bg-void)', border: '1px solid var(--line-visible)', borderRadius: '6px', color: 'var(--text-primary)', fontFamily: 'Orbitron, monospace', fontSize: '0.875rem', textAlign: 'center' }} />
      </td>
      <td style={{ padding: '10px 12px' }}>
        <input value={form.description ?? ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Optional description…"
          style={{ width: '100%', padding: '7px 10px', background: 'var(--bg-void)', border: '1px solid var(--line-visible)', borderRadius: '6px', color: 'var(--text-primary)', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.875rem' }} />
      </td>
      <td style={{ padding: '10px 12px' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button onClick={() => onSave(form)} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', background: 'var(--neon-lime)', border: 'none', borderRadius: '6px', color: 'var(--bg-void)', cursor: 'pointer', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.875rem', textTransform: 'uppercase' }}>
            <Check size={13} /> Save
          </button>
          <button onClick={onCancel} style={{ display: 'flex', padding: '6px', background: 'var(--bg-elevated)', border: '1px solid var(--line-visible)', borderRadius: '6px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <X size={13} />
          </button>
        </div>
      </td>
    </tr>
  )
}

export default function AdminCategories({ categories, onRefresh }: Props) {
  const [editingId, setEditingId] = useState<number | 'new' | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [error, setError] = useState('')

  const saveNew = async (data: Partial<Category>) => {
    setError('')
    if (!data.name?.trim() || !data.slug?.trim()) { setError('Name and slug are required.'); return }
    const { error: err } = await supabase.from('categories').insert([{
      name: data.name.trim(),
      slug: data.slug.trim(),
      icon: data.icon ?? 'gamepad',
      description: data.description?.trim() || null,
      order_num: data.order_num ?? 99,
    }] as never[])
    if (err) { setError(err.message); return }
    setEditingId(null)
    onRefresh()
  }

  const saveEdit = async (id: number, data: Partial<Category>) => {
    setError('')
    if (!data.name?.trim() || !data.slug?.trim()) { setError('Name and slug are required.'); return }
    const { error: err } = await supabase.from('categories').update({
      name: data.name.trim(),
      slug: data.slug.trim(),
      icon: data.icon ?? 'gamepad',
      description: data.description?.trim() || null,
      order_num: data.order_num ?? 0,
    } as never).eq('id', id)
    if (err) { setError(err.message); return }
    setEditingId(null)
    onRefresh()
  }

  const handleDelete = async (id: number) => {
    const { error: err } = await supabase.from('categories').delete().eq('id', id)
    if (err) { setError(err.message); return }
    setDeleteId(null)
    onRefresh()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <p style={{ margin: 0, color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>{categories.length} categories · Edit name, slug, icon, or sort order. Changes take effect immediately.</p>
        <button
          onClick={() => setEditingId('new')}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 18px', background: 'var(--neon-lime)', border: 'none', borderRadius: '8px', color: 'var(--bg-void)', cursor: 'pointer', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase' }}>
          <Plus size={14} /> Add Category
        </button>
      </div>

      {error && <div style={{ marginBottom: '1rem', padding: '10px 14px', background: 'rgba(255,61,87,0.08)', border: '1px solid var(--state-hot)', borderRadius: '8px', color: 'var(--state-hot)', fontSize: '0.875rem' }}>{error}</div>}

      <div style={{ overflowX: 'auto', borderRadius: '10px', border: '1px solid var(--line-subtle)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', fontFamily: 'Space Grotesk, sans-serif', minWidth: '700px' }}>
          <thead>
            <tr style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--line-visible)' }}>
              {['Name', 'Slug', 'Icon', 'Order', 'Description', 'Actions'].map(h => (
                <th key={h} style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--text-tertiary)', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'Orbitron, monospace', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {editingId === 'new' && (
              <InlineEdit
                cat={{ order_num: (Math.max(...categories.map(c => c.order_num)) + 1) || 15 }}
                onSave={saveNew}
                onCancel={() => setEditingId(null)}
              />
            )}
            {categories.sort((a, b) => a.order_num - b.order_num).map(cat => (
              editingId === cat.id ? (
                <InlineEdit key={cat.id} cat={cat} onSave={d => saveEdit(cat.id, d)} onCancel={() => setEditingId(null)} />
              ) : (
                <tr key={cat.id} style={{ borderBottom: '1px solid var(--line-subtle)', transition: 'background 0.1s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-elevated)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <td style={{ padding: '12px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <GripVertical size={14} style={{ color: 'var(--line-visible)', flexShrink: 0 }} />
                      <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{cat.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 12px' }}>
                    <span style={{ color: 'var(--neon-lime)', fontFamily: 'Space Grotesk, sans-serif', fontSize: '0.8125rem' }}>{cat.slug}</span>
                  </td>
                  <td style={{ padding: '12px 12px' }}>
                    <span style={{ fontFamily: 'Orbitron, monospace', fontSize: '0.75rem', color: 'var(--text-secondary)', background: 'var(--bg-elevated)', padding: '2px 8px', borderRadius: '4px' }}>{cat.icon}</span>
                  </td>
                  <td style={{ padding: '12px 12px' }}>
                    <span style={{ fontFamily: 'Orbitron, monospace', fontSize: '0.8125rem', color: 'var(--text-tertiary)' }}>{cat.order_num}</span>
                  </td>
                  <td style={{ padding: '12px 12px', color: 'var(--text-tertiary)', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {cat.description ?? <span style={{ color: 'var(--line-visible)' }}>—</span>}
                  </td>
                  <td style={{ padding: '12px 12px' }}>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => setEditingId(cat.id)} title="Edit"
                        style={{ display: 'flex', padding: '6px', background: 'none', border: '1px solid var(--line-visible)', borderRadius: '6px', color: 'var(--text-tertiary)', cursor: 'pointer', transition: 'color 0.15s, border-color 0.15s' }}
                        onMouseEnter={e => { e.currentTarget.style.color = 'var(--ice)'; e.currentTarget.style.borderColor = 'var(--ice)' }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-tertiary)'; e.currentTarget.style.borderColor = 'var(--line-visible)' }}>
                        <Edit2 size={13} />
                      </button>
                      <a href={`/category/${cat.slug}`} target="_blank" rel="noreferrer"
                        style={{ display: 'flex', padding: '6px', background: 'none', border: '1px solid var(--line-visible)', borderRadius: '6px', color: 'var(--text-tertiary)', transition: 'color 0.15s' }}
                        onMouseEnter={e => (e.currentTarget.style.color = 'var(--neon-lime)')}
                        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-tertiary)')}>
                        <GripVertical size={13} />
                      </a>
                      <button onClick={() => setDeleteId(cat.id)} title="Delete"
                        style={{ display: 'flex', padding: '6px', background: 'none', border: '1px solid var(--line-visible)', borderRadius: '6px', color: 'var(--text-tertiary)', cursor: 'pointer', transition: 'color 0.15s, border-color 0.15s' }}
                        onMouseEnter={e => { e.currentTarget.style.color = 'var(--state-hot)'; e.currentTarget.style.borderColor = 'var(--state-hot)' }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-tertiary)'; e.currentTarget.style.borderColor = 'var(--line-visible)' }}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      </div>

      {deleteId !== null && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.75)' }} onClick={() => setDeleteId(null)} />
          <div style={{ position: 'relative', background: 'var(--bg-surface)', border: '1px solid var(--state-hot)', borderRadius: '14px', padding: '2rem', maxWidth: '420px', width: '100%', margin: '1rem' }}>
            <h3 style={{ margin: '0 0 0.75rem', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: '1.25rem', textTransform: 'uppercase', color: 'var(--state-hot)' }}>Delete Category?</h3>
            <p style={{ margin: '0 0 0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>This will permanently delete the category. Any games assigned to it will need to be reassigned.</p>
            <p style={{ margin: '0 0 1.5rem', color: 'var(--state-hot)', fontSize: '0.8125rem' }}>Warning: Cannot delete a category that has games assigned to it.</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button onClick={() => setDeleteId(null)} style={{ padding: '9px 18px', background: 'var(--bg-elevated)', border: '1px solid var(--line-visible)', borderRadius: '8px', color: 'var(--text-secondary)', cursor: 'pointer', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.9375rem', textTransform: 'uppercase' }}>Cancel</button>
              <button onClick={() => handleDelete(deleteId)} style={{ padding: '9px 18px', background: 'var(--state-hot)', border: 'none', borderRadius: '8px', color: '#fff', cursor: 'pointer', fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 700, fontSize: '0.9375rem', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

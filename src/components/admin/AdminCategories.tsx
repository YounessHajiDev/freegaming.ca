import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Category } from '../../lib/types'

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [newCat, setNewCat] = useState({ name: '', slug: '', icon: '', description: '' })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('*').order('order_num')
    if (data) setCategories(data)
  }

  const addCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    const { error } = await supabase.from('categories').insert([{
      ...newCat,
      order_num: categories.length,
    }])

    if (!error) {
      setNewCat({ name: '', slug: '', icon: '', description: '' })
      fetchCategories()
    }
  }

  const deleteCategory = async (id: number) => {
    if (!confirm('Delete this category?')) return
    await supabase.from('categories').delete().eq('id', id)
    fetchCategories()
  }

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem' }}>Manage Categories</h2>

      <div style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--line-visible)',
        borderRadius: '0.5rem',
        padding: '2rem',
        marginBottom: '2rem',
        maxWidth: '600px',
      }}>
        <h3 style={{ marginBottom: '1rem' }}>Add New Category</h3>
        <form onSubmit={addCategory}>
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="Name"
              value={newCat.name}
              onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'var(--bg-surface)',
                border: '1px solid var(--line-visible)',
                borderRadius: '0.25rem',
                color: 'var(--text-primary)',
                marginBottom: '0.5rem',
              }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="Slug"
              value={newCat.slug}
              onChange={(e) => setNewCat({ ...newCat, slug: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'var(--bg-surface)',
                border: '1px solid var(--line-visible)',
                borderRadius: '0.25rem',
                color: 'var(--text-primary)',
                marginBottom: '0.5rem',
              }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="Icon"
              value={newCat.icon}
              onChange={(e) => setNewCat({ ...newCat, icon: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'var(--bg-surface)',
                border: '1px solid var(--line-visible)',
                borderRadius: '0.25rem',
                color: 'var(--text-primary)',
                marginBottom: '0.5rem',
              }}
            />
          </div>
          <textarea
            placeholder="Description"
            value={newCat.description}
            onChange={(e) => setNewCat({ ...newCat, description: e.target.value })}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: 'var(--bg-surface)',
              border: '1px solid var(--line-visible)',
              borderRadius: '0.25rem',
              color: 'var(--text-primary)',
              marginBottom: '1rem',
              fontFamily: 'inherit',
            }}
          />
          <button type="submit" className="btn-primary">
            Add Category
          </button>
        </form>
      </div>

      <h3 style={{ marginBottom: '1rem' }}>Existing Categories</h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '1rem',
      }}>
        {categories.map(cat => (
          <div
            key={cat.id}
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--line-visible)',
              borderRadius: '0.5rem',
              padding: '1rem',
            }}
          >
            <h4>{cat.icon} {cat.name}</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-tertiary)', marginBottom: '1rem' }}>
              {cat.slug}
            </p>
            <button
              onClick={() => deleteCategory(cat.id)}
              className="btn-ghost"
              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

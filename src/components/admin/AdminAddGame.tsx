import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function AdminAddGame() {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    short_description: '',
    thumbnail: '',
    iframe_url: '',
    category_id: 1,
    width: 800,
    height: 600,
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.from('games').insert([{
        ...formData,
        source: 'MANUAL',
        source_id: `manual-${Date.now()}`,
        tags: [],
        is_active: true,
        is_new: true,
        is_hot: false,
        is_featured: false,
        views: 0,
      }])

      if (!error) {
        alert('Game added successfully!')
        setFormData({
          title: '',
          slug: '',
          description: '',
          short_description: '',
          thumbnail: '',
          iframe_url: '',
          category_id: 1,
          width: 800,
          height: 600,
        })
      } else {
        alert('Failed to add game: ' + error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem' }}>Add New Game</h2>

      <form onSubmit={handleSubmit} style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--line-visible)',
        borderRadius: '0.5rem',
        padding: '2rem',
        maxWidth: '600px',
      }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Title</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: 'var(--bg-surface)',
              border: '1px solid var(--line-visible)',
              borderRadius: '0.25rem',
              color: 'var(--text-primary)',
            }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Slug</label>
          <input
            type="text"
            required
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: 'var(--bg-surface)',
              border: '1px solid var(--line-visible)',
              borderRadius: '0.25rem',
              color: 'var(--text-primary)',
            }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Short Description</label>
          <input
            type="text"
            required
            value={formData.short_description}
            onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: 'var(--bg-surface)',
              border: '1px solid var(--line-visible)',
              borderRadius: '0.25rem',
              color: 'var(--text-primary)',
            }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Description</label>
          <textarea
            required
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: 'var(--bg-surface)',
              border: '1px solid var(--line-visible)',
              borderRadius: '0.25rem',
              color: 'var(--text-primary)',
              fontFamily: 'inherit',
            }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Thumbnail URL</label>
          <input
            type="url"
            required
            value={formData.thumbnail}
            onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: 'var(--bg-surface)',
              border: '1px solid var(--line-visible)',
              borderRadius: '0.25rem',
              color: 'var(--text-primary)',
            }}
          />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Game Iframe URL</label>
          <input
            type="url"
            required
            value={formData.iframe_url}
            onChange={(e) => setFormData({ ...formData, iframe_url: e.target.value })}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: 'var(--bg-surface)',
              border: '1px solid var(--line-visible)',
              borderRadius: '0.25rem',
              color: 'var(--text-primary)',
            }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Width</label>
            <input
              type="number"
              value={formData.width}
              onChange={(e) => setFormData({ ...formData, width: parseInt(e.target.value) })}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'var(--bg-surface)',
                border: '1px solid var(--line-visible)',
                borderRadius: '0.25rem',
                color: 'var(--text-primary)',
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Height</label>
            <input
              type="number"
              value={formData.height}
              onChange={(e) => setFormData({ ...formData, height: parseInt(e.target.value) })}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'var(--bg-surface)',
                border: '1px solid var(--line-visible)',
                borderRadius: '0.25rem',
                color: 'var(--text-primary)',
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Category</label>
            <input
              type="number"
              value={formData.category_id}
              onChange={(e) => setFormData({ ...formData, category_id: parseInt(e.target.value) })}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'var(--bg-surface)',
                border: '1px solid var(--line-visible)',
                borderRadius: '0.25rem',
                color: 'var(--text-primary)',
              }}
            />
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Adding...' : 'Add Game'}
        </button>
      </form>
    </div>
  )
}

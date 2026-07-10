import { useState, useEffect } from 'react'
import { Trash2 } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { Game } from '../../lib/types'

export default function AdminGameManager() {
  const [games, setGames] = useState<Game[]>([])
  const [page, setPage] = useState(0)
  const perPage = 10

  useEffect(() => {
    fetchGames()
  }, [page])

  const fetchGames = async () => {
    const { data } = await supabase
      .from('games')
      .select('*')
      .order('created_at', { ascending: false })
      .range(page * perPage, (page + 1) * perPage - 1)

    if (data) setGames(data)
  }

  const toggleFlag = async (id: number, field: 'is_hot' | 'is_new' | 'is_featured') => {
    const game = games.find(g => g.id === id)
    if (!game) return

    const { error } = await supabase
      .from('games')
      .update({ [field]: !game[field] })
      .eq('id', id)

    if (!error) {
      setGames(games.map(g => g.id === id ? { ...g, [field]: !g[field] } : g))
    }
  }

  const deleteGame = async (id: number) => {
    if (!confirm('Delete this game?')) return

    const { error } = await supabase.from('games').delete().eq('id', id)
    if (!error) {
      setGames(games.filter(g => g.id !== id))
    }
  }

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem' }}>Manage Games</h2>

      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          background: 'var(--bg-elevated)',
          border: '1px solid var(--line-visible)',
          borderRadius: '0.5rem',
        }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--line-visible)' }}>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Title</th>
              <th style={{ padding: '1rem' }}>Hot</th>
              <th style={{ padding: '1rem' }}>New</th>
              <th style={{ padding: '1rem' }}>Featured</th>
              <th style={{ padding: '1rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {games.map(game => (
              <tr key={game.id} style={{ borderBottom: '1px solid var(--line-subtle)' }}>
                <td style={{ padding: '1rem' }}>{game.title}</td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={game.is_hot}
                    onChange={() => toggleFlag(game.id, 'is_hot')}
                  />
                </td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={game.is_new}
                    onChange={() => toggleFlag(game.id, 'is_new')}
                  />
                </td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={game.is_featured}
                    onChange={() => toggleFlag(game.id, 'is_featured')}
                  />
                </td>
                <td style={{ padding: '1rem', textAlign: 'center', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                  <button
                    onClick={() => deleteGame(game.id)}
                    style={{ background: 'transparent', color: 'var(--state-hot)', cursor: 'pointer' }}
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
        <button
          onClick={() => setPage(Math.max(0, page - 1))}
          disabled={page === 0}
          className="btn-ghost"
        >
          Previous
        </button>
        <span style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>Page {page + 1}</span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={games.length < perPage}
          className="btn-ghost"
        >
          Next
        </button>
      </div>
    </div>
  )
}

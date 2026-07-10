import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Game, Category } from '../lib/types'
import GamePlayer from '../components/games/GamePlayer'
import GameGrid from '../components/games/GameGrid'

export default function GamePage() {
  const { slug } = useParams<{ slug: string }>()
  const [game, setGame] = useState<Game | null>(null)
  const [category, setCategory] = useState<Category | null>(null)
  const [related, setRelated] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      if (!slug) return

      const { data: gameData } = await supabase
        .from('games')
        .select('*, categories(*)')
        .eq('slug', slug)
        .single()

      if (gameData) {
        setGame(gameData)
        setCategory(gameData.categories)

        const { data: relatedData } = await supabase
          .from('games')
          .select('*')
          .eq('category_id', gameData.category_id)
          .neq('id', gameData.id)
          .limit(8)

        if (relatedData) setRelated(relatedData)
      }

      setLoading(false)
    }

    fetch()
  }, [slug])

  if (loading) return <div>Loading...</div>
  if (!game) return <div>Game not found</div>

  return (
    <>
      <Helmet>
        <title>{game.title} - Free Online Game | FreeGaming.ca</title>
        <meta name="description" content={game.description} />
        <meta property="og:title" content={game.title} />
        <meta property="og:description" content={game.short_description} />
        <meta property="og:image" content={game.thumbnail} />
      </Helmet>

      <h1 style={{ marginBottom: '1rem', color: 'var(--neon-lime)' }}>{game.title}</h1>

      <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
        {game.short_description}
      </p>

      <GamePlayer iframeUrl={game.iframe_url} title={game.title} width={game.width} height={game.height} />

      <div style={{
        background: 'var(--bg-elevated)',
        border: '1px solid var(--line-visible)',
        borderRadius: '0.5rem',
        padding: '1.5rem',
        marginBottom: '2rem',
      }}>
        <h2 style={{ marginBottom: '1rem' }}>About this game</h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{game.description}</p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1rem',
          marginTop: '1.5rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid var(--line-subtle)',
        }}>
          <div>
            <span style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>Category</span>
            <p style={{ color: 'var(--neon-lime)', fontWeight: 600 }}>{category?.name || 'Game'}</p>
          </div>
          <div>
            <span style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>Views</span>
            <p style={{ color: 'var(--neon-lime)', fontWeight: 600 }}>{game.views.toLocaleString()}</p>
          </div>
          <div>
            <span style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>Cost</span>
            <p style={{ color: 'var(--ember)', fontWeight: 600 }}>FREE</p>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div>
          <h2 style={{ marginBottom: '1.5rem' }}>More in {category?.name}</h2>
          <GameGrid games={related} />
        </div>
      )}
    </>
  )
}

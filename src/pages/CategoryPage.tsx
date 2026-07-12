import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Category, Game } from '../lib/types'
import GameGrid from '../components/games/GameGrid'

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>()
  const [category, setCategory] = useState<Category | null>(null)
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      if (!slug) return
      try {
        const { data: catData } = await supabase
          .from('categories')
          .select('*')
          .eq('slug', slug)
          .single()

        if (catData) {
          setCategory(catData)

          const { data: gamesData } = await supabase
            .from('games')
            .select('*, categories(*)')
            .eq('category_id', catData.id)
            .limit(48)

          if (gamesData) setGames(gamesData)
        }
      } catch (err) {
        console.error('Failed to load category:', err)
      } finally {
        setLoading(false)
      }
    }

    fetch()
  }, [slug])

  if (loading) return <div>Loading...</div>
  if (!category) return <div>Category not found</div>

  return (
    <>
      <Helmet>
        <title>{category.name} - Free Online Games | FreeGaming.ca</title>
        <meta name="description" content={category.description || `Free ${category.name.toLowerCase()} games`} />
      </Helmet>

      <h1 style={{ marginBottom: '0.5rem', color: 'var(--neon-lime)' }}>
        {category.icon} {category.name}
      </h1>

      {category.description && (
        <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
          {category.description}
        </p>
      )}

      <GameGrid games={games} loading={loading} />
    </>
  )
}

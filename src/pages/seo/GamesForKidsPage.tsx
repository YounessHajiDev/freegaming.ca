import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { supabase } from '../../lib/supabase'
import type { Game } from '../../lib/types'
import GameGrid from '../../components/games/GameGrid'

export default function GamesForKidsPage() {
  const [games, setGames] = useState<(Game & { categories?: { name: string } })[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('games')
      .select('id, title, slug, thumbnail, short_description, is_new, is_hot, is_featured, views, category_id, categories!inner(name, slug)')
      .eq('is_active', true)
      .in('categories.slug', ['puzzle-games', 'casual-games', 'arcade-games', 'adventure-games'])
      .order('views', { ascending: false })
      .limit(30)
      .then(({ data }) => { setGames((data ?? []) as (Game & { categories?: { name: string } })[]) ; setLoading(false) })
  }, [])

  return (
    <>
      <Helmet>
        <title>Free Online Games for Kids — Safe & Fun | FreeGaming.ca</title>
        <meta name="description" content="Safe, fun, and free online games for kids. Age-appropriate browser games for children — puzzle, adventure, and arcade games with no downloads." />
        <link rel="canonical" href="https://www.freegaming.ca/games-for-kids/" />
      </Helmet>
      <h1 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontWeight: 800, fontSize: 'clamp(2rem, 4vw, 3rem)', textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '1rem' }}>Games for Kids</h1>
      <div style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--line-subtle)' }}>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75', margin: 0 }}>
          FreeGaming.ca offers a great selection of <strong style={{ color: 'var(--text-primary)' }}>free online games for kids</strong> that are fun, safe, and educational. Canadian families love our carefully curated collection of age-appropriate browser games — no downloads, no account creation, and no in-app purchases.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75', marginBottom: 0, marginTop: '1rem' }}>
          We feature puzzle games that sharpen problem-solving skills, adventure games that build creativity and narrative thinking, arcade games for hand-eye coordination, and casual games perfect for younger players. All games load directly in the browser, so parents never have to worry about installing software.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75', marginBottom: 0, marginTop: '1rem' }}>
          Our kids' games work on all devices — iPads, Android tablets, laptops, and desktop computers. Whether your child is at home or in the classroom, FreeGaming.ca provides safe, educational entertainment. Games from top-tier publishers are vetted for appropriate content.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75', marginBottom: 0, marginTop: '1rem' }}>
          We recommend parental supervision for children under 13. Our privacy practices comply with Canadian PIPEDA regulations.
        </p>
      </div>
      <GameGrid games={games} loading={loading} columns={5} />
    </>
  )
}

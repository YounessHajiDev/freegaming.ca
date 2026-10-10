import SeoGamePageTemplate from '../../components/seo/SeoGamePageTemplate'

export default function BrainGamesPage() {
  return (
    <SeoGamePageTemplate cfg={{
      title: 'Free Brain Games Online — Memory, Logic & Thinking Games | FreeGaming.ca',
      metaDescription: 'Play free brain games online: memory tests, logic puzzles, math games and thinking challenges. Train your brain for free — no download at FreeGaming.ca.',
      canonical: 'https://www.freegaming.ca/brain-games/',
      h1: 'Free Brain Games Online',
      collectionName: 'Brain Games',
      categorySlugs: ['thinking-games', 'puzzle-games'],
      intro: (
        <>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75', margin: 0 }}>
            Give your brain a workout — our <strong style={{ color: 'var(--text-primary)' }}>free brain games</strong> collection is packed with memory tests, logic puzzles, math challenges and thinking games that are as fun as they are good for you.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75', marginBottom: 0, marginTop: '1rem' }}>
            Sharpen your memory with matching and recall games, stretch your logic with deduction puzzles, test your math speed, or unwind with Sudoku-style number challenges. Each game targets a different mental skill — play a few every day and feel the difference.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75', marginBottom: 0, marginTop: '1rem' }}>
            Brain games are perfect for students, professionals, and anyone who wants entertainment that actually exercises the mind. Free, instant, and playable on any device — Canada\'s daily brain gym, open 24/7.
          </p>
        </>
      ),
      faqs: [
        { q: 'Do brain games actually help your brain?', a: 'Studies show regular puzzle and memory play supports cognitive skills like attention, recall and processing speed — and our games make it fun, not homework.' },
        { q: 'What brain games can I play for free?', a: 'Memory matching, logic puzzles, math challenges, word games, Sudoku-style numbers, pattern recognition and more — all free, no account.' },
        { q: 'Are brain games suitable for kids and seniors?', a: 'Yes — difficulty ranges from kid-friendly memory games to tough logic challenges adults enjoy. A great screen-time choice for every age.' },
        { q: 'Can I play brain games on mobile?', a: 'Every game runs in your phone\'s browser — perfect for a mental workout during commutes or coffee breaks.' },
      ],
      relatedLinks: [
        { href: '/free-puzzle-games/', label: 'Free Puzzle Games' },
        { href: '/strategy-games/', label: 'Strategy Games' },
        { href: '/card-games/', label: 'Card Games' },
        { href: '/casual-games/', label: 'Casual Games' },
        { href: '/free-games/', label: 'All Free Games' },
      ],
    }} />
  )
}

import SeoGamePageTemplate from '../../components/seo/SeoGamePageTemplate'

export default function StrategyGamesPage() {
  return (
    <SeoGamePageTemplate cfg={{
      title: 'Free Strategy Games Online — Tower Defense, Chess & War Games | FreeGaming.ca',
      metaDescription: 'Play free strategy games online: tower defense, chess, war strategy and tactical puzzles. Think your way to victory — no download required at FreeGaming.ca.',
      canonical: 'https://www.freegaming.ca/strategy-games/',
      h1: 'Free Strategy Games Online',
      collectionName: 'Strategy Games',
      categorySlugs: ['strategy-games'],
      intro: (
        <>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75', margin: 0 }}>
            Outsmart, outplay, outlast — our <strong style={{ color: 'var(--text-primary)' }}>free strategy games</strong> collection is for players who win with their brains, not just their reflexes. Every game is free and runs right in your browser.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75', marginBottom: 0, marginTop: '1rem' }}>
            Plan your defence in tower defense classics, command armies in war strategy games, outmanoeuvre opponents in chess and board-style tactics, or manage resources in tycoon and base-building challenges. Slow-paced or real-time — your call.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75', marginBottom: 0, marginTop: '1rem' }}>
            Strategy games reward patience and planning: the perfect genre for players who like a real mental workout. Works on desktop and mobile — no downloads, no accounts, just you versus the game (or the world).
          </p>
        </>
      ),
      faqs: [
        { q: 'What are the best free strategy games online?', a: 'Tower defense games, chess variants, war strategy and resource-management games are consistently the most popular — all free on this page.' },
        { q: 'Do strategy games work without downloading?', a: 'Yes — everything here is HTML5 and plays directly in your browser on desktop, Chromebook, or mobile.' },
        { q: 'Are there multiplayer strategy games?', a: 'Some titles let you play against real opponents. Browse our Multiplayer and IO Games collections for more head-to-head strategy.' },
        { q: 'Are strategy games good for your brain?', a: 'Research links strategy gaming to improved planning, problem-solving and working memory — plus they\'re genuinely fun.' },
      ],
      relatedLinks: [
        { href: '/brain-games/', label: 'Brain Games' },
        { href: '/card-games/', label: 'Card Games' },
        { href: '/free-puzzle-games/', label: 'Free Puzzle Games' },
        { href: '/io-games/', label: 'IO Games' },
        { href: '/free-games/', label: 'All Free Games' },
      ],
    }} />
  )
}

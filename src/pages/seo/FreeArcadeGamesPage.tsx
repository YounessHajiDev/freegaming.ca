import SeoGamePageTemplate from '../../components/seo/SeoGamePageTemplate'

export default function FreeArcadeGamesPage() {
  return (
    <SeoGamePageTemplate cfg={{
      title: 'Free Arcade Games Online — Classic & New | FreeGaming.ca',
      metaDescription: 'Play free arcade games online — classic retro games, bubble shooters, runners, and more. No download, no signup. Canada\'s best free arcade portal.',
      canonical: 'https://www.freegaming.ca/free-arcade-games/',
      h1: 'Free Arcade Games Online',
      collectionName: 'Free Arcade Games',
      categorySlugs: ['arcade-games', 'casual-games'],
      intro: (
        <>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75', margin: 0 }}>
            Relive the golden age of gaming with FreeGaming.ca's collection of <strong style={{ color: 'var(--text-primary)' }}>free arcade games online</strong>. Classic retro-style games, bubble shooters, endless runners, pinball machines, and modern hypercasual titles — all completely free and playable in your browser.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75', marginBottom: 0, marginTop: '1rem' }}>
            Arcade games are perfect for quick sessions. Our free arcade collection ranges from old-school classics like Pong and Snake-inspired games to modern tap-and-jump hypercasual hits. Every game is fast to load, easy to learn, and endlessly replayable.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75', marginBottom: 0, marginTop: '1rem' }}>
            All arcade games on FreeGaming.ca run in your browser using HTML5 technology — no Flash needed. They work beautifully on desktop computers and mobile phones alike, making them ideal for gaming on any device at any time.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75', marginBottom: 0, marginTop: '1rem' }}>
            We add new free arcade games every week. Casual and hypercasual titles are among the most popular games on the site — great for a quick break or a long gaming session.
          </p>
        </>
      ),
      faqs: [
        { q: 'What free arcade games can I play online?', a: 'FreeGaming.ca offers bubble shooters, endless runners, retro-style platformers, ball games, clicker games, pinball, and dozens of classic arcade-inspired HTML5 games — all free.' },
        { q: 'Can I play retro arcade games for free online?', a: 'Yes! Our arcade collection includes retro-inspired games that evoke the feel of classic 80s and 90s arcade machines, updated with modern HTML5 graphics and controls.' },
        { q: 'Are arcade games good for casual gaming?', a: 'Absolutely. Arcade games are designed for quick, accessible fun. Most games can be started in seconds and played in short bursts, making them perfect for casual players.' },
        { q: 'Do free online arcade games work on mobile?', a: 'Yes. All our arcade games are HTML5 browser games that work perfectly on iOS and Android mobile browsers. No app download required.' },
        { q: 'Are there new arcade games added regularly?', a: 'Yes! FreeGaming.ca adds new arcade and casual games weekly. Our library grows constantly with fresh titles from top HTML5 game publishers.' },
      ],
      relatedLinks: [
        { href: '/category/arcade-games/', label: 'Arcade Games Category' },
        { href: '/free-puzzle-games/', label: 'Free Puzzle Games' },
        { href: '/free-action-games/', label: 'Free Action Games' },
        { href: '/games-for-kids/', label: 'Games for Kids' },
        { href: '/free-games/', label: 'All Free Games' },
      ],
    }} />
  )
}

import SeoGamePageTemplate from '../../components/seo/SeoGamePageTemplate'

export default function IoGamesPage() {
  return (
    <SeoGamePageTemplate cfg={{
      title: 'Free IO Games Online — Agar.io, Slither.io & More | FreeGaming.ca',
      metaDescription: 'Play the best free .io games online — Agar.io-style arena battles, Slither.io snakes, and multiplayer .io hits. No download, no account — Canada\'s free io games portal.',
      canonical: 'https://www.freegaming.ca/io-games/',
      h1: 'Free IO Games Online',
      collectionName: 'IO Games',
      categorySlugs: ['io-games', 'multiplayer-games'],
      intro: (
        <>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75', margin: 0 }}>
            <strong style={{ color: 'var(--text-primary)' }}>IO games</strong> are the genre that took over the internet — fast, free multiplayer battles played against real people around the world, right in your browser. Born from legends like Agar.io and Slither.io, every .io game follows the same magic formula: easy to learn, impossible to put down.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75', marginBottom: 0, marginTop: '1rem' }}>
            Our io games collection covers the whole genre: grow-and-eat arena games, territory battles, survival shooters, racing .io titles, and classic snake games. Every match is live against real players — no bots faking it, no signup wall blocking you.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75', marginBottom: 0, marginTop: '1rem' }}>
            The best part? IO games are the lightest multiplayer games on the web. They load in seconds on any connection — perfect for a quick match on your lunch break at school, work, or home. Desktop, laptop, tablet or phone, they all run in the browser.
          </p>
        </>
      ),
      faqs: [
        { q: 'What are .io games?', a: 'IO games are free browser multiplayer games — named after the .io domain many pioneers used. You play live against other people in shared arenas: grow bigger, survive longer, climb the leaderboard.' },
        { q: 'Can I play io games without downloading?', a: 'Yes — every io game on FreeGaming.ca runs directly in your browser. No download, no plugins, no account required. Click and you\'re in a live match within seconds.' },
        { q: 'Are io games multiplayer?', a: 'Yes, that\'s what defines the genre — real-time multiplayer against players worldwide. Some io games let you team up or play private matches with friends.' },
        { q: 'Do io games work on Chromebook and school computers?', a: 'Yes. IO games are lightweight HTML5 titles that run on Chromebooks and locked-down school or work computers — no installs, no admin rights needed.' },
      ],
      relatedLinks: [
        { href: '/2-player-games/', label: '2 Player Games' },
        { href: '/unblocked-games/', label: 'Unblocked Games' },
        { href: '/free-action-games/', label: 'Free Action Games' },
        { href: '/casual-games/', label: 'Casual Games' },
        { href: '/free-games/', label: 'All Free Games' },
      ],
    }} />
  )
}

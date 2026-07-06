import SeoGamePageTemplate from '../../components/seo/SeoGamePageTemplate'

export default function TwoPlayerPage() {
  return (
    <SeoGamePageTemplate cfg={{
      title: '2 Player Games Free Online — Play With a Friend | FreeGaming.ca',
      metaDescription: 'Play free 2 player games online with a friend. Multiplayer browser games — no download, no account needed. Canada\'s best free 2 player game collection.',
      canonical: 'https://www.freegaming.ca/2-player-games/',
      h1: '2 Player Games Free Online',
      collectionName: '2 Player Games',
      categorySlugs: ['multiplayer-games', 'sports-games', 'action-games'],
      intro: (
        <>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75', margin: 0 }}>
            Challenge a friend with FreeGaming.ca's collection of <strong style={{ color: 'var(--text-primary)' }}>free 2 player games</strong>. From competitive head-to-head sports games to co-op adventures, our two-player browser games let you play together on the same device or online — absolutely free, no download required.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75', marginBottom: 0, marginTop: '1rem' }}>
            2 player games are perfect for gaming sessions with friends and family. Share a keyboard, pass the device, or play online — our selection covers basketball, soccer, fighting games, racing, and more competitive multiplayer formats.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75', marginBottom: 0, marginTop: '1rem' }}>
            All 2 player games on FreeGaming.ca run in your browser — no special hardware or software needed. They work on desktop computers, laptops, and large-screen tablets. Most same-screen multiplayer games use split keyboard controls.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75', marginBottom: 0, marginTop: '1rem' }}>
            FreeGaming.ca is the most complete free multiplayer gaming destination for Canadians. New 2 player titles are added regularly to keep the competition fresh.
          </p>
        </>
      ),
      faqs: [
        { q: 'What are 2 player games online?', a: '2 player games are games designed for two people to play simultaneously — either cooperatively or competitively. On FreeGaming.ca, this includes same-screen games and online multiplayer games, all free to play in your browser.' },
        { q: 'Can 2 player games be played on the same computer?', a: 'Yes! Most 2 player games on FreeGaming.ca support same-device play using split keyboard controls. Player 1 typically uses WASD keys and Player 2 uses arrow keys.' },
        { q: 'Are there free 2 player sports games online?', a: 'Yes. Our 2 player collection features free basketball, soccer, tennis, hockey, and other sports games where two players can compete head-to-head.' },
        { q: 'Do 2 player games work on tablets?', a: 'Same-screen 2 player games can work on large tablets using touch controls. Online multiplayer games work on any device with a browser. Individual game descriptions confirm supported platforms.' },
        { q: 'What are the best free 2 player games on FreeGaming.ca?', a: 'Our top 2 player games include sports titles, fighting games, and racing games. Check our Most Popular page to see which multiplayer games other Canadian players are enjoying right now.' },
      ],
      relatedLinks: [
        { href: '/free-sports-games/', label: 'Free Sports Games' },
        { href: '/free-action-games/', label: 'Free Action Games' },
        { href: '/free-racing-games/', label: 'Free Racing Games' },
        { href: '/category/multiplayer-games/', label: 'Multiplayer Games' },
        { href: '/free-games/', label: 'All Free Games' },
      ],
    }} />
  )
}

import SeoGamePageTemplate from '../../components/seo/SeoGamePageTemplate'

export default function FreeSportsGamesPage() {
  return (
    <SeoGamePageTemplate cfg={{
      title: 'Free Sports Games Online — Soccer, Basketball & More | FreeGaming.ca',
      metaDescription: 'Play free sports games online — soccer, basketball, hockey, golf, and more. No download, no signup. Canada\'s best free sports gaming portal.',
      canonical: 'https://www.freegaming.ca/free-sports-games/',
      h1: 'Free Sports Games Online',
      collectionName: 'Free Sports Games',
      categorySlugs: ['sports-games'],
      intro: (
        <>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75', margin: 0 }}>
            Score big with FreeGaming.ca's collection of <strong style={{ color: 'var(--text-primary)' }}>free sports games online</strong>. From soccer and basketball to hockey, golf, and bowling — we bring the world's most popular sports to your browser, completely free and instantly playable.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75', marginBottom: 0, marginTop: '1rem' }}>
            Our free sports game library covers all major sports: Canadian favourites like ice hockey, globally loved soccer and basketball, precision sports like golf and billiards, and competitive classics like bowling and tennis. Every game is a browser game — no download required.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75', marginBottom: 0, marginTop: '1rem' }}>
            Sports games are great for quick competitive sessions between breaks. Whether you're a hardcore sports fan or just looking for casual fun, our free HTML5 sports games deliver solid gameplay on desktop and mobile alike.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75', marginBottom: 0, marginTop: '1rem' }}>
            New free sports games are regularly added from licensed HTML5 publishers. Canadian sports fans will find plenty of hockey, curling, and winter sports titles alongside global favourites.
          </p>
        </>
      ),
      faqs: [
        { q: 'What free sports games can I play online?', a: 'FreeGaming.ca offers free soccer games, basketball games, ice hockey games, golf, bowling, tennis, billiards, cricket, and many more sports — all playable free in your browser.' },
        { q: 'Are there free Canadian sports games online?', a: 'Yes! Our collection includes ice hockey games and other Canadian favourites. As Canada\'s free gaming portal, we make sure to include sports popular with Canadian players.' },
        { q: 'Can I play free soccer games online without downloading?', a: 'Absolutely. All our soccer games are HTML5 browser games — no download or installation needed. Just click Play and start the match immediately.' },
        { q: 'Do the free sports games work on mobile?', a: 'Yes, all sports games on FreeGaming.ca are optimised for mobile browsers. They work on iPhone, Android, and tablets with responsive touch controls.' },
        { q: 'Are there free multiplayer sports games?', a: 'Some sports games offer 2-player modes on the same device or online multiplayer. Check the game description to confirm the available play modes.' },
      ],
      relatedLinks: [
        { href: '/category/sports-games/', label: 'Sports Games Category' },
        { href: '/free-racing-games/', label: 'Free Racing Games' },
        { href: '/2-player-games/', label: '2 Player Games' },
        { href: '/free-action-games/', label: 'Free Action Games' },
        { href: '/free-games/', label: 'All Free Games' },
      ],
    }} />
  )
}

import SeoGamePageTemplate from '../../components/seo/SeoGamePageTemplate'

export default function CardGamesPage() {
  return (
    <SeoGamePageTemplate cfg={{
      title: 'Free Card Games Online — Solitaire, Poker-Style & More | FreeGaming.ca',
      metaDescription: 'Play free card games online: Solitaire, classic card battles, matching and deck games. No download, no account — Canada\'s free card game collection at FreeGaming.ca.',
      canonical: 'https://www.freegaming.ca/card-games/',
      h1: 'Free Card Games Online',
      collectionName: 'Card Games',
      categorySlugs: ['card-games'],
      intro: (
        <>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75', margin: 0 }}>
            Deal yourself in — our <strong style={{ color: 'var(--text-primary)' }}>free card games</strong> collection covers everything from relaxing Solitaire sessions to fast-paced deck battles. Every game plays instantly in your browser, no shuffle required.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75', marginBottom: 0, marginTop: '1rem' }}>
            You\'ll find classic patience games like Klondike Solitaire, Spider, and FreeCell alongside memory matching, war-style card battles, and trick-taking challenges. Perfect for killing five minutes or settling in for a longer strategic session.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75', marginBottom: 0, marginTop: '1rem' }}>
            Card games are the oldest casual games on earth — and still some of the best for your brain. Our collection works on desktop, tablet, and phone: drag, tap, and play your way through Canada\'s free card table.
          </p>
        </>
      ),
      faqs: [
        { q: 'Is Solitaire free to play here?', a: 'Yes — Klondike Solitaire, Spider, FreeCell and all our card games are completely free. No account, no download, no ads blocking the table.' },
        { q: 'Can I play card games on my phone?', a: 'Absolutely. All our card games are touch-friendly — tap or drag cards on iPhone, iPad, Android, or any touchscreen device.' },
        { q: 'Do you have card games for kids?', a: 'Yes — memory matching and simple card games are great for kids. See our Games for Kids page for a fully age-appropriate selection.' },
        { q: 'Are there multiplayer card games?', a: 'Some card and board-style games support 2 players on the same device. Check our 2 Player Games and Multiplayer collections for more.' },
      ],
      relatedLinks: [
        { href: '/brain-games/', label: 'Brain Games' },
        { href: '/strategy-games/', label: 'Strategy Games' },
        { href: '/casual-games/', label: 'Casual Games' },
        { href: '/2-player-games/', label: '2 Player Games' },
        { href: '/free-games/', label: 'All Free Games' },
      ],
    }} />
  )
}

import SeoGamePageTemplate from '../../components/seo/SeoGamePageTemplate'

export default function ShootingGamesPage() {
  return (
    <SeoGamePageTemplate cfg={{
      title: 'Free Shooting Games Online — FPS, Sniper & Gun Games | FreeGaming.ca',
      metaDescription: 'Play free shooting games online: sniper missions, FPS battles, target shooters and arcade gun games. No download or signup — Canada\'s free shooting game collection.',
      canonical: 'https://www.freegaming.ca/shooting-games/',
      h1: 'Free Shooting Games Online',
      collectionName: 'Shooting Games',
      categorySlugs: ['shooting-games'],
      intro: (
        <>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75', margin: 0 }}>
            Lock and load — our <strong style={{ color: 'var(--text-primary)' }}>free shooting games</strong> collection brings arcade-style gun action straight to your browser. From precision sniper missions to chaotic wave-defense shootouts, every game is free and plays instantly with zero downloads.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75', marginBottom: 0, marginTop: '1rem' }}>
            The lineup covers every flavour of shooter: first-person arena battles, top-down survival shooters, zombie defence, skeet and target practice, and old-school rail shooters. Whether you want a 60-second reflex test or an hour-long campaign, there\'s a gun game here for it.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75', marginBottom: 0, marginTop: '1rem' }}>
            All our shooting games are built on HTML5 — they run on school Chromebooks, office desktops, and mobile devices alike, with controls tuned for keyboard, mouse, and touch. Aim, shoot, repeat — completely free.
          </p>
        </>
      ),
      faqs: [
        { q: 'Are these shooting games really free?', a: 'Yes — every shooting game on FreeGaming.ca is 100% free to play, with no signup, download, or payment required.' },
        { q: 'Can I play shooting games on a school computer?', a: 'Most can — our HTML5 shooters need no install or admin rights. If your network blocks gaming sites, try our Unblocked Games page instead.' },
        { q: 'Do shooting games work on mobile?', a: 'Yes. Most titles include touch controls — tap to aim and shoot on phones and tablets. FPS-style games play best on desktop.' },
        { q: 'What kinds of shooting games are included?', a: 'Sniper games, first-person shooters, zombie survival, wave defence, target practice, western duels and arcade gun games — new titles added regularly.' },
      ],
      relatedLinks: [
        { href: '/free-action-games/', label: 'Free Action Games' },
        { href: '/io-games/', label: 'IO Games' },
        { href: '/unblocked-games/', label: 'Unblocked Games' },
        { href: '/2-player-games/', label: '2 Player Games' },
        { href: '/free-games/', label: 'All Free Games' },
      ],
    }} />
  )
}

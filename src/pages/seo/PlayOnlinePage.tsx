import SeoGamePageTemplate from '../../components/seo/SeoGamePageTemplate'

export default function PlayOnlinePage() {
  return (
    <SeoGamePageTemplate cfg={{
      title: 'Play Online Games Free — No Download Required | FreeGaming.ca',
      metaDescription: 'Play online games for free — instant browser games, no download needed. Thousands of HTML5 games on Canada\'s #1 free gaming portal. Play now!',
      canonical: 'https://www.freegaming.ca/play-online/',
      h1: 'Play Online Games Free',
      collectionName: 'Play Online Games',
      intro: (
        <>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75', margin: 0 }}>
            Ready to <strong style={{ color: 'var(--text-primary)' }}>play online games</strong> for free? FreeGaming.ca is Canada's premier destination for instant browser gaming. Thousands of HTML5 games — no download, no account, no cost. Click any game and start playing in seconds.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75', marginBottom: 0, marginTop: '1rem' }}>
            Playing online games used to mean downloading large files, installing software, or signing up for paid services. Not anymore. FreeGaming.ca delivers full-quality HTML5 games that run entirely in your web browser. The same technology that powers modern websites powers our games — fast, secure, and universally compatible.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75', marginBottom: 0, marginTop: '1rem' }}>
            Our online game catalogue spans every genre: action, puzzle, sports, racing, strategy, arcade, card games, io games, and more. Whether you want to play a solo puzzle or compete online, you'll find it on FreeGaming.ca. All games work on desktop, tablet, and smartphone.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75', marginBottom: 0, marginTop: '1rem' }}>
            FreeGaming.ca is updated constantly with fresh online games sourced from the world's leading HTML5 game publishers. Bookmark us and check back often — there's always something new to play online.
          </p>
        </>
      ),
      faqs: [
        { q: 'Can I play online games for free without downloading?', a: 'Yes. Every game on FreeGaming.ca plays directly in your browser — no download, no installation, and no account required. Just click and play.' },
        { q: 'What\'s the best free online game site in Canada?', a: 'FreeGaming.ca is Canada\'s #1 free online games portal, offering thousands of HTML5 browser games across every genre, updated weekly with new titles.' },
        { q: 'What browser is best for playing online games?', a: 'Modern versions of Chrome, Firefox, Safari, and Edge all work great for playing HTML5 online games. We recommend keeping your browser updated for the best performance.' },
        { q: 'Can I play online games on my phone?', a: 'Yes! All games on FreeGaming.ca are designed to work on mobile phones and tablets. Open the site in your mobile browser and play any game without installing an app.' },
        { q: 'Are the online games on FreeGaming.ca safe?', a: 'Yes. We source all games from reputable licensed HTML5 publishers. We never ask for personal information to play, and our site uses HTTPS for secure browsing.' },
      ],
      relatedLinks: [
        { href: '/free-games/', label: 'All Free Games' },
        { href: '/popular/', label: 'Most Popular Games' },
        { href: '/new-games/', label: 'New Games' },
        { href: '/unblocked-games/', label: 'Unblocked Games' },
        { href: '/2-player-games/', label: '2 Player Games' },
      ],
    }} />
  )
}

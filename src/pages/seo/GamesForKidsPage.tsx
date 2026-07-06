import SeoGamePageTemplate from '../../components/seo/SeoGamePageTemplate'

export default function GamesForKidsPage() {
  return (
    <SeoGamePageTemplate cfg={{
      title: 'Free Online Games for Kids — Safe & Fun | FreeGaming.ca',
      metaDescription: 'Safe, fun, and free online games for kids. Age-appropriate browser games for children — puzzle, adventure, and arcade games. No download, no account required.',
      canonical: 'https://www.freegaming.ca/games-for-kids/',
      h1: 'Free Games for Kids',
      collectionName: 'Games for Kids',
      categorySlugs: ['puzzle-games', 'casual-games', 'arcade-games', 'adventure-games'],
      intro: (
        <>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75', margin: 0 }}>
            FreeGaming.ca offers a great selection of <strong style={{ color: 'var(--text-primary)' }}>free online games for kids</strong> that are fun, safe, and educational. Canadian families love our carefully curated collection of age-appropriate browser games — no downloads, no account creation, and no in-app purchases.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75', marginBottom: 0, marginTop: '1rem' }}>
            We feature puzzle games that sharpen problem-solving skills, adventure games that build creativity and narrative thinking, arcade games for hand-eye coordination, and casual games perfect for younger players. All games load directly in the browser, so parents never have to worry about installing software.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75', marginBottom: 0, marginTop: '1rem' }}>
            Our kids' games work on all devices — iPads, Android tablets, laptops, and desktop computers. Whether your child is at home or in the classroom, FreeGaming.ca provides safe, entertaining browser games with no harmful content.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75', marginBottom: 0, marginTop: '1rem' }}>
            We recommend parental supervision for children under 13. Our privacy practices comply with Canadian PIPEDA regulations and we never collect personal data from players.
          </p>
        </>
      ),
      faqs: [
        { q: 'What free games are suitable for kids?', a: 'Puzzle games, casual games, arcade games, and adventure games are ideal for kids. FreeGaming.ca\'s collection features age-appropriate HTML5 games from vetted publishers with no violent or adult content.' },
        { q: 'Are the kids\' games safe from inappropriate content?', a: 'Yes. Games in our kids\' collection come from reputable HTML5 publishers and are reviewed for appropriate content. We do not host games with graphic violence, adult themes, or inappropriate language.' },
        { q: 'Do the kids\' games require a download or account?', a: 'No. Every game loads directly in the browser — no downloads, no accounts, no personal information required. Children can play immediately and safely.' },
        { q: 'Are there educational free games for children?', a: 'Yes. Our puzzle and thinking games categories include educational titles that teach math, pattern recognition, logic, and spatial reasoning through fun gameplay.' },
        { q: 'Do the kids\' games work on tablets and iPads?', a: 'Yes! All games on FreeGaming.ca are HTML5 browser games that work on iPads, Android tablets, and any device with a modern web browser. No app installation needed.' },
      ],
      relatedLinks: [
        { href: '/free-puzzle-games/', label: 'Free Puzzle Games' },
        { href: '/free-arcade-games/', label: 'Free Arcade Games' },
        { href: '/unblocked-games/', label: 'Unblocked Games' },
        { href: '/free-games/', label: 'All Free Games' },
        { href: '/free-sports-games/', label: 'Free Sports Games' },
      ],
    }} />
  )
}

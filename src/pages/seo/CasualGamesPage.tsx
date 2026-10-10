import SeoGamePageTemplate from '../../components/seo/SeoGamePageTemplate'

export default function CasualGamesPage() {
  return (
    <SeoGamePageTemplate cfg={{
      title: 'Free Casual Games Online — Easy & Fun Browser Games | FreeGaming.ca',
      metaDescription: 'Play free casual games online — easy, relaxing browser games anyone can enjoy. Match-3, clickers, hyper-casual hits and more. No download at FreeGaming.ca.',
      canonical: 'https://www.freegaming.ca/casual-games/',
      h1: 'Free Casual Games Online',
      collectionName: 'Casual Games',
      categorySlugs: ['casual-games'],
      intro: (
        <>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75', margin: 0 }}>
            No tutorials, no stress — <strong style={{ color: 'var(--text-primary)' }}>casual games</strong> are games anyone can pick up and enjoy in seconds. Our free collection is full of easy, feel-good titles perfect for a quick break or a lazy evening.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75', marginBottom: 0, marginTop: '1rem' }}>
            Match-3 puzzles, idle clickers, cooking and farming games, hidden object hunts, dress-up and makeover titles, bubble shooters — the casual genre is huge and we cover all of it. Simple controls, satisfying gameplay, zero commitment.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75', marginBottom: 0, marginTop: '1rem' }}>
            Casual games are the most-played games on the web for a reason: they fit into real life. Two minutes or two hours, phone or desktop, young or old — there\'s always a casual game that fits.
          </p>
        </>
      ),
      faqs: [
        { q: 'What are casual games?', a: 'Casual games are easy-to-learn games designed for short, relaxing play sessions — match-3 puzzles, clickers, cooking games, hidden objects and more. No skill barrier, no time pressure.' },
        { q: 'Are casual games free?', a: 'Every casual game on FreeGaming.ca is 100% free — no download, no account, no in-app purchases. Just open and play.' },
        { q: 'What\'s the best casual game for a quick break?', a: 'Match-3 puzzles and hyper-casual clickers are perfect for 2-5 minute breaks — instant fun, easy to pause.' },
        { q: 'Do casual games work on phones?', a: 'Yes — casual games are ideal on mobile. Most were designed for touch and play perfectly on iPhone and Android.' },
      ],
      relatedLinks: [
        { href: '/games-for-kids/', label: 'Games for Kids' },
        { href: '/free-puzzle-games/', label: 'Free Puzzle Games' },
        { href: '/brain-games/', label: 'Brain Games' },
        { href: '/card-games/', label: 'Card Games' },
        { href: '/free-games/', label: 'All Free Games' },
      ],
    }} />
  )
}

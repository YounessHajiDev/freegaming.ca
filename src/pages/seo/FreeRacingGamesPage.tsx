import SeoGamePageTemplate from '../../components/seo/SeoGamePageTemplate'

export default function FreeRacingGamesPage() {
  return (
    <SeoGamePageTemplate cfg={{
      title: 'Free Racing Games Online — Play Now, No Download | FreeGaming.ca',
      metaDescription: 'Play free racing games online — car racing, bike racing, drift, kart, and more. No download, no signup. Canada\'s best free racing games portal.',
      canonical: 'https://www.freegaming.ca/free-racing-games/',
      h1: 'Free Racing Games Online',
      collectionName: 'Free Racing Games',
      categorySlugs: ['racing-games'],
      intro: (
        <>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75', margin: 0 }}>
            Get behind the wheel with FreeGaming.ca's collection of <strong style={{ color: 'var(--text-primary)' }}>free racing games</strong>. From high-speed formula cars to off-road trucks, drift challenges to kart races — we have every type of free racing game playable right in your browser. No download required.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75', marginBottom: 0, marginTop: '1rem' }}>
            Our free racing games cover every motorsport genre: street racing, highway traffic races, 3D car games, motorbike racing, truck driving, drag racing, and kart racing. Whether you want casual fun or intense competitive racing, our selection has something for every speed enthusiast.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75', marginBottom: 0, marginTop: '1rem' }}>
            All racing games on FreeGaming.ca use HTML5 technology for smooth, fast gameplay. They work perfectly on Chrome, Firefox, Safari, and Edge — on desktop, laptop, tablet, or phone. No plugins or downloads needed, ever.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75', marginBottom: 0, marginTop: '1rem' }}>
            FreeGaming.ca sources racing games from the world's top HTML5 publishers. New racing titles arrive weekly, so there's always a fresh track to conquer.
          </p>
        </>
      ),
      faqs: [
        { q: 'What free racing games can I play online?', a: 'FreeGaming.ca offers car racing games, motorbike races, kart games, drift games, truck driving challenges, off-road races, and highway traffic racers — all free and playable in your browser.' },
        { q: 'Can I play free racing games on my phone?', a: 'Yes. All racing games on FreeGaming.ca are HTML5 games optimised for mobile. They work on iPhone, Android, and tablets with touch controls, no app download needed.' },
        { q: 'Are there 3D car games I can play for free?', a: 'Absolutely. Our collection includes many 3D car racing games with realistic graphics and physics, all playable for free without downloading anything.' },
        { q: 'Do the free racing games have multiplayer modes?', a: 'Some of our racing games include multiplayer or time-trial modes. Check the individual game description to see what modes are available.' },
        { q: 'How do I control racing games online?', a: 'Most racing games use arrow keys or WASD on desktop. Mobile games use on-screen touch controls. Each game page describes the specific controls before you start playing.' },
      ],
      relatedLinks: [
        { href: '/free-car-games/', label: 'Free Car Games' },
        { href: '/category/racing-games/', label: 'Racing Games Category' },
        { href: '/free-sports-games/', label: 'Free Sports Games' },
        { href: '/free-action-games/', label: 'Free Action Games' },
        { href: '/free-games/', label: 'All Free Games' },
      ],
    }} />
  )
}

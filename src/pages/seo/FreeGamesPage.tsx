import SeoGamePageTemplate from '../../components/seo/SeoGamePageTemplate'

export default function FreeGamesPage() {
  return (
    <SeoGamePageTemplate cfg={{
      title: 'Free Online Games — No Download, No Signup | FreeGaming.ca',
      metaDescription: 'Play hundreds of free online games instantly at FreeGaming.ca. No download, no account needed. Canada\'s #1 free games portal — puzzle, racing, sports & more.',
      canonical: 'https://www.freegaming.ca/free-games/',
      h1: 'Free Online Games',
      collectionName: 'Free Online Games',
      intro: (
        <>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75', margin: 0 }}>
            Looking for <strong style={{ color: 'var(--text-primary)' }}>free online games</strong>? You've found Canada's best destination. Every single game on FreeGaming.ca is 100% free — no credit card, no subscription, no hidden fees. Just click any game and start playing instantly in your browser.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75', marginBottom: 0, marginTop: '1rem' }}>
            Our free games library includes hundreds of HTML5 titles spanning every genre: puzzle games, racing games, sports games, action games, arcade classics, strategy challenges, and casual games perfect for a quick break. New free games are added every week.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75', marginBottom: 0, marginTop: '1rem' }}>
            All games work directly in your web browser — Chrome, Firefox, Safari, and Edge are all supported. No plugins, no Flash, no Java required. FreeGaming.ca uses modern HTML5 technology to deliver smooth, fast gameplay on desktop, tablet, and mobile. Whether you're on a Windows PC, Mac, iPhone, or Android device, our free games work everywhere.
          </p>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.75', marginBottom: 0, marginTop: '1rem' }}>
            FreeGaming.ca is proudly Canadian. We've built this portal specifically for English-speaking Canadians who want great games without the hassle of downloads, installations, or creating yet another account. Play whenever you want, on any device, for free — forever.
          </p>
        </>
      ),
      faqs: [
        { q: 'Are all the games on FreeGaming.ca really free?', a: 'Yes — every game on FreeGaming.ca is 100% free to play. No hidden fees, no subscriptions, no in-app purchases required to enjoy the full game.' },
        { q: 'Do I need to download anything to play free online games?', a: 'No. All games run directly in your browser using HTML5 technology. No downloads, no plugins — just click Play and start instantly.' },
        { q: 'Do I need to create an account to play?', a: 'No account or registration is ever required. You can play any game immediately without signing up for anything.' },
        { q: 'What types of free online games are available?', a: 'FreeGaming.ca offers puzzle games, racing games, action games, sports games, arcade games, strategy games, card games, casual games, io games, and more — thousands of titles across dozens of genres.' },
        { q: 'Does FreeGaming.ca work on mobile devices?', a: 'Yes. FreeGaming.ca and all of our HTML5 games are optimised for smartphones and tablets running iOS or Android. Everything works right in your mobile browser.' },
      ],
      relatedLinks: [
        { href: '/free-puzzle-games/', label: 'Free Puzzle Games' },
        { href: '/free-racing-games/', label: 'Free Racing Games' },
        { href: '/free-action-games/', label: 'Free Action Games' },
        { href: '/free-sports-games/', label: 'Free Sports Games' },
        { href: '/free-arcade-games/', label: 'Free Arcade Games' },
        { href: '/free-car-games/', label: 'Free Car Games' },
        { href: '/unblocked-games/', label: 'Unblocked Games' },
        { href: '/games-for-kids/', label: 'Games for Kids' },
      ],
    }} />
  )
}

import SeoGamePageTemplate, { SeoPageConfig } from '../components/seo/SeoGamePageTemplate'

export default function PlayOnlinePage() {
  const config: SeoPageConfig = {
    title: 'Play Games Online Free - Instant Browser Games | FreeGaming.ca',
    metaDescription: 'Play games online for free instantly in your browser. No downloads needed. Enjoy action, puzzle, racing, and more games on FreeGaming.ca.',
    canonical: '/play-online',
    h1: 'Play Games Online',
    intro: (
      <>
        <p>Ready to play? Jump into our collection of instant browser games that work on any device.
        Our games are optimized for quick loading and smooth gameplay, so you can start playing immediately.</p>
        <p style={{ marginTop: '1rem' }}>From quick casual games to immersive adventures, discover games that match your mood and interest.
        Play alone or challenge yourself with increasingly difficult levels.</p>
      </>
    ),
    categorySlugs: [],
    collectionName: 'Play Online',
    faqs: [
      {
        q: 'What device can I play on?',
        a: 'Play on any device with a modern web browser - PC, Mac, tablet, or smartphone.'
      },
      {
        q: 'Do games require plugins or downloads?',
        a: 'No, all games run directly in your browser. No Flash, no downloads, just instant play.'
      },
      {
        q: 'Why are these games free?',
        a: 'We partner with game developers who support free gaming. No ads, no hidden costs - just pure gaming fun.'
      },
      {
        q: 'Can I save my game progress?',
        a: 'Many games support local save files using browser storage. Check individual games for save functionality.'
      }
    ],
  }

  return <SeoGamePageTemplate cfg={config} />
}

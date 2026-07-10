import SeoGamePageTemplate, { SeoPageConfig } from '../components/seo/SeoGamePageTemplate'

export default function FreeRacingGamesPage() {
  const config: SeoPageConfig = {
    title: 'Free Racing Games - Fast-Paced Car Games | FreeGaming.ca',
    metaDescription: 'Play free racing games online. Drive fast cars, compete in races, and show off your driving skills. Speed, action, and thrills await!',
    canonical: '/free-racing-games',
    h1: 'Racing Games',
    intro: (
      <>
        <p>Rev your engines and hit the track! Our racing games collection features high-speed action,
        realistic driving physics, and intense competition.</p>
        <p style={{ marginTop: '1rem' }}>Choose your vehicle, select your track, and race against opponents or the clock.
        Feel the adrenaline rush of high-speed competition.</p>
      </>
    ),
    categorySlugs: ['racing'],
    collectionName: 'Racing Games',
    faqs: [
      {
        q: 'What types of racing games do you have?',
        a: 'We offer arcade racing, realistic driving simulators, drag racing, and more. Find your favorite style.'
      },
      {
        q: 'Can I customize my car?',
        a: 'Many games allow customization like paint jobs, upgrades, and tuning. Check individual games for options.'
      },
      {
        q: 'Are there career modes?',
        a: 'Some games feature full career modes where you progress and unlock new cars and tracks.'
      },
      {
        q: 'Do I need a racing wheel?',
        a: 'No! All games work great with keyboard and mouse controls. A wheel is optional for added immersion.'
      }
    ],
  }

  return <SeoGamePageTemplate config={config} />
}

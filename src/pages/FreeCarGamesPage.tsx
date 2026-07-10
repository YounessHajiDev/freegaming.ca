import SeoGamePageTemplate, { SeoPageConfig } from '../components/seo/SeoGamePageTemplate'

export default function FreeCarGamesPage() {
  const config: SeoPageConfig = {
    title: 'Free Car Games - Drive, Race & Explore | FreeGaming.ca',
    metaDescription: 'Play free car games online. Racing, driving, stunts, and vehicle action. Drive your dream car and race to victory!',
    canonical: '/free-car-games',
    h1: 'Car Games',
    intro: (
      <>
        <p>Get behind the wheel! Our car games collection features a wide variety of driving experiences,
        from realistic racing simulations to arcade-style driving games.</p>
        <p style={{ marginTop: '1rem' }}>Drive exotic sports cars, perform death-defying stunts, participate in intense races,
        and explore open worlds. The road is yours!</p>
      </>
    ),
    categorySlugs: ['racing', 'driving'],
    collectionName: 'Car Games',
    faqs: [
      {
        q: 'Can I customize my car?',
        a: 'Many games allow extensive customization including paint, wheels, suspension, and performance upgrades.'
      },
      {
        q: 'Are there open-world car games?',
        a: 'Yes! We have games with massive open worlds to explore and drive around freely.'
      },
      {
        q: 'Can I perform stunts?',
        a: 'Some games feature stunt driving, drifting, and trick modes for extra excitement.'
      },
      {
        q: 'What brands of cars are featured?',
        a: 'Games feature various brands from luxury sports cars to regular vehicles, depending on licensing.'
      }
    ],
  }

  return <SeoGamePageTemplate config={config} />
}

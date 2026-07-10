import SeoGamePageTemplate, { SeoPageConfig } from '../components/seo/SeoGamePageTemplate'

export default function FreeArcadeGamesPage() {
  const config: SeoPageConfig = {
    title: 'Free Arcade Games - Classic & Modern Arcade Fun | FreeGaming.ca',
    metaDescription: 'Play free arcade games online. Classic arcade games, modern takes, and retro fun. High scores, challenges, and endless entertainment.',
    canonical: '/free-arcade-games',
    h1: 'Arcade Games',
    intro: (
      <>
        <p>Experience the fun and excitement of arcade gaming! Our collection features both classic arcade games
        and modern takes on arcade-style gameplay.</p>
        <p style={{ marginTop: '1rem' }}>Chase high scores, unlock achievements, and enjoy simple yet addictive gameplay that keeps you coming back for more.
        Pure arcade fun at its finest.</p>
      </>
    ),
    categorySlugs: ['arcade'],
    collectionName: 'Arcade Games',
    faqs: [
      {
        q: 'What classic arcade games do you have?',
        a: 'We have modern recreations of classic arcade games with updated graphics and mechanics.'
      },
      {
        q: 'Can I compete for high scores?',
        a: 'Yes! Most arcade games track high scores and compare your performance.'
      },
      {
        q: 'Are arcade games simple to learn?',
        a: 'Yes! Arcade games are designed to be easy to learn but challenging to master.'
      },
      {
        q: 'Why are arcade games so addictive?',
        a: 'Arcade games combine simple mechanics with gradually increasing difficulty for that "one more try" feeling.'
      }
    ],
  }

  return <SeoGamePageTemplate cfg={config} />
}

import SeoGamePageTemplate, { SeoPageConfig } from '../components/seo/SeoGamePageTemplate'

export default function TwoPlayerPage() {
  const config: SeoPageConfig = {
    title: '2 Player Games - Free Multiplayer Games | FreeGaming.ca',
    metaDescription: 'Play free 2 player games online. Challenge friends, family, or the computer in exciting multiplayer games.',
    canonical: '/2-player-games',
    h1: '2 Player Games',
    intro: (
      <>
        <p>Challenge a friend! Our collection of two-player games lets you compete with someone on the same computer,
        or test your skills against AI opponents.</p>
        <p style={{ marginTop: '1rem' }}>From competitive sports to cooperative adventures, find games that are perfect for gaming together.
        Great for parties, family time, or friendly competition.</p>
      </>
    ),
    categorySlugs: [],
    collectionName: '2 Player Games',
    faqs: [
      {
        q: 'Can I play with friends online?',
        a: 'Many games support local multiplayer on the same device or browser. Some support online multiplayer - check game details.'
      },
      {
        q: 'Do both players need separate accounts?',
        a: 'No! Most 2-player games work with a single browser, taking turns or splitting the keyboard.'
      },
      {
        q: 'What types of 2-player games do you have?',
        a: 'We offer competitive games, cooperative games, sports games, and more. Something for every mood.'
      },
      {
        q: 'Are there games where I play against the computer?',
        a: 'Yes! Many single-player games include AI opponents you can challenge.'
      }
    ],
  }

  return <SeoGamePageTemplate cfg={config} />
}

import SeoGamePageTemplate, { SeoPageConfig } from '../components/seo/SeoGamePageTemplate'

export default function FreeSportsGamesPage() {
  const config: SeoPageConfig = {
    title: 'Free Sports Games - Play Popular Sports Online | FreeGaming.ca',
    metaDescription: 'Play free sports games online. Basketball, football, soccer, baseball, and more. Compete in realistic sports simulations.',
    canonical: '/free-sports-games',
    h1: 'Sports Games',
    intro: (
      <>
        <p>Compete in your favorite sports without leaving home! Our sports games collection features realistic simulations
        of popular sports around the world.</p>
        <p style={{ marginTop: '1rem' }}>Build your team, develop strategies, and compete against opponents. Experience the thrill of victory
        and the strategy of professional sports.</p>
      </>
    ),
    categorySlugs: ['sports'],
    collectionName: 'Sports Games',
    faqs: [
      {
        q: 'What sports are available?',
        a: 'We have basketball, football, soccer, baseball, hockey, golf, tennis, and more!'
      },
      {
        q: 'Can I manage a team?',
        a: 'Many games feature full team management where you draft, train, and develop players.'
      },
      {
        q: 'Are these realistic simulations?',
        a: 'Yes! Many games feature realistic graphics, physics, and authentic sports mechanics.'
      },
      {
        q: 'Can I play multiplayer sports games?',
        a: 'Absolutely! Compete against friends or join online tournaments.'
      }
    ],
  }

  return <SeoGamePageTemplate config={config} />
}

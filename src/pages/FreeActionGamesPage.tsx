import SeoGamePageTemplate, { SeoPageConfig } from '../components/seo/SeoGamePageTemplate'

export default function FreeActionGamesPage() {
  const config: SeoPageConfig = {
    title: 'Free Action Games - Intense & Exciting Games | FreeGaming.ca',
    metaDescription: 'Play free action games with intense gameplay. Adventure, combat, missions, and thrilling challenges. Non-stop action awaits!',
    canonical: '/free-action-games',
    h1: 'Action Games',
    intro: (
      <>
        <p>Experience non-stop action and adventure! Our action games collection features fast-paced gameplay,
        combat challenges, and exciting missions.</p>
        <p style={{ marginTop: '1rem' }}>From zombie survival to superhero adventures, immerse yourself in thrilling action-packed experiences
        that will keep you on the edge of your seat.</p>
      </>
    ),
    categorySlugs: ['action'],
    collectionName: 'Action Games',
    faqs: [
      {
        q: 'Are action games violent?',
        a: 'We have action games at various intensity levels. From cartoon action to realistic combat, choose what you prefer.'
      },
      {
        q: 'What weapons are available?',
        a: 'Games feature various weapons depending on the setting - guns, swords, magic, and more.'
      },
      {
        q: 'Can I play multiplayer action games?',
        a: 'Yes! We have both single-player and multiplayer action games available.'
      },
      {
        q: 'Are there boss fights?',
        a: 'Many action games feature epic boss encounters and challenging final missions.'
      }
    ],
  }

  return <SeoGamePageTemplate config={config} />
}

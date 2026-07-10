import SeoGamePageTemplate, { SeoPageConfig } from '../components/seo/SeoGamePageTemplate'

export default function GamesForKidsPage() {
  const config: SeoPageConfig = {
    title: 'Free Games for Kids - Safe Online Games | FreeGaming.ca',
    metaDescription: 'Safe, age-appropriate free games for kids. Educational and fun games designed for children. No ads, no scary content.',
    canonical: '/games-for-kids',
    h1: 'Games for Kids',
    intro: (
      <>
        <p>Looking for safe, fun games your kids will love? Our kids' game collection features age-appropriate titles
        that are both entertaining and educational.</p>
        <p style={{ marginTop: '1rem' }}>All games are carefully selected to ensure they're safe, non-violent, and free from inappropriate content.
        Parents can trust that their children are enjoying quality gaming experiences.</p>
      </>
    ),
    categorySlugs: [],
    collectionName: 'Games for Kids',
    faqs: [
      {
        q: 'Are these games safe for children?',
        a: 'Absolutely! All games are screened for age-appropriateness and safety. No scary content or ads.'
      },
      {
        q: 'Can games help my child learn?',
        a: 'Many games are educational, teaching skills like problem-solving, strategy, and creativity.'
      },
      {
        q: 'What age group are these games for?',
        a: 'We offer games for all ages from toddlers to teens. Check individual game ratings.'
      },
      {
        q: 'Are there any in-game purchases?',
        a: 'No! All games are completely free with no in-app purchases or hidden costs.'
      }
    ],
  }

  return <SeoGamePageTemplate config={config} />
}

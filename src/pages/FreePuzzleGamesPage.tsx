import SeoGamePageTemplate, { SeoPageConfig } from '../components/seo/SeoGamePageTemplate'

export default function FreePuzzleGamesPage() {
  const config: SeoPageConfig = {
    title: 'Free Puzzle Games - Brain Teasers & Logic Games | FreeGaming.ca',
    metaDescription: 'Play free puzzle games online. Solve brain teasers, logic puzzles, and more. Challenge your mind with our puzzle collection.',
    canonical: '/free-puzzle-games',
    h1: 'Puzzle Games',
    intro: (
      <>
        <p>Exercise your brain with our collection of challenging puzzle games. From classic logic puzzles to modern brain teasers,
        find the perfect mental challenge.</p>
        <p style={{ marginTop: '1rem' }}>Improve your problem-solving skills while having fun. Our puzzle games are perfect for relaxation,
        concentration, and keeping your mind sharp.</p>
      </>
    ),
    categorySlugs: ['puzzle'],
    collectionName: 'Puzzle Games',
    faqs: [
      {
        q: 'Are puzzle games good for your brain?',
        a: 'Yes! Puzzle games improve problem-solving skills, memory, and concentration. Perfect for brain training.'
      },
      {
        q: 'How difficult are the games?',
        a: 'We offer games at all difficulty levels, from beginner-friendly to expert challenges.'
      },
      {
        q: 'Can I learn strategies from playing?',
        a: 'Absolutely! Each game teaches different strategies and logical thinking approaches.'
      },
      {
        q: 'Are there timed puzzle games?',
        a: 'Yes, we have both timed challenges and relaxed puzzle games. Choose what suits your style.'
      }
    ],
  }

  return <SeoGamePageTemplate config={config} />
}

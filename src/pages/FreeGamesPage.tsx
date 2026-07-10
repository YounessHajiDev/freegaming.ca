import SeoGamePageTemplate, { SeoPageConfig } from '../components/seo/SeoGamePageTemplate'

export default function FreeGamesPage() {
  const config: SeoPageConfig = {
    title: 'Free Online Games - Play Hundreds Without Registration | FreeGaming.ca',
    metaDescription: 'Play hundreds of free online games at FreeGaming.ca. No registration, no downloads, no fees. Action, puzzle, racing, and more games for everyone.',
    canonical: '/free-games',
    h1: 'Free Online Games',
    intro: (
      <>
        <p>Welcome to FreeGaming.ca, your ultimate destination for free online games! We offer hundreds of exciting games
        that you can play instantly in your browser without any registration, downloads, or fees.</p>
        <p style={{ marginTop: '1rem' }}>Whether you're looking for action-packed adventures, mind-bending puzzles, or casual fun,
        we have something for everyone. All our games are carefully curated and regularly updated to bring you the latest gaming experiences.</p>
      </>
    ),
    categorySlugs: [],
    collectionName: 'Free Games',
    faqs: [
      {
        q: 'Do I need to register to play games?',
        a: 'No! All games on FreeGaming.ca are completely free and require no registration. Just click and play.'
      },
      {
        q: 'Are there any hidden fees?',
        a: 'Absolutely not. All games are 100% free with no hidden charges or premium purchases required.'
      },
      {
        q: 'Can I play on mobile devices?',
        a: 'Most of our games are optimized for mobile and desktop browsers. Check individual game pages for compatibility.'
      },
      {
        q: 'How often are new games added?',
        a: 'We add new games regularly to keep our library fresh and exciting. Check back often for the latest additions.'
      }
    ],
  }

  return <SeoGamePageTemplate cfg={config} />
}

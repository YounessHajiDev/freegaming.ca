import SeoGamePageTemplate, { SeoPageConfig } from '../components/seo/SeoGamePageTemplate'

export default function UnblockedGamesPage() {
  const config: SeoPageConfig = {
    title: 'Unblocked Games - Free Online Games for School & Work | FreeGaming.ca',
    metaDescription: 'Play unblocked games online. School-friendly games that work on any computer. Access FreeGaming.ca anytime for instant gaming fun.',
    canonical: '/unblocked-games',
    h1: 'Unblocked Games',
    intro: (
      <>
        <p>Looking for games you can play anywhere? Our unblocked games collection features titles that work
        on any computer or device, whether at school, work, or home.</p>
        <p style={{ marginTop: '1rem' }}>We're committed to keeping our games accessible and reliable, so you can enjoy gaming
        whenever you want. All games are lightweight and load quickly, even on slower connections.</p>
      </>
    ),
    categorySlugs: [],
    collectionName: 'Unblocked Games',
    faqs: [
      {
        q: 'Why are some games blocked?',
        a: 'Some networks restrict access to certain sites. Our games are designed to be lightweight and accessible on most networks.'
      },
      {
        q: 'Is it safe to play unblocked games?',
        a: 'Yes! All games on FreeGaming.ca are safe, virus-free, and carefully moderated.'
      },
      {
        q: 'Will playing use a lot of bandwidth?',
        a: 'Our games are optimized to use minimal bandwidth, making them perfect for limited connections.'
      },
      {
        q: "Can teachers see if I'm playing games?",
        a: 'Just like any website, network admins may see you\'re accessing FreeGaming.ca. Use gaming time responsibly!'
      }
    ],
  }

  return <SeoGamePageTemplate config={config} />
}

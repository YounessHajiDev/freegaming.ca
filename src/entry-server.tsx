import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'
import { HelmetProvider, type HelmetServerState } from 'react-helmet-async'
import { AppRoutes } from './App'
import { PrerenderProvider } from './lib/prerender'

export { fetchHomeData, fetchCollectionGames, fetchPopularGames, fetchNewGames, fetchCategoryData } from './lib/queries'
export { supabase } from './lib/supabase'

/** Must match the `canonical` + `categorySlugs` of each page in src/pages/seo/. */
export const SEO_COLLECTION_PAGES: { path: string; categorySlugs?: string[] }[] = [
  { path: '/free-games/' },
  { path: '/play-online/' },
  { path: '/unblocked-games/' },
  { path: '/games-for-kids/', categorySlugs: ['puzzle-games', 'casual-games', 'arcade-games', 'adventure-games'] },
  { path: '/2-player-games/', categorySlugs: ['multiplayer-games', 'sports-games', 'action-games'] },
  { path: '/free-puzzle-games/', categorySlugs: ['puzzle-games'] },
  { path: '/free-racing-games/', categorySlugs: ['racing-games'] },
  { path: '/free-action-games/', categorySlugs: ['action-games', 'shooting-games', 'adventure-games'] },
  { path: '/free-sports-games/', categorySlugs: ['sports-games'] },
  { path: '/free-arcade-games/', categorySlugs: ['arcade-games', 'casual-games'] },
  { path: '/free-car-games/', categorySlugs: ['racing-games'] },
]

export function render(url: string, data: Record<string, unknown>) {
  const helmetContext: { helmet?: HelmetServerState } = {}
  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <PrerenderProvider data={data}>
        <StaticRouter location={url}>
          <AppRoutes />
        </StaticRouter>
      </PrerenderProvider>
    </HelmetProvider>
  )
  const h = helmetContext.helmet
  const head = h
    ? [h.title.toString(), h.meta.toString(), h.link.toString(), h.script.toString()].join('\n    ')
    : ''
  return { html, head }
}

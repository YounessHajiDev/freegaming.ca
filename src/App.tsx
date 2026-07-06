import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import GamePage from './pages/GamePage'
import CategoryPage from './pages/CategoryPage'
import PopularPage from './pages/PopularPage'
import NewGamesPage from './pages/NewGamesPage'
import AdminPage from './pages/AdminPage'
import FreeGamesPage from './pages/seo/FreeGamesPage'
import PlayOnlinePage from './pages/seo/PlayOnlinePage'
import UnblockedGamesPage from './pages/seo/UnblockedGamesPage'
import GamesForKidsPage from './pages/seo/GamesForKidsPage'
import TwoPlayerPage from './pages/seo/TwoPlayerPage'
import NotFoundPage from './pages/NotFoundPage'
import { CookieBanner } from './components/ui/CookieBanner'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/games/:slug" element={<GamePage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/popular" element={<PopularPage />} />
          <Route path="/new-games" element={<NewGamesPage />} />
          <Route path="/free-games" element={<FreeGamesPage />} />
          <Route path="/play-online" element={<PlayOnlinePage />} />
          <Route path="/unblocked-games" element={<UnblockedGamesPage />} />
          <Route path="/games-for-kids" element={<GamesForKidsPage />} />
          <Route path="/2-player-games" element={<TwoPlayerPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      <CookieBanner />
    </BrowserRouter>
  )
}

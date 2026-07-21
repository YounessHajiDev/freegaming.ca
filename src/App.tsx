import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import GamePage from './pages/GamePage'
import CategoryPage from './pages/CategoryPage'
import PopularPage from './pages/PopularPage'
import NewGamesPage from './pages/NewGamesPage'
import SearchPage from './pages/SearchPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import TermsPage from './pages/TermsPage'
import AdminPage from './pages/AdminPage'
import PinterestPinsPage from './pages/PinterestPinsPage'
import FreeGamesPage from './pages/seo/FreeGamesPage'
import PlayOnlinePage from './pages/seo/PlayOnlinePage'
import UnblockedGamesPage from './pages/seo/UnblockedGamesPage'
import GamesForKidsPage from './pages/seo/GamesForKidsPage'
import TwoPlayerPage from './pages/seo/TwoPlayerPage'
import FreePuzzleGamesPage from './pages/seo/FreePuzzleGamesPage'
import FreeRacingGamesPage from './pages/seo/FreeRacingGamesPage'
import FreeActionGamesPage from './pages/seo/FreeActionGamesPage'
import FreeSportsGamesPage from './pages/seo/FreeSportsGamesPage'
import FreeArcadeGamesPage from './pages/seo/FreeArcadeGamesPage'
import FreeCarGamesPage from './pages/seo/FreeCarGamesPage'
import OffersPage from './pages/OffersPage'
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
          <Route path="/search" element={<SearchPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-of-service" element={<TermsPage />} />
          <Route path="/free-games" element={<FreeGamesPage />} />
          <Route path="/play-online" element={<PlayOnlinePage />} />
          <Route path="/unblocked-games" element={<UnblockedGamesPage />} />
          <Route path="/games-for-kids" element={<GamesForKidsPage />} />
          <Route path="/2-player-games" element={<TwoPlayerPage />} />
          <Route path="/free-puzzle-games" element={<FreePuzzleGamesPage />} />
          <Route path="/free-racing-games" element={<FreeRacingGamesPage />} />
          <Route path="/free-action-games" element={<FreeActionGamesPage />} />
          <Route path="/free-sports-games" element={<FreeSportsGamesPage />} />
          <Route path="/free-arcade-games" element={<FreeArcadeGamesPage />} />
          <Route path="/free-car-games" element={<FreeCarGamesPage />} />
          <Route path="/offers" element={<OffersPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/admin/pinterest" element={<PinterestPinsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
      <CookieBanner />
    </BrowserRouter>
  )
}

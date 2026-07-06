import { Outlet } from 'react-router-dom'
import Header from './Header'
import LiveTicker from './LiveTicker'
import Sidebar from './Sidebar'
import Footer from './Footer'
import MobileNav from './MobileNav'

export default function Layout() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-void)' }}>
      <Header />
      <LiveTicker />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <main style={{ flex: 1, minWidth: 0, padding: '1.5rem', paddingBottom: '5rem' }}>
          <Outlet />
        </main>
      </div>
      <Footer />
      <MobileNav />
    </div>
  )
}

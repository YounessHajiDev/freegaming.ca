import { Outlet } from 'react-router-dom'
import Header from './Header'
import LiveTicker from './LiveTicker'
import Sidebar from './Sidebar'
import Footer from './Footer'
import MobileNav from './MobileNav'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-void">
      <Header />
      <LiveTicker />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 min-w-0 p-4 md:p-6 pb-24 md:pb-6">
          <Outlet />
        </main>
      </div>
      <Footer />
      <MobileNav />
    </div>
  )
}

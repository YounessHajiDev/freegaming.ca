import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import Sidebar from './Sidebar'

export default function Layout() {
  return (
    <div className="site-wrapper">
      <Header />
      <div className="content-row">
        <main className="main-area">
          <Outlet />
        </main>
        <Sidebar />
      </div>
      <Footer />
    </div>
  )
}

import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import Sidebar from './Sidebar'

export default function Layout() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-void)' }}>
      <Header />
      <div style={{ display: 'flex', flex: 1, maxWidth: '1400px', margin: '0 auto', width: '100%', padding: '0 1rem', gap: '1.5rem' }}>
        <main style={{ flex: 1, minWidth: 0, padding: '1.5rem 0' }}>
          <Outlet />
        </main>
        <Sidebar />
      </div>
      <Footer />
    </div>
  )
}

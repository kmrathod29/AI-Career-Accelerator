import { Outlet } from 'react-router-dom'
import { Navbar } from '@components/ui/Navbar.jsx'

export function MainLayout() {
  return (
    <div className="relative flex min-h-screen flex-col bg-[var(--color-bg)] transition-colors duration-300">
      {/* Animated aurora background */}
      <div className="aurora-bg" aria-hidden="true">
        <div className="aurora-orb aurora-orb-1" />
        <div className="aurora-orb aurora-orb-2" />
        <div className="aurora-orb aurora-orb-3" />
      </div>

      <Navbar />
      <main className="relative flex-grow">
        <Outlet />
      </main>
    </div>
  )
}
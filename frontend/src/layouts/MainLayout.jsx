import { Outlet } from 'react-router-dom'
import { Navbar } from '@components/ui/Navbar.jsx'

export function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)] transition-colors duration-300">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  )
}
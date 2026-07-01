import { Outlet } from 'react-router-dom'
import { Container } from '@components/ui/Container.jsx'
import { Logo } from '@components/ui/Logo.jsx'
import { ThemeToggle } from '@components/ui/ThemeToggle.jsx'

export function MainLayout() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-[var(--color-border)] bg-[color:var(--color-surface)]/80 backdrop-blur">
        <Container className="flex items-center justify-between py-4">
          <Logo />
          <ThemeToggle />
        </Container>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
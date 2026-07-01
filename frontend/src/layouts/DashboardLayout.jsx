import { Outlet } from 'react-router-dom'
import { Container } from '@components/ui/Container.jsx'

export function DashboardLayout() {
  return (
    <main className="min-h-screen py-8">
      <Container>
        <Outlet />
      </Container>
    </main>
  )
}
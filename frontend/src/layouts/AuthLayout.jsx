import { Outlet } from 'react-router-dom'
import { Card } from '@components/ui/Card.jsx'
import { Container } from '@components/ui/Container.jsx'

export function AuthLayout() {
  return (
    <main className="min-h-screen py-12">
      <Container className="flex min-h-[calc(100vh-6rem)] items-center justify-center">
        <Card className="w-full max-w-md">
          <Outlet />
        </Card>
      </Container>
    </main>
  )
}
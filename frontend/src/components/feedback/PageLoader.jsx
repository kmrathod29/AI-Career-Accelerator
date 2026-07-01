import { Container } from '@components/ui/Container.jsx'
import { LoadingSpinner } from '@components/ui/LoadingSpinner.jsx'

export function PageLoader() {
  return (
    <Container className="flex min-h-[50vh] items-center justify-center">
      <LoadingSpinner />
    </Container>
  )
}
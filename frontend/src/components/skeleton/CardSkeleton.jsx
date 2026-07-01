import { Card } from '@components/ui/Card.jsx'
import { Skeleton } from './Skeleton.jsx'

export function CardSkeleton() {
  return (
    <Card className="space-y-4">
      <Skeleton className="h-5 w-2/5" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-32 w-full" />
    </Card>
  )
}
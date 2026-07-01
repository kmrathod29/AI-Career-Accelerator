import { Container } from '@components/ui/Container.jsx'
import { Card } from '@components/ui/Card.jsx'
import { Skeleton } from './Skeleton.jsx'

export function LandingSkeleton() {
  return (
    <div className="w-full space-y-16 py-12 md:py-20 animate-fade-in">
      {/* Hero Section Skeleton */}
      <Container className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
        {/* Left Column (Hero Details) */}
        <div className="space-y-8 lg:col-span-6">
          {/* Badge */}
          <div className="flex">
            <Skeleton className="h-6 w-48 rounded-full animate-shimmer" />
          </div>

          {/* Heading */}
          <div className="space-y-3">
            <Skeleton className="h-10 w-full md:h-12 animate-shimmer" />
            <Skeleton className="h-10 w-11/12 md:h-12 animate-shimmer" />
            <Skeleton className="h-10 w-4/5 md:h-12 animate-shimmer" />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full animate-shimmer" />
            <Skeleton className="h-4 w-11/12 animate-shimmer" />
            <Skeleton className="h-4 w-9/12 animate-shimmer" />
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4">
            <Skeleton className="h-12 w-36 rounded-xl animate-shimmer" />
            <Skeleton className="h-12 w-36 rounded-xl animate-shimmer" />
          </div>

          {/* Trust Badges */}
          <div className="flex items-center gap-4 pt-4">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-8 w-8 rounded-full border-2 border-[var(--color-bg)] animate-shimmer" />
              ))}
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-28 animate-shimmer" />
              <Skeleton className="h-3 w-36 animate-shimmer" />
            </div>
          </div>
        </div>

        {/* Right Column (Dashboard Illustration) */}
        <div className="relative lg:col-span-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Resume Score Card Skeleton */}
            <Card className="space-y-4 border-[var(--color-border)] bg-[var(--color-surface)]/40 p-5">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24 animate-shimmer" />
                <Skeleton className="h-6 w-12 rounded-full animate-shimmer" />
              </div>
              <div className="flex justify-center py-2">
                <Skeleton className="h-24 w-24 rounded-full animate-shimmer" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-3 w-full animate-shimmer" />
                <Skeleton className="h-3 w-5/6 animate-shimmer" />
              </div>
            </Card>

            {/* ATS Score Card Skeleton */}
            <Card className="space-y-4 border-[var(--color-border)] bg-[var(--color-surface)]/40 p-5">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-20 animate-shimmer" />
                <Skeleton className="h-5 w-16 rounded-full animate-shimmer" />
              </div>
              <div className="space-y-3 py-1">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Skeleton className="h-3 w-3 rounded-full animate-shimmer" />
                    <Skeleton className="h-3 flex-1 animate-shimmer" />
                  </div>
                ))}
              </div>
              <Skeleton className="h-8 w-full rounded-lg animate-shimmer" />
            </Card>

            {/* Interview Score Card Skeleton */}
            <Card className="space-y-4 border-[var(--color-border)] bg-[var(--color-surface)]/40 p-5 sm:col-span-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5 rounded-md animate-shimmer" />
                  <Skeleton className="h-4 w-32 animate-shimmer" />
                </div>
                <Skeleton className="h-4 w-20 animate-shimmer" />
              </div>
              {/* Waveform graphic skeleton */}
              <div className="flex h-12 items-end gap-1 px-2">
                {[4, 8, 5, 9, 3, 7, 5, 8, 4, 9, 6, 8, 3, 7, 5, 8, 4, 9, 3, 5, 8, 4].map((h, i) => (
                  <Skeleton
                    key={i}
                    className="flex-1 rounded-full animate-shimmer"
                    style={{ height: `${h * 10}%` }}
                  />
                ))}
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-28 animate-shimmer" />
                <Skeleton className="h-3 w-24 animate-shimmer" />
              </div>
            </Card>
          </div>
        </div>
      </Container>

      {/* Trusted By Section Skeleton */}
      <Container className="pt-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Skeleton className="h-4 w-48 animate-shimmer" />
          <div className="flex w-full items-center justify-between gap-8 py-4 opacity-50 overflow-hidden">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-6 w-24 flex-shrink-0 rounded animate-shimmer" />
            ))}
          </div>
        </div>
      </Container>
    </div>
  )
}

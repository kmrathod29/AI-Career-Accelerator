import { Container } from '@components/ui/Container.jsx'
import { Card } from '@components/ui/Card.jsx'
import { Skeleton } from './Skeleton.jsx'

export function LandingSkeleton() {
  return (
    <div className="w-full py-12 md:py-20">
      <Container className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">

        {/* ── Left column ─────────────────────────────────── */}
        <div className="space-y-8">
          {/* Badge */}
          <Skeleton className="h-7 w-48 rounded-full animate-shimmer" />

          {/* Heading lines */}
          <div className="space-y-3">
            <Skeleton className="h-11 w-full animate-shimmer rounded-xl" />
            <Skeleton className="h-11 w-10/12 animate-shimmer rounded-xl" />
            <Skeleton className="h-11 w-8/12 animate-shimmer rounded-xl" />
          </div>

          {/* Description lines */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full animate-shimmer" />
            <Skeleton className="h-4 w-11/12 animate-shimmer" />
            <Skeleton className="h-4 w-8/12 animate-shimmer" />
          </div>

          {/* CTA buttons */}
          <div className="flex gap-4">
            <Skeleton className="h-12 w-40 rounded-xl animate-shimmer" />
            <Skeleton className="h-12 w-40 rounded-xl animate-shimmer" />
          </div>

          {/* Trust row */}
          <div className="flex items-center gap-4 border-t border-[var(--color-border)]/50 pt-6">
            <div className="flex -space-x-2.5">
              {[0, 1, 2, 3].map((i) => (
                <Skeleton
                  key={i}
                  className="h-9 w-9 rounded-full border-2 border-[var(--color-bg)] animate-shimmer"
                />
              ))}
            </div>
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-28 animate-shimmer" />
              <Skeleton className="h-3 w-44 animate-shimmer" />
            </div>
          </div>
        </div>

        {/* ── Right column — dashboard card stubs ─────────── */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Resume Score */}
          <Card className="space-y-4 bg-[var(--color-surface)]/40 p-5">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24 animate-shimmer" />
              <Skeleton className="h-5 w-10 rounded-full animate-shimmer" />
            </div>
            <div className="flex justify-center py-3">
              <Skeleton className="h-24 w-24 rounded-full animate-shimmer" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-full animate-shimmer" />
              <Skeleton className="h-3 w-5/6 animate-shimmer" />
            </div>
          </Card>

          {/* ATS Score */}
          <Card className="space-y-4 bg-[var(--color-surface)]/40 p-5">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-20 animate-shimmer" />
              <Skeleton className="h-5 w-10 rounded-full animate-shimmer" />
            </div>
            <div className="space-y-2 py-1">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-8 w-full rounded-lg animate-shimmer" />
              ))}
            </div>
            <Skeleton className="h-9 w-full rounded-xl animate-shimmer" />
          </Card>

          {/* Interview Score — full width */}
          <Card className="space-y-4 bg-[var(--color-surface)]/40 p-5 sm:col-span-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Skeleton className="h-7 w-7 rounded-lg animate-shimmer" />
                <div className="space-y-1">
                  <Skeleton className="h-3.5 w-28 animate-shimmer" />
                  <Skeleton className="h-3 w-40 animate-shimmer" />
                </div>
              </div>
              <Skeleton className="h-5 w-20 rounded-full animate-shimmer" />
            </div>
            {/* Waveform bars */}
            <div className="flex h-14 items-end gap-1 rounded-xl bg-[var(--color-surface-2)]/40 px-3 py-1">
              {[4, 7, 5, 9, 3, 8, 5, 9, 4, 7, 6, 9, 3, 7, 5, 9, 4, 7, 3, 6, 8, 4].map((h, i) => (
                <Skeleton
                  key={i}
                  className="flex-1 rounded-full animate-shimmer"
                  style={{ height: `${h * 10}%` }}
                />
              ))}
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-32 animate-shimmer" />
              <Skeleton className="h-3 w-28 animate-shimmer" />
            </div>
          </Card>

          {/* Career Progress — full width */}
          <Card className="space-y-4 bg-[var(--color-surface)]/40 p-5 sm:col-span-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-32 animate-shimmer" />
              <Skeleton className="h-6 w-6 rounded-md animate-shimmer" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="space-y-2 rounded-xl border border-[var(--color-border)]/50 p-3">
                  <Skeleton className="h-3 w-14 animate-shimmer" />
                  <Skeleton className="h-7 w-10 animate-shimmer" />
                  <Skeleton className="h-1 w-full rounded-full animate-shimmer" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </Container>

      {/* Trusted by skeleton */}
      <div className="mt-16 border-y border-[var(--color-border)]/40 py-10">
        <Skeleton className="mx-auto mb-6 h-4 w-52 animate-shimmer" />
        <div className="flex items-center justify-around gap-8 px-8 opacity-40">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-5 w-20 flex-shrink-0 animate-shimmer" />
          ))}
        </div>
      </div>
    </div>
  )
}

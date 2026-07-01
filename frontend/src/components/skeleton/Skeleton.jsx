import { cn } from '@utils/classNames.js'

export function Skeleton({ className, ...props }) {
  return <div className={cn('animate-pulse rounded-xl bg-[var(--color-surface-3)]', className)} {...props} />
}
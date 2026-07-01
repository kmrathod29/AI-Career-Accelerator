import { forwardRef } from 'react'
import { cn } from '@utils/classNames.js'

export const Card = forwardRef(function Card({ className, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn(
        'rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-elevated)]',
        className,
      )}
      {...props}
    />
  )
})
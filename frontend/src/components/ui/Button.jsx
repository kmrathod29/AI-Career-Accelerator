import { forwardRef } from 'react'
import { cn } from '@utils/classNames.js'

export const Button = forwardRef(function Button(
  { className, variant = 'primary', type = 'button', ...props },
  ref,
) {
  const variantClasses = {
    primary: 'bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:opacity-90',
    secondary: 'bg-[var(--color-surface-2)] text-[var(--color-text)] hover:brightness-95',
    ghost: 'bg-transparent text-[var(--color-text)] hover:bg-[var(--color-surface-2)]',
  }

  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] disabled:pointer-events-none disabled:opacity-60',
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  )
})
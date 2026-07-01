import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@utils/classNames.js'

/**
 * PrimaryButton
 * Default: solid brand blue (#2563EB)
 * Hover:   gradient overlay fades in (from-primary → to-secondary)
 * No green/teal. Gradient only on hover — not the default state.
 */
export const PrimaryButton = forwardRef(function PrimaryButton(
  { className, children, type = 'button', ...props },
  ref,
) {
  return (
    <motion.button
      ref={ref}
      type={type}
      whileTap={{ scale: 0.97 }}
      className={cn(
        // Layout & shape
        'group relative inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-xl',
        // Solid blue base
        'bg-[var(--color-primary)] text-[var(--color-primary-foreground)]',
        // Sizing defaults (overridable via className)
        'px-6 py-3 text-sm font-semibold',
        // Shadow & transition
        'shadow-sm transition-shadow duration-200 hover:shadow-md',
        // Focus ring
        'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]',
        'disabled:pointer-events-none disabled:opacity-60',
        className,
      )}
      {...props}
    >
      {/* Gradient overlay: invisible by default, fades in on hover */}
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-br from-[var(--color-primary)] to-[var(--color-secondary)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      {/* Content sits above the gradient overlay */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  )
})

import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@utils/classNames.js'

export const SecondaryButton = forwardRef(function SecondaryButton(
  { className, children, type = 'button', ...props },
  ref,
) {
  return (
    <motion.button
      ref={ref}
      type={type}
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.97 }}
      className={cn(
        'inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/60 px-6 py-3 text-sm font-semibold text-[var(--color-text)] backdrop-blur-md transition-all hover:bg-[var(--color-surface-2)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] disabled:pointer-events-none disabled:opacity-60',
        className,
      )}
      {...props}
    >
      <span className="flex items-center justify-center gap-2">{children}</span>
    </motion.button>
  )
})

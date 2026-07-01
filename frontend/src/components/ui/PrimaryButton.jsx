import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@utils/classNames.js'

export const PrimaryButton = forwardRef(function PrimaryButton(
  { className, children, type = 'button', ...props },
  ref,
) {
  return (
    <motion.button
      ref={ref}
      type={type}
      whileHover={{ scale: 1.02, y: -1 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'relative cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:shadow-lg hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] disabled:pointer-events-none disabled:opacity-60',
        className,
      )}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  )
})

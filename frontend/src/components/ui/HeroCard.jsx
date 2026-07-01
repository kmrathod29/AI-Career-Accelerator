import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@utils/classNames.js'

/**
 * HeroCard — premium surface card for the hero dashboard illustration.
 * 24 px radius, soft shadow, no glow effects.
 * glow prop accepted but intentionally unused (no glowing per design spec).
 */
export const HeroCard = forwardRef(function HeroCard(
  // glow is accepted for backwards-compat but intentionally not applied (no glow per design spec)
  // eslint-disable-next-line no-unused-vars
  { className, children, glow, ...props },
  ref,
) {
  return (
    <motion.div
      ref={ref}
      whileHover={{ y: -3, transition: { duration: 0.18, ease: 'easeOut' } }}
      className={cn(
        'relative rounded-2xl border border-[var(--color-border)]',
        'bg-[var(--color-surface)] p-5',
        'shadow-[var(--shadow-card)]',
        'transition-shadow duration-200 hover:shadow-[var(--shadow-elevated)]',
        className,
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
})

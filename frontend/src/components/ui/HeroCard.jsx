import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@utils/classNames.js'

export const HeroCard = forwardRef(function HeroCard(
  { className, children, glow = false, ...props },
  ref,
) {
  return (
    <motion.div
      ref={ref}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={cn(
        'relative rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/80 p-5 shadow-[var(--shadow-elevated)] backdrop-blur-md transition-all duration-300 hover:border-[var(--color-primary)]/35',
        glow &&
          'before:absolute before:-inset-px before:-z-10 before:rounded-2xl before:bg-gradient-to-r before:from-[var(--color-primary)]/20 before:to-[var(--color-accent)]/20 before:opacity-0 before:blur-sm before:transition-opacity hover:before:opacity-100',
        className,
      )}
      {...props}
    >
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
})

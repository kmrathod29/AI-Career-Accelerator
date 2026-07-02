import { memo } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@utils/classNames.js'

/**
 * SocialLinks — circular social icon buttons with hover scale.
 *
 * Props:
 *   links — array of { label, href, icon: LucideComponent }
 */

const FADE = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, delay: i * 0.06 },
  }),
}

export const SocialLinks = memo(function SocialLinks({ links }) {
  return (
    <div className="flex items-center gap-2.5">
      {links.map(({ label, href, icon: Icon }, i) => (
        <motion.a
          key={label}
          custom={i}
          variants={FADE}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-full',
            'border border-[var(--color-border)]',
            'bg-[var(--color-surface)]',
            'text-[var(--color-muted)]',
            'transition-all duration-200',
            'hover:scale-110 hover:border-[var(--color-primary)]/30 hover:text-[var(--color-primary)]',
          )}
        >
          <Icon className="h-4 w-4" strokeWidth={1.8} aria-hidden="true" />
        </motion.a>
      ))}
    </div>
  )
})

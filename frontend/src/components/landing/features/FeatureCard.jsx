import { memo } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { cn } from '@utils/classNames.js'

/**
 * FeatureCard — premium card for the Features section.
 *
 * Props:
 *   icon        — Lucide icon component
 *   title       — card heading
 *   description — two-line description text
 *   index       — stagger delay index
 *
 * Design:
 *   - 24 px radius, soft shadow, thin border
 *   - No gradients inside
 *   - Hover: translateY(-6px), shadow increase, border highlight,
 *     icon scales, arrow slides right
 *   - Full dark mode support via CSS variables
 */

const FADE_UP = {
  hidden:  { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.08,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
}

export const FeatureCard = memo(function FeatureCard({
  icon: Icon,
  title,
  description,
  index = 0,
}) {
  return (
    <motion.article
      custom={index}
      variants={FADE_UP}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      className={cn(
        'group relative flex flex-col rounded-3xl border p-6',
        'border-[var(--color-border)]',
        'bg-[var(--color-surface)]',
        'shadow-[var(--shadow-card)]',
        'transition-all duration-300 ease-out',
        'hover:-translate-y-1.5 hover:shadow-[var(--shadow-elevated)]',
        'hover:border-[var(--color-primary)]/25',
      )}
    >
      {/* Icon container */}
      <div
        className={cn(
          'mb-5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
          'bg-[var(--color-primary)]/10',
          'transition-transform duration-300 ease-out group-hover:scale-110',
        )}
      >
        <Icon
          className="h-5 w-5 text-[var(--color-primary)]"
          strokeWidth={1.8}
          aria-hidden="true"
        />
      </div>

      {/* Title */}
      <h3 className="mb-2 text-base font-semibold tracking-tight text-[var(--color-text)]">
        {title}
      </h3>

      {/* Description */}
      <p className="mb-5 flex-1 text-sm leading-relaxed text-[var(--color-muted)]">
        {description}
      </p>

      {/* Arrow link hint */}
      <div className="flex items-center gap-1.5 text-sm font-medium text-[var(--color-primary)]">
        <span className="text-xs">Learn more</span>
        <ArrowRight
          className="h-3.5 w-3.5 transition-transform duration-300 ease-out group-hover:translate-x-1"
          aria-hidden="true"
        />
      </div>
    </motion.article>
  )
})

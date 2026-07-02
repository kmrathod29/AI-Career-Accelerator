import { memo } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@utils/classNames.js'

/**
 * TimelineStep — individual step for the How It Works timeline.
 *
 * Props:
 *   icon        — Lucide icon component
 *   number      — step number (1-based)
 *   title       — step heading
 *   description — short description
 *   index       — stagger delay index
 *   isLast      — if true, no connector line after this step
 *
 * Desktop: horizontal step with connector line to the right.
 * Mobile:  vertical step with connector line below.
 */

const FADE_UP = {
  hidden:  { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.12,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
}

export const TimelineStep = memo(function TimelineStep({
  icon: Icon,
  number,
  title,
  description,
  index = 0,
  isLast = false,
}) {
  return (
    <motion.div
      custom={index}
      variants={FADE_UP}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      className="group relative flex flex-1 flex-col items-center text-center"
    >
      {/* ── Connector line (horizontal on desktop, vertical on mobile) ── */}
      {!isLast && (
        <>
          {/* Desktop: horizontal connector to the right */}
          <div
            className="pointer-events-none absolute left-[calc(50%+32px)] top-8 hidden h-px lg:block"
            style={{ width: 'calc(100% - 64px)' }}
            aria-hidden="true"
          >
            <motion.div
              className="h-full w-full rounded-full"
              style={{ backgroundColor: 'var(--color-border)' }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: (index + 1) * 0.15,
                ease: 'easeOut',
              }}
            />
          </div>

          {/* Mobile: vertical connector below */}
          <div
            className="pointer-events-none absolute left-1/2 top-[68px] -translate-x-1/2 lg:hidden"
            style={{ height: 'calc(100% - 68px)' }}
            aria-hidden="true"
          >
            <motion.div
              className="h-full w-px rounded-full"
              style={{ backgroundColor: 'var(--color-border)' }}
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: (index + 1) * 0.12,
                ease: 'easeOut',
              }}
            />
          </div>
        </>
      )}

      {/* ── Step number + icon circle ─── */}
      <div
        className={cn(
          'relative z-10 mb-5 flex h-16 w-16 shrink-0 items-center justify-center rounded-full',
          'border border-[var(--color-border)]',
          'bg-[var(--color-surface)]',
          'shadow-[var(--shadow-card)]',
          'transition-all duration-300 ease-out',
          'group-hover:border-[var(--color-primary)]/30',
          'group-hover:shadow-[var(--shadow-elevated)]',
          'group-hover:scale-105',
        )}
      >
        {/* Step number badge */}
        <span
          className={cn(
            'absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full',
            'bg-[var(--color-primary)] text-[10px] font-bold text-white',
            'shadow-sm',
          )}
        >
          {number}
        </span>

        <Icon
          className="h-6 w-6 text-[var(--color-primary)]"
          strokeWidth={1.8}
          aria-hidden="true"
        />
      </div>

      {/* ── Text ─── */}
      <h3 className="mb-1.5 text-sm font-semibold tracking-tight text-[var(--color-text)] sm:text-base">
        {title}
      </h3>
      <p className="max-w-48 text-xs leading-relaxed text-[var(--color-muted)] sm:text-sm">
        {description}
      </p>
    </motion.div>
  )
})

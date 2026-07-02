import { memo } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@utils/classNames.js'

/**
 * FeatureTabs — vertical tab navigation for the product showcase.
 *
 * Props:
 *   features  — array of { id, label, desc, icon }
 *   activeId  — currently active feature ID
 *   onSelect  — callback when a tab is clicked
 *
 * Active tab has a left border indicator (layout-animated),
 * tinted background, and primary-coloured icon.
 * Inactive tabs have subtle hover state.
 */

const STAGGER = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
}

const FADE = {
  hidden:  { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35 } },
}

export const FeatureTabs = memo(function FeatureTabs({ features, activeId, onSelect }) {
  return (
    <motion.nav
      variants={STAGGER}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      className="space-y-1.5"
      aria-label="Feature navigation"
    >
      {features.map((f) => {
        const isActive = activeId === f.id
        const Icon = f.icon

        return (
          <motion.button
            key={f.id}
            variants={FADE}
            onClick={() => onSelect(f.id)}
            className={cn(
              'group relative flex w-full cursor-pointer items-center gap-3 rounded-xl border p-4 text-left transition-all duration-200',
              isActive
                ? 'border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5 shadow-sm'
                : 'border-transparent hover:bg-[var(--color-surface-2)]',
            )}
          >
            {/* Active indicator bar */}
            {isActive && (
              <motion.div
                layoutId="showcase-active-tab"
                className="absolute bottom-3 left-0 top-3 w-[3px] rounded-full bg-[var(--color-primary)]"
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              />
            )}

            {/* Icon */}
            <div
              className={cn(
                'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors',
                isActive ? 'bg-[var(--color-primary)]/15' : 'bg-[var(--color-surface-2)]',
              )}
            >
              <Icon
                className={cn(
                  'h-4 w-4 transition-colors',
                  isActive ? 'text-[var(--color-primary)]' : 'text-[var(--color-muted)]',
                )}
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </div>

            {/* Label + description */}
            <div className="min-w-0 flex-1">
              <p
                className={cn(
                  'truncate text-sm font-semibold transition-colors',
                  isActive ? 'text-[var(--color-text)]' : 'text-[var(--color-muted)]',
                )}
              >
                {f.label}
              </p>
              <p className="mt-0.5 truncate text-xs text-[var(--color-muted)]">
                {f.desc}
              </p>
            </div>
          </motion.button>
        )
      })}
    </motion.nav>
  )
})

import { memo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@utils/classNames.js'

/**
 * Accordion — reusable expand/collapse component.
 *
 * Props:
 *   question — the accordion header text
 *   answer   — the expandable body text
 *   index    — stagger delay index for scroll-reveal
 *   isOpen   — controlled open state
 *   onToggle — callback when toggled
 *
 * Design:
 *   - Rounded card with soft border
 *   - Smooth height animation via Framer Motion
 *   - Rotating chevron indicator
 *   - Premium hover/active states
 */

const FADE_UP = {
  hidden: { opacity: 0, y: 16 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      delay: i * 0.06,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
}

export const Accordion = memo(function Accordion({
  question,
  answer,
  index = 0,
  isOpen = false,
  onToggle,
}) {
  return (
    <motion.div
      custom={index}
      variants={FADE_UP}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      className={cn(
        'overflow-hidden rounded-2xl border transition-colors duration-200',
        isOpen
          ? 'border-[var(--color-primary)]/20 bg-[var(--color-surface)]'
          : 'border-[var(--color-border)] bg-[var(--color-surface)]',
      )}
    >
      {/* Header button */}
      <button
        onClick={onToggle}
        className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-[var(--color-surface-2)]/50 sm:px-6 sm:py-5"
        aria-expanded={isOpen}
      >
        <span
          className={cn(
            'text-sm font-semibold transition-colors sm:text-base',
            isOpen ? 'text-[var(--color-text)]' : 'text-[var(--color-text)]',
          )}
        >
          {question}
        </span>
        <ChevronDown
          className={cn(
            'h-4 w-4 shrink-0 text-[var(--color-muted)] transition-transform duration-300',
            isOpen && 'rotate-180',
          )}
          aria-hidden="true"
        />
      </button>

      {/* Expandable panel */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="border-t border-[var(--color-border)] px-5 pb-5 pt-4 sm:px-6">
              <p className="text-sm leading-relaxed text-[var(--color-muted)]">
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
})

import { memo } from 'react'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import { cn } from '@utils/classNames.js'

/**
 * TestimonialCard — premium review card for the Testimonials section.
 *
 * Props:
 *   name        — student name
 *   role        — role / title
 *   initials    — two-letter avatar initials
 *   gradient    — avatar background gradient string
 *   rating      — star count (1–5)
 *   feedback    — testimonial text
 *   badge       — feature name badge (e.g. "ATS Analyzer")
 *   index       — stagger delay index
 */

const FADE_UP = {
  hidden: { opacity: 0, y: 24 },
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

export const TestimonialCard = memo(function TestimonialCard({
  name,
  role,
  initials,
  gradient,
  rating = 5,
  feedback,
  badge,
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
        'group flex flex-col rounded-3xl border p-6',
        'border-[var(--color-border)]',
        'bg-[var(--color-surface)]',
        'shadow-[var(--shadow-card)]',
        'transition-all duration-300 ease-out',
        'hover:-translate-y-1.5 hover:shadow-[var(--shadow-elevated)]',
        'hover:border-[var(--color-primary)]/20',
      )}
    >
      {/* Header: avatar + info */}
      <div className="mb-4 flex items-center gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
          style={{ background: gradient }}
          aria-hidden="true"
        >
          {initials}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[var(--color-text)]">{name}</p>
          <p className="truncate text-xs text-[var(--color-muted)]">{role}</p>
        </div>
      </div>

      {/* Star rating */}
      <div className="mb-3 flex items-center gap-0.5" aria-label={`Rated ${rating} out of 5 stars`} role="img">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={cn(
              'h-3.5 w-3.5',
              i < rating ? 'fill-amber-400 text-amber-400' : 'fill-none text-[var(--color-surface-3)]',
            )}
            aria-hidden="true"
          />
        ))}
      </div>

      {/* Feedback */}
      <p className="mb-5 flex-1 text-sm leading-relaxed text-[var(--color-muted)]">
        &ldquo;{feedback}&rdquo;
      </p>

      {/* Feature badge */}
      {badge && (
        <span className="inline-flex w-fit items-center rounded-full bg-[var(--color-primary)]/10 px-3 py-1 text-[11px] font-semibold text-[var(--color-primary)]">
          {badge}
        </span>
      )}
    </motion.article>
  )
})

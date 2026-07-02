import { memo } from 'react'
import { cn } from '@utils/classNames.js'

/**
 * FeatureCard — reusable product preview card for the hero illustration.
 * Props:
 *   title        — card header label
 *   badge        — optional pill label (string)
 *   badgeVariant — 'blue' | 'green' | 'amber' | 'none'
 *   icon         — Lucide icon component
 *   className    — extra classes for the outer container
 *   children     — card body content
 *
 * Badge colours use CSS variables so they adapt to dark mode
 * (e.g. emerald-50 → emerald-500/15 with lighter text).
 */
const BADGE_STYLES = {
  blue:  'bg-[var(--color-surface-2)] text-[var(--color-primary)]',
  green: 'bg-[var(--badge-green-bg)] text-[var(--badge-green-text)]',
  amber: 'bg-[var(--badge-amber-bg)] text-[var(--badge-amber-text)]',
  none:  '',
}

export const FeatureCard = memo(function FeatureCard({
  title,
  badge,
  badgeVariant = 'blue',
  icon: Icon,
  className,
  children,
  ...props
}) {
  return (
    <article
      className={cn(
        'rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4',
        'shadow-[var(--shadow-card)]',
        className,
      )}
      {...props}
    >
      {/* ── Card header ─────────────────────────────────── */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {Icon && (
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[var(--color-primary)]/10">
              <Icon className="h-3.5 w-3.5 text-[var(--color-primary)]" aria-hidden="true" />
            </div>
          )}
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text)]">
            {title}
          </span>
        </div>

        {badge && badgeVariant !== 'none' && (
          <span className={cn(
            'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold',
            BADGE_STYLES[badgeVariant],
          )}>
            {badge}
          </span>
        )}
      </div>

      {/* ── Card body ───────────────────────────────────── */}
      <div className="space-y-1.5">
        {children}
      </div>
    </article>
  )
})

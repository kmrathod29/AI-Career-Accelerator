import { memo } from 'react'
import { motion } from 'framer-motion'
import {
  Target,
  Brain,
  CheckCircle2,
} from 'lucide-react'
import { cn } from '@utils/classNames.js'

/* ── Shared card base ────────────────────────────────────────────── */
/* Uses CSS variable tokens for dark mode support */
const BASE =
  'absolute rounded-[18px] border p-3 backdrop-blur-sm'

const ENTER = {
  hidden:  { opacity: 0, y: 16, scale: 0.94 },
  visible: { opacity: 1, y: 0,  scale: 1    },
}

/* ── Generic metric card ─────────────────────────────────────────── */
function MetricCard({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  value,
  sub,
  className,
  delay = 0,
  floatCls = 'animate-float-1',
}) {
  return (
    <motion.div
      variants={ENTER}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.42, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -4, transition: { duration: 0.15 } }}
      className={cn(BASE, floatCls, className)}
      style={{
        backgroundColor: 'var(--floating-bg)',
        borderColor: 'var(--floating-border)',
        boxShadow: 'var(--floating-shadow)',
      }}
    >
      {/* Icon + title row */}
      <div className="mb-1.5 flex items-center gap-1.5">
        <div className={cn('flex h-5 w-5 shrink-0 items-center justify-center rounded-md', iconBg)}>
          <Icon className={cn('h-3 w-3', iconColor)} aria-hidden="true" />
        </div>
        <span className="text-[9px] font-semibold uppercase tracking-wide text-[var(--color-muted)]">
          {title}
        </span>
      </div>

      {/* Large value */}
      <p className="text-[19px] font-bold leading-none tracking-tight text-[var(--color-text)]">
        {value}
      </p>

      {/* Sub-label */}
      {sub && (
        <p className="mt-1 text-[9px] font-medium text-[var(--color-muted)]">{sub}</p>
      )}
    </motion.div>
  )
}

/* ── All floating cards — intentionally reduced to 3 ─────────────── */
/**
 * Only 3 accent cards to support the main dashboard, not surround it.
 * Positioned in empty spaces: top-right, bottom-left, lower-right.
 *
 * 1. ATS Score — top-right (primary metric, high visibility)
 * 2. AI Coach — bottom-left (shows AI assistance value)
 * 3. Today's Goal — lower-right (engagement/actionability)
 */
export const FloatingCards = memo(function FloatingCards() {
  return (
    <>
      {/* 1 – ATS Score: top-right, overlapping dashboard top-right corner */}
      <MetricCard
        icon={Target}
        iconBg="bg-emerald-500/15" iconColor="text-emerald-500"
        title="ATS Score"  value="94%"  sub="↑ 6% this week"
        delay={0.30}  floatCls="animate-float-1"
        className="right-14 top-0 z-30 w-[118px]"
      />

      {/* 2 – AI Coach: bottom-left area */}
      <MetricCard
        icon={Brain}
        iconBg="bg-rose-500/15" iconColor="text-rose-500"
        title="AI Coach"  value="Resume ✓"  sub="Improved +12 pts"
        delay={0.50}  floatCls="animate-float-3"
        className="bottom-[80px] left-2 z-[25] w-[140px]"
      />

      {/* 3 – Today's Goal: lower-right corner */}
      <MetricCard
        icon={CheckCircle2}
        iconBg="bg-teal-500/15" iconColor="text-teal-500"
        title="Today's Goal"  value="Interview #4"  sub="Complete in 2h"
        delay={0.70}  floatCls="animate-float-2"
        className="bottom-[-15px] right-[-25px] z-[25] w-[140px]"
      />
    </>
  )
})

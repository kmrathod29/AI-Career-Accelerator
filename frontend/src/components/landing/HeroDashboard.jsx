import { memo } from 'react'
import { motion } from 'framer-motion'
import { MainDashboard } from './dashboard/MainDashboard.jsx'
import { FloatingCards } from './dashboard/FloatingCards.jsx'

/**
 * HeroDashboard — right-side product illustration.
 *
 * Layout strategy (desktop — lg+):
 *   - Container is `relative h-[580px]`.
 *   - MainDashboard fills `left-[130px]` → right edge, leaving room for
 *     the left-side floating cards to "bleed" into the dashboard.
 *   - FloatingCards are absolutely positioned siblings; they overlap the
 *     dashboard naturally via z-index.
 *   - Two soft radial glows sit behind everything (z-0).
 *
 * Mobile / tablet (below lg):
 *   - Dashboard scales down and remains visible (never hidden).
 *   - Floating cards are hidden on mobile to keep layout clean.
 *   - Uses transform: scale(0.72) for compact fit.
 *
 * This section is intentionally aria-hidden — it is decorative.
 */
export const HeroDashboard = memo(function HeroDashboard() {
  return (
    <>
      {/* ── Desktop layout (lg+) — absolute positioning ─────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        aria-hidden="true"
        className="relative hidden h-[580px] w-full select-none lg:block"
      >
        {/* ── Ambient background glows ─────────────────────── */}
        {/* Primary blue glow — centred behind the dashboard */}
        <div
          className="pointer-events-none absolute left-1/2 top-[40px] h-[380px] w-[380px] -translate-x-[35%] rounded-full"
          style={{
            background:
              'radial-gradient(circle at center, rgba(37,99,235,0.07) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />
        {/* Secondary violet glow — bottom-right accent */}
        <div
          className="pointer-events-none absolute bottom-[40px] right-[60px] h-[200px] w-[200px] rounded-full"
          style={{
            background:
              'radial-gradient(circle at center, rgba(99,102,241,0.05) 0%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        />

        {/* ── Main Dashboard ───────────────────────────────── */}
        {/* Offset left-[130px] so floating cards bleed onto its left edge */}
        <div className="absolute bottom-0 right-0 top-[40px] z-10 w-[calc(100%-130px)]">
          <MainDashboard />
        </div>

        {/* ── Floating metric cards ────────────────────────── */}
        {/* z-[25] / z-30 — sits above the main dashboard */}
        <FloatingCards />
      </motion.div>

      {/* ── Mobile / Tablet layout (below lg) ────────────────── */}
      {/* Dashboard scaled down, always visible. No floating cards. */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        aria-hidden="true"
        className="relative mx-auto w-full max-w-md select-none lg:hidden"
      >
        {/* Subtle glow behind mobile dashboard */}
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-[200px] w-[200px] -translate-x-1/2 rounded-full"
          style={{
            background:
              'radial-gradient(circle at center, rgba(37,99,235,0.06) 0%, transparent 70%)',
            filter: 'blur(30px)',
          }}
        />
        <div
          style={{
            transform: 'scale(0.82)',
            transformOrigin: 'top center',
          }}
        >
          <MainDashboard />
        </div>
      </motion.div>
    </>
  )
})

import { memo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { DashboardPreview } from './DashboardPreview.jsx'

/**
 * FeaturePreview — right-side preview container for desktop layout.
 *
 * Wraps DashboardPreview in AnimatePresence so switching tabs
 * produces a smooth fade-slide transition. The container has
 * a fixed minimum height to prevent layout shifts.
 */
export const FeaturePreview = memo(function FeaturePreview({ activeId }) {
  return (
    <div
      className="relative min-h-96 overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-card)] lg:min-h-[460px]"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={activeId}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <DashboardPreview featureId={activeId} />
        </motion.div>
      </AnimatePresence>
    </div>
  )
})

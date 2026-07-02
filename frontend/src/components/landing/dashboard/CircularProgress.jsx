import { memo } from 'react'
import { motion } from 'framer-motion'

/**
 * CircularProgress — SVG ring with animated stroke-dashoffset on mount.
 * Uses Framer Motion so the ring draws in smoothly.
 *
 * Track colour uses --progress-track CSS variable
 * so it adapts to dark mode (#1E293B) vs light (#F1F5F9).
 */
export const CircularProgress = memo(function CircularProgress({
  value,
  size = 52,
  strokeWidth = 4.5,
  color = '#2563EB',
  label,
}) {
  const r    = (size - strokeWidth * 2) / 2
  const circ = 2 * Math.PI * r
  const dash = circ * (1 - Math.min(value, 100) / 100)

  return (
    <div
      className="flex flex-col items-center gap-1.5"
      role="meter"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ? `${label}: ${value}%` : `Progress: ${value}%`}
    >
      <div className="relative flex items-center justify-center">
        <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
          {/* Track — theme-aware via CSS variable */}
          <circle
            cx={size / 2} cy={size / 2} r={r}
            fill="none" stroke="var(--progress-track)" strokeWidth={strokeWidth}
          />
          {/* Animated fill */}
          <motion.circle
            cx={size / 2} cy={size / 2} r={r}
            fill="none" stroke={color} strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: dash }}
            transition={{ duration: 1.1, ease: 'easeOut', delay: 0.5 }}
          />
        </svg>
        {/* Centre label */}
        <span className="absolute text-[10px] font-bold text-[var(--color-text)]">
          {value}%
        </span>
      </div>

      {label && (
        <span className="text-center text-[9px] font-medium leading-tight text-[var(--color-muted)]">
          {label}
        </span>
      )}
    </div>
  )
})

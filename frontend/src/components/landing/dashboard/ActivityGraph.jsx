import { memo } from 'react'
import { motion } from 'framer-motion'

/* 30 data points representing daily career actions over the last month */
const DATA = [
  2, 5, 3, 7, 4, 8, 3, 9, 6, 4,
  8, 7, 5, 9, 6, 8, 4, 7, 9, 5,
  8, 6, 9, 7, 8, 5, 9, 7, 8, 9,
]
const MAX   = Math.max(...DATA)
const TOTAL = DATA.length
const VB_W  = TOTAL * 10  // 300 units wide
const VB_H  = 52

export const ActivityGraph = memo(function ActivityGraph() {
  const barW = VB_W / TOTAL - 2 // 2 px gap between bars

  return (
    <svg
      className="w-full"
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      preserveAspectRatio="none"
      role="img"
      aria-label="30-day career activity graph"
    >
      {DATA.map((v, i) => {
        const h   = Math.max(4, (v / MAX) * (VB_H - 8))
        const x   = i * (barW + 2) + 1
        const y   = VB_H - h - 4
        const op  = 0.22 + (v / MAX) * 0.68

        return (
          <motion.rect
            key={i}
            x={x} y={y}
            width={barW} height={h}
            rx={2}
            fill="#2563EB"
            initial={{ opacity: 0 }}
            animate={{ opacity: op }}
            transition={{ duration: 0.3, delay: 0.022 * i }}
            aria-hidden="true"
          />
        )
      })}
    </svg>
  )
})

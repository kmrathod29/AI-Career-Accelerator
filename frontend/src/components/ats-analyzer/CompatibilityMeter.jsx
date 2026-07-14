import { motion } from 'framer-motion'
import { Shield } from 'lucide-react'

/**
 * CompatibilityMeter — three-segment ATS compatibility progress bar.
 */
export function CompatibilityMeter({ compatible = 0, needsImprovement = 0, critical = 0 }) {
	const total = compatible + needsImprovement + critical
	if (total === 0) return null

	const segments = [
		{ label: 'Compatible', count: compatible, color: 'bg-emerald-500', textColor: 'text-emerald-500' },
		{ label: 'Needs Improvement', count: needsImprovement, color: 'bg-amber-500', textColor: 'text-amber-500' },
		{ label: 'Critical Issues', count: critical, color: 'bg-red-500', textColor: 'text-red-500' },
	]

	return (
		<div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
			<div className="mb-4 flex items-center gap-2">
				<Shield className="h-4 w-4 text-[var(--color-primary)]" strokeWidth={1.8} />
				<h3 className="text-sm font-semibold text-[var(--color-text)]">
					ATS Compatibility
				</h3>
			</div>

			{/* Progress bar */}
			<div className="mb-4 flex h-3 overflow-hidden rounded-full bg-[var(--progress-track)]">
				{segments.map((seg) =>
					seg.count > 0 ? (
						<motion.div
							key={seg.label}
							initial={{ width: 0 }}
							animate={{ width: `${(seg.count / total) * 100}%` }}
							transition={{ duration: 0.8, ease: 'easeOut' }}
							className={`${seg.color} first:rounded-l-full last:rounded-r-full`}
						/>
					) : null,
				)}
			</div>

			{/* Legend */}
			<div className="flex flex-wrap items-center gap-4">
				{segments.map((seg) => (
					<div key={seg.label} className="flex items-center gap-2">
						<span className={`h-2 w-2 rounded-full ${seg.color}`} />
						<span className="text-xs text-[var(--color-muted)]">{seg.label}</span>
						<span className={`text-xs font-semibold ${seg.textColor}`}>{seg.count}</span>
					</div>
				))}
			</div>
		</div>
	)
}

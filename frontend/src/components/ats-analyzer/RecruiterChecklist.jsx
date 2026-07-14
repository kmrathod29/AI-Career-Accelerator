import { motion } from 'framer-motion'
import { ClipboardCheck, Check, X } from 'lucide-react'

/**
 * RecruiterChecklist — pass/fail checklist with completion percentage.
 */
export function RecruiterChecklist({ items = [] }) {
	const passedCount = items.filter((item) => item.passed).length
	const percentage = items.length > 0 ? Math.round((passedCount / items.length) * 100) : 0

	return (
		<div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
			<div className="mb-4 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<ClipboardCheck className="h-4 w-4 text-[var(--color-primary)]" strokeWidth={1.8} />
					<h3 className="text-sm font-semibold text-[var(--color-text)]">
						Recruiter Checklist
					</h3>
				</div>
				<span className="text-xs font-semibold text-[var(--color-primary)]">
					{percentage}%
				</span>
			</div>

			{/* Completion bar */}
			<div className="mb-4 h-1.5 overflow-hidden rounded-full bg-[var(--progress-track)]">
				<motion.div
					initial={{ width: 0 }}
					animate={{ width: `${percentage}%` }}
					transition={{ duration: 0.8, ease: 'easeOut' }}
					className="h-full rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]"
				/>
			</div>

			{/* Checklist items */}
			<div className="space-y-1.5">
				{items.map((item, i) => (
					<motion.div
						key={item.id}
						initial={{ opacity: 0, x: -8 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.25, delay: i * 0.03 }}
						className="flex items-center gap-3 rounded-lg px-2 py-1.5"
					>
						{item.passed ? (
							<div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
								<Check className="h-3 w-3 text-emerald-500" strokeWidth={2.5} />
							</div>
						) : (
							<div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/10">
								<X className="h-3 w-3 text-red-500" strokeWidth={2.5} />
							</div>
						)}
						<span
							className={`text-[13px] ${
								item.passed ? 'text-[var(--color-text)]' : 'text-[var(--color-muted)]'
							}`}
						>
							{item.label}
						</span>
					</motion.div>
				))}
			</div>
		</div>
	)
}

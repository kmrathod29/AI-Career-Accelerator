import { motion } from 'framer-motion'
import { History, Eye, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { getScoreTier } from '@constants/atsAnalyzer.js'
import { cn } from '@utils/classNames.js'

const TIER_BADGE = {
	emerald: 'bg-emerald-500/10 text-emerald-500',
	blue: 'bg-blue-500/10 text-blue-500',
	amber: 'bg-amber-500/10 text-amber-500',
	red: 'bg-red-500/10 text-red-500',
}

/**
 * AnalysisHistory — recent ATS analyses list.
 */
export function AnalysisHistory({ history = [] }) {
	if (history.length === 0) return null

	return (
		<div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
			<div className="mb-4 flex items-center gap-2">
				<History className="h-4 w-4 text-[var(--color-primary)]" strokeWidth={1.8} />
				<h3 className="text-sm font-semibold text-[var(--color-text)]">
					Recent Analyses
				</h3>
			</div>

			<div className="space-y-2">
				{history.map((entry, i) => {
					const tier = getScoreTier(entry.score)
					const badgeClass = TIER_BADGE[tier.color] ?? TIER_BADGE.blue

					return (
						<motion.div
							key={entry.id}
							initial={{ opacity: 0, y: 8 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3, delay: i * 0.04 }}
							className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3.5 py-3"
						>
							{/* File info */}
							<div className="min-w-0 flex-1">
								<p className="truncate text-[13px] font-medium text-[var(--color-text)]">
									{entry.fileName}
								</p>
								<p className="mt-0.5 text-[11px] text-[var(--color-muted)]">
									{new Date(entry.date).toLocaleDateString('en-US', {
										month: 'short',
										day: 'numeric',
										year: 'numeric',
									})}
								</p>
							</div>

							{/* Score badge */}
							<span
								className={cn(
									'shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold',
									badgeClass,
								)}
							>
								{entry.score}/100
							</span>

							{/* Actions */}
							<div className="flex shrink-0 items-center gap-1">
								<button
									type="button"
									onClick={() => toast.info('Report view coming soon')}
									className="rounded-lg p-1.5 text-[var(--color-muted)] transition-colors hover:bg-[var(--color-surface-3)] hover:text-[var(--color-text)]"
									title="View Report"
								>
									<Eye className="h-3.5 w-3.5" />
								</button>
								<button
									type="button"
									onClick={() => toast.info('Re-analysis coming soon')}
									className="rounded-lg p-1.5 text-[var(--color-muted)] transition-colors hover:bg-[var(--color-surface-3)] hover:text-[var(--color-text)]"
									title="Re-analyze"
								>
									<RefreshCw className="h-3.5 w-3.5" />
								</button>
							</div>
						</motion.div>
					)
				})}
			</div>
		</div>
	)
}

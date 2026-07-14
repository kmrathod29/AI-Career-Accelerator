import { motion } from 'framer-motion'
import { AlertTriangle, Wrench } from 'lucide-react'
import { toast } from 'sonner'
import { SEVERITY_CONFIG } from '@constants/atsAnalyzer.js'
import { cn } from '@utils/classNames.js'

/**
 * AtsIssues — warning list card with severity badges and fix buttons.
 */
export function AtsIssues({ issues = [] }) {
	const highCount = issues.filter((i) => i.severity === 'high').length
	const mediumCount = issues.filter((i) => i.severity === 'medium').length
	const lowCount = issues.filter((i) => i.severity === 'low').length

	return (
		<div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
			<div className="mb-4 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<AlertTriangle className="h-4 w-4 text-amber-500" strokeWidth={1.8} />
					<h3 className="text-sm font-semibold text-[var(--color-text)]">
						ATS Issues
					</h3>
				</div>
				<div className="flex items-center gap-2">
					{highCount > 0 && (
						<span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold text-red-500">
							{highCount} High
						</span>
					)}
					{mediumCount > 0 && (
						<span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-500">
							{mediumCount} Medium
						</span>
					)}
					{lowCount > 0 && (
						<span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-500">
							{lowCount} Low
						</span>
					)}
				</div>
			</div>

			<div className="space-y-2">
				{issues.map((issue, i) => {
					const severity = SEVERITY_CONFIG[issue.severity] ?? SEVERITY_CONFIG.low
					return (
						<motion.div
							key={issue.id}
							initial={{ opacity: 0, x: -8 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.3, delay: i * 0.04 }}
							className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3.5 py-3"
						>
							<span
								className={cn(
									'shrink-0 rounded-md border px-2 py-0.5 text-[10px] font-semibold',
									severity.bgClass,
									severity.textClass,
									severity.borderClass,
								)}
							>
								{severity.label}
							</span>

							<p className="min-w-0 flex-1 text-[13px] text-[var(--color-text)]">
								{issue.text}
							</p>

							<motion.button
								type="button"
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={() => toast.info('Fix suggestion coming soon')}
								className="flex shrink-0 items-center gap-1.5 rounded-lg bg-[var(--color-primary)]/10 px-2.5 py-1.5 text-[11px] font-medium text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary)]/20"
							>
								<Wrench className="h-3 w-3" />
								Fix
							</motion.button>
						</motion.div>
					)
				})}
			</div>
		</div>
	)
}

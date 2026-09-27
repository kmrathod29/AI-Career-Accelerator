import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, CheckCircle, Wrench, X } from 'lucide-react'
import { SEVERITY_CONFIG } from '@constants/atsAnalyzer.js'
import { cn } from '@utils/classNames.js'
import { atsStore, useAtsVerificationOutcome, useAtsCurrentId } from '@/stores/atsStore.js'
import { ResumeVerificationModal } from './ResumeVerificationModal.jsx'

/**
 * AtsIssues — warning list card with severity badges, "I've Fixed This" verification workflow,
 * and post-reanalysis resolution status banner.
 */
export function AtsIssues({ issues = [] }) {
	const [activeIssue, setActiveIssue] = useState(null)
	const outcome = useAtsVerificationOutcome()
	const currentId = useAtsCurrentId()

	const highCount = issues.filter((i) => i.severity === 'high').length
	const mediumCount = issues.filter((i) => i.severity === 'medium').length
	const lowCount = issues.filter((i) => i.severity === 'low').length

	const handleConfirmUpload = async (file) => {
		if (!activeIssue) return
		const target = {
			type: 'issue',
			id: activeIssue.id,
			text: activeIssue.text,
		}
		await atsStore.reAnalyzeWithFile(file, currentId, target)
		setActiveIssue(null)
	}

	return (
		<div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
			{/* Header */}
			<div className="mb-3 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<AlertTriangle className="h-4 w-4 text-amber-500" strokeWidth={1.8} />
					<h3 className="text-base font-bold tracking-[-0.02em] text-[var(--color-text)]">
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

			{/* Required Helper text */}
			<p className="mb-4 text-xs leading-relaxed text-[var(--color-muted)]">
				Fix the issue in your resume, then upload the updated version to verify it.
			</p>

			{/* Resolution status banner */}
			<AnimatePresence>
				{outcome && outcome.type === 'issue' && (
					<motion.div
						initial={{ opacity: 0, y: -6 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -6 }}
						className={cn(
							'mb-4 flex items-start gap-2.5 rounded-xl border p-3 text-xs leading-relaxed',
							outcome.resolved
								? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
								: 'border-amber-500/30 bg-amber-500/10 text-amber-400',
						)}
					>
						{outcome.resolved ? (
							<CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
						) : (
							<AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
						)}

						<div className="min-w-0 flex-1">
							<p className="font-semibold">
								{outcome.resolved
									? 'Issue resolved after re-analysis.'
									: 'This issue is still detected in your resume.'}
							</p>
							<p className="mt-0.5 opacity-90 truncate">
								"{outcome.text}"
							</p>
						</div>

						<button
							type="button"
							onClick={() => atsStore.clearVerificationOutcome()}
							className="rounded p-1 opacity-70 transition-opacity hover:opacity-100 cursor-pointer"
						>
							<X className="h-3.5 w-3.5" />
						</button>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Issues list */}
			{issues.length === 0 ? (
				<div className="py-6 text-center text-sm text-[var(--color-muted)]">
					All detected issues resolved! 🎉
				</div>
			) : (
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
										'shrink-0 rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
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
									whileHover={{ scale: 1.03 }}
									whileTap={{ scale: 0.97 }}
									onClick={() => setActiveIssue(issue)}
									className="flex shrink-0 items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 py-1.5 text-[11px] font-medium text-[var(--color-text)] transition-colors hover:border-[var(--color-primary)]/40 hover:bg-[var(--color-surface-3)] hover:text-[var(--color-primary)] cursor-pointer"
									title="Fix this issue in your resume and upload to verify"
								>
									<Wrench className="h-3 w-3" />
									I've Fixed This
								</motion.button>
							</motion.div>
						)
					})}
				</div>
			)}

			{/* Verification & Upload Modal */}
			<ResumeVerificationModal
				isOpen={Boolean(activeIssue)}
				onClose={() => setActiveIssue(null)}
				mode="issue"
				targetItem={activeIssue}
				onConfirmUpload={handleConfirmUpload}
			/>
		</div>
	)
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { History, Eye, Trash2, AlertTriangle, X, Check } from 'lucide-react'
import { toast } from 'sonner'
import { atsStore } from '@/stores/atsStore.js'
import { getScoreTier } from '@constants/atsAnalyzer.js'
import { cn } from '@utils/classNames.js'
import { formatDate } from '@utils/dateTime.js'

const TIER_BADGE = {
	emerald: 'bg-emerald-500/10 text-emerald-500',
	blue: 'bg-blue-500/10 text-blue-500',
	amber: 'bg-amber-500/10 text-amber-500',
	red: 'bg-red-500/10 text-red-500',
}

/**
 * AnalysisHistory — recent ATS analyses list with confirmation modal on delete.
 */
export function AnalysisHistory({ history = [] }) {
	const navigate = useNavigate()
	const [pendingDelete, setPendingDelete] = useState(null)
	const [isDeleting, setIsDeleting] = useState(false)

	if (history.length === 0) return null

	function handleView(analysisId) {
		navigate(`/dashboard/ats-analyzer/${analysisId}`)
	}

	function confirmDelete(entry) {
		setPendingDelete(entry)
	}

	async function executeDelete() {
		if (!pendingDelete) return
		setIsDeleting(true)
		try {
			const { id, fileName } = pendingDelete
			const result = await atsStore.deleteAnalysis(id)
			if (result.success) {
				toast.success(`Analysis for "${fileName}" deleted`)
				if (result.wasActive) {
					navigate('/dashboard/ats-analyzer')
				}
			} else {
				toast.error(result.message || 'Failed to delete analysis')
			}
		} finally {
			setIsDeleting(false)
			setPendingDelete(null)
		}
	}

	return (
		<>
			<div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
				<div className="mb-4 flex items-center justify-between">
					<div className="flex items-center gap-2">
						<History className="h-4 w-4 text-[var(--color-primary)]" strokeWidth={1.8} />
						<h3 className="text-sm font-semibold text-[var(--color-text)]">
							Recent Analyses
						</h3>
					</div>
					<span className="text-xs text-[var(--color-muted)]">
						{history.length} {history.length === 1 ? 'record' : 'records'}
					</span>
				</div>

				<div className="space-y-2">
					{history.map((entry, i) => {
						const tier = getScoreTier(entry.score)
						const badgeClass = TIER_BADGE[tier.color] ?? TIER_BADGE.blue
						const isJobMatch = entry.analysisMode === 'job_match' || Boolean(entry.jobTitle)

						return (
							<motion.div
								key={entry.id}
								initial={{ opacity: 0, y: 8 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.3, delay: i * 0.04 }}
								className="group flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3.5 py-3 transition-colors hover:border-[var(--color-primary)]/30"
							>
								{/* File info */}
								<div className="min-w-0 flex-1 cursor-pointer" onClick={() => handleView(entry.id)}>
									<div className="flex items-center gap-2">
										<p className="truncate text-[13px] font-medium text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">
											{entry.fileName}
										</p>
										<span className="shrink-0 rounded-full border border-[var(--color-border)] px-1.5 py-0.2 text-[10px] text-[var(--color-muted)]">
											{isJobMatch ? 'Job Match' : 'Resume-Only'}
										</span>
									</div>
									<p className="mt-0.5 text-[11px] text-[var(--color-muted)]">
										{formatDate(entry.date)}
										{entry.jobTitle && <span className="ml-1.5 truncate">· {entry.jobTitle}</span>}
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
										onClick={() => handleView(entry.id)}
										className="rounded-lg p-1.5 text-[var(--color-muted)] transition-colors hover:bg-[var(--color-surface-3)] hover:text-[var(--color-text)]"
										title="View Report"
									>
										<Eye className="h-3.5 w-3.5" />
									</button>
									<button
										type="button"
										onClick={() => confirmDelete(entry)}
										className="rounded-lg p-1.5 text-[var(--color-muted)] transition-colors hover:bg-red-500/10 hover:text-red-500"
										title="Delete analysis"
									>
										<Trash2 className="h-3.5 w-3.5" />
									</button>
								</div>
							</motion.div>
						)
					})}
				</div>
			</div>

			{/* ─── Delete Confirmation Modal ─────────────────────────────── */}
			<AnimatePresence>
				{pendingDelete && (
					<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
						{/* Backdrop */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={() => !isDeleting && setPendingDelete(null)}
							className="absolute inset-0 bg-black/60 backdrop-blur-sm"
						/>

						{/* Modal Box */}
						<motion.div
							initial={{ opacity: 0, scale: 0.95, y: 10 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.95, y: 10 }}
							transition={{ duration: 0.2 }}
							className="relative w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-2xl"
						>
							<div className="flex items-start gap-4">
								<div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
									<AlertTriangle className="h-5 w-5" strokeWidth={2} />
								</div>
								<div className="min-w-0 flex-1">
									<h4 className="text-base font-bold text-[var(--color-text)]">
										Delete Analysis?
									</h4>
									<p className="mt-1.5 text-sm text-[var(--color-muted)] leading-relaxed">
										Are you sure you want to delete the ATS analysis for{' '}
										<span className="font-semibold text-[var(--color-text)]">
											&ldquo;{pendingDelete.fileName}&rdquo;
										</span>
										? This action cannot be undone.
									</p>
								</div>
							</div>

							<div className="mt-6 flex items-center justify-end gap-3">
								<button
									type="button"
									disabled={isDeleting}
									onClick={() => setPendingDelete(null)}
									className="rounded-xl border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface-2)] disabled:opacity-50"
								>
									Cancel
								</button>
								<button
									type="button"
									disabled={isDeleting}
									onClick={executeDelete}
									className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
								>
									{isDeleting ? 'Deleting...' : 'Delete Analysis'}
								</button>
							</div>
						</motion.div>
					</div>
				)}
			</AnimatePresence>
		</>
	)
}

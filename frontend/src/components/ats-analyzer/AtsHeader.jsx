import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

/**
 * AtsHeader — page header for ATS Analyzer.
 *
 * Supports:
 * - Title + Subtitle
 * - Detail page header with "Back to ATS Analyzer" action
 */
export function AtsHeader({ isDetail = false, onBack = null }) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 12 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.35 }}
			className="mb-5 flex flex-col items-start gap-4 sm:mb-6 sm:flex-row sm:items-end sm:justify-between"
		>
			{/* Left — title + subtitle */}
			<div className="min-w-0">
				<p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--color-primary)]">
					ATS ANALYSIS
				</p>
				<h2 className="text-2xl font-black tracking-[-0.05em] leading-[1.05] text-[var(--color-text)] sm:text-[32px]">
					ATS Resume Analyzer
				</h2>
				<p className="mt-1 text-base leading-[1.6] text-[var(--color-muted)]">
					Analyze your resume against modern ATS systems.
				</p>
			</div>

			{/* Right — Back button on detail page */}
			{isDetail && onBack && (
				<div className="shrink-0">
					<button
						type="button"
						onClick={onBack}
						className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm font-medium text-[var(--color-text)] shadow-sm transition-all hover:bg-[var(--color-surface-2)] hover:border-[var(--color-primary)]/40 hover:text-[var(--color-primary)] cursor-pointer"
					>
						<ArrowLeft className="h-4 w-4" />
						Back to ATS Analyzer
					</button>
				</div>
			)}
		</motion.div>
	)
}

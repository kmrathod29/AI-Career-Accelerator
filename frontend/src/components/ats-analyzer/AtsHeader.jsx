import { motion, AnimatePresence } from 'framer-motion'
import { ScanSearch, Upload, RefreshCw } from 'lucide-react'
import { atsStore, useAtsFile, useAtsViewMode } from '@/stores/atsStore.js'

/**
 * AtsHeader — page header with a single contextual CTA.
 *
 * Before upload  → "Upload Resume"
 * After upload   → "Analyze Resume"
 * After analysis → "Re-analyze Resume"
 */
export function AtsHeader() {
	const file = useAtsFile()
	const viewMode = useAtsViewMode()

	/* Determine which single button to show */
	const cta = !file
		? { label: 'Upload Resume', icon: Upload, action: () => document.getElementById('ats-file-input')?.click() }
		: viewMode === 'results'
			? { label: 'Re-analyze Resume', icon: RefreshCw, action: () => atsStore.startAnalysis() }
			: viewMode !== 'analyzing'
				? { label: 'Analyze Resume', icon: ScanSearch, action: () => atsStore.startAnalysis() }
				: null

	return (
		<motion.div
			initial={{ opacity: 0, y: 12 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.35 }}
			className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-end sm:justify-between"
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

			{/* Right — single contextual CTA */}
			{/* <AnimatePresence mode="wait">
				{cta && (
					<motion.button
						key={cta.label}
						type="button"
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.95 }}
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.97 }}
						transition={{ duration: 0.2 }}
						onClick={cta.action}
						className="hidden items-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 sm:inline-flex"
					>
						<cta.icon className="h-4 w-4" />
						{cta.label}
					</motion.button>
				)}
			</AnimatePresence> */}
		</motion.div>


		
	)
}

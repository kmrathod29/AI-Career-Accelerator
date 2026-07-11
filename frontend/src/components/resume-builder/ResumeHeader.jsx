import { motion } from 'framer-motion'
import { Eye, Download } from 'lucide-react'
import { toast } from 'sonner'
import { AutosaveIndicator } from '@components/resume-builder/shared/AutosaveIndicator.jsx'

/**
 * ResumeHeader — page title, subtitle, autosave indicator, and action buttons.
 */
export function ResumeHeader() {
	return (
		<motion.div
			initial={{ opacity: 0, y: 12 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.35 }}
			className="mb-5 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-end sm:justify-between"
		>
			{/* Left — title + subtitle */}
			<div className="min-w-0">
				<h2 className="text-lg font-semibold tracking-tight text-[var(--color-text)] sm:text-2xl">
					Resume Builder
				</h2>
				<p className="mt-0.5 text-sm text-[var(--color-muted)]">
					Build an ATS-optimized resume with AI assistance.
				</p>
			</div>

			{/* Right — autosave + actions */}
			<div className="flex items-center gap-3">
				<AutosaveIndicator />

				<motion.button
					type="button"
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.97 }}
					onClick={() => toast.info('Preview mode coming soon')}
					className="hidden items-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 sm:inline-flex"
				>
					<Eye className="h-4 w-4" />
					Preview Resume
				</motion.button>

				<motion.button
					type="button"
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.97 }}
					onClick={() => toast.info('PDF export coming soon')}
					className="hidden items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface-2)] sm:inline-flex"
				>
					<Download className="h-4 w-4" />
					Export PDF
				</motion.button>
			</div>
		</motion.div>
	)
}

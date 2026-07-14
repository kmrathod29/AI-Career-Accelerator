import { motion } from 'framer-motion'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { atsStore } from '@/stores/atsStore.js'

/**
 * AtsErrorState — error state with retry button.
 */
export function AtsErrorState({ message }) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 16 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, ease: 'easeOut' }}
			className="flex flex-col items-center justify-center py-16 text-center"
		>
			<motion.div
				initial={{ scale: 0.8, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
				className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10"
			>
				<AlertCircle className="h-9 w-9 text-red-500" strokeWidth={1.5} />
			</motion.div>

			<h3 className="mb-2 text-lg font-semibold text-[var(--color-text)]">
				Resume could not be analyzed
			</h3>

			<p className="mx-auto mb-6 max-w-sm text-sm leading-relaxed text-[var(--color-muted)]">
				{message ?? 'Something went wrong while analyzing your resume. Please try uploading another file or try again.'}
			</p>

			<motion.button
				type="button"
				whileHover={{ scale: 1.03 }}
				whileTap={{ scale: 0.97 }}
				onClick={() => atsStore.reAnalyze()}
				className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
			>
				<RefreshCw className="h-4 w-4" />
				Retry Analysis
			</motion.button>
		</motion.div>
	)
}

import { motion } from 'framer-motion'
import { Save, Eye, Download } from 'lucide-react'
import { toast } from 'sonner'

/**
 * MobileActionBar — sticky bottom bar for mobile.
 * Contains Save, Preview, and Export actions.
 */
export function MobileActionBar() {
	return (
		<motion.div
			initial={{ y: 80 }}
			animate={{ y: 0 }}
			transition={{ type: 'spring', stiffness: 300, damping: 30 }}
			className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--color-border)] bg-[var(--color-surface)]/90 px-4 py-3 backdrop-blur-xl lg:hidden"
		>
			<div className="mx-auto flex max-w-lg items-center gap-2">
				<motion.button
					type="button"
					whileTap={{ scale: 0.95 }}
					onClick={() => toast.success('Resume saved!')}
					className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
				>
					<Save className="h-4 w-4" />
					Save
				</motion.button>

				<motion.button
					type="button"
					whileTap={{ scale: 0.95 }}
					onClick={() => toast.info('Preview mode coming soon')}
					className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface-2)]"
				>
					<Eye className="h-4 w-4" />
					Preview
				</motion.button>

				<motion.button
					type="button"
					whileTap={{ scale: 0.95 }}
					onClick={() => toast.info('PDF export coming soon')}
					className="flex items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-2.5 text-[var(--color-muted)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]"
				>
					<Download className="h-4 w-4" />
				</motion.button>
			</div>
		</motion.div>
	)
}

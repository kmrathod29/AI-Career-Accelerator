import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle } from 'lucide-react'

export function UnsavedChangesBanner({ visible, onSave, onDiscard, saving = false }) {
	return (
		<AnimatePresence>
			{visible && (
				<motion.div
					initial={{ opacity: 0, y: -8 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -8 }}
					transition={{ duration: 0.2 }}
					className="mb-4 flex flex-col gap-3 rounded-2xl border border-amber-200/60 bg-[var(--badge-amber-bg)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
				>
					<div className="flex items-center gap-2.5">
						<AlertCircle className="h-4 w-4 shrink-0 text-[var(--badge-amber-text)]" />
						<p className="text-sm font-medium text-[var(--badge-amber-text)]">
							You have unsaved changes
						</p>
					</div>
					<div className="flex flex-wrap items-center gap-2">
						<button
							type="button"
							onClick={onDiscard}
							disabled={saving}
							className="rounded-xl border border-[var(--color-border)] px-3.5 py-2 text-sm font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface)] disabled:opacity-50"
						>
							Discard
						</button>
						<button
							type="button"
							onClick={onSave}
							disabled={saving}
							className="rounded-xl bg-[var(--color-primary)] px-3.5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
						>
							{saving ? 'Saving...' : 'Save Changes'}
						</button>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}

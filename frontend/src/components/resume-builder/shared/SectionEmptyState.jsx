import { motion } from 'framer-motion'

/**
 * SectionEmptyState — shown when a list section (experiences, projects, etc.) has no entries.
 */
export function SectionEmptyState({ icon: Icon, message, actionLabel, onAction }) {
	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.3 }}
			className="flex flex-col items-center py-8 text-center"
		>
			{Icon && (
				<div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-surface-2)]">
					<Icon className="h-6 w-6 text-[var(--color-muted)]" strokeWidth={1.5} />
				</div>
			)}
			<p className="mb-4 max-w-xs text-sm text-[var(--color-muted)]">{message}</p>
			{onAction && (
				<motion.button
					type="button"
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
					onClick={onAction}
					className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5 px-4 py-2 text-sm font-medium text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary)]/10"
				>
					{actionLabel}
				</motion.button>
			)}
		</motion.div>
	)
}

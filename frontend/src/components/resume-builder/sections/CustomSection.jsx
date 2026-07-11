import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2 } from 'lucide-react'
import { useCustomSections, resumeStore } from '@/stores/resumeStore.js'

/**
 * CustomSection — user-defined custom sections with title and content.
 */
export function CustomSection() {
	const customSections = useCustomSections()

	return (
		<div className="space-y-4">
			<AnimatePresence>
				{customSections.map((section, idx) => (
					<motion.div
						key={section.id}
						layout
						initial={{ opacity: 0, y: 12 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.2 }}
						className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-inset)] p-4"
					>
						<div className="mb-3 flex items-center justify-between">
							<span className="text-xs font-medium text-[var(--color-muted)]">
								Custom Section {idx + 1}
							</span>
							<button
								type="button"
								onClick={() => resumeStore.removeCustomSection(section.id)}
								className="rounded-lg p-1.5 text-[var(--color-muted)] transition-colors hover:bg-[var(--notif-error-bg)] hover:text-[var(--color-danger)]"
							>
								<Trash2 className="h-3.5 w-3.5" />
							</button>
						</div>

						<div className="space-y-3">
							<div>
								<label className="mb-1 block text-[11px] font-medium text-[var(--color-muted)]">Section Title</label>
								<input
									type="text"
									value={section.title}
									onChange={(e) => resumeStore.updateCustomSection(section.id, { title: e.target.value })}
									placeholder="Volunteering, Hobbies, Publications..."
									className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-muted)]/60 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
								/>
							</div>
							<div>
								<label className="mb-1 block text-[11px] font-medium text-[var(--color-muted)]">Content</label>
								<textarea
									value={section.content}
									onChange={(e) => resumeStore.updateCustomSection(section.id, { content: e.target.value })}
									placeholder="Describe the details..."
									rows={3}
									className="w-full resize-y rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm leading-relaxed text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-muted)]/60 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
								/>
							</div>
						</div>
					</motion.div>
				))}
			</AnimatePresence>

			<motion.button
				type="button"
				whileHover={{ scale: 1.01 }}
				whileTap={{ scale: 0.99 }}
				onClick={() => resumeStore.addCustomSection()}
				className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--color-border)] py-3 text-sm font-medium text-[var(--color-muted)] transition-colors hover:border-[var(--color-primary)]/30 hover:bg-[var(--color-primary)]/5 hover:text-[var(--color-primary)]"
			>
				<Plus className="h-4 w-4" />
				Add Custom Section
			</motion.button>
		</div>
	)
}

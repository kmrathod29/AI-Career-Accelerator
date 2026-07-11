import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Briefcase } from 'lucide-react'
import { useExperiences, resumeStore } from '@/stores/resumeStore.js'
import { SectionEmptyState } from '@components/resume-builder/shared/SectionEmptyState.jsx'

/**
 * ExperienceSection — list of work experience entries with add/remove.
 */
export function ExperienceSection() {
	const experiences = useExperiences()

	if (experiences.length === 0) {
		return (
			<SectionEmptyState
				icon={Briefcase}
				message="Add your first work experience to showcase your professional journey."
				actionLabel="Add Experience"
				onAction={() => resumeStore.addExperience()}
			/>
		)
	}

	return (
		<div className="space-y-4">
			<AnimatePresence>
				{experiences.map((exp, idx) => (
					<motion.div
						key={exp.id}
						layout
						initial={{ opacity: 0, y: 12 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.2 }}
						className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-inset)] p-4"
					>
						<div className="mb-3 flex items-center justify-between">
							<span className="text-xs font-medium text-[var(--color-muted)]">
								Experience {idx + 1}
							</span>
							<button
								type="button"
								onClick={() => resumeStore.removeExperience(exp.id)}
								className="rounded-lg p-1.5 text-[var(--color-muted)] transition-colors hover:bg-[var(--notif-error-bg)] hover:text-[var(--color-danger)]"
							>
								<Trash2 className="h-3.5 w-3.5" />
							</button>
						</div>

						<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
							<div>
								<label className="mb-1 block text-[11px] font-medium text-[var(--color-muted)]">Company</label>
								<input
									type="text"
									value={exp.company}
									onChange={(e) => resumeStore.updateExperience(exp.id, { company: e.target.value })}
									placeholder="Google"
									className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-muted)]/60 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
								/>
							</div>
							<div>
								<label className="mb-1 block text-[11px] font-medium text-[var(--color-muted)]">Role</label>
								<input
									type="text"
									value={exp.role}
									onChange={(e) => resumeStore.updateExperience(exp.id, { role: e.target.value })}
									placeholder="Senior Software Engineer"
									className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-muted)]/60 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
								/>
							</div>
							<div>
								<label className="mb-1 block text-[11px] font-medium text-[var(--color-muted)]">Start Date</label>
								<input
									type="month"
									value={exp.startDate}
									onChange={(e) => resumeStore.updateExperience(exp.id, { startDate: e.target.value })}
									className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] outline-none transition-colors focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
								/>
							</div>
							<div>
								<label className="mb-1 block text-[11px] font-medium text-[var(--color-muted)]">End Date</label>
								<input
									type="month"
									value={exp.endDate}
									onChange={(e) => resumeStore.updateExperience(exp.id, { endDate: e.target.value })}
									disabled={exp.currentlyWorking}
									className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] outline-none transition-colors focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 disabled:opacity-50"
								/>
								<label className="mt-2 flex items-center gap-2 text-xs text-[var(--color-muted)]">
									<input
										type="checkbox"
										checked={exp.currentlyWorking}
										onChange={(e) => resumeStore.updateExperience(exp.id, { currentlyWorking: e.target.checked })}
										className="h-3.5 w-3.5 rounded border-[var(--color-border)] accent-[var(--color-primary)]"
									/>
									Currently working here
								</label>
							</div>
							<div className="sm:col-span-2">
								<label className="mb-1 block text-[11px] font-medium text-[var(--color-muted)]">Description</label>
								<textarea
									value={exp.description}
									onChange={(e) => resumeStore.updateExperience(exp.id, { description: e.target.value })}
									placeholder="Describe your key responsibilities and achievements..."
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
				onClick={() => resumeStore.addExperience()}
				className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--color-border)] py-3 text-sm font-medium text-[var(--color-muted)] transition-colors hover:border-[var(--color-primary)]/30 hover:bg-[var(--color-primary)]/5 hover:text-[var(--color-primary)]"
			>
				<Plus className="h-4 w-4" />
				Add Experience
			</motion.button>
		</div>
	)
}

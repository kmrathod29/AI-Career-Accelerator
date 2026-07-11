import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, GraduationCap } from 'lucide-react'
import { useEducation, resumeStore } from '@/stores/resumeStore.js'
import { SectionEmptyState } from '@components/resume-builder/shared/SectionEmptyState.jsx'

/**
 * EducationSection — list of education entries.
 */
export function EducationSection() {
	const education = useEducation()

	if (education.length === 0) {
		return (
			<SectionEmptyState
				icon={GraduationCap}
				message="Add your educational background to strengthen your resume."
				actionLabel="Add Education"
				onAction={() => resumeStore.addEducation()}
			/>
		)
	}

	return (
		<div className="space-y-4">
			<AnimatePresence>
				{education.map((edu, idx) => (
					<motion.div
						key={edu.id}
						layout
						initial={{ opacity: 0, y: 12 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.2 }}
						className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-inset)] p-4"
					>
						<div className="mb-3 flex items-center justify-between">
							<span className="text-xs font-medium text-[var(--color-muted)]">
								Education {idx + 1}
							</span>
							<button
								type="button"
								onClick={() => resumeStore.removeEducation(edu.id)}
								className="rounded-lg p-1.5 text-[var(--color-muted)] transition-colors hover:bg-[var(--notif-error-bg)] hover:text-[var(--color-danger)]"
							>
								<Trash2 className="h-3.5 w-3.5" />
							</button>
						</div>

						<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
							<div className="sm:col-span-2">
								<label className="mb-1 block text-[11px] font-medium text-[var(--color-muted)]">College / University</label>
								<input
									type="text"
									value={edu.college}
									onChange={(e) => resumeStore.updateEducation(edu.id, { college: e.target.value })}
									placeholder="Stanford University"
									className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-muted)]/60 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
								/>
							</div>
							<div>
								<label className="mb-1 block text-[11px] font-medium text-[var(--color-muted)]">Degree</label>
								<input
									type="text"
									value={edu.degree}
									onChange={(e) => resumeStore.updateEducation(edu.id, { degree: e.target.value })}
									placeholder="Bachelor of Technology"
									className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-muted)]/60 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
								/>
							</div>
							<div>
								<label className="mb-1 block text-[11px] font-medium text-[var(--color-muted)]">Branch / Major</label>
								<input
									type="text"
									value={edu.branch}
									onChange={(e) => resumeStore.updateEducation(edu.id, { branch: e.target.value })}
									placeholder="Computer Science"
									className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-muted)]/60 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
								/>
							</div>
							<div>
								<label className="mb-1 block text-[11px] font-medium text-[var(--color-muted)]">CGPA / Percentage</label>
								<input
									type="text"
									value={edu.cgpa}
									onChange={(e) => resumeStore.updateEducation(edu.id, { cgpa: e.target.value })}
									placeholder="9.2 / 10"
									className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-muted)]/60 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
								/>
							</div>
							<div>
								<label className="mb-1 block text-[11px] font-medium text-[var(--color-muted)]">Passing Year</label>
								<input
									type="text"
									value={edu.passingYear}
									onChange={(e) => resumeStore.updateEducation(edu.id, { passingYear: e.target.value })}
									placeholder="2024"
									className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-muted)]/60 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
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
				onClick={() => resumeStore.addEducation()}
				className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--color-border)] py-3 text-sm font-medium text-[var(--color-muted)] transition-colors hover:border-[var(--color-primary)]/30 hover:bg-[var(--color-primary)]/5 hover:text-[var(--color-primary)]"
			>
				<Plus className="h-4 w-4" />
				Add Education
			</motion.button>
		</div>
	)
}

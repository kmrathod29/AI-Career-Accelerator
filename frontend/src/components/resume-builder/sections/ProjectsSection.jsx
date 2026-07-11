import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, FolderGit2 } from 'lucide-react'
import { useProjects, resumeStore } from '@/stores/resumeStore.js'
import { SectionEmptyState } from '@components/resume-builder/shared/SectionEmptyState.jsx'

/**
 * ProjectsSection — list of project entries.
 */
export function ProjectsSection() {
	const projects = useProjects()

	if (projects.length === 0) {
		return (
			<SectionEmptyState
				icon={FolderGit2}
				message="Add your notable projects to demonstrate your technical expertise."
				actionLabel="Add Project"
				onAction={() => resumeStore.addProject()}
			/>
		)
	}

	return (
		<div className="space-y-4">
			<AnimatePresence>
				{projects.map((proj, idx) => (
					<motion.div
						key={proj.id}
						layout
						initial={{ opacity: 0, y: 12 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.2 }}
						className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-inset)] p-4"
					>
						<div className="mb-3 flex items-center justify-between">
							<span className="text-xs font-medium text-[var(--color-muted)]">
								Project {idx + 1}
							</span>
							<button
								type="button"
								onClick={() => resumeStore.removeProject(proj.id)}
								className="rounded-lg p-1.5 text-[var(--color-muted)] transition-colors hover:bg-[var(--notif-error-bg)] hover:text-[var(--color-danger)]"
							>
								<Trash2 className="h-3.5 w-3.5" />
							</button>
						</div>

						<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
							<div>
								<label className="mb-1 block text-[11px] font-medium text-[var(--color-muted)]">Project Name</label>
								<input
									type="text"
									value={proj.name}
									onChange={(e) => resumeStore.updateProject(proj.id, { name: e.target.value })}
									placeholder="AI Career Accelerator"
									className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-muted)]/60 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
								/>
							</div>
							<div>
								<label className="mb-1 block text-[11px] font-medium text-[var(--color-muted)]">Tech Stack</label>
								<input
									type="text"
									value={proj.techStack}
									onChange={(e) => resumeStore.updateProject(proj.id, { techStack: e.target.value })}
									placeholder="React, Node.js, PostgreSQL"
									className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-muted)]/60 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
								/>
							</div>
							<div className="sm:col-span-2">
								<label className="mb-1 block text-[11px] font-medium text-[var(--color-muted)]">Description</label>
								<textarea
									value={proj.description}
									onChange={(e) => resumeStore.updateProject(proj.id, { description: e.target.value })}
									placeholder="Describe what the project does and your contributions..."
									rows={2}
									className="w-full resize-y rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm leading-relaxed text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-muted)]/60 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
								/>
							</div>
							<div>
								<label className="mb-1 block text-[11px] font-medium text-[var(--color-muted)]">GitHub URL</label>
								<input
									type="url"
									value={proj.github}
									onChange={(e) => resumeStore.updateProject(proj.id, { github: e.target.value })}
									placeholder="https://github.com/user/repo"
									className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-muted)]/60 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
								/>
							</div>
							<div>
								<label className="mb-1 block text-[11px] font-medium text-[var(--color-muted)]">Live URL</label>
								<input
									type="url"
									value={proj.liveUrl}
									onChange={(e) => resumeStore.updateProject(proj.id, { liveUrl: e.target.value })}
									placeholder="https://myproject.vercel.app"
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
				onClick={() => resumeStore.addProject()}
				className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--color-border)] py-3 text-sm font-medium text-[var(--color-muted)] transition-colors hover:border-[var(--color-primary)]/30 hover:bg-[var(--color-primary)]/5 hover:text-[var(--color-primary)]"
			>
				<Plus className="h-4 w-4" />
				Add Project
			</motion.button>
		</div>
	)
}

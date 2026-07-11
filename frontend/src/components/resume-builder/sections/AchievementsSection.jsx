import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Trophy } from 'lucide-react'
import { useAchievements, resumeStore } from '@/stores/resumeStore.js'
import { SectionEmptyState } from '@components/resume-builder/shared/SectionEmptyState.jsx'

/**
 * AchievementsSection — free-text achievement entries.
 */
export function AchievementsSection() {
	const achievements = useAchievements()

	if (achievements.length === 0) {
		return (
			<SectionEmptyState
				icon={Trophy}
				message="Add your notable achievements to highlight your accomplishments."
				actionLabel="Add Achievement"
				onAction={() => resumeStore.addAchievement()}
			/>
		)
	}

	return (
		<div className="space-y-3">
			<AnimatePresence>
				{achievements.map((ach, idx) => (
					<motion.div
						key={ach.id}
						layout
						initial={{ opacity: 0, y: 8 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.2 }}
						className="flex items-start gap-2"
					>
						<span className="mt-2.5 text-xs font-medium text-[var(--color-muted)]">
							{idx + 1}.
						</span>
						<input
							type="text"
							value={ach.text}
							onChange={(e) => resumeStore.updateAchievement(ach.id, { text: e.target.value })}
							placeholder="Won first place in national hackathon..."
							className="min-w-0 flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-muted)]/60 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
						/>
						<button
							type="button"
							onClick={() => resumeStore.removeAchievement(ach.id)}
							className="mt-1 shrink-0 rounded-lg p-1.5 text-[var(--color-muted)] transition-colors hover:bg-[var(--notif-error-bg)] hover:text-[var(--color-danger)]"
						>
							<Trash2 className="h-3.5 w-3.5" />
						</button>
					</motion.div>
				))}
			</AnimatePresence>

			<motion.button
				type="button"
				whileHover={{ scale: 1.01 }}
				whileTap={{ scale: 0.99 }}
				onClick={() => resumeStore.addAchievement()}
				className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--color-border)] py-3 text-sm font-medium text-[var(--color-muted)] transition-colors hover:border-[var(--color-primary)]/30 hover:bg-[var(--color-primary)]/5 hover:text-[var(--color-primary)]"
			>
				<Plus className="h-4 w-4" />
				Add Achievement
			</motion.button>
		</div>
	)
}

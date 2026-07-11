import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Globe } from 'lucide-react'
import { useLanguages, resumeStore } from '@/stores/resumeStore.js'
import { LANGUAGE_PROFICIENCY_LEVELS } from '@constants/resumeBuilder.js'
import { SectionEmptyState } from '@components/resume-builder/shared/SectionEmptyState.jsx'

/**
 * LanguagesSection — language + proficiency level entries.
 */
export function LanguagesSection() {
	const languages = useLanguages()

	if (languages.length === 0) {
		return (
			<SectionEmptyState
				icon={Globe}
				message="Add languages you speak to broaden your opportunities."
				actionLabel="Add Language"
				onAction={() => resumeStore.addLanguage()}
			/>
		)
	}

	return (
		<div className="space-y-3">
			<AnimatePresence>
				{languages.map((lang) => (
					<motion.div
						key={lang.id}
						layout
						initial={{ opacity: 0, y: 8 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.2 }}
						className="flex items-center gap-2"
					>
						<input
							type="text"
							value={lang.language}
							onChange={(e) => resumeStore.updateLanguage(lang.id, { language: e.target.value })}
							placeholder="English"
							className="min-w-0 flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-muted)]/60 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
						/>
						<select
							value={lang.proficiency}
							onChange={(e) => resumeStore.updateLanguage(lang.id, { proficiency: e.target.value })}
							className="min-w-0 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] outline-none transition-colors focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
						>
							{LANGUAGE_PROFICIENCY_LEVELS.map((level) => (
								<option key={level} value={level}>{level}</option>
							))}
						</select>
						<button
							type="button"
							onClick={() => resumeStore.removeLanguage(lang.id)}
							className="shrink-0 rounded-lg p-1.5 text-[var(--color-muted)] transition-colors hover:bg-[var(--notif-error-bg)] hover:text-[var(--color-danger)]"
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
				onClick={() => resumeStore.addLanguage()}
				className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--color-border)] py-3 text-sm font-medium text-[var(--color-muted)] transition-colors hover:border-[var(--color-primary)]/30 hover:bg-[var(--color-primary)]/5 hover:text-[var(--color-primary)]"
			>
				<Plus className="h-4 w-4" />
				Add Language
			</motion.button>
		</div>
	)
}

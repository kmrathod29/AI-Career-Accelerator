import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Check, X } from 'lucide-react'
import { toast } from 'sonner'
import { DUMMY_AI_SUGGESTIONS } from '@constants/resumeBuilder.js'

/**
 * AISuggestionCard — premium AI suggestions panel inside the editor.
 * Dummy functionality: Apply shows toast, Dismiss removes with animation.
 */
export function AISuggestionCard() {
	const [suggestions, setSuggestions] = useState(DUMMY_AI_SUGGESTIONS.slice(0, 3))

	const handleApply = (sug) => {
		toast.success('Suggestion applied!', { description: sug.text })
		setSuggestions((prev) => prev.filter((s) => s.id !== sug.id))
	}

	const handleDismiss = (sug) => {
		setSuggestions((prev) => prev.filter((s) => s.id !== sug.id))
	}

	if (suggestions.length === 0) return null

	return (
		<motion.div
			initial={{ opacity: 0, y: 8 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
			className="rounded-2xl border border-[var(--color-primary)]/15 bg-gradient-to-br from-[var(--color-primary)]/[0.03] to-[var(--color-surface)] p-4 sm:p-5"
		>
			{/* Header */}
			<div className="mb-3 flex items-center gap-2">
				<div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--color-primary)]/10">
					<Sparkles className="h-3.5 w-3.5 text-[var(--color-primary)]" />
				</div>
				<span className="text-xs font-semibold tracking-wide text-[var(--color-primary)] uppercase">
					AI Suggestions
				</span>
			</div>

			{/* Suggestion list */}
			<div className="space-y-2">
				<AnimatePresence>
					{suggestions.map((sug) => (
						<motion.div
							key={sug.id}
							layout
							initial={{ opacity: 0, x: -8 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: 8, height: 0 }}
							transition={{ duration: 0.2 }}
							className="flex items-start gap-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5"
						>
							<p className="min-w-0 flex-1 text-[13px] leading-relaxed text-[var(--color-text)]">
								{sug.text}
							</p>
							<div className="flex shrink-0 items-center gap-1">
								<motion.button
									type="button"
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.9 }}
									onClick={() => handleApply(sug)}
									className="rounded-lg p-1.5 text-emerald-500 transition-colors hover:bg-emerald-500/10"
									title="Apply suggestion"
								>
									<Check className="h-3.5 w-3.5" strokeWidth={2.5} />
								</motion.button>
								<motion.button
									type="button"
									whileHover={{ scale: 1.1 }}
									whileTap={{ scale: 0.9 }}
									onClick={() => handleDismiss(sug)}
									className="rounded-lg p-1.5 text-[var(--color-muted)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]"
									title="Dismiss"
								>
									<X className="h-3.5 w-3.5" />
								</motion.button>
							</div>
						</motion.div>
					))}
				</AnimatePresence>
			</div>
		</motion.div>
	)
}

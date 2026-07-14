import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Check, X, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import { atsStore, useAtsDismissed } from '@/stores/atsStore.js'

/**
 * AiSuggestions — AI-powered recommendation cards with apply/dismiss.
 */
export function AiSuggestions({ suggestions = [] }) {
	const dismissed = useAtsDismissed()
	const visible = suggestions.filter((s) => !dismissed.has(s.id))

	if (visible.length === 0) {
		return (
			<div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
				<div className="flex items-center gap-2">
					<Sparkles className="h-4 w-4 text-violet-500" strokeWidth={1.8} />
					<h3 className="text-sm font-semibold text-[var(--color-text)]">AI Suggestions</h3>
				</div>
				<p className="mt-3 text-center text-sm text-[var(--color-muted)]">
					All suggestions have been addressed! 🎉
				</p>
			</div>
		)
	}

	return (
		<div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
			<div className="mb-4 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Sparkles className="h-4 w-4 text-violet-500" strokeWidth={1.8} />
					<h3 className="text-sm font-semibold text-[var(--color-text)]">
						AI Suggestions
					</h3>
				</div>
				<span className="text-xs text-[var(--color-muted)]">
					{visible.length} remaining
				</span>
			</div>

			<div className="space-y-2.5">
				<AnimatePresence>
					{visible.map((sug, i) => (
						<motion.div
							key={sug.id}
							layout
							initial={{ opacity: 0, y: 8 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, height: 0, marginBottom: 0 }}
							transition={{ duration: 0.3, delay: i * 0.04 }}
							className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3.5"
						>
							{/* Replacement suggestion */}
							{sug.original ? (
								<div className="mb-2 flex items-center gap-2 text-[13px]">
									<span className="rounded-md bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-500 line-through">
										{sug.original}
									</span>
									<ArrowRight className="h-3 w-3 text-[var(--color-muted)]" />
									<span className="rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-500">
										{sug.replacement}
									</span>
								</div>
							) : (
								<p className="mb-2 text-[13px] font-medium text-[var(--color-text)]">
									{sug.replacement}
								</p>
							)}

							<p className="mb-3 text-[11px] text-[var(--color-muted)]">
								{sug.context}
							</p>

							{/* Action buttons */}
							<div className="flex items-center gap-2">
								<motion.button
									type="button"
									whileHover={{ scale: 1.03 }}
									whileTap={{ scale: 0.97 }}
									onClick={() => {
										toast.success('Suggestion applied')
										atsStore.dismissSuggestion(sug.id)
									}}
									className="flex items-center gap-1.5 rounded-lg bg-[var(--color-primary)] px-3 py-1.5 text-[11px] font-medium text-white transition-opacity hover:opacity-90"
								>
									<Check className="h-3 w-3" />
									Apply Fix
								</motion.button>

								<motion.button
									type="button"
									whileHover={{ scale: 1.03 }}
									whileTap={{ scale: 0.97 }}
									onClick={() => {
										toast.info('Suggestion dismissed')
										atsStore.dismissSuggestion(sug.id)
									}}
									className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-[11px] font-medium text-[var(--color-muted)] transition-colors hover:bg-[var(--color-surface-3)]"
								>
									<X className="h-3 w-3" />
									Dismiss
								</motion.button>
							</div>
						</motion.div>
					))}
				</AnimatePresence>
			</div>
		</div>
	)
}

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Check, X, ArrowRight, CheckCircle, Info } from 'lucide-react'
import { atsStore, useAtsDismissed, useAtsVerificationOutcome, useAtsCurrentId } from '@/stores/atsStore.js'
import { ResumeVerificationModal } from './ResumeVerificationModal.jsx'
import { cn } from '@utils/classNames.js'

/**
 * AiSuggestions — AI-powered recommendation cards with "I've Applied This" verification workflow.
 */
export function AiSuggestions({ suggestions = [] }) {
	const [activeSuggestion, setActiveSuggestion] = useState(null)
	const dismissed = useAtsDismissed()
	const outcome = useAtsVerificationOutcome()
	const currentId = useAtsCurrentId()

	const visible = suggestions.filter((s) => !dismissed.has(s.id))

	const handleConfirmUpload = async (file) => {
		if (!activeSuggestion) return
		const target = {
			type: 'suggestion',
			id: activeSuggestion.id,
			replacement: activeSuggestion.replacement,
			context: activeSuggestion.context,
		}
		await atsStore.reAnalyzeWithFile(file, currentId, target)
		setActiveSuggestion(null)
	}

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
			{/* Header */}
			<div className="mb-3 flex items-center justify-between">
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

			{/* Required Helper text */}
			<p className="mb-4 text-xs leading-relaxed text-[var(--color-muted)]">
				Apply the suggestion to your resume, then upload the updated version to verify it.
			</p>

			{/* Resolution status banner */}
			<AnimatePresence>
				{outcome && outcome.type === 'suggestion' && (
					<motion.div
						initial={{ opacity: 0, y: -6 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -6 }}
						className={cn(
							'mb-4 flex items-start gap-2.5 rounded-xl border p-3 text-xs leading-relaxed',
							outcome.resolved
								? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
								: 'border-blue-500/30 bg-blue-500/10 text-blue-400',
						)}
					>
						{outcome.resolved ? (
							<CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
						) : (
							<Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
						)}

						<div className="min-w-0 flex-1">
							<p className="font-semibold">
								{outcome.resolved
									? 'Suggestion addressed after re-analysis.'
									: 'This suggestion is still recommended for your resume.'}
							</p>
							<p className="mt-0.5 opacity-90 truncate">
								"{outcome.text}"
							</p>
						</div>

						<button
							type="button"
							onClick={() => atsStore.clearVerificationOutcome()}
							className="rounded p-1 opacity-70 transition-opacity hover:opacity-100 cursor-pointer"
						>
							<X className="h-3.5 w-3.5" />
						</button>
					</motion.div>
				)}
			</AnimatePresence>

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
									onClick={() => setActiveSuggestion(sug)}
									className="flex items-center gap-1.5 rounded-lg bg-[var(--color-primary)] px-3 py-1.5 text-[11px] font-medium text-white transition-opacity hover:opacity-90 cursor-pointer"
									title="Apply this recommendation to your resume and upload to verify"
								>
									<Check className="h-3 w-3" />
									I've Applied This
								</motion.button>

								<motion.button
									type="button"
									whileHover={{ scale: 1.03 }}
									whileTap={{ scale: 0.97 }}
									onClick={() => {
										atsStore.dismissSuggestion(sug.id)
									}}
									className="flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-[11px] font-medium text-[var(--color-muted)] transition-colors hover:bg-[var(--color-surface-3)] cursor-pointer"
								>
									<X className="h-3 w-3" />
									Dismiss
								</motion.button>
							</div>
						</motion.div>
					))}
				</AnimatePresence>
			</div>

			{/* Verification & Upload Modal */}
			<ResumeVerificationModal
				isOpen={Boolean(activeSuggestion)}
				onClose={() => setActiveSuggestion(null)}
				mode="suggestion"
				targetItem={activeSuggestion}
				onConfirmUpload={handleConfirmUpload}
			/>
		</div>
	)
}

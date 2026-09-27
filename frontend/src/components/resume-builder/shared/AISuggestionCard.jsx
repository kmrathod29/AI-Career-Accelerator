import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Check, X, Loader2, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { resumeApi } from '@/services/resumeApi.js'

/**
 * AISuggestionCard — premium AI suggestions panel inside the editor.
 * Fetches real suggestions from Gemini via backend API.
 */
export function AISuggestionCard() {
	const [suggestions, setSuggestions] = useState([])
	const [isLoading, setIsLoading] = useState(false)
	const [hasGenerated, setHasGenerated] = useState(false)
	const [error, setError] = useState(null)

	const handleGenerate = useCallback(async () => {
		setIsLoading(true)
		setError(null)
		try {
			const result = await resumeApi.getAISuggestions()
			if (result?.data?.suggestions) {
				setSuggestions(result.data.suggestions)
				setHasGenerated(true)
				if (result.data.cached) {
					toast.info('Showing cached suggestions — resume hasn\'t changed since last analysis')
				} else {
					toast.success(`AI generated ${result.data.suggestions.length} suggestion${result.data.suggestions.length !== 1 ? 's' : ''}`)
				}
			} else {
				setSuggestions([])
				setHasGenerated(true)
			}
		} catch (err) {
			const message = err.response?.data?.message || 'AI suggestions are temporarily unavailable'
			setError(message)
			toast.error(message)
		} finally {
			setIsLoading(false)
		}
	}, [])

	const handleDismiss = (sug) => {
		setSuggestions((prev) => prev.filter((s) => s.id !== sug.id))
	}

	const handleApply = (sug) => {
		toast.success('Suggestion noted!', { description: sug.text || sug.title })
		setSuggestions((prev) => prev.filter((s) => s.id !== sug.id))
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 8 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
			className="rounded-2xl border border-[var(--color-primary)]/15 bg-gradient-to-br from-[var(--color-primary)]/[0.03] to-[var(--color-surface)] p-4 sm:p-5"
		>
			{/* Header */}
			<div className="mb-3 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[var(--color-primary)]/10">
						<Sparkles className="h-3.5 w-3.5 text-[var(--color-primary)]" />
					</div>
					<span className="text-xs font-semibold tracking-wide text-[var(--color-primary)] uppercase">
						AI Suggestions
					</span>
				</div>

				<motion.button
					type="button"
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={handleGenerate}
					disabled={isLoading}
					className="flex items-center gap-1.5 rounded-lg border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5 px-3 py-1.5 text-xs font-medium text-[var(--color-primary)] transition-colors hover:bg-[var(--color-primary)]/10 disabled:opacity-50"
				>
					{isLoading ? (
						<>
							<Loader2 className="h-3 w-3 animate-spin" />
							Analyzing...
						</>
					) : (
						<>
							<RefreshCw className="h-3 w-3" />
							{hasGenerated ? 'Refresh' : 'Get AI Suggestions'}
						</>
					)}
				</motion.button>
			</div>

			{/* Error state */}
			{error && !isLoading && (
				<div className="rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-2.5 text-[13px] text-red-500">
					{error}
				</div>
			)}

			{/* Empty state — before first generation */}
			{!hasGenerated && !isLoading && !error && (
				<p className="text-[13px] leading-relaxed text-[var(--color-muted)]">
					Click "Get AI Suggestions" to analyze your resume with Gemini AI and receive personalized improvement tips.
				</p>
			)}

			{/* Loading state */}
			{isLoading && (
				<div className="flex items-center gap-2 py-4 text-[13px] text-[var(--color-muted)]">
					<Loader2 className="h-4 w-4 animate-spin text-[var(--color-primary)]" />
					Analyzing your resume with AI...
				</div>
			)}

			{/* Suggestions list */}
			{!isLoading && suggestions.length > 0 && (
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
									{sug.text || sug.title}
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
			)}

			{/* Empty after generation */}
			{!isLoading && hasGenerated && suggestions.length === 0 && !error && (
				<p className="text-[13px] leading-relaxed text-[var(--color-muted)]">
					No suggestions at this time. Your resume looks good! Click "Refresh" after making changes to get new suggestions.
				</p>
			)}
		</motion.div>
	)
}

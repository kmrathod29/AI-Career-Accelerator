import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, AlertCircle, Sparkles, RefreshCw, FileText } from 'lucide-react'
import { toast } from 'sonner'
import { SEVERITY_CONFIG } from '@constants/atsAnalyzer.js'
import { cn } from '@utils/classNames.js'

/**
 * ResumeVerificationModal
 *
 * Provides confirmation and upload triggering for:
 * 1. ATS Issues — "I've Fixed This" -> verify via updated resume upload
 * 2. AI Suggestions — "I've Applied This" -> verify via updated resume upload
 * 3. Top-level Re-analysis — "Re-analyze Resume" -> upload updated resume file
 */
export function ResumeVerificationModal({
	isOpen = false,
	onClose,
	mode = 'issue', // 'issue' | 'suggestion' | 'reanalyze'
	targetItem = null,
	onConfirmUpload,
}) {
	const fileInputRef = useRef(null)
	const [isValidating, setIsValidating] = useState(false)

	if (!isOpen) return null

	const handleFileSelect = (e) => {
		const file = e.target.files?.[0]
		if (!file) return

		// Reset input value so re-selecting same file triggers onChange
		if (fileInputRef.current) {
			fileInputRef.current.value = ''
		}

		// Validation: file extension
		const ext = '.' + file.name.split('.').pop().toLowerCase()
		if (!['.pdf', '.docx'].includes(ext)) {
			toast.error('Invalid file format. Please upload a PDF or DOCX file.')
			return
		}

		// Validation: file size (max 5 MB)
		if (file.size > 5 * 1024 * 1024) {
			toast.error('File size exceeds the 5 MB limit. Please select a smaller resume file.')
			return
		}

		setIsValidating(true)
		try {
			onConfirmUpload(file)
			onClose()
		} finally {
			setIsValidating(false)
		}
	}

	const isIssue = mode === 'issue'
	const isSuggestion = mode === 'suggestion'
	const isReanalyze = mode === 'reanalyze'

	const title = isIssue
		? 'Verify Fixed ATS Issue'
		: isSuggestion
			? 'Verify Applied Suggestion'
			: 'Re-analyze Resume'

	const question = isIssue
		? 'Have you updated your resume to fix this issue?'
		: isSuggestion
			? 'Have you applied this suggestion to your resume?'
			: 'Upload your updated resume to generate a fresh ATS analysis.'

	const helperText = isIssue
		? 'Fix the issue in your resume, then upload the updated version to verify it.'
		: isSuggestion
			? 'Apply the suggestion to your resume, then upload the updated version to verify it.'
			: 'Upload your latest resume to generate a fresh ATS analysis.'

	const uploadBtnLabel = 'Upload Updated Resume'

	const severity = isIssue && targetItem?.severity
		? SEVERITY_CONFIG[targetItem.severity] ?? SEVERITY_CONFIG.medium
		: null

	return (
		<AnimatePresence>
			<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
				{/* Backdrop */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					onClick={onClose}
					className="fixed inset-0 bg-black/75 backdrop-blur-sm"
				/>

				{/* Modal Card */}
				<motion.div
					initial={{ opacity: 0, scale: 0.95, y: 16 }}
					animate={{ opacity: 1, scale: 1, y: 0 }}
					exit={{ opacity: 0, scale: 0.95, y: 16 }}
					transition={{ type: 'spring', duration: 0.35, bounce: 0.15 }}
					className="relative z-10 w-full max-w-lg rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-2xl"
				>
					{/* Close button */}
					<button
						type="button"
						onClick={onClose}
						className="absolute right-4 top-4 rounded-lg p-1.5 text-[var(--color-muted)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]"
					>
						<X className="h-4 w-4" />
					</button>

					{/* Header with Icon */}
					<div className="flex items-center gap-3">
						<div className={cn(
							'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
							isIssue && 'bg-amber-500/10 text-amber-500',
							isSuggestion && 'bg-violet-500/10 text-violet-500',
							isReanalyze && 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]',
						)}>
							{isIssue && <AlertCircle className="h-5 w-5" />}
							{isSuggestion && <Sparkles className="h-5 w-5" />}
							{isReanalyze && <RefreshCw className="h-5 w-5" />}
						</div>

						<div className="min-w-0">
							<h3 className="text-lg font-bold tracking-tight text-[var(--color-text)]">
								{title}
							</h3>
							<p className="text-xs text-[var(--color-muted)]">
								Verification via latest resume content
							</p>
						</div>
					</div>

					{/* Body / Question */}
					<div className="mt-5 space-y-4">
						<p className="text-sm font-semibold text-[var(--color-text)]">
							{question}
						</p>

						{/* Target item preview box */}
						{isIssue && targetItem && (
							<div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3.5">
								<div className="mb-1.5 flex items-center gap-2">
									{severity && (
										<span
											className={cn(
												'rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider',
												severity.bgClass,
												severity.textClass,
												severity.borderClass,
											)}
										>
											{severity.label}
										</span>
									)}
									<span className="text-[11px] text-[var(--color-muted)]">Flagged ATS Issue</span>
								</div>
								<p className="text-[13px] leading-relaxed text-[var(--color-text)]">
									{targetItem.text}
								</p>
							</div>
						)}

						{isSuggestion && targetItem && (
							<div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3.5">
								<span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-violet-400">
									Recommended Change
								</span>
								<p className="text-[13px] font-medium leading-relaxed text-[var(--color-text)]">
									{targetItem.replacement || targetItem.text}
								</p>
								{targetItem.context && (
									<p className="mt-1 text-[11px] text-[var(--color-muted)]">
										{targetItem.context}
									</p>
								)}
							</div>
						)}

						{isReanalyze && (
							<div className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3.5">
								<FileText className="h-5 w-5 text-[var(--color-primary)]" />
								<p className="text-xs leading-relaxed text-[var(--color-muted)]">
									The current analysis was generated from your previous resume version. Upload the latest version of your resume to re-analyze it against modern ATS systems and generate fresh insights.
								</p>
							</div>
						)}

						{/* Explanatory notice */}
						<div className="rounded-xl border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/5 p-3">
							<p className="text-xs leading-relaxed text-[var(--color-text)]">
								{helperText}
							</p>
							<p className="mt-1 text-[11px] text-[var(--color-muted)]">
								{isReanalyze
									? 'All scores, keyword matches, issues, and AI recommendations will be updated in-place.'
									: 'Note: The issue or suggestion will only be marked resolved if our fresh ATS analysis confirms it is no longer detected.'}
							</p>
						</div>
					</div>

					{/* Hidden file input */}
					<input
						ref={fileInputRef}
						type="file"
						accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
						className="hidden"
						onChange={handleFileSelect}
					/>

					{/* Actions */}
					<div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
						<button
							type="button"
							onClick={onClose}
							className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface-2)] cursor-pointer"
						>
							Cancel
						</button>

						<button
							type="button"
							onClick={() => fileInputRef.current?.click()}
							className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 cursor-pointer"
						>
							<Upload className="h-4 w-4" />
							{uploadBtnLabel}
						</button>
					</div>
				</motion.div>
			</div>
		</AnimatePresence>
	)
}

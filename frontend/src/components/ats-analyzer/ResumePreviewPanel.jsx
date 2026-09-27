import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, RefreshCw } from 'lucide-react'
import { atsStore, useAtsFile, useAtsResult, useAtsCurrentId } from '@/stores/atsStore.js'
import { ResumeVerificationModal } from './ResumeVerificationModal.jsx'

/**
 * ResumePreviewPanel — shows the uploaded resume file info and
 * provides the top-level "Re-analyze Resume" action with fresh upload modal.
 */
export function ResumePreviewPanel() {
	const [showReanalyzeModal, setShowReanalyzeModal] = useState(false)
	const file = useAtsFile()
	const result = useAtsResult()
	const currentId = useAtsCurrentId()
	const fileName = file?.name || result?.resumeFileName

	const handleReAnalyzeClick = () => {
		setShowReanalyzeModal(true)
	}

	const handleConfirmUpload = async (newFile) => {
		await atsStore.reAnalyzeWithFile(newFile, currentId, { type: 'reanalyze' })
		setShowReanalyzeModal(false)
	}

	return (
		<div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-card)]">
			{/* Header */}
			<div className="flex items-center gap-2 border-b border-[var(--color-border)] px-5 py-3.5">
				<FileText className="h-4 w-4 text-[var(--color-primary)]" strokeWidth={1.8} />
				<h3 className="text-sm font-semibold text-[var(--color-text)]">
					Analyzed Resume
				</h3>
			</div>

			<div className="p-5">
				{fileName ? (
					<div className="space-y-4">
						{/* File info card */}
						<div className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3">
							<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)]/10">
								<FileText className="h-5 w-5 text-[var(--color-primary)]" />
							</div>
							<div className="min-w-0 flex-1">
								<p className="truncate text-sm font-medium text-[var(--color-text)]">
									{fileName}
								</p>
								<p className="mt-0.5 text-xs text-[var(--color-muted)]">
									{fileName.endsWith('.pdf') ? 'PDF Document' : 'DOCX Document'}
								</p>
							</div>
						</div>

						{/* Helper text */}
						<p className="text-xs leading-relaxed text-[var(--color-muted)]">
							Upload your latest resume to generate a fresh ATS analysis.
						</p>

						{/* Re-analyze action button */}
						<motion.button
							type="button"
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							onClick={handleReAnalyzeClick}
							className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-2.5 text-sm font-medium text-[var(--color-text)] shadow-sm transition-all hover:border-[var(--color-primary)]/40 hover:bg-[var(--color-surface-3)] hover:text-[var(--color-primary)] cursor-pointer"
						>
							<RefreshCw className="h-4 w-4" />
							Re-analyze Resume
						</motion.button>
					</div>
				) : (
					<p className="text-center text-sm text-[var(--color-muted)]">
						No resume file selected
					</p>
				)}
			</div>

			{/* Re-analyze Upload Modal */}
			<ResumeVerificationModal
				isOpen={showReanalyzeModal}
				onClose={() => setShowReanalyzeModal(false)}
				mode="reanalyze"
				onConfirmUpload={handleConfirmUpload}
			/>
		</div>
	)
}

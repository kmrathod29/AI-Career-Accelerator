import { FileText } from 'lucide-react'
import { useAtsFile, useAtsResult } from '@/stores/atsStore.js'

/**
 * ResumePreviewPanel — shows the uploaded resume file info.
 * Since ATS analysis works with extracted text (not visual rendering),
 * this panel displays file metadata rather than a rendered preview.
 */
export function ResumePreviewPanel() {
	const file = useAtsFile()
	const result = useAtsResult()
	const fileName = file?.name || result?.resumeFileName

	return (
		<div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-card)]">
			<div className="flex items-center gap-2 border-b border-[var(--color-border)] px-5 py-3.5">
				<FileText className="h-4 w-4 text-[var(--color-primary)]" strokeWidth={1.8} />
				<h3 className="text-sm font-semibold text-[var(--color-text)]">
					Analyzed Resume
				</h3>
			</div>

			<div className="px-5 py-4">
				{fileName ? (
					<div className="flex items-center gap-3">
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
				) : (
					<p className="text-center text-sm text-[var(--color-muted)]">
						No resume file selected
					</p>
				)}
			</div>
		</div>
	)
}

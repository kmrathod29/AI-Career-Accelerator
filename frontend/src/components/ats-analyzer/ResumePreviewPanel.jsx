import { FileText } from 'lucide-react'
import { DUMMY_RESUME_HTML } from '@constants/atsAnalyzer.js'

/**
 * ResumePreviewPanel — sticky panel showing dummy HTML resume preview.
 */
export function ResumePreviewPanel() {
	return (
		<div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-card)]">
			<div className="flex items-center gap-2 border-b border-[var(--color-border)] px-5 py-3.5">
				<FileText className="h-4 w-4 text-[var(--color-primary)]" strokeWidth={1.8} />
				<h3 className="text-sm font-semibold text-[var(--color-text)]">
					Resume Preview
				</h3>
			</div>

			<div
				className="max-h-[600px] overflow-y-auto px-5 py-4 scrollbar-none"
				dangerouslySetInnerHTML={{ __html: DUMMY_RESUME_HTML }}
			/>
		</div>
	)
}

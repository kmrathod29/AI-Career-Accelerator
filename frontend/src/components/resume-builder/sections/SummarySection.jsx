import { useResumeSummary, resumeStore } from '@/stores/resumeStore.js'

/**
 * SummarySection — large textarea for professional summary.
 */
export function SummarySection() {
	const summary = useResumeSummary()

	return (
		<div>
			<label className="mb-1.5 block text-xs font-medium text-[var(--color-muted)]">
				Professional Summary
			</label>
			<textarea
				value={summary}
				onChange={(e) => resumeStore.updateSummary(e.target.value)}
				placeholder="Write a compelling summary highlighting your key strengths, experience, and career objectives..."
				rows={5}
				className="w-full resize-y rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3.5 py-2.5 text-sm leading-relaxed text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-muted)]/60 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
			/>
			<p className="mt-1.5 text-right text-[11px] text-[var(--color-muted)]">
				{summary.length} characters
			</p>
		</div>
	)
}

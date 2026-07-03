/**
 * PageHeader — reusable page header with title and subtitle.
 * Provides consistent typography across all dashboard pages.
 */
export function PageHeader({ title, subtitle }) {
	return (
		<div className="mb-4 min-w-0 sm:mb-6">
			<h2 className="text-lg font-semibold tracking-tight text-[var(--color-text)] sm:text-2xl">
				{title}
			</h2>
			{subtitle && (
				<p className="mt-1 text-sm text-[var(--color-muted)]">{subtitle}</p>
			)}
		</div>
	)
}

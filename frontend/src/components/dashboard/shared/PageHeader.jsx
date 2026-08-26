/**
 * PageHeader — reusable page header with eyebrow, title and subtitle.
 * Provides consistent typography across all dashboard pages.
 */
export function PageHeader({ eyebrow, title, subtitle }) {
	return (
		<div className="mb-4 min-w-0 sm:mb-6">
			{eyebrow && (
				<p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--color-primary)]">
					{eyebrow}
				</p>
			)}
			<h2 className="text-2xl font-black tracking-[-0.05em] leading-[1.05] text-[var(--color-text)] sm:text-[32px]">
				{title}
			</h2>
			{subtitle && (
				<p className="mt-1 text-base leading-[1.6] text-[var(--color-muted)]">{subtitle}</p>
			)}
		</div>
	)
}

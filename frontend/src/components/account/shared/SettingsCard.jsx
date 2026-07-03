import { cn } from '@utils/classNames.js'
import { Card } from '@components/ui/Card.jsx'

export function SettingsCard({ title, description, children, className, footer }) {
	return (
		<Card className={cn('overflow-hidden p-0', className)}>
			{(title || description) && (
				<div className="border-b border-[var(--color-border)] px-4 py-4 sm:px-6 sm:py-5">
					{title && (
						<h3 className="text-base font-semibold text-[var(--color-text)]">{title}</h3>
					)}
					{description && (
						<p className="mt-1 text-sm text-[var(--color-muted)]">{description}</p>
					)}
				</div>
			)}
			<div className="px-4 py-4 sm:px-6 sm:py-5">{children}</div>
			{footer && (
				<div className="border-t border-[var(--color-border)] bg-[var(--color-surface-inset)] px-4 py-3 sm:px-6 sm:py-4">
					{footer}
				</div>
			)}
		</Card>
	)
}

export function SettingsRow({ label, description, children, className }) {
	return (
		<div
			className={cn(
				'flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between',
				className,
			)}
		>
			<div className="min-w-0 flex-1">
				<p className="text-sm font-medium text-[var(--color-text)]">{label}</p>
				{description && (
					<p className="mt-0.5 text-xs leading-relaxed text-[var(--color-muted)]">
						{description}
					</p>
				)}
			</div>
			<div className="min-w-0 shrink-0">{children}</div>
		</div>
	)
}

export function SectionHeader({ title, description }) {
	return (
		<div className="mb-4 sm:mb-6">
			<h2 className="text-lg font-semibold tracking-tight text-[var(--color-text)] sm:text-xl">
				{title}
			</h2>
			{description && (
				<p className="mt-1 text-sm text-[var(--color-muted)]">{description}</p>
			)}
		</div>
	)
}

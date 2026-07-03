import { motion } from 'framer-motion'
import { BellOff, Inbox } from 'lucide-react'
import { cn } from '@utils/classNames.js'

/**
 * Premium empty state for notification lists.
 */
export function NotificationEmptyState({
	title = 'All caught up',
	description = 'No notifications to show. We\'ll notify you when something important happens.',
	variant = 'default',
	className,
}) {
	const isError = variant === 'error'

	return (
		<motion.div
			initial={{ opacity: 0, y: 8 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3, ease: 'easeOut' }}
			className={cn('flex flex-col items-center justify-center px-6 py-12 text-center', className)}
		>
			<div
				className={cn(
					'mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border',
					isError
						? 'border-[var(--notif-error)]/20 bg-[var(--notif-error-bg)]'
						: 'border-[var(--color-border)] bg-[var(--color-surface-2)]',
				)}
			>
				{isError ? (
					<BellOff className="h-7 w-7 text-[var(--notif-error)]" strokeWidth={1.5} />
				) : (
					<Inbox className="h-7 w-7 text-[var(--color-muted)]" strokeWidth={1.5} />
				)}
			</div>

			<h3 className="text-sm font-semibold text-[var(--color-text)]">{title}</h3>
			<p className="mt-1.5 max-w-xs text-[13px] leading-relaxed text-[var(--color-muted)]">
				{description}
			</p>
		</motion.div>
	)
}

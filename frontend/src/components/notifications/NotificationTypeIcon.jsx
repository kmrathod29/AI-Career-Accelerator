import { NOTIFICATION_TYPE_CONFIG } from '@constants/notifications.js'
import { cn } from '@utils/classNames.js'

/**
 * Type icon badge for notifications.
 */
export function NotificationTypeIcon({ type, size = 'md', className }) {
	const config = NOTIFICATION_TYPE_CONFIG[type] ?? NOTIFICATION_TYPE_CONFIG.info
	const Icon = config.icon

	const sizeClasses = {
		sm: 'h-7 w-7 rounded-lg [&>svg]:h-3.5 [&>svg]:w-3.5',
		md: 'h-9 w-9 rounded-xl [&>svg]:h-4 [&>svg]:w-4',
		lg: 'h-11 w-11 rounded-xl [&>svg]:h-5 [&>svg]:w-5',
	}

	return (
		<div
			className={cn(
				'flex shrink-0 items-center justify-center',
				sizeClasses[size],
				className,
			)}
			style={{ backgroundColor: config.bg, color: config.color }}
			aria-hidden
		>
			<Icon strokeWidth={1.8} />
		</div>
	)
}

/**
 * Small type label badge for filters/lists.
 */
export function NotificationTypeBadge({ type, className }) {
	const config = NOTIFICATION_TYPE_CONFIG[type] ?? NOTIFICATION_TYPE_CONFIG.info

	return (
		<span
			className={cn(
				'inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide',
				className,
			)}
			style={{ backgroundColor: config.bg, color: config.color }}
		>
			{config.label}
		</span>
	)
}

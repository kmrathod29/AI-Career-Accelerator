import { memo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, ExternalLink, Trash2, MailOpen } from 'lucide-react'
import { NotificationTypeIcon } from './NotificationTypeIcon.jsx'
import { formatRelativeTime } from '@utils/notificationHelpers.js'
import { cn } from '@utils/classNames.js'

/**
 * Reusable notification row — used in popup and full page.
 */
export const NotificationItem = memo(function NotificationItem({
	notification,
	variant = 'default',
	showActions = false,
	showCompactActions = false,
	showCheckbox = false,
	checked = false,
	onCheck,
	onMarkRead,
	onMarkUnread,
	onDelete,
	onOpen,
}) {
	const { id, title, description, type, timestamp, read, actionUrl, actionLabel } = notification
	const isCompact = variant === 'compact'

	const handleOpen = () => {
		if (!read && onMarkRead) onMarkRead(id)
		onOpen?.(notification)
	}

	const content = (
		<div
			className={cn(
				'group relative flex items-start gap-3 transition-colors duration-150',
				isCompact ? 'px-4 py-3' : 'gap-4 px-5 py-4',
				!read && 'bg-[var(--color-primary)]/[0.03]',
				'hover:bg-[var(--color-surface-2)]',
			)}
		>
			{showCheckbox && (
				<label className="mt-2 flex shrink-0 cursor-pointer items-center">
					<input
						type="checkbox"
						checked={checked}
						onChange={() => onCheck?.(id)}
						className="h-4 w-4 rounded border-[var(--color-border)] accent-[var(--color-primary)]"
						aria-label={`Select ${title}`}
					/>
				</label>
			)}

			{/* Unread indicator */}
			<div className="relative shrink-0">
				<NotificationTypeIcon type={type} size={isCompact ? 'sm' : 'md'} />
				{!read && (
					<span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-[var(--floating-bg)] bg-[var(--color-primary)]" />
				)}
			</div>

			<div className="min-w-0 flex-1">
				<div className="flex items-start justify-between gap-2">
					<p
						className={cn(
							'text-[13px] leading-snug text-[var(--color-text)]',
							!read && 'font-semibold',
						)}
					>
						{title}
					</p>
					<span className="shrink-0 text-[11px] text-[var(--color-muted)]">
						{formatRelativeTime(timestamp)}
					</span>
				</div>

				<p
					className={cn(
						'mt-0.5 text-[12px] leading-relaxed',
						read ? 'text-[var(--color-muted)]' : 'text-[var(--color-text)]/70',
					)}
				>
					{description}
				</p>

				{actionUrl && actionLabel && !showActions && (
					<span className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-medium text-[var(--color-primary)]">
						{actionLabel}
						<ExternalLink className="h-3 w-3" strokeWidth={2} />
					</span>
				)}
			</div>

			{(showActions || showCompactActions) && (
				<div
					className={cn(
						'flex shrink-0 items-center gap-0.5 transition-opacity max-sm:opacity-100',
						showCompactActions
							? 'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100'
							: 'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100',
					)}
				>
					{read ? (
						<button
							type="button"
							onClick={(e) => {
								e.stopPropagation()
								onMarkUnread?.(id)
							}}
							className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-muted)] transition-colors hover:bg-[var(--color-surface-3)] hover:text-[var(--color-text)]"
							aria-label="Mark as unread"
							title="Mark unread"
						>
							<MailOpen className="h-3.5 w-3.5" strokeWidth={1.8} />
						</button>
					) : (
						<button
							type="button"
							onClick={(e) => {
								e.stopPropagation()
								onMarkRead?.(id)
							}}
							className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-muted)] transition-colors hover:bg-[var(--color-surface-3)] hover:text-[var(--color-text)]"
							aria-label="Mark as read"
							title="Mark read"
						>
							<Check className="h-3.5 w-3.5" strokeWidth={1.8} />
						</button>
					)}

					{actionUrl && (
						<Link
							to={actionUrl}
							onClick={(e) => {
								e.stopPropagation()
								handleOpen()
							}}
							className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-muted)] transition-colors hover:bg-[var(--color-surface-3)] hover:text-[var(--color-primary)]"
							aria-label="Open notification"
							title="Open"
						>
							<ExternalLink className="h-3.5 w-3.5" strokeWidth={1.8} />
						</Link>
					)}

					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation()
							onDelete?.(id)
						}}
						className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-muted)] transition-colors hover:bg-[var(--notif-error-bg)] hover:text-[var(--notif-error)]"
						aria-label="Delete notification"
						title="Delete"
					>
						<Trash2 className="h-3.5 w-3.5" strokeWidth={1.8} />
					</button>
				</div>
			)}
		</div>
	)

	if (actionUrl && !showActions && !showCompactActions) {
		return (
			<motion.div layout initial={false}>
				<Link to={actionUrl} onClick={handleOpen} className="block">
					{content}
				</Link>
			</motion.div>
		)
	}

	return (
		<motion.div
			layout
			initial={false}
			onClick={showActions || showCompactActions ? undefined : handleOpen}
			className={showActions || showCompactActions ? 'cursor-default' : 'cursor-pointer'}
		>
			{content}
		</motion.div>
	)
})

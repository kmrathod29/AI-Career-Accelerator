import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCheck, X, ExternalLink } from 'lucide-react'
import { NotificationItem } from './NotificationItem.jsx'
import { NotificationEmptyState } from './NotificationEmptyState.jsx'
import { NotificationSkeleton } from './NotificationSkeleton.jsx'
import { groupNotificationsByDate } from '@utils/notificationHelpers.js'
import { notificationStore } from '@/stores/notificationStore.js'
import { APP_ROUTES } from '@constants/routes.js'

function NotificationGroup({ label, notifications, onMarkRead, onDelete, onOpen }) {
	if (!notifications.length) return null

	return (
		<div>
			<p className="sticky top-0 z-10 bg-[var(--floating-bg)] px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">
				{label}
			</p>
			<AnimatePresence initial={false}>
				{notifications.map((notification) => (
					<motion.div
						key={notification.id}
						layout
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: 'auto' }}
						exit={{ opacity: 0, height: 0, marginTop: 0 }}
						transition={{ duration: 0.2, ease: 'easeOut' }}
						className="overflow-hidden border-b border-[var(--color-border)] last:border-b-0"
					>
						<NotificationItem
							notification={notification}
							variant="compact"
							showCompactActions
							onMarkRead={onMarkRead}
							onDelete={onDelete}
							onOpen={onOpen}
						/>
					</motion.div>
				))}
			</AnimatePresence>
		</div>
	)
}

/**
 * Premium floating notification popup — synced with central store.
 */
export function NotificationPopup({
	notifications,
	unreadCount,
	isLoading,
	onClose,
}) {
	const groups = groupNotificationsByDate(notifications)
	const hasNotifications = notifications.length > 0

	const handleMarkRead = (id) => notificationStore.markAsRead(id)
	const handleDelete = (id) => notificationStore.deleteNotification(id)
	const handleMarkAllRead = () => notificationStore.markAllAsRead()
	const handleClearPopup = () => notificationStore.clearPopup()

	return (
		<motion.div
			initial={{ opacity: 0, y: 8, scale: 0.96 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			exit={{ opacity: 0, y: 8, scale: 0.96 }}
			transition={{ duration: 0.18, ease: 'easeOut' }}
			className="absolute right-0 top-full z-50 mt-2 flex w-[min(100vw-2rem,22rem)] flex-col overflow-hidden rounded-2xl border shadow-lg sm:w-96"
			style={{
				backgroundColor: 'var(--floating-bg)',
				borderColor: 'var(--floating-border)',
				boxShadow: 'var(--floating-shadow)',
			}}
		>
			{/* Header */}
			<div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
				<div>
					<p className="text-sm font-semibold text-[var(--color-text)]">Notifications</p>
					{unreadCount > 0 && (
						<p className="text-[11px] text-[var(--color-muted)]">
							{unreadCount} unread
						</p>
					)}
				</div>

				{hasNotifications && (
					<div className="flex items-center gap-1">
						{unreadCount > 0 && (
							<button
								type="button"
								onClick={handleMarkAllRead}
								className="flex h-8 items-center gap-1 rounded-lg px-2 text-[11px] font-medium text-[var(--color-primary)] transition-colors hover:bg-[var(--color-surface-2)]"
								title="Mark all as read"
							>
								<CheckCheck className="h-3.5 w-3.5" strokeWidth={1.8} />
								<span className="hidden sm:inline">Mark all read</span>
							</button>
						)}
						<button
							type="button"
							onClick={handleClearPopup}
							className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-muted)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]"
							aria-label="Clear popup"
							title="Clear popup"
						>
							<X className="h-4 w-4" strokeWidth={1.8} />
						</button>
					</div>
				)}
			</div>

			{/* List */}
			<div className="max-h-[min(60vh,22rem)] overflow-y-auto">
				{isLoading ? (
					<NotificationSkeleton count={4} compact />
				) : !hasNotifications ? (
					<NotificationEmptyState
						title="All caught up"
						description="No new notifications. Check back later for updates on your career journey."
						className="py-10"
					/>
				) : (
					<>
						<NotificationGroup
							label="Today"
							notifications={groups.today}
							onMarkRead={handleMarkRead}
							onDelete={handleDelete}
							onOpen={onClose}
						/>
						<NotificationGroup
							label="Yesterday"
							notifications={groups.yesterday}
							onMarkRead={handleMarkRead}
							onDelete={handleDelete}
							onOpen={onClose}
						/>
						<NotificationGroup
							label="Earlier"
							notifications={groups.earlier}
							onMarkRead={handleMarkRead}
							onDelete={handleDelete}
							onOpen={onClose}
						/>
					</>
				)}
			</div>

			{/* Footer */}
			<div className="border-t border-[var(--color-border)] px-4 py-2.5">
				<Link
					to={APP_ROUTES.NOTIFICATIONS}
					onClick={onClose}
					className="flex w-full items-center justify-center gap-1.5 rounded-xl py-2 text-[12px] font-semibold text-[var(--color-primary)] transition-colors hover:bg-[var(--color-surface-2)]"
				>
					View all notifications
					<ExternalLink className="h-3 w-3" strokeWidth={2} />
				</Link>
			</div>
		</motion.div>
	)
}

import { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
	Search,
	SlidersHorizontal,
	CheckCheck,
	Trash2,
	MailOpen,
	Bell,
} from 'lucide-react'
import { PageHeader } from '@components/dashboard/shared/PageHeader.jsx'
import { SwipeableNotificationRow } from '@components/notifications/SwipeableNotificationRow.jsx'
import { NotificationEmptyState } from '@components/notifications/NotificationEmptyState.jsx'
import { NotificationSkeleton } from '@components/notifications/NotificationSkeleton.jsx'
import { ConfirmDialog } from '@components/notifications/ConfirmDialog.jsx'
import {
	NOTIFICATION_FILTERS,
	NOTIFICATION_SORT_OPTIONS,
} from '@constants/notifications.js'
import {
	filterNotifications,
	sortNotifications,
} from '@utils/notificationHelpers.js'
import {
	useNotifications,
	useNotificationLoading,
	notificationStore,
} from '@/stores/notificationStore.js'
import { cn } from '@utils/classNames.js'

const fadeUp = {
	initial: { opacity: 0, y: 12 },
	animate: { opacity: 1, y: 0 },
}

export function NotificationsPage() {
	const notifications = useNotifications()
	const isLoading = useNotificationLoading()

	const [search, setSearch] = useState('')
	const [activeFilter, setActiveFilter] = useState('all')
	const [sortBy, setSortBy] = useState('newest')
	const [selectedIds, setSelectedIds] = useState(new Set())
	const [showFilters, setShowFilters] = useState(false)
	const [confirmClear, setConfirmClear] = useState(false)
	const [confirmBulkDelete, setConfirmBulkDelete] = useState(false)
	const [error, setError] = useState(null)

	const filtered = useMemo(
		() =>
			sortNotifications(
				filterNotifications(notifications, { search, filter: activeFilter }),
				sortBy,
			),
		[notifications, search, activeFilter, sortBy],
	)

	const allSelected = filtered.length > 0 && filtered.every((n) => selectedIds.has(n.id))
	const someSelected = selectedIds.size > 0
	const unreadInView = filtered.filter((n) => !n.read).length

	const toggleSelect = useCallback((id) => {
		setSelectedIds((prev) => {
			const next = new Set(prev)
			if (next.has(id)) next.delete(id)
			else next.add(id)
			return next
		})
	}, [])

	const toggleSelectAll = () => {
		if (allSelected) {
			setSelectedIds(new Set())
		} else {
			setSelectedIds(new Set(filtered.map((n) => n.id)))
		}
	}

	const handleBulkMarkRead = () => {
		selectedIds.forEach((id) => notificationStore.markAsRead(id))
		setSelectedIds(new Set())
	}

	const handleBulkMarkUnread = () => {
		selectedIds.forEach((id) => notificationStore.markAsUnread(id))
		setSelectedIds(new Set())
	}

	const handleBulkDelete = () => {
		notificationStore.deleteMultiple([...selectedIds])
		setSelectedIds(new Set())
		setConfirmBulkDelete(false)
	}

	const handleClearHistory = () => {
		try {
			notificationStore.clearHistory()
			setSelectedIds(new Set())
			setConfirmClear(false)
		} catch {
			setError('Failed to clear notification history. Please try again.')
		}
	}

	return (
		<motion.div
			initial="initial"
			animate="animate"
			transition={{ staggerChildren: 0.05 }}
			className="mx-auto min-w-0 max-w-4xl overflow-x-hidden"
		>
			<motion.div variants={fadeUp} transition={{ duration: 0.35 }}>
				<PageHeader
					title="Notifications"
					subtitle="Stay updated on resume analyses, interview results, and career milestones."
				/>
			</motion.div>

			{/* Stats bar */}
			<motion.div
				variants={fadeUp}
				transition={{ duration: 0.35 }}
				className="mb-5 flex flex-wrap items-center gap-3"
			>
				<div className="flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] px-3.5 py-2">
					<Bell className="h-4 w-4 text-[var(--color-primary)]" strokeWidth={1.8} />
					<span className="text-sm font-medium text-[var(--color-text)]">
						{notifications.length} total
					</span>
				</div>
				{unreadInView > 0 && (
					<div className="flex items-center gap-2 rounded-xl border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/8 px-3.5 py-2">
						<span className="relative flex h-2 w-2">
							<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-primary)] opacity-40" />
							<span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-primary)]" />
						</span>
						<span className="text-sm font-medium text-[var(--color-primary)]">
							{unreadInView} unread
						</span>
					</div>
				)}
			</motion.div>

			{/* Toolbar */}
			<motion.div
				variants={fadeUp}
				transition={{ duration: 0.35 }}
				className="mb-4 space-y-3"
			>
				<div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center">
					<div className="relative min-w-0 flex-1">
						<Search
							className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted)]"
							strokeWidth={1.8}
						/>
						<input
							type="search"
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search notifications..."
							className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] py-2.5 pl-10 pr-4 text-sm text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
							aria-label="Search notifications"
						/>
					</div>

					<div className="flex min-w-0 flex-wrap items-center gap-2">
						<select
							value={sortBy}
							onChange={(e) => setSortBy(e.target.value)}
							className="min-w-0 max-w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-sm text-[var(--color-text)] outline-none transition-colors focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
							aria-label="Sort notifications"
						>
							{NOTIFICATION_SORT_OPTIONS.map((opt) => (
								<option key={opt.id} value={opt.id}>
									{opt.label}
								</option>
							))}
						</select>

						<button
							type="button"
							onClick={() => setShowFilters((v) => !v)}
							className={cn(
								'flex h-10 items-center gap-2 rounded-xl border px-3.5 text-sm font-medium transition-colors',
								showFilters
									? 'border-[var(--color-primary)]/30 bg-[var(--color-primary)]/8 text-[var(--color-primary)]'
									: 'border-[var(--color-border)] text-[var(--color-text)] hover:bg-[var(--color-surface-2)]',
							)}
							aria-expanded={showFilters}
						>
							<SlidersHorizontal className="h-4 w-4" strokeWidth={1.8} />
							<span className="hidden sm:inline">Filter</span>
						</button>
					</div>
				</div>

				{/* Filter pills */}
				<AnimatePresence>
					{showFilters && (
						<motion.div
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: 'auto' }}
							exit={{ opacity: 0, height: 0 }}
							transition={{ duration: 0.2 }}
							className="overflow-hidden"
						>
							<div className="flex flex-wrap gap-2 pb-1">
								{NOTIFICATION_FILTERS.map((filter) => (
									<button
										key={filter.id}
										type="button"
										onClick={() => setActiveFilter(filter.id)}
										className={cn(
											'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
											activeFilter === filter.id
												? 'border-[var(--color-primary)]/30 bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
												: 'border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-primary)]/20 hover:text-[var(--color-text)]',
										)}
									>
										{filter.label}
									</button>
								))}
							</div>
						</motion.div>
					)}
				</AnimatePresence>

				{/* Bulk actions bar */}
				<div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] px-4 py-2.5">
					<label className="flex cursor-pointer items-center gap-2.5">
						<input
							type="checkbox"
							checked={allSelected}
							onChange={toggleSelectAll}
							disabled={filtered.length === 0}
							className="h-4 w-4 rounded border-[var(--color-border)] accent-[var(--color-primary)]"
							aria-label="Select all notifications"
						/>
						<span className="text-sm text-[var(--color-muted)]">
							{someSelected ? `${selectedIds.size} selected` : 'Select all'}
						</span>
					</label>

					<div className="flex flex-wrap items-center gap-1.5">
						{someSelected ? (
							<>
								<button
									type="button"
									onClick={handleBulkMarkRead}
									className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface-2)]"
								>
									<CheckCheck className="h-3.5 w-3.5" strokeWidth={1.8} />
									Mark read
								</button>
								<button
									type="button"
									onClick={handleBulkMarkUnread}
									className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface-2)]"
								>
									<MailOpen className="h-3.5 w-3.5" strokeWidth={1.8} />
									Mark unread
								</button>
								<button
									type="button"
									onClick={() => setConfirmBulkDelete(true)}
									className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-[var(--color-danger)] transition-colors hover:bg-[var(--notif-error-bg)]"
								>
									<Trash2 className="h-3.5 w-3.5" strokeWidth={1.8} />
									Delete
								</button>
							</>
						) : (
							<>
								<button
									type="button"
									onClick={() => notificationStore.markAllAsRead()}
									disabled={unreadInView === 0}
									className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface-2)] disabled:opacity-40"
								>
									<CheckCheck className="h-3.5 w-3.5" strokeWidth={1.8} />
									Mark all read
								</button>
								<button
									type="button"
									onClick={() => setConfirmClear(true)}
									disabled={notifications.length === 0}
									className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-[var(--color-danger)] transition-colors hover:bg-[var(--notif-error-bg)] disabled:opacity-40"
								>
									<Trash2 className="h-3.5 w-3.5" strokeWidth={1.8} />
									Clear history
								</button>
							</>
						)}
					</div>
				</div>
			</motion.div>

			{/* Notification list */}
			<motion.div
				variants={fadeUp}
				transition={{ duration: 0.35 }}
				className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-card)]"
			>
				{error && (
					<div className="border-b border-[var(--notif-error)]/20 bg-[var(--notif-error-bg)] px-4 py-3 text-sm text-[var(--notif-error)]">
						{error}
					</div>
				)}

				{isLoading ? (
					<NotificationSkeleton count={6} />
				) : filtered.length === 0 ? (
					<NotificationEmptyState
						title={search || activeFilter !== 'all' ? 'No matches found' : 'All caught up'}
						description={
							search || activeFilter !== 'all'
								? 'Try adjusting your search or filters to find what you\'re looking for.'
								: 'No notifications yet. We\'ll notify you when something important happens.'
						}
						variant={error ? 'error' : 'default'}
						className="py-16"
					/>
				) : (
					<AnimatePresence initial={false}>
						{filtered.map((notification) => (
							<motion.div
								key={notification.id}
								layout
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0, height: 0 }}
								transition={{ duration: 0.2 }}
							>
								<SwipeableNotificationRow
									notification={notification}
									showActions
									showCheckbox
									checked={selectedIds.has(notification.id)}
									onCheck={toggleSelect}
									onMarkRead={(id) => notificationStore.markAsRead(id)}
									onMarkUnread={(id) => notificationStore.markAsUnread(id)}
									onDelete={(id) => notificationStore.deleteNotification(id)}
								/>
							</motion.div>
						))}
					</AnimatePresence>
				)}
			</motion.div>

			{/* Mobile hint */}
			<p className="mt-3 text-center text-[11px] text-[var(--color-muted)] md:hidden">
				Swipe right to mark read · Swipe left to delete
			</p>

			<ConfirmDialog
				open={confirmClear}
				onClose={() => setConfirmClear(false)}
				onConfirm={handleClearHistory}
				title="Clear notification history?"
				description="This will permanently delete all notifications. This action cannot be undone."
				confirmLabel="Clear history"
				variant="danger"
			/>

			<ConfirmDialog
				open={confirmBulkDelete}
				onClose={() => setConfirmBulkDelete(false)}
				onConfirm={handleBulkDelete}
				title={`Delete ${selectedIds.size} notification${selectedIds.size === 1 ? '' : 's'}?`}
				description="Selected notifications will be permanently deleted."
				confirmLabel="Delete"
				variant="danger"
			/>
		</motion.div>
	)
}

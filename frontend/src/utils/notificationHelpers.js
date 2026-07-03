/**
 * Format a timestamp as a human-readable relative string.
 */
export function formatRelativeTime(timestamp) {
	const now = Date.now()
	const diff = now - timestamp
	const seconds = Math.floor(diff / 1000)
	const minutes = Math.floor(seconds / 60)
	const hours = Math.floor(minutes / 60)
	const days = Math.floor(hours / 24)

	if (seconds < 60) return 'Just now'
	if (minutes < 60) return `${minutes} min ago`
	if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
	if (days === 1) return 'Yesterday'
	if (days < 7) return `${days} days ago`

	return new Date(timestamp).toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: now - timestamp > 365 * 24 * 60 * 60 * 1000 ? 'numeric' : undefined,
	})
}

/**
 * Group notifications into Today / Yesterday / Earlier buckets.
 */
export function groupNotificationsByDate(notifications) {
	const now = new Date()
	const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
	const startOfYesterday = startOfToday - 24 * 60 * 60 * 1000

	const groups = { today: [], yesterday: [], earlier: [] }

	for (const notification of notifications) {
		if (notification.timestamp >= startOfToday) {
			groups.today.push(notification)
		} else if (notification.timestamp >= startOfYesterday) {
			groups.yesterday.push(notification)
		} else {
			groups.earlier.push(notification)
		}
	}

	return groups
}

/**
 * Sort notifications by the selected sort option.
 */
export function sortNotifications(notifications, sortBy) {
	const sorted = [...notifications]

	switch (sortBy) {
		case 'oldest':
			return sorted.sort((a, b) => a.timestamp - b.timestamp)
		case 'unread_first':
			return sorted.sort((a, b) => {
				if (a.read !== b.read) return a.read ? 1 : -1
				return b.timestamp - a.timestamp
			})
		case 'read_first':
			return sorted.sort((a, b) => {
				if (a.read !== b.read) return a.read ? -1 : 1
				return b.timestamp - a.timestamp
			})
		case 'newest':
		default:
			return sorted.sort((a, b) => b.timestamp - a.timestamp)
	}
}

/**
 * Filter notifications by search query and active filter.
 */
export function filterNotifications(notifications, { search = '', filter = 'all' } = {}) {
	let result = notifications

	if (filter === 'unread') {
		result = result.filter((n) => !n.read)
	} else if (filter === 'read') {
		result = result.filter((n) => n.read)
	} else if (filter !== 'all') {
		result = result.filter((n) => n.type === filter)
	}

	if (search.trim()) {
		const query = search.trim().toLowerCase()
		result = result.filter(
			(n) =>
				n.title.toLowerCase().includes(query) ||
				n.description.toLowerCase().includes(query),
		)
	}

	return result
}

import { useSyncExternalStore, useCallback } from 'react'
import { notificationApi } from '@/services/notificationApi.js'

/**
 * @typedef {Object} Notification
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} type
 * @property {number} timestamp
 * @property {boolean} read
 * @property {string} [actionUrl]
 * @property {string} [actionLabel]
 */

/** @type {{ notifications: Notification[], popupDismissedIds: string[], isLoading: boolean, lastArrivalAt: number | null, unreadCount: number, error: string | null }} */
let state = {
	notifications: [],
	popupDismissedIds: [],
	isLoading: true,
	lastArrivalAt: null,
	unreadCount: 0,
	error: null,
}

let popupNotificationsCacheState = null
let popupNotificationsCache = []

const listeners = new Set()

function emit() {
	listeners.forEach((listener) => listener())
}

function setState(partial) {
	state = { ...state, ...partial }
	emit()
}

/** @returns {Notification[]} */
function getPopupNotifications() {
	if (
		popupNotificationsCacheState &&
		popupNotificationsCacheState.notifications === state.notifications &&
		popupNotificationsCacheState.popupDismissedIds === state.popupDismissedIds
	) {
		return popupNotificationsCache
	}

	popupNotificationsCache = state.notifications.filter(
		(n) => !state.popupDismissedIds.includes(n.id),
	)
	popupNotificationsCacheState = {
		notifications: state.notifications,
		popupDismissedIds: state.popupDismissedIds,
	}
	return popupNotificationsCache
}

function getUnreadCount() {
	return state.unreadCount
}

export const notificationStore = {
	subscribe(listener) {
		listeners.add(listener)
		return () => listeners.delete(listener)
	},

	getState() {
		return state
	},

	getUnreadCount,
	getPopupNotifications,

	/**
	 * Fetch notifications from the backend API.
	 * Called on app startup (after auth) and when navigating to Notifications page.
	 */
	async init() {
		setState({ isLoading: true, error: null })
		try {
			const result = await notificationApi.getNotifications({ limit: 50 })
			if (result?.data) {
				setState({
					notifications: result.data.notifications ?? [],
					unreadCount: result.data.unreadCount ?? 0,
					isLoading: false,
					error: null,
				})
			} else {
				setState({ isLoading: false })
			}
		} catch (error) {
			// 401 means not authenticated — don't show as error, just empty
			if (error.response?.status === 401) {
				setState({ isLoading: false, notifications: [], unreadCount: 0 })
			} else {
				console.error('Notification init error:', error)
				setState({
					isLoading: false,
					error: error.response?.data?.message || 'Failed to load notifications',
				})
			}
		}
	},

	/**
	 * Fetch just the unread count (lightweight).
	 */
	async fetchUnreadCount() {
		try {
			const result = await notificationApi.getUnreadCount()
			if (result?.data) {
				setState({ unreadCount: result.data.unreadCount ?? 0 })
			}
		} catch {
			// Silently fail — badge will show stale count
		}
	},

	/**
	 * Mark a notification as read — optimistic UI update then API call.
	 */
	async markAsRead(id) {
		// Optimistic update
		const prev = state.notifications
		setState({
			notifications: prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
			unreadCount: Math.max(0, state.unreadCount - (prev.find((n) => n.id === id && !n.read) ? 1 : 0)),
		})

		try {
			await notificationApi.markAsRead(id)
		} catch {
			// Revert on error
			setState({ notifications: prev })
			notificationStore.fetchUnreadCount()
		}
	},

	/**
	 * Mark a notification as unread — optimistic UI update then API call.
	 */
	async markAsUnread(id) {
		const prev = state.notifications
		setState({
			notifications: prev.map((n) => (n.id === id ? { ...n, read: false } : n)),
			unreadCount: state.unreadCount + (prev.find((n) => n.id === id && n.read) ? 1 : 0),
		})

		try {
			await notificationApi.markAsUnread(id)
		} catch {
			setState({ notifications: prev })
			notificationStore.fetchUnreadCount()
		}
	},

	/**
	 * Mark all notifications as read — optimistic.
	 */
	async markAllAsRead() {
		const prev = state.notifications
		setState({
			notifications: prev.map((n) => ({ ...n, read: true })),
			unreadCount: 0,
		})

		try {
			await notificationApi.markAllAsRead()
		} catch {
			setState({ notifications: prev })
			notificationStore.fetchUnreadCount()
		}
	},

	/**
	 * Delete a notification — optimistic.
	 */
	async deleteNotification(id) {
		const prev = state.notifications
		const wasUnread = prev.find((n) => n.id === id && !n.read)
		setState({
			notifications: prev.filter((n) => n.id !== id),
			popupDismissedIds: state.popupDismissedIds.filter((dId) => dId !== id),
			unreadCount: Math.max(0, state.unreadCount - (wasUnread ? 1 : 0)),
		})

		try {
			await notificationApi.deleteNotification(id)
		} catch {
			setState({ notifications: prev })
			notificationStore.fetchUnreadCount()
		}
	},

	/**
	 * Delete multiple notifications — optimistic.
	 */
	async deleteMultiple(ids) {
		const idSet = new Set(ids)
		const prev = state.notifications
		const unreadRemoved = prev.filter((n) => idSet.has(n.id) && !n.read).length
		setState({
			notifications: prev.filter((n) => !idSet.has(n.id)),
			popupDismissedIds: state.popupDismissedIds.filter((dId) => !idSet.has(dId)),
			unreadCount: Math.max(0, state.unreadCount - unreadRemoved),
		})

		try {
			await Promise.all(ids.map((id) => notificationApi.deleteNotification(id)))
		} catch {
			setState({ notifications: prev })
			notificationStore.fetchUnreadCount()
		}
	},

	/** Dismiss from popup only — does NOT delete from history */
	clearPopup() {
		const visibleIds = getPopupNotifications().map((n) => n.id)
		const dismissed = new Set([...state.popupDismissedIds, ...visibleIds])
		setState({ popupDismissedIds: [...dismissed] })
	},

	/** Permanently delete all notification history — API call. */
	async clearHistory() {
		const prev = state.notifications
		setState({
			notifications: [],
			popupDismissedIds: [],
			unreadCount: 0,
		})

		try {
			await notificationApi.clearAll()
		} catch {
			setState({ notifications: prev })
			notificationStore.fetchUnreadCount()
		}
	},

	/**
	 * Add a notification to local state (for real-time updates
	 * when a backend module creates one during the same session).
	 */
	addNotification(notification) {
		const newNotif = {
			id: notification.id || `local_${Date.now()}`,
			title: notification.title,
			description: notification.description,
			type: notification.type,
			timestamp: notification.timestamp ?? Date.now(),
			read: notification.read ?? false,
			actionUrl: notification.actionUrl,
			actionLabel: notification.actionLabel,
		}

		const popupDismissedIds = state.popupDismissedIds.filter((id) => id !== newNotif.id)

		setState({
			notifications: [newNotif, ...state.notifications],
			popupDismissedIds,
			lastArrivalAt: Date.now(),
			unreadCount: newNotif.read ? state.unreadCount : state.unreadCount + 1,
		})

		return newNotif
	},

	clearLastArrival() {
		setState({ lastArrivalAt: null })
	},

	setLoading(isLoading) {
		setState({ isLoading })
	},

	reset() {
		state = {
			notifications: [],
			popupDismissedIds: [],
			isLoading: false,
			lastArrivalAt: null,
			unreadCount: 0,
			error: null,
		}
		emit()
	},
}

/**
 * Subscribe to notification store with optional selector.
 * @template T
 * @param {(state: typeof state) => T} selector
 */
export function useNotificationStore(selector) {
	const getSnapshot = useCallback(() => selector(state), [selector])

	return useSyncExternalStore(notificationStore.subscribe, getSnapshot, getSnapshot)
}

/** Stable selectors — avoid re-subscribe on every render */
const selectNotifications = (s) => s.notifications
const selectIsLoading = (s) => s.isLoading
const selectLastArrivalAt = (s) => s.lastArrivalAt

/** Convenience selectors */
export function useUnreadCount() {
	return useNotificationStore(getUnreadCount)
}

export function useNotifications() {
	return useNotificationStore(selectNotifications)
}

export function usePopupNotifications() {
	return useNotificationStore(getPopupNotifications)
}

export function useNotificationLoading() {
	return useNotificationStore(selectIsLoading)
}

export function useLastArrivalAt() {
	return useNotificationStore(selectLastArrivalAt)
}

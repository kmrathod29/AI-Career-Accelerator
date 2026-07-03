import { useSyncExternalStore, useCallback } from 'react'
import { getLocalStorageValue, setLocalStorageValue } from '@utils/storage.js'
import {
	NOTIFICATION_STORAGE_KEY,
	NOTIFICATION_TYPES,
} from '@constants/notifications.js'
import { APP_ROUTES } from '@constants/routes.js'

function generateId() {
	return `notif_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

const HOUR = 60 * 60 * 1000
const DAY = 24 * HOUR
const now = Date.now()

/** Seed notifications for demo — varied types and timestamps */
function createSeedNotifications() {
	return [
		{
			id: generateId(),
			title: 'Resume generated successfully',
			description: 'Your "Senior Full Stack Developer" resume is ready to review and export.',
			type: NOTIFICATION_TYPES.RESUME,
			timestamp: now - 12 * 60 * 1000,
			read: false,
			actionUrl: APP_ROUTES.RESUME_BUILDER,
			actionLabel: 'View Resume',
		},
		{
			id: generateId(),
			title: 'ATS score completed',
			description: 'Your resume scored 92/100 — excellent keyword alignment for target roles.',
			type: NOTIFICATION_TYPES.ATS,
			timestamp: now - 45 * 60 * 1000,
			read: false,
			actionUrl: APP_ROUTES.ATS_ANALYZER,
			actionLabel: 'View Report',
		},
		{
			id: generateId(),
			title: 'Mock interview finished',
			description: 'Behavioral interview session complete. AI feedback and scores are available.',
			type: NOTIFICATION_TYPES.INTERVIEW,
			timestamp: now - 3 * HOUR,
			read: false,
			actionUrl: APP_ROUTES.MOCK_INTERVIEW,
			actionLabel: 'See Feedback',
		},
		{
			id: generateId(),
			title: 'AI Roadmap generated',
			description: 'Your personalized 90-day career roadmap with milestones is ready.',
			type: NOTIFICATION_TYPES.AI,
			timestamp: now - 8 * HOUR,
			read: true,
			actionUrl: APP_ROUTES.CAREER_ROADMAP,
			actionLabel: 'Open Roadmap',
		},
		{
			id: generateId(),
			title: 'Job saved to tracker',
			description: 'Stripe — Software Engineer II has been added to your saved jobs.',
			type: NOTIFICATION_TYPES.JOB,
			timestamp: now - DAY - 2 * HOUR,
			read: true,
			actionUrl: APP_ROUTES.DASHBOARD,
			actionLabel: 'View Jobs',
		},
		{
			id: generateId(),
			title: 'Application submitted',
			description: 'Your application to Vercel — Frontend Engineer was sent successfully.',
			type: NOTIFICATION_TYPES.SUCCESS,
			timestamp: now - DAY - 5 * HOUR,
			read: true,
			actionUrl: APP_ROUTES.DASHBOARD,
			actionLabel: 'Track Status',
		},
		{
			id: generateId(),
			title: 'Profile updated',
			description: 'Your career preferences and target roles have been saved.',
			type: NOTIFICATION_TYPES.INFO,
			timestamp: now - 2 * DAY,
			read: true,
			actionUrl: APP_ROUTES.ACCOUNT,
			actionLabel: 'View Profile',
		},
		{
			id: generateId(),
			title: 'Subscription renewed',
			description: 'Pro plan renewed until Jul 3, 2027. Thank you for your continued trust.',
			type: NOTIFICATION_TYPES.SUBSCRIPTION,
			timestamp: now - 3 * DAY,
			read: true,
			actionUrl: APP_ROUTES.ACCOUNT,
			actionLabel: 'Manage Plan',
		},
		{
			id: generateId(),
			title: 'Search completed',
			description: 'Found 24 matching roles for "React Developer" in your preferred locations.',
			type: NOTIFICATION_TYPES.JOB,
			timestamp: now - 4 * DAY,
			read: true,
			actionUrl: APP_ROUTES.DASHBOARD,
			actionLabel: 'Browse Results',
		},
		{
			id: generateId(),
			title: 'System maintenance scheduled',
			description: 'Planned maintenance on Jul 10, 2:00–4:00 AM UTC. No action required.',
			type: NOTIFICATION_TYPES.SYSTEM,
			timestamp: now - 5 * DAY,
			read: true,
		},
	]
}

/** @typedef {import('@constants/notifications.js').NotificationType} NotificationType */

/**
 * @typedef {Object} Notification
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {NotificationType} type
 * @property {number} timestamp
 * @property {boolean} read
 * @property {string} [actionUrl]
 * @property {string} [actionLabel]
 */

/** @type {{ notifications: Notification[], popupDismissedIds: string[], isLoading: boolean, lastArrivalAt: number | null }} */
let state = {
	notifications: [],
	popupDismissedIds: [],
	isLoading: true,
	lastArrivalAt: null,
}

let popupNotificationsCacheState = null
let popupNotificationsCache = []

const listeners = new Set()

function emit() {
	listeners.forEach((listener) => listener())
}

function persist() {
	setLocalStorageValue(
		NOTIFICATION_STORAGE_KEY,
		JSON.stringify({
			notifications: state.notifications,
			popupDismissedIds: state.popupDismissedIds,
		}),
	)
}

function setState(partial) {
	state = { ...state, ...partial }
	persist()
	emit()
}

function updateNotifications(updater) {
	const notifications = updater(state.notifications)
	setState({ notifications })
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
	return state.notifications.filter((n) => !n.read).length
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

	init() {
		try {
			const stored = getLocalStorageValue(NOTIFICATION_STORAGE_KEY, null)
			if (stored) {
				const parsed = JSON.parse(stored)
				state = {
					...state,
					notifications: parsed.notifications ?? [],
					popupDismissedIds: parsed.popupDismissedIds ?? [],
					isLoading: false,
				}
			} else {
				state = {
					...state,
					notifications: createSeedNotifications(),
					popupDismissedIds: [],
					isLoading: false,
				}
				persist()
			}
		} catch {
			state = {
				...state,
				notifications: createSeedNotifications(),
				popupDismissedIds: [],
				isLoading: false,
			}
			persist()
		}
		emit()
	},

	/**
	 * @param {Omit<Notification, 'id' | 'timestamp' | 'read'> & { id?: string, timestamp?: number, read?: boolean }} payload
	 */
	addNotification(payload) {
		const notification = {
			id: payload.id ?? generateId(),
			title: payload.title,
			description: payload.description,
			type: payload.type,
			timestamp: payload.timestamp ?? Date.now(),
			read: payload.read ?? false,
			actionUrl: payload.actionUrl,
			actionLabel: payload.actionLabel,
		}

		/* New notifications always reappear in popup */
		const popupDismissedIds = state.popupDismissedIds.filter((id) => id !== notification.id)

		setState({
			notifications: [notification, ...state.notifications],
			popupDismissedIds,
			lastArrivalAt: Date.now(),
		})

		return notification
	},

	markAsRead(id) {
		updateNotifications((items) =>
			items.map((n) => (n.id === id ? { ...n, read: true } : n)),
		)
	},

	markAsUnread(id) {
		updateNotifications((items) =>
			items.map((n) => (n.id === id ? { ...n, read: false } : n)),
		)
	},

	markAllAsRead() {
		updateNotifications((items) => items.map((n) => ({ ...n, read: true })))
	},

	deleteNotification(id) {
		setState({
			notifications: state.notifications.filter((n) => n.id !== id),
			popupDismissedIds: state.popupDismissedIds.filter((dId) => dId !== id),
		})
	},

	deleteMultiple(ids) {
		const idSet = new Set(ids)
		setState({
			notifications: state.notifications.filter((n) => !idSet.has(n.id)),
			popupDismissedIds: state.popupDismissedIds.filter((dId) => !idSet.has(dId)),
		})
	},

	/** Dismiss from popup only — does NOT delete history */
	clearPopup() {
		const visibleIds = getPopupNotifications().map((n) => n.id)
		const dismissed = new Set([...state.popupDismissedIds, ...visibleIds])
		setState({ popupDismissedIds: [...dismissed] })
	},

	/** Permanently delete all notification history */
	clearHistory() {
		setState({
			notifications: [],
			popupDismissedIds: [],
		})
	},

	clearLastArrival() {
		setState({ lastArrivalAt: null })
	},

	setLoading(isLoading) {
		setState({ isLoading })
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

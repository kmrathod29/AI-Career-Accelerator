import { useSyncExternalStore, useCallback } from 'react'
import { getLocalStorageValue, setLocalStorageValue } from '@utils/storage.js'
import {
	ACCOUNT_STORAGE_KEY,
	DEFAULT_PROFILE,
	DEFAULT_STATS,
	DEFAULT_NOTIFICATION_PREFS,
	DEFAULT_PRIVACY_PREFS,
	DEFAULT_APPEARANCE_PREFS,
	DUMMY_SESSIONS,
} from '@constants/account.js'

function createDefaultState() {
	return {
		profile: { ...DEFAULT_PROFILE, social: { ...DEFAULT_PROFILE.social } },
		stats: { ...DEFAULT_STATS },
		notificationPrefs: { ...DEFAULT_NOTIFICATION_PREFS },
		privacyPrefs: { ...DEFAULT_PRIVACY_PREFS },
		appearancePrefs: { ...DEFAULT_APPEARANCE_PREFS },
		sessions: [...DUMMY_SESSIONS],
		isLoading: true,
		hasUnsavedChanges: false,
	}
}

function loadPersistedState() {
	const saved = getLocalStorageValue(ACCOUNT_STORAGE_KEY, null)
	if (!saved) return createDefaultState()

	return {
		...createDefaultState(),
		profile: { ...DEFAULT_PROFILE, ...saved.profile, social: { ...DEFAULT_PROFILE.social, ...saved.profile?.social } },
		notificationPrefs: { ...DEFAULT_NOTIFICATION_PREFS, ...saved.notificationPrefs },
		privacyPrefs: { ...DEFAULT_PRIVACY_PREFS, ...saved.privacyPrefs },
		appearancePrefs: { ...DEFAULT_APPEARANCE_PREFS, ...saved.appearancePrefs },
		isLoading: false,
		hasUnsavedChanges: false,
	}
}

let state = loadPersistedState()
const listeners = new Set()

function emit() {
	listeners.forEach((listener) => listener())
}

function persist() {
	setLocalStorageValue(ACCOUNT_STORAGE_KEY, {
		profile: state.profile,
		notificationPrefs: state.notificationPrefs,
		privacyPrefs: state.privacyPrefs,
		appearancePrefs: state.appearancePrefs,
	})
}

export const accountStore = {
	subscribe(listener) {
		listeners.add(listener)
		return () => listeners.delete(listener)
	},

	getSnapshot() {
		return state
	},

	init() {
		setTimeout(() => {
			state = { ...state, isLoading: false }
			emit()
		}, 600)
	},

	updateProfile(updates) {
		state = {
			...state,
			profile: { ...state.profile, ...updates },
			hasUnsavedChanges: true,
		}
		emit()
	},

	updateSocial(updates) {
		state = {
			...state,
			profile: {
				...state.profile,
				social: { ...state.profile.social, ...updates },
			},
			hasUnsavedChanges: true,
		}
		emit()
	},

	saveProfile() {
		persist()
		state = { ...state, hasUnsavedChanges: false }
		emit()
	},

	discardChanges() {
		const saved = getLocalStorageValue(ACCOUNT_STORAGE_KEY, null)
		if (saved?.profile) {
			state = {
				...state,
				profile: { ...DEFAULT_PROFILE, ...saved.profile, social: { ...DEFAULT_PROFILE.social, ...saved.profile?.social } },
				hasUnsavedChanges: false,
			}
		} else {
			state = { ...state, profile: createDefaultState().profile, hasUnsavedChanges: false }
		}
		emit()
	},

	setAvatar(dataUrl) {
		state = {
			...state,
			profile: { ...state.profile, avatar: dataUrl },
			hasUnsavedChanges: true,
		}
		emit()
	},

	updateNotificationPrefs(updates) {
		state = {
			...state,
			notificationPrefs: { ...state.notificationPrefs, ...updates },
		}
		persist()
		emit()
	},

	updatePrivacyPrefs(updates) {
		state = {
			...state,
			privacyPrefs: { ...state.privacyPrefs, ...updates },
		}
		persist()
		emit()
	},

	updateAppearancePrefs(updates) {
		state = {
			...state,
			appearancePrefs: { ...state.appearancePrefs, ...updates },
		}
		persist()
		emit()
	},

	logoutSession(sessionId) {
		state = {
			...state,
			sessions: state.sessions.filter((s) => s.id !== sessionId),
		}
		emit()
	},

	logoutAllSessions() {
		state = {
			...state,
			sessions: state.sessions.filter((s) => s.isCurrent),
		}
		emit()
	},
}

export function useAccountStore(selector) {
	const getSnapshot = useCallback(() => selector(accountStore.getSnapshot()), [selector])
	return useSyncExternalStore(accountStore.subscribe, getSnapshot, getSnapshot)
}

export function useProfile() {
	return useAccountStore((s) => s.profile)
}

export function useAccountStats() {
	return useAccountStore((s) => s.stats)
}

export function useAccountLoading() {
	return useAccountStore((s) => s.isLoading)
}

export function useHasUnsavedChanges() {
	return useAccountStore((s) => s.hasUnsavedChanges)
}

export function useNotificationPrefs() {
	return useAccountStore((s) => s.notificationPrefs)
}

export function usePrivacyPrefs() {
	return useAccountStore((s) => s.privacyPrefs)
}

export function useAppearancePrefs() {
	return useAccountStore((s) => s.appearancePrefs)
}

export function useSessions() {
	return useAccountStore((s) => s.sessions)
}

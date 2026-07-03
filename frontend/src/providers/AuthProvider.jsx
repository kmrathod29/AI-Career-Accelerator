import { useEffect, useMemo, useState } from 'react'
import { getLocalStorageValue, setLocalStorageValue } from '@utils/storage.js'
import { AUTH_STORAGE_KEY, AuthContext } from './authContext.js'

function readStoredSession() {
	try {
		const stored = getLocalStorageValue(AUTH_STORAGE_KEY, null)
		if (!stored) {
			return { isAuthenticated: false, userEmail: null }
		}

		const parsed = JSON.parse(stored)
		return {
			isAuthenticated: Boolean(parsed?.isAuthenticated),
			userEmail: parsed?.userEmail ?? null,
		}
	} catch {
		return { isAuthenticated: false, userEmail: null }
	}
}

export function AuthProvider({ children }) {
	const [session, setSession] = useState(readStoredSession)

	useEffect(() => {
		if (session.isAuthenticated) {
			setLocalStorageValue(AUTH_STORAGE_KEY, JSON.stringify(session))
			return
		}

		if (typeof window !== 'undefined') {
			window.localStorage.removeItem(AUTH_STORAGE_KEY)
		}
	}, [session])

	useEffect(() => {
		const handleStorage = (event) => {
			if (event.key === AUTH_STORAGE_KEY || event.key === null) {
				setSession(readStoredSession())
			}
		}

		window.addEventListener('storage', handleStorage)
		return () => window.removeEventListener('storage', handleStorage)
	}, [])

	const login = ({ userEmail = null } = {}) => {
		const nextSession = { isAuthenticated: true, userEmail }
		setSession(nextSession)
		setLocalStorageValue(AUTH_STORAGE_KEY, JSON.stringify(nextSession))
	}

	const logout = ({ clearStorage = false } = {}) => {
		setSession({ isAuthenticated: false, userEmail: null })

		if (typeof window === 'undefined') {
			return
		}

		if (clearStorage) {
			window.localStorage.clear()
			return
		}

		window.localStorage.removeItem(AUTH_STORAGE_KEY)
	}

	const value = useMemo(
		() => ({
			...session,
			login,
			logout,
		}),
		[session],
	)

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
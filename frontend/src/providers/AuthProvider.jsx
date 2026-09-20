import { useCallback, useEffect, useMemo, useState } from 'react'
import { authService } from '@/services/authService.js'
import { accountStore } from '@/stores/accountStore.js'
import { AuthContext } from './authContext.js'

/**
 * AuthProvider — manages authentication state via server-side sessions.
 *
 * On mount, calls GET /api/auth/me to restore the session from the
 * HttpOnly cookie. No auth tokens are stored in localStorage.
 *
 * Provides:
 *   - user          : { id, firstName, lastName, email } | null
 *   - isAuthenticated : boolean
 *   - isLoading     : boolean  (true during initial session check)
 *   - login(user)   : set authenticated user from server response
 *   - logout()      : call server logout + clear state
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const hydrateUser = useCallback((userData) => {
    if (!userData) return

    setUser(userData)
    accountStore.setFromUser(userData)
  }, [])

  // Profile edits are saved through accountStore. Mirror its successful
  // server responses into the global authenticated-user state as well.
  useEffect(() => accountStore.subscribe(() => {
    const profile = accountStore.getSnapshot().profile
    setUser((currentUser) => {
      if (
        !currentUser ||
        currentUser.id !== profile.id ||
        currentUser.updatedAt === profile.updatedAt
      ) {
        return currentUser
      }

      return profile
    })
  }), [])

  /**
   * On mount — check if there's an existing session.
   * GET /api/auth/me will succeed if the HttpOnly cookie is valid.
   */
  useEffect(() => {
    let cancelled = false

    async function checkSession() {
      try {
        const response = await authService.me()
        if (!cancelled && response?.data?.user) {
          hydrateUser(response.data.user)
        }
      } catch (error) {
        if (!cancelled && error.response?.status === 401) {
          setUser(null)
          accountStore.reset()
        } else if (!cancelled) {
          console.error('Session hydration failed:', error.message)
        }
        // No valid session — user stays null (unauthenticated)
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    checkSession()
    return () => { cancelled = true }
  }, [hydrateUser])

  /**
   * Set authenticated user from a login/register response.
   */
  const login = useCallback((userData) => {
    hydrateUser(userData)
  }, [hydrateUser])

  /**
   * Logout — calls the backend to destroy the session,
   * then clears local state regardless.
   */
  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } catch {
      // Even if the server call fails, clear local state
    }
    setUser(null)
    accountStore.reset()
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
    }),
    [user, isLoading, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

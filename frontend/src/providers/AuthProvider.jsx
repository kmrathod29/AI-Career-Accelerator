import { useCallback, useEffect, useMemo, useState } from 'react'
import { authService } from '@/services/authService.js'
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
          setUser(response.data.user)
        }
      } catch {
        // No valid session — user stays null (unauthenticated)
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    checkSession()
    return () => { cancelled = true }
  }, [])

  /**
   * Set authenticated user from a login/register response.
   */
  const login = useCallback((userData) => {
    setUser(userData)
  }, [])

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
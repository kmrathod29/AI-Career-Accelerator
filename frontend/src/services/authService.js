import api from './api.js'

/**
 * Authentication service — all auth API calls.
 * Errors are thrown and should be caught by the calling component.
 */
export const authService = {
  /**
   * Register a new user.
   * @returns {{ user: { id, firstName, lastName, email, createdAt, updatedAt } }}
   */
  async register({ firstName, lastName, email, password }) {
    const { data } = await api.post('/auth/register', {
      firstName,
      lastName,
      email,
      password,
    })
    return data
  },

  /**
   * Login with email and password.
   * @returns {{ user: { id, firstName, lastName, email, createdAt, updatedAt } }}
   */
  async login({ email, password }) {
    const { data } = await api.post('/auth/login', { email, password })
    return data
  },

  /**
   * Logout — destroys the server-side session.
   */
  async logout() {
    const { data } = await api.post('/auth/logout')
    return data
  },

  /**
   * Get current authenticated user from session.
   * @returns {{ user: { id, firstName, lastName, email, createdAt, updatedAt } }}
   */
  async me() {
    const { data } = await api.get('/auth/me')
    return data
  },
}

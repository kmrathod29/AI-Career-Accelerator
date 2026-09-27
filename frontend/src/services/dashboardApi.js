import api from './api.js'

/**
 * Dashboard API service.
 * All endpoints require authentication (handled by api.js withCredentials).
 */
export const dashboardApi = {
  /**
   * GET /api/dashboard
   * Fetch aggregated dashboard data for the authenticated user.
   */
  async getDashboard() {
    const response = await api.get('/dashboard')
    return response.data
  },
}

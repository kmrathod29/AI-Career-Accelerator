import api from './api.js'

/**
 * Notification API service — all notification backend calls.
 * Used by the notificationStore to replace localStorage with MongoDB.
 */
export const notificationApi = {
  /**
   * Get paginated notifications for the authenticated user.
   * @param {{ page?: number, limit?: number }} [params]
   */
  async getNotifications(params = {}) {
    const { data } = await api.get('/notifications', { params })
    return data
  },

  /**
   * Get unread notification count.
   */
  async getUnreadCount() {
    const { data } = await api.get('/notifications/unread-count')
    return data
  },

  /**
   * Mark a single notification as read.
   */
  async markAsRead(id) {
    const { data } = await api.patch(`/notifications/${id}/read`)
    return data
  },

  /**
   * Mark a single notification as unread.
   */
  async markAsUnread(id) {
    const { data } = await api.patch(`/notifications/${id}/unread`)
    return data
  },

  /**
   * Mark all notifications as read.
   */
  async markAllAsRead() {
    const { data } = await api.patch('/notifications/read-all')
    return data
  },

  /**
   * Delete a single notification.
   */
  async deleteNotification(id) {
    const { data } = await api.delete(`/notifications/${id}`)
    return data
  },

  /**
   * Delete all notifications (clear history).
   */
  async clearAll() {
    const { data } = await api.delete('/notifications')
    return data
  },

  /**
   * Seed test notifications (development only).
   */
  async seed() {
    const { data } = await api.post('/notifications/seed')
    return data
  },
}

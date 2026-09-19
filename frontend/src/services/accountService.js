import api from './api.js'

/**
 * Account service — all account/profile API calls.
 * Errors are thrown and should be caught by the calling code.
 */
export const accountService = {
  /**
   * Get the full user profile (personal + career + social).
   * @returns {{ user: Object }}
   */
  async getProfile() {
    const { data } = await api.get('/account/profile')
    return data
  },

  /**
   * Update personal information (firstName, lastName, phone, bio, etc.).
   * @returns {{ user: Object }}
   */
  async updateProfile(updates) {
    const { data } = await api.patch('/account/profile', updates)
    return data
  },

  /**
   * Update career information (currentRole, skills, education, etc.).
   * @returns {{ user: Object }}
   */
  async updateCareer(updates) {
    const { data } = await api.patch('/account/career', updates)
    return data
  },

  /**
   * Update social links (linkedin, github, portfolio, etc.).
   * @returns {{ user: Object }}
   */
  async updateSocial(updates) {
    const { data } = await api.patch('/account/social', updates)
    return data
  },

  /**
   * Update avatar (base64 data URL).
   * @returns {{ user: Object }}
   */
  async updateAvatar(avatar) {
    const { data } = await api.patch('/account/avatar', { avatar })
    return data
  },

  /**
   * Change password.
   * @returns {{ message: string }}
   */
  async changePassword({ currentPassword, newPassword }) {
    const { data } = await api.put('/account/password', {
      currentPassword,
      newPassword,
    })
    return data
  },

  /**
   * Export account data as JSON.
   * @returns {{ exportedAt, format, account: Object }}
   */
  async exportData() {
    const { data } = await api.get('/account/export')
    return data
  },

  /**
   * Permanently delete the user account.
   * @returns {{ message: string }}
   */
  async deleteAccount() {
    const { data } = await api.delete('/account')
    return data
  },
}

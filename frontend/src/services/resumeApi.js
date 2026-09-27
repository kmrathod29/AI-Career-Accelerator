import api from './api.js'

/**
 * Resume API service — all resume backend calls.
 */
export const resumeApi = {
  /**
   * Get the authenticated user's resume.
   */
  async getResume() {
    const { data } = await api.get('/resume')
    return data
  },

  /**
   * Create or update the resume (upsert).
   */
  async saveResume(resumeData) {
    const { data } = await api.put('/resume', resumeData)
    return data
  },

  /**
   * Delete the resume.
   */
  async deleteResume() {
    const { data } = await api.delete('/resume')
    return data
  },

  /**
   * Get AI suggestions for the resume.
   * @param {{ targetRole?: string }} [params]
   */
  async getAISuggestions(params = {}) {
    const { data } = await api.post('/resume/ai-suggestions', params, { timeout: 60000 })
    return data
  },
}

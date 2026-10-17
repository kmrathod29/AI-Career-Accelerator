import api from './api.js'

/**
 * Skill Gap API service.
 * All endpoints require authentication (handled by api.js withCredentials).
 */
export const skillGapApi = {
  /**
   * POST /api/skill-gap/analyze
   * Submit current skills (text) and/or an optional resume file + target role
   * for AI-powered skill gap analysis.
   *
   * @param {Object} params
   * @param {string} params.targetRole - Target job role
   * @param {string} [params.currentSkills] - Comma-separated or text description of current skills
   * @param {File|null} [params.resumeFile] - Optional PDF resume for skill extraction
   */
  async analyze({ targetRole, currentSkills = '', resumeFile = null }) {
    const formData = new FormData()
    formData.append('targetRole', targetRole)
    if (currentSkills) {
      formData.append('currentSkills', currentSkills)
    }
    if (resumeFile) {
      formData.append('resume', resumeFile)
    }

    const response = await api.post('/skill-gap/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 120000, // 2 minutes — AI analysis can take time
    })
    return response.data
  },

  /**
   * GET /api/skill-gap/analyses
   * Fetch authenticated user's Skill Gap analysis history.
   */
  async getAnalyses(page = 1, limit = 10) {
    const response = await api.get('/skill-gap/analyses', {
      params: { page, limit },
    })
    return response.data
  },

  /**
   * GET /api/skill-gap/analyses/:id
   * Fetch a specific skill gap analysis by ID.
   */
  async getAnalysisById(id) {
    const response = await api.get(`/skill-gap/analyses/${id}`)
    return response.data
  },

  /**
   * DELETE /api/skill-gap/analyses/:id
   * Delete a specific skill gap analysis.
   */
  async deleteAnalysis(id) {
    const response = await api.delete(`/skill-gap/analyses/${id}`)
    return response.data
  },
}

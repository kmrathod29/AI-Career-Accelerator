import api from './api.js'

/**
 * Resume Match API service.
 * All endpoints require authentication (handled by api.js withCredentials).
 */
export const resumeMatchApi = {
  /**
   * POST /api/resume-match/analyze
   * Upload resume file + job description for AI match analysis.
   * Uses multipart/form-data for file upload.
   */
  async analyze(file, jobDescription) {
    const formData = new FormData()
    formData.append('resume', file)
    formData.append('jobDescription', jobDescription)

    const response = await api.post('/resume-match/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 120000, // 2 minutes — AI analysis can take time
    })
    return response.data
  },

  /**
   * POST /api/resume-match/analyses/:id/re-analyze
   * Re-analyze an existing analysis with an updated resume file.
   * Keeps the same analysis ID and route.
   */
  async reAnalyze(id, file, jobDescription) {
    const formData = new FormData()
    formData.append('resume', file)
    if (jobDescription !== undefined && jobDescription !== null) {
      formData.append('jobDescription', jobDescription)
    }

    const response = await api.post(`/resume-match/analyses/${id}/re-analyze`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 120000,
    })
    return response.data
  },

  /**
   * GET /api/resume-match/analyses
   * Fetch authenticated user's Resume Match history.
   */
  async getAnalyses(page = 1, limit = 10) {
    const response = await api.get('/resume-match/analyses', {
      params: { page, limit },
    })
    return response.data
  },

  /**
   * GET /api/resume-match/analyses/:id
   * Fetch a specific analysis by ID.
   */
  async getAnalysisById(id) {
    const response = await api.get(`/resume-match/analyses/${id}`)
    return response.data
  },

  /**
   * DELETE /api/resume-match/analyses/:id
   * Delete a specific analysis.
   */
  async deleteAnalysis(id) {
    const response = await api.delete(`/resume-match/analyses/${id}`)
    return response.data
  },
}

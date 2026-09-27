import api from './api.js'

/**
 * ATS Analyzer API service.
 * All endpoints require authentication (handled by api.js withCredentials).
 */
export const atsApi = {
  /**
   * POST /api/ats/analyze
   * Upload resume file + job description for AI analysis.
   * Uses multipart/form-data for file upload.
   */
  async analyze(file, jobDescription) {
    const formData = new FormData()
    formData.append('resume', file)
    formData.append('jobDescription', jobDescription)

    const response = await api.post('/ats/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 120000, // 2 minutes — AI analysis can take time
    })
    return response.data
  },

  /**
   * GET /api/ats/analyses
   * Fetch authenticated user's analysis history.
   */
  async getAnalyses(page = 1, limit = 10) {
    const response = await api.get('/ats/analyses', {
      params: { page, limit },
    })
    return response.data
  },

  /**
   * GET /api/ats/analyses/:id
   * Fetch a specific analysis by ID.
   */
  async getAnalysisById(id) {
    const response = await api.get(`/ats/analyses/${id}`)
    return response.data
  },

  /**
   * DELETE /api/ats/analyses/:id
   * Delete a specific analysis.
   */
  async deleteAnalysis(id) {
    const response = await api.delete(`/ats/analyses/${id}`)
    return response.data
  },
}

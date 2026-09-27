import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import {
  analyzeResume,
  reAnalyzeResume,
  getAnalyses,
  getAnalysisById,
  deleteAnalysis,
  uploadResume,
} from '../controllers/atsController.js'
import { sendError } from '../utils/apiResponse.js'

const router = Router()

/* ── All ATS routes require authentication ─────────────────────── */
router.use(requireAuth)

/* ── POST /api/ats/analyze — upload + AI analysis ──────────────── */
router.post('/analyze', (req, res, next) => {
  uploadResume(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return sendError(res, 'File size must be under 5 MB', 413)
      }
      return sendError(res, err.message || 'File upload failed', 400)
    }
    next()
  })
}, analyzeResume)

/* ── POST /api/ats/analyses/:id/re-analyze — in-place re-analysis ─ */
router.post('/analyses/:id/re-analyze', (req, res, next) => {
  uploadResume(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return sendError(res, 'File size must be under 5 MB', 413)
      }
      return sendError(res, err.message || 'File upload failed', 400)
    }
    next()
  })
}, reAnalyzeResume)

/* ── GET /api/ats/analyses — list user's analyses ──────────────── */
router.get('/analyses', getAnalyses)

/* ── GET /api/ats/analyses/:id — single analysis detail ────────── */
router.get('/analyses/:id', getAnalysisById)

/* ── DELETE /api/ats/analyses/:id — remove analysis ────────────── */
router.delete('/analyses/:id', deleteAnalysis)

export default router

import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import {
  analyzeResumeMatch,
  reAnalyzeResumeMatch,
  getResumeMatchAnalyses,
  getResumeMatchById,
  deleteResumeMatch,
  uploadResume,
} from '../controllers/resumeMatchController.js'
import { sendError } from '../utils/apiResponse.js'

const router = Router()

/* ── All Resume Match routes require authentication ───────────── */
router.use(requireAuth)

/* ── POST /api/resume-match/analyze — upload + AI match analysis ── */
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
}, analyzeResumeMatch)

/* ── POST /api/resume-match/analyses/:id/re-analyze — in-place re-analysis ─ */
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
}, reAnalyzeResumeMatch)

/* ── GET /api/resume-match/analyses — list user's analyses ─────── */
router.get('/analyses', getResumeMatchAnalyses)

/* ── GET /api/resume-match/analyses/:id — single analysis detail ── */
router.get('/analyses/:id', getResumeMatchById)

/* ── DELETE /api/resume-match/analyses/:id — remove analysis ──── */
router.delete('/analyses/:id', deleteResumeMatch)

export default router

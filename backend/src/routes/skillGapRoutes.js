import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import {
  analyzeSkillGap,
  getSkillGapAnalyses,
  getSkillGapById,
  deleteSkillGapAnalysis,
  uploadResumeForSkillGap,
} from '../controllers/skillGapController.js'
import { sendError } from '../utils/apiResponse.js'

const router = Router()

/* ── All Skill Gap routes require authentication ───────────── */
router.use(requireAuth)

/* ── POST /api/skill-gap/analyze — text skills + optional resume upload ── */
router.post('/analyze', (req, res, next) => {
  uploadResumeForSkillGap(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return sendError(res, 'File size must be under 5 MB', 413)
      }
      return sendError(res, err.message || 'File upload failed', 400)
    }
    next()
  })
}, analyzeSkillGap)

/* ── GET /api/skill-gap/analyses — list user's analyses ──────── */
router.get('/analyses', getSkillGapAnalyses)

/* ── GET /api/skill-gap/analyses/:id — single analysis detail ── */
router.get('/analyses/:id', getSkillGapById)

/* ── DELETE /api/skill-gap/analyses/:id — remove analysis ────── */
router.delete('/analyses/:id', deleteSkillGapAnalysis)

export default router

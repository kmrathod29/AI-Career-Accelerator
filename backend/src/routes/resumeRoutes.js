import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import {
  getResume,
  saveResume,
  deleteResume,
  getAISuggestions,
} from '../controllers/resumeController.js'

const router = Router()

/* ── All resume routes require authentication ──────────────── */
router.use(requireAuth)

/* ── CRUD ──────────────────────────────────────────────────── */
router.get('/', getResume)
router.put('/', saveResume)
router.delete('/', deleteResume)

/* ── AI ───────────────────────────────────────────────────── */
router.post('/ai-suggestions', getAISuggestions)

export default router

import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { getDashboard } from '../controllers/dashboardController.js'

const router = Router()

/* ── All dashboard routes require authentication ───────────────── */
router.use(requireAuth)

/* ── GET /api/dashboard — aggregated dashboard data ────────────── */
router.get('/', getDashboard)

export default router

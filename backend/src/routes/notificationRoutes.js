import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAsUnread,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
  seedNotifications,
} from '../controllers/notificationController.js'

const router = Router()

/* ── All notification routes require authentication ──── */
router.use(requireAuth)

/* ── Read operations ─────────────────────────────────── */
router.get('/', getNotifications)
router.get('/unread-count', getUnreadCount)

/* ── Write operations ────────────────────────────────── */
router.patch('/read-all', markAllAsRead)
router.patch('/:id/read', markAsRead)
router.patch('/:id/unread', markAsUnread)

/* ── Delete operations ───────────────────────────────── */
router.delete('/:id', deleteNotification)
router.delete('/', clearAllNotifications)

/* ── Development seed endpoint ───────────────────────── */
if (process.env.NODE_ENV !== 'production') {
  router.post('/seed', seedNotifications)
}

export default router

import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import {
  getConversations,
  createConversation,
  getConversation,
  sendMessage,
  deleteConversation,
} from '../controllers/coachController.js'

const router = Router()

/* ── All coach routes require authentication ─────────────────── */
router.use(requireAuth)

/* ── GET  /api/coach/conversations     — list user's conversations ── */
router.get('/conversations', getConversations)

/* ── POST /api/coach/conversations     — create new conversation  ── */
router.post('/conversations', createConversation)

/* ── GET  /api/coach/conversations/:id — load conversation + messages ── */
router.get('/conversations/:id', getConversation)

/* ── POST /api/coach/conversations/:id/messages — send message    ── */
router.post('/conversations/:id/messages', sendMessage)

/* ── DELETE /api/coach/conversations/:id — soft-delete            ── */
router.delete('/conversations/:id', deleteConversation)

export default router

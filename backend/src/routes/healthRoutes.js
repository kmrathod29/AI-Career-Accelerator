import { Router } from 'express'
import { sendSuccess } from '../utils/apiResponse.js'

const router = Router()

router.get('/', (_req, res) => {
  sendSuccess(res, {
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  })
})

export default router

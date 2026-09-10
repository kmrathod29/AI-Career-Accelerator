import { Router } from 'express'
import mongoose from 'mongoose'
import { sendSuccess } from '../utils/apiResponse.js'

const router = Router()

router.get('/', (_req, res) => {
  const databaseReady = mongoose.connection.readyState === 1

  if (!databaseReady) {
    return res.status(503).json({
      success: false,
      message: 'Database is not ready',
      data: {
        server: 'up',
        database: 'down',
        timestamp: new Date().toISOString(),
      },
    })
  }

  return sendSuccess(res, {
    message: 'Server and database are running',
    server: 'up',
    database: 'up',
    timestamp: new Date().toISOString(),
  })
})

export default router

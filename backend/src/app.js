import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { connectDB } from './config/db.js'
import { createSessionMiddleware } from './config/session.js'
import authRoutes from './routes/authRoutes.js'
import accountRoutes from './routes/accountRoutes.js'
import notificationRoutes from './routes/notificationRoutes.js'
import resumeRoutes from './routes/resumeRoutes.js'
import atsRoutes from './routes/atsRoutes.js'
import dashboardRoutes from './routes/dashboardRoutes.js'
import healthRoutes from './routes/healthRoutes.js'
import { sendError } from './utils/apiResponse.js'

const app = express()

/* ── Trust proxy (Vercel/NGINX terminate TLS and forward via HTTP) ── */
app.set('trust proxy', 1)

const isProduction = process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL)

const configuredOrigin = process.env.CORS_ORIGIN || (
  isProduction
    ? 'https://ai-career-accelerator-bay.vercel.app'
    : 'http://localhost:5173'
)
const corsOrigin = configuredOrigin.replace(/\/+$/, '')

const ALLOWED_ORIGINS = [
  'https://ai-career-accelerator-bay.vercel.app',
  'http://localhost:5173',
  corsOrigin,
]

/* ── Security headers ──────────────────────────────────────── */
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }),
)

/* ── CORS ──────────────────────────────────────────────────── */
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true)
      const clean = origin.replace(/\/+$/, '')
      if (ALLOWED_ORIGINS.includes(clean)) {
        return callback(null, true)
      }
      return callback(null, corsOrigin)
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
)

/* ── Body parsers with size limits ────────────────────────── */
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: false, limit: '1mb' }))

/* ── Ensure database connection on serverless/local invocations ── */
app.use(async (_req, _res, next) => {
  try {
    await connectDB()
  } catch (err) {
    console.error('Database connection error in middleware:', err.message)
  }
  next()
})

/* ── Session ──────────────────────────────────────────────── */
app.use(createSessionMiddleware())

/* ── Root endpoint ────────────────────────────────────────── */
app.get('/', (_req, res) => {
  res.json({
    success: true,
    message: 'AI Career Accelerator API is running',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'production',
  })
})

/* ── Routes ───────────────────────────────────────────────── */
app.use('/api/health', healthRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/account', accountRoutes)
app.use('/api/notifications', notificationRoutes)
app.use('/api/resume', resumeRoutes)
app.use('/api/ats', atsRoutes)
app.use('/api/dashboard', dashboardRoutes)

/* ── 404 handler ──────────────────────────────────────────── */
app.use((_req, res) => {
  sendError(res, 'Route not found', 404)
})

/* ── Global error handler ─────────────────────────────────── */
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err)
  sendError(res, 'Internal server error', 500)
})

export default app

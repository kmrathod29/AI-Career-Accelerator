import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { createSessionMiddleware } from './config/session.js'
import authRoutes from './routes/authRoutes.js'
import accountRoutes from './routes/accountRoutes.js'
import healthRoutes from './routes/healthRoutes.js'
import { sendError } from './utils/apiResponse.js'

const app = express()

/* ── Trust proxy (Vercel/NGINX terminate TLS and forward via HTTP) ── */
app.set('trust proxy', 1)

const configuredOrigin = process.env.CORS_ORIGIN || (
  process.env.NODE_ENV === 'production'
    ? 'https://ai-career-accelerator-bay.vercel.app'
    : 'http://localhost:5173'
)
const corsOrigin = configuredOrigin.replace(/\/+$/, '')

/* ── Security headers ──────────────────────────────────────── */
app.use(helmet())

/* ── CORS ──────────────────────────────────────────────────── */
app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
)

/* ── Body parsers with size limits ────────────────────────── */
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: false, limit: '1mb' }))

/* ── Session ──────────────────────────────────────────────── */
app.use(createSessionMiddleware())

/* ── Routes ───────────────────────────────────────────────── */
app.use('/api/health', healthRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/account', accountRoutes)

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

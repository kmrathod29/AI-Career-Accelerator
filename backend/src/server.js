import 'dotenv/config'
import app from './app.js'
import { connectDB } from './config/db.js'

const PORT = process.env.PORT || 3000

// Only start a persistent HTTP server in local development (not in Vercel serverless)
if (!process.env.VERCEL) {
  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`)
        console.log(`Health check: http://localhost:${PORT}/api/health`)
        console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
      })
    })
    .catch((err) => {
      console.error('Failed to start server:', err)
      process.exit(1)
    })
}

// Export Express app as the default export for Vercel serverless functions (@vercel/node)
export default app

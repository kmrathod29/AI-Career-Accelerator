globalThis.DOMMatrix ??= class DOMMatrix {}

await import('dotenv/config')

const [{ default: app }, { connectDB }] = await Promise.all([
  import('./app.js'),
  import('./config/db.js'),
])

/**
 * Cleanly separate local server startup:
 * Only launch persistent HTTP listener when executed directly from the CLI locally.
 * In Vercel serverless (@vercel/node), app.listen() is NEVER called.
 */
const isDirectCliExecution =
  typeof process !== 'undefined' &&
  Boolean(process.argv?.[1]?.includes('server.js')) &&
  !process.env.VERCEL

if (isDirectCliExecution) {
  import('./local.js')
}

/**
 * Universal Vercel Serverless Handler:
 * - Catches any unhandled error so Vercel returns JSON instead of FUNCTION_INVOCATION_FAILED.
 * - Ensures DB connection is initialized before routing.
 * - Copies Express application properties onto the function so it satisfies both
 *   `export default app` and `export default function handler(req, res)`.
 */
export default async function handler(req, res) {
  try {
    await connectDB().catch((err) => {
      console.error('Database connection error in handler:', err.message)
    })
    return app(req, res)
  } catch (err) {
    console.error('Unhandled serverless handler error:', err)
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: 'SERVERLESS_HANDLER_ERROR',
        message: err.message,
      })
    }
  }
}

// Attach Express application properties to handler
Object.assign(handler, app)

export { app }

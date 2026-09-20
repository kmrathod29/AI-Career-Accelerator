import mongoose from 'mongoose'

/**
 * Cached connection promise — ensures we don't create multiple
 * connections on Vercel serverless cold starts.
 */
let cached = null

/**
 * Connect to MongoDB with connection caching.
 *
 * On Vercel serverless, this function may be called on every request
 * during a cold start. The cached promise ensures we only connect once.
 */
export async function connectDB() {
  // Already connected
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection
  }

  // Connection in progress — reuse the cached promise
  if (cached) {
    return cached
  }

  const uri = process.env.MONGODB_URI

  if (!uri) {
    console.error('MONGODB_URI is not defined in environment variables.')
    process.exit(1)
  }

  try {
    cached = mongoose.connect(uri)
    await cached
    console.log(`MongoDB connected: ${mongoose.connection.host}`)
    return mongoose.connection
  } catch (error) {
    cached = null
    console.error('MongoDB connection failed:', error.message)
    throw error
  }
}

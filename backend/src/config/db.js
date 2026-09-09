import mongoose from 'mongoose'

/**
 * Connect to MongoDB with retry logic.
 * Exits the process on fatal connection failure.
 */
export async function connectDB() {
  const uri = process.env.MONGODB_URI

  if (!uri) {
    console.error('MONGODB_URI is not defined in environment variables.')
    process.exit(1)
  }

  try {
    await mongoose.connect(uri)
    console.log(`MongoDB connected: ${mongoose.connection.host}`)
  } catch (error) {
    console.error('MongoDB connection failed:', error.message)
    process.exit(1)
  }

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB runtime error:', err.message)
  })
}

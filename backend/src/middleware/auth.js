import User from '../models/User.js'
import { sendError } from '../utils/apiResponse.js'

/**
 * Express middleware — rejects unauthenticated requests with 401.
 *
 * Attaches the full user document (minus passwordHash) to `req.user`
 * so downstream handlers can use it directly.
 */
export async function requireAuth(req, res, next) {
  try {
    if (!req.session?.userId) {
      return sendError(res, 'Authentication required', 401)
    }

    const user = await User.findById(req.session.userId).select('-passwordHash')

    if (!user) {
      // Session references a user that no longer exists — destroy it
      req.session.destroy(() => {})
      return sendError(res, 'Authentication required', 401)
    }

    req.user = user
    next()
  } catch (error) {
    console.error('Auth middleware error:', error.message)
    return sendError(res, 'Authentication error', 500)
  }
}

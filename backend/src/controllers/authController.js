import bcrypt from 'bcrypt'
import User from '../models/User.js'
import { getSessionCookieOptions } from '../config/session.js'
import { sendSuccess, sendError } from '../utils/apiResponse.js'

const BCRYPT_ROUNDS = 12

function initializeSession(req, userId) {
  const now = new Date().toISOString()
  req.session.userId = userId.toString()
  req.session.sessionCreatedAt = now
  req.session.lastActiveAt = now
  req.session.userAgent = (req.get('user-agent') || '').slice(0, 512)
}

/**
 * POST /api/auth/register
 */
export async function register(req, res) {
  try {
    const { firstName, lastName, email, password } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() })
    if (existingUser) {
      return sendError(res, 'An account with this email already exists', 409)
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS)

    // Create user
    const user = await User.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
    })

    // Create authenticated session
    initializeSession(req, user._id)

    return sendSuccess(res, { user: user.toSafeObject() }, 201)
  } catch (error) {
    console.error('Register error:', error.message)

    // Handle Mongoose duplicate key error (race condition)
    if (error.code === 11000) {
      return sendError(res, 'An account with this email already exists', 409)
    }

    return sendError(res, 'An unexpected error occurred. Please try again.', 500)
  }
}

/**
 * POST /api/auth/login
 */
export async function login(req, res) {
  try {
    const { email, password } = req.body

    // Find user — include passwordHash for verification
    const user = await User.findOne({ email: email.toLowerCase().trim() })

    if (!user) {
      // Use generic message to avoid email enumeration
      return sendError(res, 'Invalid email or password', 401)
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.passwordHash)

    if (!isMatch) {
      return sendError(res, 'Invalid email or password', 401)
    }

    // Create authenticated session
    initializeSession(req, user._id)

    return sendSuccess(res, { user: user.toSafeObject() })
  } catch (error) {
    console.error('Login error:', error.message)
    return sendError(res, 'An unexpected error occurred. Please try again.', 500)
  }
}

/**
 * POST /api/auth/logout
 */
export async function logout(req, res) {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destroy error:', err.message)
        return sendError(res, 'Logout failed. Please try again.', 500)
      }

      res.clearCookie('aca.sid', getSessionCookieOptions())

      return sendSuccess(res, { message: 'Logged out successfully' })
    })
  } catch (error) {
    console.error('Logout error:', error.message)
    return sendError(res, 'An unexpected error occurred. Please try again.', 500)
  }
}

/**
 * GET /api/auth/me
 */
export async function me(req, res) {
  try {
    return sendSuccess(res, { user: req.user.toSafeObject() })
  } catch (error) {
    console.error('Me error:', error.message)
    return sendError(res, 'An unexpected error occurred. Please try again.', 500)
  }
}

import bcrypt from 'bcrypt'
import User from '../models/User.js'
import { sendSuccess, sendError } from '../utils/apiResponse.js'

const BCRYPT_ROUNDS = 12

/* ── Allowed update fields (whitelist prevents mass-assignment) ── */

const PROFILE_FIELDS = [
  'phone', 'gender', 'dateOfBirth', 'country', 'city', 'state', 'bio',
]

const PERSONAL_FIELDS = ['firstName', 'lastName']

const CAREER_FIELDS = [
  'currentRole', 'experienceLevel', 'education', 'university',
  'degree', 'branch', 'passingYear', 'skills',
  'preferredRole', 'preferredLocation', 'expectedSalary', 'employmentType',
]

const SOCIAL_FIELDS = [
  'linkedin', 'github', 'portfolio',
  'leetcode', 'codeforces', 'hackerrank', 'website',
]

/**
 * Pick only allowed keys from an object.
 */
function pick(source, allowedKeys) {
  const result = {}
  for (const key of allowedKeys) {
    if (key in source) {
      result[key] = source[key]
    }
  }
  return result
}

/* ────────────────────────────────────────────────────────── */
/*  GET /api/account/profile                                 */
/* ────────────────────────────────────────────────────────── */

export async function getProfile(req, res) {
  try {
    return sendSuccess(res, { user: req.user.toSafeObject() })
  } catch (error) {
    console.error('getProfile error:', error.message)
    return sendError(res, 'Failed to retrieve profile', 500)
  }
}

/* ────────────────────────────────────────────────────────── */
/*  PATCH /api/account/profile                               */
/* ────────────────────────────────────────────────────────── */

export async function updateProfile(req, res) {
  try {
    const user = req.user

    // Update top-level personal fields
    const personalUpdates = pick(req.body, PERSONAL_FIELDS)
    for (const [key, value] of Object.entries(personalUpdates)) {
      user[key] = value
    }

    // Update nested profile fields
    const profileUpdates = pick(req.body, PROFILE_FIELDS)
    if (!user.profile) user.profile = {}
    for (const [key, value] of Object.entries(profileUpdates)) {
      user.profile[key] = value
    }

    await user.save()
    return sendSuccess(res, { user: user.toSafeObject() })
  } catch (error) {
    console.error('updateProfile error:', error.message)

    if (error.name === 'ValidationError') {
      const firstError = Object.values(error.errors)[0]
      return sendError(res, firstError.message, 422)
    }

    return sendError(res, 'Failed to update profile', 500)
  }
}

/* ────────────────────────────────────────────────────────── */
/*  PATCH /api/account/career                                */
/* ────────────────────────────────────────────────────────── */

export async function updateCareer(req, res) {
  try {
    const user = req.user
    const careerUpdates = pick(req.body, CAREER_FIELDS)

    if (!user.career) user.career = {}
    for (const [key, value] of Object.entries(careerUpdates)) {
      user.career[key] = value
    }

    await user.save()
    return sendSuccess(res, { user: user.toSafeObject() })
  } catch (error) {
    console.error('updateCareer error:', error.message)

    if (error.name === 'ValidationError') {
      const firstError = Object.values(error.errors)[0]
      return sendError(res, firstError.message, 422)
    }

    return sendError(res, 'Failed to update career information', 500)
  }
}

/* ────────────────────────────────────────────────────────── */
/*  PATCH /api/account/social                                */
/* ────────────────────────────────────────────────────────── */

export async function updateSocial(req, res) {
  try {
    const user = req.user
    const socialUpdates = pick(req.body, SOCIAL_FIELDS)

    if (!user.socialLinks) user.socialLinks = {}
    for (const [key, value] of Object.entries(socialUpdates)) {
      user.socialLinks[key] = value
    }

    await user.save()
    return sendSuccess(res, { user: user.toSafeObject() })
  } catch (error) {
    console.error('updateSocial error:', error.message)

    if (error.name === 'ValidationError') {
      const firstError = Object.values(error.errors)[0]
      return sendError(res, firstError.message, 422)
    }

    return sendError(res, 'Failed to update social links', 500)
  }
}

/* ────────────────────────────────────────────────────────── */
/*  PATCH /api/account/avatar                                */
/* ────────────────────────────────────────────────────────── */

export async function updateAvatar(req, res) {
  try {
    const { avatar } = req.body
    const user = req.user

    if (!user.profile) user.profile = {}
    user.profile.avatar = avatar || ''

    await user.save()
    return sendSuccess(res, { user: user.toSafeObject() })
  } catch (error) {
    console.error('updateAvatar error:', error.message)
    return sendError(res, 'Failed to update avatar', 500)
  }
}

/* ────────────────────────────────────────────────────────── */
/*  PUT /api/account/password                                */
/* ────────────────────────────────────────────────────────── */

export async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body

    // Fetch user WITH passwordHash (req.user has it stripped)
    const user = await User.findById(req.user._id)
    if (!user) {
      return sendError(res, 'User not found', 404)
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash)
    if (!isMatch) {
      return sendError(res, 'Current password is incorrect', 401)
    }

    // Hash and save new password
    user.passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS)
    await user.save()

    return sendSuccess(res, { message: 'Password changed successfully' })
  } catch (error) {
    console.error('changePassword error:', error.message)
    return sendError(res, 'Failed to change password', 500)
  }
}

/* ────────────────────────────────────────────────────────── */
/*  GET /api/account/export                                  */
/* ────────────────────────────────────────────────────────── */

export async function exportData(req, res) {
  try {
    const safeData = req.user.toSafeObject()

    // Add export metadata
    const exportPayload = {
      exportedAt: new Date().toISOString(),
      format: 'AI Career Accelerator — Account Export',
      account: safeData,
    }

    return sendSuccess(res, exportPayload)
  } catch (error) {
    console.error('exportData error:', error.message)
    return sendError(res, 'Failed to export data', 500)
  }
}

/* ────────────────────────────────────────────────────────── */
/*  DELETE /api/account                                      */
/* ────────────────────────────────────────────────────────── */

export async function deleteAccount(req, res) {
  try {
    const userId = req.user._id

    // Delete the user document
    await User.findByIdAndDelete(userId)

    // Destroy the session
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destroy error after account deletion:', err.message)
      }

      res.clearCookie('aca.sid', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        path: '/',
      })

      return sendSuccess(res, { message: 'Account deleted successfully' })
    })
  } catch (error) {
    console.error('deleteAccount error:', error.message)
    return sendError(res, 'Failed to delete account', 500)
  }
}

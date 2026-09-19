import { Router } from 'express'
import { body } from 'express-validator'
import { validate } from '../middleware/validate.js'
import { requireAuth } from '../middleware/auth.js'
import {
  getProfile,
  updateProfile,
  updateCareer,
  updateSocial,
  updateAvatar,
  changePassword,
  exportData,
  deleteAccount,
} from '../controllers/accountController.js'

const router = Router()

/* ── All account routes require authentication ────────── */
router.use(requireAuth)

/* ── Validation helpers ──────────────────────────────── */

function isValidUrlOrEmpty(value) {
  if (!value || !value.trim()) return true
  try {
    const url = new URL(value.trim())
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

const urlField = (fieldName) =>
  body(fieldName)
    .optional()
    .trim()
    .isLength({ max: 300 }).withMessage(`${fieldName} URL is too long`)
    .custom(isValidUrlOrEmpty).withMessage(`${fieldName} must be a valid URL (http:// or https://)`)

/* ── Validation rules ────────────────────────────────── */

const profileRules = [
  body('firstName')
    .optional().trim()
    .isLength({ min: 1, max: 50 }).withMessage('First name must be 1–50 characters'),
  body('lastName')
    .optional().trim()
    .isLength({ min: 1, max: 50 }).withMessage('Last name must be 1–50 characters'),
  body('phone')
    .optional().trim()
    .isLength({ max: 20 }).withMessage('Phone number is too long'),
  body('gender')
    .optional().trim()
    .isLength({ max: 20 }).withMessage('Gender value is too long'),
  body('dateOfBirth')
    .optional().trim()
    .isLength({ max: 20 }).withMessage('Date of birth value is too long'),
  body('country')
    .optional().trim()
    .isLength({ max: 100 }).withMessage('Country name is too long'),
  body('city')
    .optional().trim()
    .isLength({ max: 100 }).withMessage('City name is too long'),
  body('state')
    .optional().trim()
    .isLength({ max: 100 }).withMessage('State name is too long'),
  body('bio')
    .optional().trim()
    .isLength({ max: 500 }).withMessage('Bio cannot exceed 500 characters'),
]

const careerRules = [
  body('currentRole')
    .optional().trim()
    .isLength({ max: 100 }).withMessage('Current role is too long'),
  body('experienceLevel')
    .optional().trim()
    .isLength({ max: 30 }).withMessage('Experience level value is too long'),
  body('education')
    .optional().trim()
    .isLength({ max: 30 }).withMessage('Education value is too long'),
  body('university')
    .optional().trim()
    .isLength({ max: 150 }).withMessage('University name is too long'),
  body('degree')
    .optional().trim()
    .isLength({ max: 100 }).withMessage('Degree is too long'),
  body('branch')
    .optional().trim()
    .isLength({ max: 100 }).withMessage('Branch is too long'),
  body('passingYear')
    .optional().trim()
    .isLength({ max: 10 }).withMessage('Passing year is too long'),
  body('skills')
    .optional()
    .isArray({ max: 30 }).withMessage('Cannot exceed 30 skills'),
  body('skills.*')
    .optional().trim()
    .isLength({ min: 1, max: 50 }).withMessage('Each skill must be 1–50 characters'),
  body('preferredRole')
    .optional().trim()
    .isLength({ max: 100 }).withMessage('Preferred role is too long'),
  body('preferredLocation')
    .optional().trim()
    .isLength({ max: 100 }).withMessage('Preferred location is too long'),
  body('expectedSalary')
    .optional().trim()
    .isLength({ max: 50 }).withMessage('Expected salary is too long'),
  body('employmentType')
    .optional().trim()
    .isLength({ max: 30 }).withMessage('Employment type is too long'),
]

const socialRules = [
  urlField('linkedin'),
  urlField('github'),
  urlField('portfolio'),
  urlField('leetcode'),
  urlField('codeforces'),
  urlField('hackerrank'),
  urlField('website'),
]

const avatarRules = [
  body('avatar')
    .isString().withMessage('Avatar must be a string')
    .isLength({ max: 2_000_000 }).withMessage('Avatar data is too large (max ~2MB)'),
]

const passwordRules = [
  body('currentPassword')
    .notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .notEmpty().withMessage('New password is required')
    .isLength({ min: 8, max: 128 }).withMessage('New password must be 8–128 characters')
    .matches(/[A-Z]/).withMessage('New password must contain at least one uppercase letter')
    .matches(/[0-9]/).withMessage('New password must contain at least one number')
    .matches(/[^A-Za-z0-9]/).withMessage('New password must contain at least one special character'),
]

/* ── Routes ──────────────────────────────────────────── */

router.get('/profile', getProfile)
router.patch('/profile', profileRules, validate, updateProfile)
router.patch('/career', careerRules, validate, updateCareer)
router.patch('/social', socialRules, validate, updateSocial)
router.patch('/avatar', avatarRules, validate, updateAvatar)
router.put('/password', passwordRules, validate, changePassword)
router.get('/export', exportData)
router.delete('/', deleteAccount)

export default router

import { validationResult } from 'express-validator'
import { sendError } from '../utils/apiResponse.js'

/**
 * Express middleware factory — runs express-validator rules and
 * returns the first validation error as a user-friendly message.
 *
 * Usage:
 *   router.post('/register', [...rules], validate, controller)
 */
export function validate(req, res, next) {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const firstError = errors.array({ onlyFirstError: true })[0]
    return sendError(res, firstError.msg, 422)
  }

  next()
}

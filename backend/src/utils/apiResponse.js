/**
 * Consistent API response helpers.
 *
 * Success: { success: true, data: { ... } }
 * Error:   { success: false, message: "..." }
 */

export function sendSuccess(res, data, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    data,
  })
}

export function sendError(res, message, statusCode = 400) {
  return res.status(statusCode).json({
    success: false,
    message,
  })
}

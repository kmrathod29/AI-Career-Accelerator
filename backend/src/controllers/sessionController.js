import { getSessionCookieOptions } from '../config/session.js'
import { listActiveUserSessions, revokeUserSession } from '../services/sessionService.js'
import { sendError, sendSuccess } from '../utils/apiResponse.js'

export async function getSessions(req, res) {
  try {
    const sessions = await listActiveUserSessions(req.user._id.toString(), req.sessionID)
    return sendSuccess(res, { sessions })
  } catch (error) {
    console.error('getSessions error:', error.message)
    return sendError(res, 'Unable to retrieve active sessions', 500)
  }
}

export async function revokeSession(req, res) {
  try {
    const session = await revokeUserSession(
      req.user._id.toString(),
      req.params.sessionKey,
      req.sessionID,
    )

    if (!session) {
      return sendError(res, 'Active session not found', 404)
    }

    if (!session.isCurrent) {
      return sendSuccess(res, { currentSessionRevoked: false })
    }

    return req.session.destroy((error) => {
      if (error) {
        console.error('Current session revoke error:', error.message)
        return sendError(res, 'Unable to revoke the current session', 500)
      }

      res.clearCookie('aca.sid', getSessionCookieOptions())
      return sendSuccess(res, { currentSessionRevoked: true })
    })
  } catch (error) {
    console.error('revokeSession error:', error.message)
    return sendError(res, 'Unable to revoke active session', 500)
  }
}

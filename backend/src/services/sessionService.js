import { createHmac } from 'node:crypto'
import { getSessionStore } from '../config/session.js'

function toDate(value) {
  const date = value ? new Date(value) : null
  return date && !Number.isNaN(date.getTime()) ? date : null
}

function parseStoredSession(document) {
  try {
    const session = typeof document.session === 'string'
      ? JSON.parse(document.session)
      : document.session

    return session && typeof session === 'object' ? session : null
  } catch {
    return null
  }
}

function getDeviceLabel(userAgent) {
  if (!userAgent) return 'Browser session'

  const browser = /Edg\//.test(userAgent)
    ? 'Microsoft Edge'
    : /Firefox\//.test(userAgent)
      ? 'Firefox'
      : /Chrome\//.test(userAgent)
        ? 'Chrome'
        : /Safari\//.test(userAgent)
          ? 'Safari'
          : 'Browser'

  const platform = /Android/i.test(userAgent)
    ? 'Android'
    : /iPhone|iPad|iPod/i.test(userAgent)
      ? 'iOS'
      : /Windows/i.test(userAgent)
        ? 'Windows'
        : /Macintosh|Mac OS X/i.test(userAgent)
          ? 'macOS'
          : /Linux/i.test(userAgent)
            ? 'Linux'
            : null

  return platform ? `${browser} on ${platform}` : browser
}

function getPublicSessionKey(sessionId) {
  const secret = process.env.SESSION_SECRET
  if (!secret) {
    throw new Error('SESSION_SECRET is required for session management')
  }

  return createHmac('sha256', secret).update(sessionId).digest('hex')
}

async function getActiveStoredSessions() {
  const store = getSessionStore()
  const collection = await store.collectionP
  const now = new Date()

  return collection.find({
    $or: [
      { expires: { $exists: false } },
      { expires: { $gt: now } },
    ],
  }).toArray()
}

function mapUserSession(document, session, currentSessionId) {
  const sessionId = String(document._id)

  return {
    sessionId,
    session: {
      id: getPublicSessionKey(sessionId),
      device: getDeviceLabel(session.userAgent),
      createdAt: session.sessionCreatedAt || null,
      lastActiveAt: session.lastActiveAt || null,
      expiresAt: toDate(document.expires)?.toISOString() || null,
      isCurrent: sessionId === currentSessionId,
    },
  }
}

async function findActiveUserSession(userId, publicSessionKey, currentSessionId) {
  const documents = await getActiveStoredSessions()

  for (const document of documents) {
    const session = parseStoredSession(document)
    if (!session || session.userId !== userId) continue

    const mapped = mapUserSession(document, session, currentSessionId)
    if (mapped.session.id === publicSessionKey) return mapped
  }

  return null
}

export async function listActiveUserSessions(userId, currentSessionId) {
  const documents = await getActiveStoredSessions()
  const sessions = []

  for (const document of documents) {
    const session = parseStoredSession(document)
    if (!session || session.userId !== userId) continue

    sessions.push(mapUserSession(document, session, currentSessionId).session)
  }

  return sessions.sort((a, b) => {
    if (a.isCurrent !== b.isCurrent) return a.isCurrent ? -1 : 1
    return (toDate(b.lastActiveAt)?.getTime() || 0) - (toDate(a.lastActiveAt)?.getTime() || 0)
  })
}

export async function revokeUserSession(userId, publicSessionKey, currentSessionId) {
  const session = await findActiveUserSession(userId, publicSessionKey, currentSessionId)
  if (!session) return null

  if (!session.session.isCurrent) {
    await new Promise((resolve, reject) => {
      getSessionStore().destroy(session.sessionId, (error) => {
        if (error) reject(error)
        else resolve()
      })
    })
  }

  return session.session
}

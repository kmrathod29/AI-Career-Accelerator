import session from 'express-session'
import MongoStore from 'connect-mongo'

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000
let mongoSessionStore = null

export function getSessionCookieOptions() {
  const isProd = process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL)

  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    path: '/',
  }
}

/**
 * Return the existing connect-mongo store used by express-session.
 * Session-management APIs use this store rather than creating a second
 * collection or a parallel session system.
 */
export function getSessionStore() {
  if (!mongoSessionStore) {
    throw new Error('Session store has not been initialized')
  }

  return mongoSessionStore
}

/**
 * Create express-session middleware with MongoDB-backed store.
 *
 * Cookie properties:
 *   - httpOnly: prevents JavaScript access (XSS protection)
 *   - sameSite: 'lax' blocks cross-site POST (CSRF mitigation); 'none' in production
 *   - secure: true in production (HTTPS only)
 *   - maxAge: 7 days
 */
export function createSessionMiddleware() {
  const secret = process.env.SESSION_SECRET || 'aca_session_development_fallback_secret_key'
  const mongoUri = process.env.MONGODB_URI

  if (!process.env.SESSION_SECRET) {
    console.warn(
      'Notice: SESSION_SECRET is not explicitly set in environment variables.',
    )
  }

  if (!mongoSessionStore && mongoUri) {
    try {
      mongoSessionStore = MongoStore.create({
        mongoUrl: mongoUri,
        collectionName: 'sessions',
        ttl: ONE_WEEK_MS / 1000,
        autoRemove: 'native',
        touchAfter: 24 * 3600,
      })
      mongoSessionStore.on('error', (err) => {
        console.error('MongoSessionStore error (non-fatal):', err.message)
      })
    } catch (err) {
      console.error('Failed to initialize MongoStore (non-fatal):', err.message)
    }
  }

  return session({
    secret,
    name: 'aca.sid',
    resave: false,
    saveUninitialized: false,
    store: mongoSessionStore || undefined,
    cookie: {
      ...getSessionCookieOptions(),
      maxAge: ONE_WEEK_MS,
    },
  })
}

import session from 'express-session'
import MongoStore from 'connect-mongo'

const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000

/**
 * Create express-session middleware with MongoDB-backed store.
 *
 * Cookie properties:
 *   - httpOnly: prevents JavaScript access (XSS protection)
 *   - sameSite: 'lax' blocks cross-site POST (CSRF mitigation)
 *   - secure: true in production (HTTPS only)
 *   - maxAge: 7 days
 */
export function createSessionMiddleware() {
  const secret = process.env.SESSION_SECRET

  if (!secret || secret === 'change-this-to-a-strong-random-secret') {
    console.warn(
      'WARNING: SESSION_SECRET is not set or is using the default value. ' +
      'Generate a strong random secret for production.',
    )
  }

  const isProd = process.env.NODE_ENV === 'production'

  return session({
    secret,
    name: 'aca.sid',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: 'sessions',
      ttl: ONE_WEEK_MS / 1000,
    }),
    cookie: {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'none' : 'lax',
      maxAge: ONE_WEEK_MS,
      path: '/',
    },
  })
}

import { memo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { APP_ROUTES } from '@constants/routes.js'
import { cn } from '@utils/classNames.js'

/**
 * AuthTabs — animated Login / Register pill tab switcher.
 *
 * Uses Framer Motion layoutId for a sliding active-pill effect.
 * Reads the current route to determine which tab is active.
 * Navigation uses React Router Link (client-side, no refresh).
 */
const TABS = [
  { label: 'Login', to: APP_ROUTES.LOGIN },
  { label: 'Register', to: APP_ROUTES.REGISTER },
]

export const AuthTabs = memo(function AuthTabs() {
  const { pathname } = useLocation()

  return (
    <div className="mb-6 flex rounded-xl bg-[var(--color-surface-2)] p-1">
      {TABS.map(({ label, to }) => {
        const isActive = pathname === to
        return (
          <Link
            key={to}
            to={to}
            replace
            className={cn(
              'relative flex-1 rounded-lg py-2.5 text-center text-sm font-semibold transition-colors',
              isActive
                ? 'text-[var(--color-text)]'
                : 'text-[var(--color-muted)] hover:text-[var(--color-text)]',
            )}
          >
            {isActive && (
              <motion.div
                layoutId="auth-tab-pill"
                className="absolute inset-0 rounded-lg bg-[var(--color-surface)] shadow-sm"
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              />
            )}
            <span className="relative z-10">{label}</span>
          </Link>
        )
      })}
    </div>
  )
})

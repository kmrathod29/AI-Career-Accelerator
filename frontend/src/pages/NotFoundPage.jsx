import { Link } from 'react-router-dom'
import { Home, LayoutDashboard, SearchX } from 'lucide-react'
import { motion } from 'framer-motion'
import logoSrc from '@assets/logo/AI-Career-Accelerator-only-logo.png'
import { APP_ROUTES } from '@constants/routes.js'
import { useAuth } from '@providers/useAuth.js'

/** A safe, product-consistent fallback for all unmatched client routes. */
export function NotFoundPage() {
  const { isAuthenticated } = useAuth()

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--color-bg)] px-4 py-10">
      <div className="aurora-bg" aria-hidden="true">
        <div className="aurora-orb aurora-orb-1" />
        <div className="aurora-orb aurora-orb-2" />
      </div>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="relative w-full max-w-lg rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)]/90 p-6 text-center shadow-[var(--shadow-elevated)] backdrop-blur-xl sm:p-10"
      >
        <img
          src={logoSrc}
          alt="AI Career Accelerator"
          className="mx-auto h-11 w-11 rounded-xl object-contain dark:bg-[var(--color-surface-2)] dark:p-0.5"
        />
        <div className="mx-auto mt-7 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-surface-2)] text-[var(--color-primary)]">
          <SearchX className="h-8 w-8" strokeWidth={1.7} />
        </div>
        <p className="mt-6 text-sm font-black tracking-[0.18em] text-[var(--color-primary)]">404</p>
        <h1 className="mt-2 text-3xl font-black tracking-[-0.05em] text-[var(--color-text)] sm:text-4xl">
          Page not found
        </h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-[var(--color-muted)] sm:text-base">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          {isAuthenticated && (
            <Link
              to={APP_ROUTES.DASHBOARD}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-[var(--color-primary-foreground)] shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[var(--color-secondary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] sm:w-auto"
            >
              <LayoutDashboard className="h-4 w-4" />
              Back to Dashboard
            </Link>
          )}
          <Link
            to={APP_ROUTES.HOME}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)]/60 px-6 py-3 text-sm font-semibold text-[var(--color-text)] transition-all hover:-translate-y-0.5 hover:bg-[var(--color-surface-2)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)] sm:w-auto"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Link>
        </div>
      </motion.section>
    </main>
  )
}

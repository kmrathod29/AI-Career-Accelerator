import { Link, Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'
import { Logo } from '@components/ui/Logo.jsx'
import { ThemeToggle } from '@components/ui/ThemeToggle.jsx'
import { AuthCard } from '@components/auth/AuthCard.jsx'
import { APP_ROUTES } from '@constants/routes.js'

const PAGE_TRANSITION = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -15 },
  transition: { duration: 0.25, ease: 'easeInOut' },
}

export function AuthLayout() {
  const location = useLocation()

  return (
    <div className="relative min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] transition-colors duration-300">
      {/* Subtle background ambient glows */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full opacity-40 mix-blend-screen"
        style={{
          background: 'radial-gradient(circle, rgba(37,99,235,0.08) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-40 left-1/3 h-[500px] w-[500px] rounded-full opacity-30 mix-blend-screen"
        style={{
          background: 'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)',
          filter: 'blur(70px)',
        }}
        aria-hidden="true"
      />

      {/* ── Top navigation bar ── */}
      <header className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex-1">
          <Link
            to={APP_ROUTES.HOME}
            className="group inline-flex items-center gap-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-sm font-medium text-[var(--color-muted)] shadow-xs transition-all hover:border-[var(--color-primary)]/20 hover:text-[var(--color-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
          >
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Back</span>
          </Link>
        </div>

        <div className="flex shrink-0 items-center justify-center">
          <Logo />
        </div>

        <div className="flex flex-1 justify-end">
          <ThemeToggle />
        </div>
      </header>

      {/* ── Main centered content area ── */}
      <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <AuthCard>
          <Outlet />
        </AuthCard>
      </main>
    </div>
  )
}
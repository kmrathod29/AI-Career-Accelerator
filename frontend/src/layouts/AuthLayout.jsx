import { Link, Outlet } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { ThemeToggle } from '@components/ui/ThemeToggle.jsx'
import { AuthCard } from '@components/auth/AuthCard.jsx'
import { APP_ROUTES } from '@constants/routes.js'

/**
 * AuthLayout — Redesigned centered minimal luxury layout.
 *
 * Uses min-h-dvh and w-full with max-w-md, mx-auto, px-4 for clean alignment
 * of both top navigation and the AuthCard, preventing any horizontal overflow
 * on mobile.
 */
export function AuthLayout() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden overflow-y-auto bg-[var(--color-bg)] text-[var(--color-text)] transition-colors duration-300">
      {/* Animated aurora background */}
      <div className="aurora-bg" aria-hidden="true">
        <div className="aurora-orb aurora-orb-1" />
        <div className="aurora-orb aurora-orb-2" />
        <div className="aurora-orb aurora-orb-3" />
      </div>

      {/* ── Top navigation bar ── */}
      <header className="mx-auto flex w-full max-w-md items-center justify-between px-4 py-4">
        <div className="flex flex-1 justify-start">
          <Link
            to={APP_ROUTES.HOME}
            className="group inline-flex items-center gap-1 text-sm font-medium text-[var(--color-muted)] transition-colors duration-200 hover:text-[var(--color-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
          >
            <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            <span>Back</span>
          </Link>
        </div>

        <div className="flex flex-1 justify-end">
          <ThemeToggle variant="auth" />
        </div>
      </header>

      {/* ── Main centered content area ── */}
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-4 py-6">
        <AuthCard>
          <Outlet />
        </AuthCard>
      </main>
    </div>
  )
}
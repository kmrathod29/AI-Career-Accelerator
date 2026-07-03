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
      {/* Subtle background ambient glows - centered to prevent scrollbars */}
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full opacity-40 mix-blend-screen"
        style={{
          background: 'radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 70%)',
          filter: 'blur(70px)',
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-40 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full opacity-30 mix-blend-screen"
        style={{
          background: 'radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
        aria-hidden="true"
      />

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
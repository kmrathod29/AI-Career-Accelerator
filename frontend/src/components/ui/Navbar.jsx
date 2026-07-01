import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { Logo } from './Logo.jsx'
import { ThemeToggle } from './ThemeToggle.jsx'
import { PrimaryButton } from './PrimaryButton.jsx'
import { APP_ROUTES } from '@constants/routes.js'

/**
 * Navbar — floating pill design.
 *
 * Visual: A rounded card that appears to float above the page,
 * with a transparent gap between the pill and the window edges.
 * Inspired by Raycast, Arc Browser, Linear.
 *
 * Per brief: Logo | (empty centre) | Log in | Get Started
 * No navigation links — intentionally minimal.
 */
export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOpen,     setIsOpen]     = useState(false)

  /* Solidify shadow on scroll */
  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 12)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  /* ESC key + body scroll lock for mobile drawer */
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && isOpen) setIsOpen(false) }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <>
      {/* ── Floating navbar ──────────────────────────────── */}
      {/*
        The outer <header> is sticky with horizontal + top padding.
        This creates the visible gap that makes the inner pill appear to
        float above the page content. Background is transparent so the
        gap is truly see-through.
      */}
      <header
        role="banner"
        className="sticky top-0 z-50 px-4 pt-4"
        style={{ background: 'transparent' }}
      >
        {/* Floating pill */}
        <motion.div
          animate={{
            boxShadow: isScrolled
              ? '0 4px 32px rgba(0,0,0,0.10), 0 1px 6px rgba(0,0,0,0.06)'
              : '0 2px 16px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)',
          }}
          transition={{ duration: 0.25 }}
          className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-slate-200/85 bg-white/90 px-5 py-3.5 backdrop-blur-xl"
        >
          {/* Logo — left */}
          <Logo />

          {/* Desktop CTAs — right */}
          <div className="hidden items-center gap-2.5 md:flex">
            <ThemeToggle />

            <Link
              to={APP_ROUTES.LOGIN}
              className="rounded-xl px-4 py-2 text-sm font-medium text-slate-500 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500"
            >
              Log in
            </Link>

            <Link to={APP_ROUTES.REGISTER}>
              <PrimaryButton className="rounded-xl px-5 py-2.5 text-sm">
                Get Started
              </PrimaryButton>
            </Link>
          </div>

          {/* Mobile: theme + hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen((o) => !o)}
              aria-expanded={isOpen}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500"
            >
              {isOpen ? (
                <X    className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Menu className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </motion.div>

        {/* Breathing room beneath the floating pill */}
        <div className="h-2" aria-hidden="true" />
      </header>

      {/* ── Mobile drawer ────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/25 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />

            {/* Slide-in panel */}
            <motion.div
              key="drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 230 }}
              className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xs flex-col justify-between border-l border-slate-100 bg-white p-6 shadow-2xl"
            >
              {/* Top: logo + close */}
              <div>
                <div className="mb-8 flex items-center justify-between">
                  <Logo />
                  <button
                    onClick={() => setIsOpen(false)}
                    aria-label="Close menu"
                    className="cursor-pointer rounded-xl border border-slate-100 p-2 text-slate-400 transition-colors hover:bg-slate-50"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>

              {/* Bottom: CTAs */}
              <div className="space-y-3 border-t border-slate-100 pt-6">
                <Link
                  to={APP_ROUTES.LOGIN}
                  onClick={() => setIsOpen(false)}
                  className="block w-full rounded-xl border border-slate-200 bg-white py-3 text-center text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
                >
                  Log in
                </Link>
                <Link to={APP_ROUTES.REGISTER} onClick={() => setIsOpen(false)}>
                  <PrimaryButton className="w-full justify-center py-3 text-sm">
                    Get Started
                  </PrimaryButton>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

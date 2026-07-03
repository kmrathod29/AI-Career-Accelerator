import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { Logo } from './Logo.jsx'
import { ThemeToggle } from './ThemeToggle.jsx'
import { UserMenu } from './UserMenu.jsx'

/**
 * Navbar — floating pill design.
 *
 * Visual: A rounded card that appears to float above the page,
 * with a transparent gap between the pill and the window edges.
 * Inspired by Raycast, Arc Browser, Linear.
 *
 * Per brief: Logo | (empty centre) | auth-aware user actions
 * No navigation links — intentionally minimal.
 *
 * Dark mode: neutral dark gray (--navbar-bg), NOT blue,
 * so the logo remains clearly visible.
 *
 * Mobile drawer renders via createPortal to document.body
 * so the body.menu-open blur on #root doesn't affect the drawer.
 */
export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  /* Solidify shadow on scroll */
  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 12)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  /* ESC key + body scroll lock + blur class for mobile drawer */
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && isOpen) setIsOpen(false) }
    window.addEventListener('keydown', onKey)

    if (isOpen) {
      document.body.style.overflow = 'hidden'
      document.body.classList.add('menu-open')
    } else {
      document.body.style.overflow = ''
      document.body.classList.remove('menu-open')
    }

    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      document.body.classList.remove('menu-open')
    }
  }, [isOpen])

  return (
    <>
      {/* ── Floating navbar ──────────────────────────────── */}
      <header
        role="banner"
        className="sticky top-0 z-50 px-4 pt-4"
        style={{ background: 'transparent' }}
      >
        {/* Floating pill — reduced height, pill-shaped, dark mode aware */}
        <motion.div
          animate={{
            boxShadow: isScrolled
              ? 'var(--shadow-elevated)'
              : 'var(--navbar-shadow)',
          }}
          transition={{ duration: 0.25 }}
          className="mx-auto flex max-w-7xl items-center justify-between rounded-full border border-(--navbar-border) px-5 py-2.5 backdrop-blur-xl"
          style={{ backgroundColor: 'var(--navbar-bg)' }}
        >
          {/* Logo — left */}
          <Logo />

          {/* Desktop actions — right */}
          <div className="hidden items-center gap-2.5 md:flex">
            <ThemeToggle />
            <UserMenu />
          </div>

          {/* Mobile: theme + hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen((o) => !o)}
              aria-expanded={isOpen}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-(--color-border) bg-(--color-surface) text-(--color-muted) transition-colors hover:bg-(--color-surface-2) focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            >
              {isOpen ? (
                <X className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Menu className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </motion.div>

        {/* Breathing room beneath the floating pill */}
        <div className="h-2" aria-hidden="true" />
      </header>

      {/* ── Mobile drawer (portalled to body so blur doesn't affect it) ── */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop — dark translucent + heavy blur */}
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="fixed inset-0 z-9998 bg-black/50 backdrop-blur-md"
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
                className="fixed inset-y-0 right-0 z-9999 flex w-full max-w-xs flex-col justify-between border-l border-(--color-border) p-6 shadow-2xl"
                style={{ backgroundColor: 'var(--color-surface)' }}
              >
                {/* Top: logo + close */}
                <div>
                  <div className="mb-8 flex items-center justify-between">
                    <Logo />
                    <button
                      onClick={() => setIsOpen(false)}
                      aria-label="Close menu"
                      className="cursor-pointer rounded-xl border border-(--color-border) p-2 text-(--color-muted) transition-colors hover:bg-(--color-surface-2)"
                    >
                      <X className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                {/* Bottom: auth-aware actions */}
                <div className="space-y-3 border-t border-(--color-border) pt-6">
                  <UserMenu guestLayout="stacked" className="w-full" />
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence >,
        document.body,
      )
      }
    </>
  )
}

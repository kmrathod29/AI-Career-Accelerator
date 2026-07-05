import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { Logo } from './Logo.jsx'
import { ThemeToggle } from './ThemeToggle.jsx'
import { ProfileDropdown } from './ProfileDropdown.jsx'
import { LANDING_NAV_LINKS } from '@constants/landingNav.js'
import { cn } from '@utils/classNames.js'

const DRAWER_LINK_STAGGER = {
  hidden: { opacity: 0, x: 12 },
  visible: (index) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.04 + index * 0.04,
      duration: 0.28,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
}

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

  const closeDrawer = useCallback(() => setIsOpen(false), [])

  /* Solidify shadow on scroll */
  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 12)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  /* ESC key + body scroll lock + blur class for mobile drawer */
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && isOpen) closeDrawer() }
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
  }, [isOpen, closeDrawer])

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
            <ProfileDropdown />
          </div>

          {/* Mobile: hamburger only — theme toggle lives in the drawer */}
          <div className="flex items-center md:hidden">
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
              {/* Backdrop — dark translucent + blur */}
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.28, ease: 'easeOut' }}
                className="fixed inset-0 z-9998 bg-black/45 backdrop-blur-md"
                onClick={closeDrawer}
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
                transition={{ type: 'spring', damping: 30, stiffness: 280 }}
                className="fixed inset-y-0 right-0 z-9999 flex w-full max-w-[min(100vw,20rem)] flex-col border-l border-(--color-border) shadow-2xl"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  paddingTop: 'max(1.5rem, env(safe-area-inset-top))',
                  paddingBottom: 'max(1rem, env(safe-area-inset-bottom))',
                  paddingLeft: 'max(1.5rem, env(safe-area-inset-left))',
                  paddingRight: 'max(1.5rem, env(safe-area-inset-right))',
                }}
              >
                {/* Header */}
                <div className="mb-6 flex shrink-0 items-center justify-between">
                  <Logo />
                  <button
                    onClick={closeDrawer}
                    aria-label="Close menu"
                    className="cursor-pointer rounded-xl border border-(--color-border) p-2 text-(--color-muted) transition-colors hover:bg-(--color-surface-2) hover:text-(--color-text)"
                  >
                    <X className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>

                {/* Navigation links */}
                <nav
                  className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
                  aria-label="Primary"
                >
                  <ul className="space-y-1">
                    {LANDING_NAV_LINKS.map((link, index) => (
                      <motion.li
                        key={link.label}
                        custom={index}
                        initial="hidden"
                        animate="visible"
                        variants={DRAWER_LINK_STAGGER}
                      >
                        <a
                          href={link.href}
                          onClick={closeDrawer}
                          className={cn(
                            'flex items-center rounded-xl px-3 py-3.5 text-[15px] font-medium tracking-[-0.01em] text-(--color-text)',
                            'transition-colors duration-150 hover:bg-(--color-surface-2) active:bg-(--color-surface-2)',
                          )}
                        >
                          {link.label}
                        </a>
                      </motion.li>
                    ))}
                  </ul>
                </nav>

                {/* Sticky bottom actions — theme left, auth right */}
                <div className="mt-6 shrink-0 border-t border-(--color-border) px-1 pt-5 pb-3">
                  <div className="flex items-center justify-between gap-4">
                    <ThemeToggle />
                    <ProfileDropdown
                      guestLayout="drawer"
                      menuPlacement="top-end"
                      onNavigate={closeDrawer}
                    />
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </>
  )
}

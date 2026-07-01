import { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Logo } from './Logo.jsx'
import { ThemeToggle } from './ThemeToggle.jsx'
import { PrimaryButton } from './PrimaryButton.jsx'
import { SecondaryButton } from './SecondaryButton.jsx'
import { APP_ROUTES } from '@constants/routes.js'
import { cn } from '@utils/classNames.js'
import { Container } from './Container.jsx'

const NAV_LINKS = [
  { label: 'Home', href: '#home', id: 'home' },
  { label: 'Features', href: '#features', id: 'features' },
  { label: 'How It Works', href: '#how-it-works', id: 'how-it-works' },
  { label: 'Pricing', href: '#pricing', id: 'pricing' },
  { label: 'FAQ', href: '#faq', id: 'faq' },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [isOpen, setIsOpen] = useState(false)
  const drawerRef = useRef(null)
  const menuButtonRef = useRef(null)
  const location = useLocation()

  // Change background on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Section observer for highlighting active links
  useEffect(() => {
    // Only track scroll highlights on the homepage
    if (location.pathname !== '/' && location.pathname !== APP_ROUTES.HOME) {
      return
    }

    const observerOptions = {
      root: null,
      rootMargin: '-40% 0px -50% 0px',
      threshold: 0,
    }

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id)
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)
    NAV_LINKS.forEach((link) => {
      const el = document.getElementById(link.id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [location.pathname])

  // Handle ESC key to close drawer and accessibility focus trapping
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
        menuButtonRef.current?.focus()
      }
    }

    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Close drawer if clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (isOpen && drawerRef.current && !drawerRef.current.contains(e.target) && !menuButtonRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [isOpen])

  const scrollToSection = (e, id) => {
    e.preventDefault()
    setIsOpen(false)
    const element = document.getElementById(id)
    if (element) {
      const offset = 80 // navbar height offset
      const bodyRect = document.body.getBoundingClientRect().top
      const elementRect = element.getBoundingClientRect().top
      const elementPosition = elementRect - bodyRect
      const offsetPosition = elementPosition - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      })
      setActiveSection(id)
    }
  }

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 w-full transition-all duration-300 border-b',
          isScrolled
            ? 'border-[var(--color-border)] bg-[var(--color-surface)]/85 backdrop-blur-md py-3 shadow-[0_4px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.2)]'
            : 'border-transparent bg-transparent py-5',
        )}
      >
        <Container className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1" aria-label="Main Navigation">
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.id)}
                className={cn(
                  'relative rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:text-[var(--color-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-primary)]',
                  activeSection === link.id
                    ? 'text-[var(--color-primary)] bg-[var(--color-surface-2)]/50'
                    : 'text-[var(--color-muted)]',
                )}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Action Area */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <Link to={APP_ROUTES.LOGIN} className="text-sm font-semibold text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors">
              Log in
            </Link>
            <Link to={APP_ROUTES.REGISTER}>
              <PrimaryButton className="px-5 py-2.5 rounded-lg text-xs font-semibold">
                Get Started
              </PrimaryButton>
            </Link>
          </div>

          {/* Mobile Hamburguer and Theme Toggle */}
          <div className="flex md:hidden items-center gap-3">
            <ThemeToggle />
            <button
              ref={menuButtonRef}
              onClick={() => setIsOpen(!isOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/80 text-[var(--color-text)] shadow-sm backdrop-blur-md hover:bg-[var(--color-surface-2)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-primary)]"
              aria-expanded={isOpen}
              aria-controls="mobile-drawer"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </Container>
      </header>

      {/* Mobile Drawer/Sheet Navigation */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
              aria-hidden="true"
            />

            {/* Slide-out Sheet */}
            <motion.div
              ref={drawerRef}
              id="mobile-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-40 w-full max-w-[320px] bg-[var(--color-surface)] border-l border-[var(--color-border)] p-6 shadow-2xl flex flex-col justify-between"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile Navigation"
            >
              <div className="space-y-8">
                {/* Header inside drawer */}
                <div className="flex items-center justify-between pb-4 border-b border-[var(--color-border)]/50">
                  <Logo />
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-lg text-[var(--color-muted)] hover:bg-[var(--color-surface-2)]"
                    aria-label="Close navigation menu"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Navigation Stack */}
                <nav className="flex flex-col space-y-2">
                  {NAV_LINKS.map((link) => (
                    <a
                      key={link.id}
                      href={link.href}
                      onClick={(e) => scrollToSection(e, link.id)}
                      className={cn(
                        'block rounded-xl px-4 py-3 text-base font-semibold transition-colors',
                        activeSection === link.id
                          ? 'bg-[var(--color-surface-2)] text-[var(--color-primary)]'
                          : 'text-[var(--color-text)] hover:bg-[var(--color-surface-2)]/50',
                      )}
                    >
                      {link.label}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Stacked CTAs at bottom */}
              <div className="space-y-4 pt-6 border-t border-[var(--color-border)]/50">
                <Link to={APP_ROUTES.LOGIN} onClick={() => setIsOpen(false)}>
                  <SecondaryButton className="w-full justify-center py-3">
                    Log in
                  </SecondaryButton>
                </Link>
                <Link to={APP_ROUTES.REGISTER} onClick={() => setIsOpen(false)}>
                  <PrimaryButton className="w-full justify-center py-3">
                    Get Started Free
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

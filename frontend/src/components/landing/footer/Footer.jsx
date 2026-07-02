import { memo } from 'react'
import { motion } from 'framer-motion'
import { Code, Briefcase, Globe } from 'lucide-react'
import { Logo } from '@components/ui/Logo.jsx'
import { FooterColumn } from './FooterColumn.jsx'
import { SocialLinks } from './SocialLinks.jsx'
import { APP_ROUTES } from '@constants/routes.js'

/* ── Footer link data ───────────────────────────────────────────── */
const SOCIAL_LINKS = [
  { label: 'GitHub',   href: 'https://github.com',   icon: Code },
  { label: 'LinkedIn', href: 'https://linkedin.com',  icon: Briefcase },
  { label: 'Twitter',  href: 'https://twitter.com',   icon: Globe },
]

const PLATFORM_LINKS = [
  { label: 'Resume Builder', href: '#' },
  { label: 'ATS Analyzer',  href: '#' },
  { label: 'Resume Match',  href: '#' },
  { label: 'Career Roadmap', href: '#' },
  { label: 'AI Coach',      href: '#' },
]

const RESOURCE_LINKS = [
  { label: 'Documentation',  href: '#' },
  { label: 'FAQs',           to: '/#faq' },
  { label: 'Contact',        href: '#' },
  { label: 'Privacy Policy',  href: '#' },
  { label: 'Terms of Service', href: '#' },
]

const QUICK_LINKS = [
  { label: 'Home',        to: APP_ROUTES.HOME },
  { label: 'Features',    to: '/#features' },
  { label: 'About',       href: '#' },
  { label: 'Login',       to: APP_ROUTES.LOGIN },
  { label: 'Get Started', to: APP_ROUTES.REGISTER },
]

/* ── Framer Motion presets ──────────────────────────────────────── */
const FADE_UP = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

/* ── Footer ─────────────────────────────────────────────────────── */
export const Footer = memo(function Footer() {
  return (
    <footer
      className="border-t border-[var(--color-border)]"
      role="contentinfo"
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        {/* ── Top: 4-column grid ─────────────────────────── */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Column 1: Brand */}
          <motion.div
            variants={FADE_UP}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            className="sm:col-span-2 lg:col-span-1"
          >
            <div className="mb-4">
              <Logo />
            </div>
            <p className="mb-5 max-w-xs text-sm leading-relaxed text-[var(--color-muted)]">
              AI-powered career platform helping students and job seekers build
              resumes, close skill gaps, and get placement-ready.
            </p>
            <SocialLinks links={SOCIAL_LINKS} />
          </motion.div>

          {/* Column 2: Platform */}
          <FooterColumn title="Platform" links={PLATFORM_LINKS} />

          {/* Column 3: Resources */}
          <FooterColumn title="Resources" links={RESOURCE_LINKS} />

          {/* Column 4: Quick Links */}
          <FooterColumn title="Quick Links" links={QUICK_LINKS} />
        </div>

        {/* ── Bottom bar ─────────────────────────────────── */}
        <motion.div
          variants={FADE_UP}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[var(--color-border)] pt-8 sm:flex-row"
        >
          <p className="text-center text-xs text-[var(--color-muted)] sm:text-left">
            © {new Date().getFullYear()} AI Career Accelerator. Built for
            students and job seekers.
          </p>
          <p className="text-xs text-[var(--color-muted)]">
            Made with <span className="text-red-500">❤️</span> in India
          </p>
        </motion.div>
      </div>
    </footer>
  )
})

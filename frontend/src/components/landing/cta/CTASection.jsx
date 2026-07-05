import { memo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import { PrimaryButton } from '@components/ui/PrimaryButton.jsx'
import { APP_ROUTES } from '@constants/routes.js'

/* ── Trust indicators ───────────────────────────────────────────── */
const TRUST_ITEMS = [
  'No Credit Card Required',
  'AI Powered',
  'Free to Get Started',
]

/* ── Framer Motion presets ──────────────────────────────────────── */
const FADE_UP = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

const STAGGER = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
}

/* ── CTASection ─────────────────────────────────────────────────── */
export const CTASection = memo(function CTASection() {
  return (
    <section
      id="pricing"
      className="relative overflow-hidden scroll-mt-24"
      aria-labelledby="cta-heading"
    >
      {/* Subtle blue radial glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 65%)',
          filter: 'blur(60px)',
        }}
        aria-hidden="true"
      />

      <div className="mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8 lg:py-40">
        <motion.div
          variants={STAGGER}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mx-auto max-w-3xl text-center"
        >
          {/* Heading */}
          <motion.h2
            variants={FADE_UP}
            id="cta-heading"
            className="text-3xl font-bold tracking-tight text-[var(--color-text)] sm:text-4xl lg:text-5xl lg:leading-tight"
          >
            Ready to Accelerate
            <br />
            <span className="text-[var(--color-primary)]">Your Career?</span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            variants={FADE_UP}
            className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-[var(--color-muted)] sm:text-lg"
          >
            Build ATS-ready resumes, discover skill gaps, prepare for interviews
            and achieve your career goals with one AI-powered platform.
          </motion.p>

          {/* Primary CTA */}
          <motion.div variants={FADE_UP} className="mt-9">
            <Link to={APP_ROUTES.REGISTER}>
              <PrimaryButton
                className="group gap-2 rounded-xl px-8 py-4 text-base font-semibold"
                aria-label="Create your free account"
              >
                Get Started
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </PrimaryButton>
            </Link>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            variants={FADE_UP}
            className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
          >
            {TRUST_ITEMS.map((item) => (
              <div
                key={item}
                className="flex items-center gap-1.5 text-sm text-[var(--color-muted)]"
              >
                <Check
                  className="h-3.5 w-3.5 text-emerald-500"
                  strokeWidth={2.5}
                  aria-hidden="true"
                />
                <span>{item}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
})

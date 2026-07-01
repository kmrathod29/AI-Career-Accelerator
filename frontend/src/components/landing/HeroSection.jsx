import { memo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Star } from 'lucide-react'
import { PrimaryButton } from '@components/ui/PrimaryButton.jsx'
import { HeroDashboard } from './HeroDashboard.jsx'
import { APP_ROUTES } from '@constants/routes.js'

/* ─── Framer Motion presets ─────────────────────────────────────── */
const FADE_UP = {
  hidden:  { opacity: 0, y: 24 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

const STAGGER = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.11, delayChildren: 0.05 } },
}

/* ─── Sub-components (all memoised) ────────────────────────────── */

const HeroHeading = memo(function HeroHeading() {
  return (
    <motion.h1
      variants={FADE_UP}
      className="text-[2.55rem] font-bold leading-[1.10] tracking-tight text-slate-900 sm:text-[3rem] lg:text-[3.2rem]"
    >
      Your AI Career Coach,
      <br />
      <span style={{ color: '#2563EB' }}>always ready.</span>
    </motion.h1>
  )
})

const HeroSubtitle = memo(function HeroSubtitle() {
  return (
    <motion.p
      variants={FADE_UP}
      className="max-w-[440px] text-base leading-relaxed text-slate-500 sm:text-[1.05rem]"
    >
      Build an ATS-ready résumé, close skill gaps, and get a personalised
      career roadmap — in minutes, not months.
    </motion.p>
  )
})

const HeroCTAs = memo(function HeroCTAs() {
  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <motion.div
      variants={FADE_UP}
      className="flex flex-wrap items-center gap-3"
    >
      {/* Primary — solid blue, gradient on hover */}
      <Link to={APP_ROUTES.REGISTER}>
        <PrimaryButton
          className="group gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold"
          aria-label="Create your free account"
        >
          Get Started
          <ArrowRight
            className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </PrimaryButton>
      </Link>

      {/*
        Secondary ghost — hardcoded slate colours so it always looks premium
        in light mode regardless of the CSS-var theme (hero is always white).
      */}
      <button
        onClick={scrollToFeatures}
        className={[
          'inline-flex items-center gap-2 rounded-xl',
          'border border-slate-200 bg-white px-7 py-3.5',
          'text-sm font-medium text-slate-600 shadow-sm',
          'transition-all duration-150',
          'hover:border-slate-300 hover:bg-slate-50 hover:shadow-md',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500',
        ].join(' ')}
      >
        Explore Features
      </button>
    </motion.div>
  )
})

const TrustRow = memo(function TrustRow() {
  return (
    <motion.div
      variants={FADE_UP}
      className="flex items-center gap-2.5"
    >
      {/* Star rating */}
      <div
        className="flex items-center gap-0.5"
        aria-label="Rated 5 out of 5 stars"
        role="img"
      >
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
            aria-hidden="true"
          />
        ))}
      </div>

      {/* User count */}
      <p className="text-xs text-slate-500">
        <span className="font-semibold text-slate-800">10,000+</span> students
      </p>
    </motion.div>
  )
})

/* ─── HeroSection ───────────────────────────────────────────────── */

export function HeroSection() {
  return (
    <section
      id="home"
      className="relative flex min-h-[calc(100vh-88px)] items-center overflow-hidden"
      aria-label="Hero — AI Career Accelerator"
    >
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[45%_55%] lg:gap-6 xl:gap-10">

          {/* ── Left: hero copy ─────────────────────────────── */}
          <motion.div
            variants={STAGGER}
            initial="hidden"
            animate="visible"
            className="space-y-7"
          >
            <HeroHeading />
            <HeroSubtitle />
            <HeroCTAs />
            <TrustRow />
          </motion.div>

          {/* ── Right: product dashboard ─────────────────────── */}
          <HeroDashboard />

        </div>
      </div>
    </section>
  )
}

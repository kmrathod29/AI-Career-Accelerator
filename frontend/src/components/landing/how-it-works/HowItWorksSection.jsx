import { memo } from 'react'
import { motion } from 'framer-motion'
import {
  UserRound,
  FilePlus,
  Sparkles,
  Rocket,
} from 'lucide-react'
import { TimelineStep } from './TimelineStep.jsx'

/* ── Steps data ─────────────────────────────────────────────────── */
const STEPS = [
  {
    icon: UserRound,
    title: 'Create Your Profile',
    description: 'Add your education, skills and career goals.',
  },
  {
    icon: FilePlus,
    title: 'Build or Upload Resume',
    description: 'Create a new resume or upload your existing resume.',
  },
  {
    icon: Sparkles,
    title: 'Analyze & Improve',
    description: 'Receive ATS score, keyword suggestions and skill gap analysis.',
  },
  {
    icon: Rocket,
    title: 'Prepare & Grow',
    description: 'Follow your AI roadmap and improve continuously.',
  },
]

/* ── Framer Motion presets ──────────────────────────────────────── */
const FADE_UP = {
  hidden:  { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

/* ── HowItWorksSection ──────────────────────────────────────────── */
export const HowItWorksSection = memo(function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden"
      aria-labelledby="how-it-works-heading"
    >
      {/* Subtle ambient glow */}
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(37,99,235,0.03) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
        aria-hidden="true"
      />

      <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
        {/* ── Section header ─────────────────────────────── */}
        <motion.div
          variants={FADE_UP}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mx-auto mb-14 max-w-2xl text-center sm:mb-16 lg:mb-20"
        >
          <h2
            id="how-it-works-heading"
            className="text-3xl font-bold tracking-tight text-[var(--color-text)] sm:text-4xl lg:text-[2.75rem] lg:leading-tight"
          >
            How It <span className="text-[var(--color-primary)]">Works</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--color-muted)] sm:text-lg">
            Get placement-ready in just a few simple steps.
          </p>
        </motion.div>

        {/* ── Timeline ───────────────────────────────────── */}
        {/*
          Desktop (lg+): horizontal row — each step is flex-1 in a row.
          Mobile/Tablet: vertical stack with spacing.
        */}
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-0">
          {STEPS.map((step, i) => (
            <TimelineStep
              key={step.title}
              icon={step.icon}
              number={i + 1}
              title={step.title}
              description={step.description}
              index={i}
              isLast={i === STEPS.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  )
})

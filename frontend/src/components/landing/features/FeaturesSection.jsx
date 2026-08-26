import { memo } from 'react'
import { motion } from 'framer-motion'
import {
  FileText,
  ScanSearch,
  GitCompare,
  TrendingUp,
  Map,
  Bot,
} from 'lucide-react'
import { FeatureCard } from './FeatureCard.jsx'

/* ── Feature data ───────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: FileText,
    title: 'AI Resume Builder',
    description:
      'Professional ATS-friendly resume creation with multiple templates and live preview.',
  },
  {
    icon: ScanSearch,
    title: 'ATS Resume Analyzer',
    description:
      'Check whether your resume is ATS-friendly and identify formatting, keyword, and structure issues that could hurt your chances of getting shortlisted.',
  },
  {
    icon: GitCompare,
    title: 'Resume Match',
    description:
      'Compare your resume with a specific job description to see how closely your experience and skills match that job.',
  },
  {
    icon: TrendingUp,
    title: 'Skill Gap Analysis',
    description:
      'Find the skills you are missing for your target role and get clear recommendations on what to learn next.',
  },
  {
    icon: Map,
    title: 'Career Roadmap',
    description:
      'Follow a step-by-step career path from your current level to your target role, with skills, milestones, and progression stages.',
  },
  {
    icon: Bot,
    title: 'AI Career Coach',
    description:
      'Get AI-powered career guidance, interview tips and resume improvement suggestions.',
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

/* ── FeaturesSection ────────────────────────────────────────────── */
export const FeaturesSection = memo(function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative overflow-hidden"
      aria-labelledby="features-heading"
    >
      {/* Subtle ambient glow behind the section */}
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(37,99,235,0.04) 0%, transparent 70%)',
          filter: 'blur(60px)',
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
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--color-primary)]">
            POWERFUL AI TOOLS
          </p>
          <h2
            id="features-heading"
            className="text-[28px] font-black tracking-[-0.055em] leading-[1.05] text-[var(--color-text)] sm:text-4xl lg:text-[36px]"
          >
            Everything You Need
            <br />
            <span className="text-[var(--color-primary)]">
              to Accelerate Your Career
            </span>
          </h2>
          <p className="mt-4 text-base leading-[1.6] text-[var(--color-muted)] sm:text-lg">
            Powerful AI tools that help students and job seekers build resumes,
            analyze ATS compatibility, identify skill gaps and prepare for
            placements.
          </p>
        </motion.div>

        {/* ── Feature cards grid ─────────────────────────── */}
        {/* 1 col mobile → 2 col tablet → 3 col desktop */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {FEATURES.map((feature, i) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  )
})

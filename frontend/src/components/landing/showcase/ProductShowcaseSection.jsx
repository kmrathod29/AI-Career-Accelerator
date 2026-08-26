import { useState, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText,
  ScanSearch,
  GitCompare,
  TrendingUp,
  Map,
  Bot,
  ChevronDown,
} from 'lucide-react'
import { FeatureTabs } from './FeatureTabs.jsx'
import { FeaturePreview } from './FeaturePreview.jsx'
import { DashboardPreview } from './DashboardPreview.jsx'
import { cn } from '@utils/classNames.js'

/* ── Feature data ───────────────────────────────────────────────── */
const FEATURES = [
  { id: 'resume-builder', label: 'Resume Builder',           icon: FileText,   desc: 'Build ATS-optimized resumes with AI assistance.' },
  { id: 'ats-analyzer',   label: 'ATS Analyzer',             icon: ScanSearch, desc: 'Check whether your resume is ATS-friendly and identify formatting, keyword, and structure issues that could hurt your chances of getting shortlisted.' },
  { id: 'resume-vs-jd',   label: 'Resume Match',            icon: GitCompare, desc: 'Compare your resume with a specific job description to see how closely your experience and skills match that job.' },
  { id: 'skill-gap',      label: 'Skill Gap Analysis',       icon: TrendingUp, desc: 'Find the skills you are missing for your target role and get clear recommendations on what to learn next.' },
  { id: 'career-roadmap', label: 'Career Roadmap',           icon: Map,        desc: 'Follow a step-by-step career path from your current level to your target role, with skills, milestones, and progression stages.' },
  { id: 'ai-coach',       label: 'AI Career Coach',          icon: Bot,        desc: 'Receive AI-powered career guidance.' },
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

/* ── ProductShowcaseSection ─────────────────────────────────────── */
export const ProductShowcaseSection = memo(function ProductShowcaseSection() {
  const [activeId, setActiveId] = useState(FEATURES[0].id)

  return (
    <section
      id="product-showcase"
      className="relative overflow-hidden"
      aria-labelledby="showcase-heading"
    >
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(37,99,235,0.04) 0%, transparent 70%)',
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
            PRODUCT SHOWCASE
          </p>
          <h2
            id="showcase-heading"
            className="text-[28px] font-black tracking-[-0.055em] leading-[1.05] text-[var(--color-text)] sm:text-4xl lg:text-[36px]"
          >
            See AI Career Accelerator{' '}
            <span className="text-[var(--color-primary)]">in Action</span>
          </h2>
          <p className="mt-4 text-base leading-[1.6] text-[var(--color-muted)] sm:text-lg">
            Explore how each AI-powered module helps you become placement-ready.
          </p>
        </motion.div>

        {/* ── Desktop: left tabs + right preview ────────── */}
        <div className="hidden lg:grid lg:grid-cols-[300px_1fr] lg:items-start lg:gap-8">
          <FeatureTabs features={FEATURES} activeId={activeId} onSelect={setActiveId} />
          <FeaturePreview activeId={activeId} />
        </div>

        {/* ── Mobile / Tablet: accordion ─────────────────── */}
        <div className="space-y-3 lg:hidden">
          {FEATURES.map((f) => {
            const isActive = activeId === f.id
            const Icon = f.icon

            return (
              <div
                key={f.id}
                className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]"
              >
                {/* Accordion header */}
                <button
                  onClick={() => setActiveId((prev) => (prev === f.id ? '' : f.id))}
                  className={cn(
                    'flex w-full cursor-pointer items-center gap-3 p-4 text-left transition-colors',
                    isActive && 'bg-[var(--color-primary)]/5',
                  )}
                >
                  <div
                    className={cn(
                      'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors',
                      isActive ? 'bg-[var(--color-primary)]/15' : 'bg-[var(--color-surface-2)]',
                    )}
                  >
                    <Icon
                      className={cn(
                        'h-4 w-4 transition-colors',
                        isActive ? 'text-[var(--color-primary)]' : 'text-[var(--color-muted)]',
                      )}
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[var(--color-text)]">{f.label}</p>
                  </div>
                  <ChevronDown
                    className={cn(
                      'h-4 w-4 shrink-0 text-[var(--color-muted)] transition-transform duration-200',
                      isActive && 'rotate-180',
                    )}
                    aria-hidden="true"
                  />
                </button>

                {/* Accordion panel */}
                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-[var(--color-border)] p-4">
                        <DashboardPreview featureId={f.id} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
})

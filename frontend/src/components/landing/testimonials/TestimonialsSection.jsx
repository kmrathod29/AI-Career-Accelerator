import { memo, useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { TestimonialCard } from './TestimonialCard.jsx'

/* ── Testimonial data ───────────────────────────────────────────── */
const TESTIMONIALS = [
  {
    name: 'Priya Sharma',
    role: 'Computer Science Student',
    initials: 'PS',
    gradient: 'linear-gradient(135deg, #3B82F6, #1D4ED8)',
    feedback:
      'The ATS analyzer helped me understand exactly why my resume wasn\'t getting shortlisted. After optimizing, I started getting interview calls within a week.',
    badge: 'ATS Analyzer',
  },
  {
    name: 'Rahul Verma',
    role: 'Final Year B.Tech',
    initials: 'RV',
    gradient: 'linear-gradient(135deg, #8B5CF6, #6D28D9)',
    feedback:
      'Built my resume from scratch using the AI builder. The templates are clean and the live preview made formatting effortless.',
    badge: 'Resume Builder',
  },
  {
    name: 'Ananya Patel',
    role: 'MBA Graduate',
    initials: 'AP',
    gradient: 'linear-gradient(135deg, #10B981, #059669)',
    feedback:
      'The skill gap analysis showed me I was missing key competencies for product roles. The recommended courses were spot-on.',
    badge: 'Skill Gap Analysis',
  },
  {
    name: 'Arjun Mehta',
    role: 'Software Developer',
    initials: 'AM',
    gradient: 'linear-gradient(135deg, #F59E0B, #D97706)',
    feedback:
      'The career roadmap gave me a clear path from junior to senior engineer. I can actually track my progress week by week.',
    badge: 'Career Roadmap',
  },
  {
    name: 'Sneha Reddy',
    role: 'Data Science Student',
    initials: 'SR',
    gradient: 'linear-gradient(135deg, #EC4899, #BE185D)',
    feedback:
      'Comparing my resume with job descriptions helped me tailor every application. My match rate went from 40% to 85%.',
    badge: 'Resume Matching',
  },
  {
    name: 'Vikram Singh',
    role: 'Placement Coordinator',
    initials: 'VS',
    gradient: 'linear-gradient(135deg, #06B6D4, #0E7490)',
    feedback:
      'I recommend this to every student in our batch. The AI coach gives personalized advice that actually makes a difference.',
    badge: 'AI Career Coach',
  },
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

/* ── TestimonialsSection ────────────────────────────────────────── */
export const TestimonialsSection = memo(function TestimonialsSection() {
  const scrollRef = useRef(null)

  const scroll = (dir) => {
    if (!scrollRef.current) return
    const amount = scrollRef.current.offsetWidth * 0.8
    scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' })
  }

  return (
    <section
      id="testimonials"
      className="relative overflow-hidden"
      aria-labelledby="testimonials-heading"
    >
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute right-0 top-1/3 h-96 w-96 rounded-full"
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
          <h2
            id="testimonials-heading"
            className="text-3xl font-bold tracking-tight text-[var(--color-text)] sm:text-4xl lg:text-[2.75rem] lg:leading-tight"
          >
            Trusted by Students
            <br />
            <span className="text-[var(--color-primary)]">Who Got Interview Ready</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--color-muted)] sm:text-lg">
            Real experiences from students and job seekers using AI Career Accelerator.
          </p>
        </motion.div>

        {/* ── Desktop / Tablet: 2-col grid ───────────────── */}
        <div className="hidden sm:grid sm:grid-cols-2 sm:gap-5 lg:gap-6">
          {TESTIMONIALS.map((t, i) => (
            <TestimonialCard key={t.name} {...t} index={i} />
          ))}
        </div>

        {/* ── Mobile: horizontal swipe carousel ──────────── */}
        <div className="relative sm:hidden">
          <div
            ref={scrollRef}
            className="scrollbar-none flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4"
            style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
          >
            {TESTIMONIALS.map((t, i) => (
              <div key={t.name} className="w-[85vw] shrink-0 snap-start">
                <TestimonialCard {...t} index={i} />
              </div>
            ))}
          </div>

          {/* Scroll arrows */}
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              onClick={() => scroll('left')}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)] transition-colors hover:bg-[var(--color-surface-2)]"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)] transition-colors hover:bg-[var(--color-surface-2)]"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
})

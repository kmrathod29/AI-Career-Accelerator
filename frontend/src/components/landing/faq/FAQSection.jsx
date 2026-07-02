import { useState, memo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Accordion } from './Accordion.jsx'

/* ── FAQ data ───────────────────────────────────────────────────── */
const FAQS = [
  {
    question: 'How does ATS Analysis work?',
    answer:
      'Our AI scans your resume against industry-standard ATS algorithms, checking for keyword optimization, formatting compatibility, and content structure. You receive a detailed score with actionable suggestions to improve your chances of passing automated screening systems.',
  },
  {
    question: 'Can I upload my existing resume?',
    answer:
      'Yes, you can upload your resume in PDF, DOCX, or TXT format. Our system will parse the content automatically and provide instant analysis. You can also choose to build a new resume from scratch using our AI-powered builder.',
  },
  {
    question: 'How accurate is Resume Matching?',
    answer:
      'Our resume matching engine uses advanced NLP to compare your resume against job descriptions with over 90% accuracy. It identifies missing keywords, skill gaps, and formatting issues that could affect your application success rate.',
  },
  {
    question: 'Can I download my resume as PDF?',
    answer:
      'Absolutely. Once you\'ve built or optimized your resume, you can download it as a professionally formatted PDF ready for submission. All templates are designed to be ATS-friendly and visually appealing.',
  },
  {
    question: 'How does Skill Gap Analysis work?',
    answer:
      'We analyze your current skills against the requirements of your target role using industry data and job market trends. The system identifies gaps and recommends specific courses, certifications, and learning paths to help you become qualified.',
  },
  {
    question: 'Is my data secure?',
    answer:
      'Yes, we take data security seriously. All data is encrypted in transit and at rest. We never share your personal information with third parties, and you can delete your account and all associated data at any time.',
  },
  {
    question: 'Can I edit my roadmap?',
    answer:
      'Yes, your career roadmap is fully customizable. You can adjust milestones, add new goals, change target roles, and update timelines based on your progress. The AI will adapt its recommendations accordingly.',
  },
  {
    question: 'Is AI Career Coach included?',
    answer:
      'Yes, the AI Career Coach is included in all plans. It provides personalized career guidance, interview preparation tips, resume improvement suggestions, and answers to your career-related questions in real-time.',
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

/* ── FAQSection ─────────────────────────────────────────────────── */
export const FAQSection = memo(function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0)

  const toggle = useCallback((i) => {
    setOpenIndex((prev) => (prev === i ? -1 : i))
  }, [])

  return (
    <section
      id="faq"
      className="relative overflow-hidden"
      aria-labelledby="faq-heading"
    >
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute bottom-0 left-1/4 h-80 w-80 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(37,99,235,0.03) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
        aria-hidden="true"
      />

      <div className="mx-auto w-full max-w-3xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
        {/* ── Section header ─────────────────────────────── */}
        <motion.div
          variants={FADE_UP}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          className="mb-12 text-center sm:mb-14 lg:mb-16"
        >
          <h2
            id="faq-heading"
            className="text-3xl font-bold tracking-tight text-[var(--color-text)] sm:text-4xl lg:text-[2.75rem] lg:leading-tight"
          >
            Frequently Asked{' '}
            <span className="text-[var(--color-primary)]">Questions</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--color-muted)] sm:text-lg">
            Everything you need to know before getting started.
          </p>
        </motion.div>

        {/* ── Accordion list ─────────────────────────────── */}
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <Accordion
              key={faq.question}
              question={faq.question}
              answer={faq.answer}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => toggle(i)}
            />
          ))}
        </div>
      </div>
    </section>
  )
})

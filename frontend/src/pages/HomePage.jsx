import { useState, useEffect, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  ArrowRight,
  Play,
  Star,
  FileText,
  Cpu,
  Mic,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Plus,
} from 'lucide-react'
import { HeroCard } from '@components/ui/HeroCard.jsx'
import { SectionContainer } from '@components/ui/SectionContainer.jsx'
import { PrimaryButton } from '@components/ui/PrimaryButton.jsx'
import { SecondaryButton } from '@components/ui/SecondaryButton.jsx'
import { LandingSkeleton } from '@components/skeleton/LandingSkeleton.jsx'


// Lazy load TrustedBy logo marquee section for optimization
const TrustedBy = lazy(() =>
  import('@components/ui/TrustedBy.jsx').then((module) => ({
    default: module.TrustedBy,
  })),
)

export function HomePage() {
  const [isLoading, setIsLoading] = useState(true)

  // Simulate dashboard loading to showcase the LandingSkeleton and shimmer effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1200)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <LandingSkeleton />
  }

  return (
    <AnimatePresence>
      <div className="w-full bg-[var(--color-bg)] transition-colors duration-300">
        {/* Hero Section Container */}
        <SectionContainer id="home" className="pt-8 pb-16 md:pt-16 md:pb-24 lg:pt-20 lg:pb-32 overflow-hidden">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            
            {/* Left Side: Copy and Actions */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="space-y-8 lg:col-span-6 text-left"
            >
              {/* Feature Badge */}
              <div className="inline-flex">
                <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-surface-2)]/80 px-3.5 py-1.5 text-xs font-semibold text-[var(--color-primary)] dark:bg-[var(--color-surface-2)]/30">
                  <Sparkles className="h-3.5 w-3.5 animate-pulse text-[var(--color-accent)]" />
                  Introducing AI Copilot 2.0
                </span>
              </div>

              {/* Title / Heading */}
              <div className="space-y-4">
                <h1 className="text-4xl font-extrabold tracking-tight text-[var(--color-text)] sm:text-5xl lg:text-6xl/tight">
                  Supercharge your career search with{' '}
                  <span className="bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-accent)] to-[var(--color-primary)] bg-clip-text text-transparent">
                    AI Intelligence
                  </span>
                </h1>
                <p className="max-w-xl text-base leading-relaxed text-[var(--color-muted)] sm:text-lg">
                  Optimize your resume, simulate full AI technical interviews, bypass applicant tracking system filters, and automate your workflow with our agentic career copilot.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 pt-2">
                <PrimaryButton className="group gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm">
                  Start Free Trial
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </PrimaryButton>
                <SecondaryButton className="gap-2 px-7 py-3.5 rounded-xl font-semibold text-sm">
                  <Play className="h-4 w-4 fill-current text-[var(--color-muted)] group-hover:text-[var(--color-text)]" />
                  Watch Demo
                </SecondaryButton>
              </div>

              {/* Trust Indicator & Star Ratings */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-6 border-t border-[var(--color-border)]/50">
                <div className="flex -space-x-3">
                  {[
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80',
                    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80',
                    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80',
                    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80&q=80',
                  ].map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      alt="ACA Professional User Profile"
                      className="h-9 w-9 rounded-full border-2 border-[var(--color-bg)] object-cover shadow-sm"
                    />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                    <span className="ml-1 text-sm font-bold text-[var(--color-text)]">4.9/5</span>
                  </div>
                  <p className="text-xs text-[var(--color-muted)] mt-1">
                    Trusted by 50,000+ graduates and professionals worldwide
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Right Side: Reusable Cards and Dashboard Illustration */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
              className="relative lg:col-span-6 w-full max-w-xl mx-auto lg:max-w-none"
            >
              {/* Background gradient decorative glow */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[var(--color-primary)]/20 to-[var(--color-accent)]/20 blur-xl opacity-75 dark:opacity-40" />

              {/* Responsive Cards Grid */}
              <div className="relative grid grid-cols-1 gap-4 sm:grid-cols-2">
                
                {/* 1. Resume Score Card */}
                <HeroCard className="animate-float-1 border-[var(--color-border)] bg-[var(--color-surface)]/85" glow>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-[var(--color-primary)]" />
                      <span className="text-xs font-bold text-[var(--color-text)] uppercase tracking-wider">Resume Analysis</span>
                    </div>
                    <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      Live
                    </span>
                  </div>

                  {/* Circle Chart */}
                  <div className="flex items-center justify-center py-5">
                    <div className="relative flex items-center justify-center">
                      <svg className="h-24 w-24 transform -rotate-90">
                        {/* Track */}
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="currentColor"
                          strokeWidth="7"
                          fill="transparent"
                          className="text-[var(--color-surface-3)]"
                        />
                        {/* Progress */}
                        <circle
                          cx="48"
                          cy="48"
                          r="40"
                          stroke="currentColor"
                          strokeWidth="7"
                          fill="transparent"
                          strokeDasharray="251.2"
                          strokeDashoffset="32.65" // (100 - 87)% * 251.2
                          className="text-[var(--color-accent)] transition-all duration-1000"
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className="text-2xl font-extrabold text-[var(--color-text)]">87</span>
                        <span className="text-[10px] text-[var(--color-muted)] font-medium">ATS Score</span>
                      </div>
                    </div>
                  </div>

                  {/* Suggestions list */}
                  <div className="space-y-2 text-xs font-medium">
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="truncate">Relevant skills indexed</span>
                    </div>
                    <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                      <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="truncate">Add metric details for impact</span>
                    </div>
                  </div>
                </HeroCard>

                {/* 2. ATS Score Card */}
                <HeroCard className="animate-float-2 border-[var(--color-border)] bg-[var(--color-surface)]/85" glow>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Cpu className="h-4 w-4 text-[var(--color-accent)]" />
                      <span className="text-xs font-bold text-[var(--color-text)] uppercase tracking-wider">ATS Alignment</span>
                    </div>
                    <span className="rounded-full bg-[var(--color-primary)]/10 px-2.5 py-0.5 text-xs font-bold text-[var(--color-primary)]">
                      94%
                    </span>
                  </div>

                  <div className="my-3 space-y-2">
                    <div className="text-[11px] font-semibold text-[var(--color-muted)]">
                      Target: <span className="text-[var(--color-text)]">Senior Frontend Engineer</span>
                    </div>
                    
                    {/* Compliance indicator checkboxes */}
                    <div className="space-y-1.5 pt-1 text-xs">
                      <div className="flex items-center justify-between rounded-lg bg-[var(--color-surface-2)]/50 p-2 border border-[var(--color-border)]/40">
                        <span className="text-[var(--color-text)] font-semibold">React 19 / Vite</span>
                        <span className="text-[10px] font-bold text-emerald-500">Perfect Match</span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg bg-[var(--color-surface-2)]/50 p-2 border border-[var(--color-border)]/40">
                        <span className="text-[var(--color-text)] font-semibold">Tailwind CSS v4</span>
                        <span className="text-[10px] font-bold text-emerald-500">Perfect Match</span>
                      </div>
                      <div className="flex items-center justify-between rounded-lg bg-[var(--color-surface-2)]/50 p-2 border border-[var(--color-border)]/40">
                        <span className="text-[var(--color-muted)] font-medium">GraphQL API</span>
                        <span className="text-[10px] font-bold text-amber-500">Missing Key</span>
                      </div>
                    </div>
                  </div>

                  <SecondaryButton className="w-full py-2 px-3 text-[11px] rounded-lg border-[var(--color-border)]">
                    Optimize Keywords
                  </SecondaryButton>
                </HeroCard>

                {/* 3. Interview Score Card */}
                <HeroCard className="animate-float-3 sm:col-span-2 border-[var(--color-border)] bg-[var(--color-surface)]/85" glow>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/10 text-rose-500">
                        <Mic className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[var(--color-text)] uppercase tracking-wider">AI Mock Interview</div>
                        <div className="text-[10px] text-[var(--color-muted)] font-medium">Technical Assessment Simulation</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                      Excellent Dynamics
                    </div>
                  </div>

                  {/* Audio Waveform Illustration */}
                  <div className="flex h-14 items-end gap-1.5 px-3 py-1 bg-[var(--color-surface-2)]/40 border border-[var(--color-border)]/35 rounded-xl justify-between">
                    {[
                      35, 60, 42, 75, 20, 55, 40, 80, 48, 65, 30, 95, 25, 70, 50, 85, 35, 60, 40,
                      80, 45, 60, 35, 75, 20, 45,
                    ].map((height, i) => (
                      <span
                        key={i}
                        className="flex-1 rounded-full bg-gradient-to-t from-[var(--color-primary)] to-[var(--color-accent)] opacity-85 hover:opacity-100 transition-opacity"
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-between mt-3 text-xs font-semibold">
                    <div className="text-[var(--color-muted)]">
                      Communication Pace:{' '}
                      <span className="text-[var(--color-text)]">135 WPM</span>
                    </div>
                    <div className="text-[var(--color-muted)]">
                      Technical Clarity:{' '}
                      <span className="text-[var(--color-text)]">Strong (89%)</span>
                    </div>
                  </div>
                </HeroCard>

                {/* 4. Career Progress Card */}
                <HeroCard className="animate-float-1 sm:col-span-2 border-[var(--color-border)] bg-[var(--color-surface)]/85" glow>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-[var(--color-primary)]" />
                      <span className="text-xs font-bold text-[var(--color-text)] uppercase tracking-wider">Application Funnel</span>
                    </div>
                    <button className="flex h-6 w-6 items-center justify-center rounded-md border border-[var(--color-border)] text-[var(--color-muted)] hover:bg-[var(--color-surface-2)] transition-colors">
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Pipeline columns */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-xl border border-[var(--color-border)]/50 bg-[var(--color-surface-2)]/30 p-3">
                      <div className="text-[10px] font-bold text-[var(--color-muted)] uppercase tracking-wider">Applied</div>
                      <div className="mt-1 flex items-baseline gap-1.5">
                        <span className="text-2xl font-extrabold text-[var(--color-text)]">18</span>
                        <span className="text-[10px] font-semibold text-emerald-500">+3 new</span>
                      </div>
                      <div className="mt-2 h-1 w-full bg-[var(--color-surface-3)] rounded-full overflow-hidden">
                        <div className="h-full bg-[var(--color-primary)] w-4/6 rounded-full" />
                      </div>
                    </div>
                    <div className="rounded-xl border border-[var(--color-border)]/50 bg-[var(--color-surface-2)]/30 p-3">
                      <div className="text-[10px] font-bold text-[var(--color-muted)] uppercase tracking-wider">Interviews</div>
                      <div className="mt-1 flex items-baseline gap-1.5">
                        <span className="text-2xl font-extrabold text-[var(--color-text)]">6</span>
                        <span className="text-[10px] font-semibold text-[var(--color-accent)]">2 active</span>
                      </div>
                      <div className="mt-2 h-1 w-full bg-[var(--color-surface-3)] rounded-full overflow-hidden">
                        <div className="h-full bg-[var(--color-accent)] w-2/6 rounded-full" />
                      </div>
                    </div>
                    <div className="rounded-xl border border-[var(--color-border)]/50 bg-[var(--color-surface-2)]/30 p-3">
                      <div className="text-[10px] font-bold text-[var(--color-muted)] uppercase tracking-wider">Offers</div>
                      <div className="mt-1 flex items-baseline gap-1.5">
                        <span className="text-2xl font-extrabold text-[var(--color-text)]">2</span>
                        <span className="text-[10px] font-semibold text-rose-500">1 pending</span>
                      </div>
                      <div className="mt-2 h-1 w-full bg-[var(--color-surface-3)] rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 w-1/6 rounded-full" />
                      </div>
                    </div>
                  </div>
                </HeroCard>

              </div>
            </motion.div>
          </div>
        </SectionContainer>

        {/* Trusted By Section (Infinite Loop Marquee) */}
        <Suspense
          fallback={
            <div className="py-12 text-center text-xs font-semibold text-[var(--color-muted)] opacity-50 animate-pulse">
              Loading partners...
            </div>
          }
        >
          <TrustedBy />
        </Suspense>

        {/* Invisible Scroll Anchors to fulfill navbar click actions & scroll highlights */}
        {/* Do NOT build active UI sections in this phase, just layout tags to prevent layout break */}
        <div id="features" className="relative h-2 pointer-events-none" />
        <div id="how-it-works" className="relative h-2 pointer-events-none" />
        <div id="pricing" className="relative h-2 pointer-events-none" />
        <div id="faq" className="relative h-2 pointer-events-none" />
      </div>
    </AnimatePresence>
  )
}
import { memo } from 'react'
import { FileText, Target, BarChart2, MapPin, CheckCircle2, Circle, AlertCircle } from 'lucide-react'
import { FeatureCard } from './FeatureCard.jsx'
import { cn } from '@utils/classNames.js'

/* ─── Micro helpers ──────────────────────────────────────────────── */

function ScoreBar({ value, className }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1 flex-1 overflow-hidden rounded-full bg-[var(--color-surface-3)]">
        <div
          className={cn('h-full rounded-full bg-[var(--color-primary)] transition-all', className)}
          style={{ width: `${value}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      <span className="w-7 shrink-0 text-right text-[10px] font-semibold tabular-nums text-[var(--color-muted)]">
        {value}%
      </span>
    </div>
  )
}

function StatusDot({ status }) {
  if (status === 'matched')
    return <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" aria-label="Matched" />
  if (status === 'gap')
    return <AlertCircle className="h-3.5 w-3.5 shrink-0 text-amber-500" aria-label="Gap identified" />
  return <Circle className="h-3.5 w-3.5 shrink-0 text-[var(--color-muted)]" aria-label="Pending" />
}

/* ─── Card 1: Resume Builder ─────────────────────────────────────── */

const ResumeBuilderCard = memo(function ResumeBuilderCard() {
  return (
    <FeatureCard
      title="Resume Builder"
      badge="ATS: 87/100"
      badgeVariant="blue"
      icon={FileText}
    >
      {/* Mini resume preview */}
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)]/40 px-3.5 py-3">
        <p className="text-xs font-semibold text-[var(--color-text)]">Alex Johnson</p>
        <p className="mt-0.5 text-[10px] text-[var(--color-muted)]">Product Designer · Open to work</p>
        <div className="mt-2.5 space-y-1.5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">Experience</p>
          {[
            { role: 'UI Engineer', company: 'Stripe', years: '2022–Present' },
            { role: 'Visual Designer', company: 'Figma', years: '2020–2022' },
          ].map(({ role, company, years }) => (
            <div key={company} className="flex items-center justify-between text-[10px]">
              <span className="font-medium text-[var(--color-text)]">{role} · {company}</span>
              <span className="text-[var(--color-muted)]">{years}</span>
            </div>
          ))}
        </div>
      </div>
      {/* ATS bar */}
      <div className="mt-2">
        <ScoreBar value={87} />
      </div>
    </FeatureCard>
  )
})

/* ─── Card 2: ATS Analysis ───────────────────────────────────────── */

const ATSAnalysisCard = memo(function ATSAnalysisCard() {
  const KEYWORDS = [
    { label: 'UI/UX Design',    score: 96, status: 'matched' },
    { label: 'React.js',        score: 88, status: 'matched' },
    { label: 'System Design',   score: 42, status: 'gap' },
  ]

  return (
    <FeatureCard
      title="ATS Analysis"
      badge="94% Match"
      badgeVariant="green"
      icon={Target}
    >
      <p className="mb-2 text-[10px] text-[var(--color-muted)]">
        Target: <span className="font-medium text-[var(--color-text)]">Sr. Product Designer</span>
      </p>
      <ul className="space-y-2" aria-label="Keyword match scores">
        {KEYWORDS.map(({ label, score, status }) => (
          <li key={label}>
            <div className="mb-1 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <StatusDot status={status} />
                <span className="text-[10px] font-medium text-[var(--color-text)]">{label}</span>
              </div>
            </div>
            <ScoreBar value={score} />
          </li>
        ))}
      </ul>
    </FeatureCard>
  )
})

/* ─── Card 3: Skill Gap Analysis (full-width) ────────────────────── */

const SkillGapCard = memo(function SkillGapCard() {
  const SKILLS = [
    { name: 'React.js',      level: 90, status: 'matched' },
    { name: 'TypeScript',    level: 55, status: 'gap' },
    { name: 'System Design', level: 32, status: 'gap' },
    { name: 'Leadership',    level: 78, status: 'matched' },
  ]

  return (
    <FeatureCard
      title="Skill Gap Analysis"
      badge="2 gaps found"
      badgeVariant="amber"
      icon={BarChart2}
      className="col-span-2"
    >
      <p className="mb-2.5 text-[10px] text-[var(--color-muted)]">
        Current → <span className="font-medium text-[var(--color-text)]">Senior Software Engineer</span>
      </p>
      <ul className="space-y-2" aria-label="Skill proficiency levels">
        {SKILLS.map(({ name, level, status }) => (
          <li key={name}>
            <div className="mb-1 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <StatusDot status={status} />
                <span className="text-[10px] font-medium text-[var(--color-text)]">{name}</span>
              </div>
              <span className={cn(
                'text-[9px] font-semibold',
                status === 'gap' ? 'text-amber-500' : 'text-emerald-600',
              )}>
                {status === 'gap' ? 'Gap' : 'Matched'}
              </span>
            </div>
            <ScoreBar value={level} />
          </li>
        ))}
      </ul>
    </FeatureCard>
  )
})

/* ─── Card 4: Career Roadmap (full-width) ────────────────────────── */

const CareerRoadmapCard = memo(function CareerRoadmapCard() {
  const STEPS = [
    { label: 'Junior',  done: true },
    { label: 'Mid',     done: true, current: true },
    { label: 'Senior',  done: false },
    { label: 'Lead',    done: false },
  ]

  return (
    <FeatureCard
      title="Career Roadmap"
      badge="On track"
      badgeVariant="green"
      icon={MapPin}
      className="col-span-2"
    >
      {/* Timeline rail */}
      <div className="relative flex items-center justify-between px-2 py-3" aria-label="Career progression stages">
        {/* Connecting line */}
        <div className="absolute left-4 right-4 top-1/2 h-px -translate-y-1/2 bg-[var(--color-surface-3)]" aria-hidden="true" />
        {STEPS.map(({ label, done, current }) => (
          <div key={label} className="relative flex flex-col items-center gap-1.5">
            <div className={cn(
              'relative z-10 flex h-6 w-6 items-center justify-center rounded-full border-2',
              current
                ? 'border-[var(--color-primary)] bg-[var(--color-primary)]'
                : done
                  ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/20'
                  : 'border-[var(--color-surface-3)] bg-[var(--color-surface)]',
            )}>
              {current && <span className="h-2 w-2 rounded-full bg-white" />}
              {done && !current && <span className="h-2 w-2 rounded-full bg-[var(--color-primary)]" />}
            </div>
            <span className={cn(
              'text-[9px] font-semibold',
              current ? 'text-[var(--color-primary)]' : 'text-[var(--color-muted)]',
            )}>
              {label}
            </span>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-[var(--color-muted)]">
        Next milestone: <span className="font-medium text-[var(--color-text)]">Senior Engineer in ~5 months</span>
      </p>
    </FeatureCard>
  )
})

/* ─── Composed preview ───────────────────────────────────────────── */

export const HeroPreview = memo(function HeroPreview() {
  return (
    <div
      className="animate-float-1 w-full"
      aria-label="AI Career Accelerator dashboard preview"
    >
      {/* Row 1: two cards side-by-side */}
      <div className="grid grid-cols-2 gap-3">
        <ResumeBuilderCard />
        {/* ATS card is offset down to create a staggered composition */}
        <div className="flex flex-col justify-end">
          <ATSAnalysisCard />
        </div>
      </div>

      {/* Row 2: Skill Gap — spans full width, overlaps row 1 slightly */}
      <div className="relative z-10 mt-3">
        <div className="grid grid-cols-2 gap-3">
          <SkillGapCard />
        </div>
      </div>

      {/* Row 3: Career Roadmap — full width */}
      <div className="mt-3">
        <div className="grid grid-cols-2 gap-3">
          <CareerRoadmapCard />
        </div>
      </div>
    </div>
  )
})

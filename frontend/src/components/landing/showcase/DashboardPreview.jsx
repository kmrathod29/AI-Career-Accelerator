import { memo } from 'react'
import { CheckCircle2, AlertCircle, Send, BookOpen } from 'lucide-react'
import { cn } from '@utils/classNames.js'

/* ── Shared micro-helpers ────────────────────────────────────────── */

function ScoreBar({ label, value, barColor }) {
  return (
    <div className="flex items-center gap-3">
      <span className="w-20 shrink-0 text-xs font-medium text-[var(--color-muted)]">{label}</span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--color-surface-3)]">
        <div
          className={cn('h-full rounded-full', barColor || 'bg-[var(--color-primary)]')}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="w-8 shrink-0 text-right text-xs font-semibold text-[var(--color-text)]">
        {value}%
      </span>
    </div>
  )
}

function InnerCard({ children, className }) {
  return (
    <div className={cn('rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] p-4', className)}>
      {children}
    </div>
  )
}

function Label({ children }) {
  return (
    <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">
      {children}
    </p>
  )
}

/* ── 1. Resume Builder ───────────────────────────────────────────── */

function ResumeBuilderPreview() {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {['Modern', 'Classic', 'Minimal'].map((t, i) => (
          <span
            key={t}
            className={cn(
              'rounded-lg px-3 py-1 text-xs font-medium transition-colors',
              i === 0 ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]' : 'text-[var(--color-muted)]',
            )}
          >
            {t}
          </span>
        ))}
      </div>

      <InnerCard>
        <p className="text-sm font-semibold text-[var(--color-text)]">Alex Johnson</p>
        <p className="text-xs text-[var(--color-muted)]">Product Designer · Open to work</p>
        <div className="mt-3 space-y-1.5 border-t border-[var(--color-border)] pt-3">
          <Label>Experience</Label>
          {[['UI Engineer · Stripe', '2022–Present'], ['Visual Designer · Figma', '2020–2022']].map(([role, yr]) => (
            <div key={role} className="flex justify-between text-xs">
              <span className="text-[var(--color-text)]">{role}</span>
              <span className="text-[var(--color-muted)]">{yr}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5 border-t border-[var(--color-border)] pt-3">
          {['React', 'Figma', 'TypeScript', 'Node.js'].map((s) => (
            <span key={s} className="rounded-md bg-[var(--color-primary)]/10 px-2 py-0.5 text-[10px] font-medium text-[var(--color-primary)]">{s}</span>
          ))}
        </div>
      </InnerCard>

      <ScoreBar label="ATS Score" value={87} />
    </div>
  )
}

/* ── 2. ATS Analyzer ─────────────────────────────────────────────── */

const ATS_KEYWORDS = [
  { label: 'React.js', score: 96, matched: true },
  { label: 'TypeScript', score: 82, matched: true },
  { label: 'System Design', score: 38, matched: false },
]

const ATS_TIPS = [
  { text: 'Add quantified impact metrics', ok: true },
  { text: 'Include relevant certifications', ok: true },
  { text: 'Missing keyword: Docker', ok: false },
]

function ATSAnalyzerPreview() {
  return (
    <div className="space-y-4">
      <InnerCard className="flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-primary)]/10">
          <span className="text-xl font-bold text-[var(--color-primary)]">94</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-[var(--color-text)]">ATS Compatibility Score</p>
          <p className="text-xs text-[var(--color-muted)]">Your resume is well optimized</p>
        </div>
      </InnerCard>

      <div>
        <Label>Keyword Matches</Label>
        <div className="space-y-2.5">
          {ATS_KEYWORDS.map(({ label, score, matched }) => (
            <div key={label} className="flex items-center gap-2">
              {matched
                ? <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" aria-hidden="true" />
                : <AlertCircle className="h-3.5 w-3.5 shrink-0 text-amber-500" aria-hidden="true" />}
              <ScoreBar label={label} value={score} barColor={matched ? 'bg-emerald-500' : 'bg-amber-500'} />
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label>Suggestions</Label>
        <div className="space-y-1.5">
          {ATS_TIPS.map(({ text, ok }) => (
            <div key={text} className="flex items-center gap-2 text-xs">
              {ok
                ? <CheckCircle2 className="h-3 w-3 shrink-0 text-emerald-500" aria-hidden="true" />
                : <AlertCircle className="h-3 w-3 shrink-0 text-amber-500" aria-hidden="true" />}
              <span className="text-[var(--color-muted)]">{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── 3. Resume vs JD ─────────────────────────────────────────────── */

const COMPARISON = [
  { keyword: 'React.js', resume: true, jd: true },
  { keyword: 'Node.js', resume: true, jd: true },
  { keyword: 'Docker', resume: false, jd: true },
  { keyword: 'SQL Databases', resume: true, jd: true },
  { keyword: 'CI/CD Pipelines', resume: false, jd: true },
]

function ResumeVsJDPreview() {
  const matched = COMPARISON.filter((c) => c.resume && c.jd).length
  const pct = Math.round((matched / COMPARISON.length) * 100)

  return (
    <div className="space-y-4">
      <InnerCard className="space-y-3">
        <div className="grid grid-cols-3 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">
          <span>Keyword</span>
          <span className="text-center">Resume</span>
          <span className="text-center">Job Desc.</span>
        </div>
        {COMPARISON.map(({ keyword, resume, jd }) => (
          <div key={keyword} className="grid grid-cols-3 items-center text-xs">
            <span className="font-medium text-[var(--color-text)]">{keyword}</span>
            <span className="text-center">
              {resume
                ? <CheckCircle2 className="mx-auto h-3.5 w-3.5 text-emerald-500" />
                : <AlertCircle className="mx-auto h-3.5 w-3.5 text-red-400" />}
            </span>
            <span className="text-center">
              {jd ? <CheckCircle2 className="mx-auto h-3.5 w-3.5 text-emerald-500" /> : null}
            </span>
          </div>
        ))}
      </InnerCard>
      <ScoreBar label="Match" value={pct} barColor={pct >= 70 ? 'bg-emerald-500' : 'bg-amber-500'} />
    </div>
  )
}

/* ── 4. Skill Gap Analysis ───────────────────────────────────────── */

const SKILLS = [
  { name: 'React.js', level: 90, gap: false },
  { name: 'TypeScript', level: 55, gap: true },
  { name: 'System Design', level: 32, gap: true },
  { name: 'Leadership', level: 78, gap: false },
]

function SkillGapPreview() {
  return (
    <div className="space-y-4">
      <p className="text-xs text-[var(--color-muted)]">
        Target → <span className="font-semibold text-[var(--color-text)]">Senior Frontend Engineer</span>
      </p>

      <div className="space-y-2.5">
        {SKILLS.map(({ name, level, gap }) => (
          <div key={name} className="flex items-center gap-2">
            {gap
              ? <AlertCircle className="h-3.5 w-3.5 shrink-0 text-amber-500" aria-hidden="true" />
              : <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" aria-hidden="true" />}
            <ScoreBar label={name} value={level} barColor={gap ? 'bg-amber-500' : 'bg-emerald-500'} />
          </div>
        ))}
      </div>

      <div>
        <Label>Recommended</Label>
        <div className="space-y-2">
          {[['TypeScript Deep Dive', '4 weeks'], ['System Design Fundamentals', '6 weeks']].map(([title, dur]) => (
            <div key={title} className="flex items-center gap-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-card)] px-3 py-2">
              <BookOpen className="h-3.5 w-3.5 shrink-0 text-[var(--color-primary)]" aria-hidden="true" />
              <span className="flex-1 text-xs font-medium text-[var(--color-text)]">{title}</span>
              <span className="text-[10px] text-[var(--color-muted)]">{dur}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── 5. Career Roadmap ───────────────────────────────────────────── */

const MILESTONES = [
  { label: 'Junior Developer', done: true, current: false },
  { label: 'Mid-Level Engineer', done: true, current: true },
  { label: 'Senior Engineer', done: false, current: false, eta: '~5 months' },
  { label: 'Tech Lead', done: false, current: false },
]

function CareerRoadmapPreview() {
  return (
    <div className="space-y-5">
      <div className="space-y-0">
        {MILESTONES.map(({ label, done, current, eta }, i) => (
          <div key={label} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2',
                  current ? 'border-[var(--color-primary)] bg-[var(--color-primary)]'
                    : done ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/20'
                      : 'border-[var(--color-surface-3)] bg-[var(--color-surface)]',
                )}
              >
                {current && <span className="h-2 w-2 rounded-full bg-white" />}
                {done && !current && <CheckCircle2 className="h-3.5 w-3.5 text-[var(--color-primary)]" />}
              </div>
              {i < MILESTONES.length - 1 && (
                <div className={cn('my-1 h-6 w-px', done ? 'bg-[var(--color-primary)]/40' : 'bg-[var(--color-surface-3)]')} />
              )}
            </div>
            <div className="pt-0.5">
              <p className={cn('text-sm font-medium', current ? 'text-[var(--color-primary)]' : 'text-[var(--color-text)]')}>
                {label}
              </p>
              {eta && <p className="text-[10px] text-[var(--color-muted)]">{eta}</p>}
            </div>
          </div>
        ))}
      </div>
      <ScoreBar label="Progress" value={62} />
    </div>
  )
}

/* ── 6. AI Career Coach ──────────────────────────────────────────── */

function AICoachPreview() {
  return (
    <div className="flex h-full flex-col space-y-3">
      {/* User bubble */}
      <div className="ml-auto max-w-56 rounded-2xl rounded-br-md bg-[var(--color-primary)] px-3.5 py-2.5">
        <p className="text-xs text-white">How can I improve my ATS score?</p>
      </div>

      {/* AI response */}
      <InnerCard className="max-w-64 space-y-2">
        <p className="text-xs font-medium text-[var(--color-text)]">Here are 3 key improvements:</p>
        <ol className="space-y-1 text-xs text-[var(--color-muted)]">
          <li className="flex gap-2"><span className="font-semibold text-[var(--color-primary)]">1.</span> Add industry-specific keywords</li>
          <li className="flex gap-2"><span className="font-semibold text-[var(--color-primary)]">2.</span> Quantify your achievements</li>
          <li className="flex gap-2"><span className="font-semibold text-[var(--color-primary)]">3.</span> Update your skills section</li>
        </ol>
      </InnerCard>

      {/* User follow-up */}
      <div className="ml-auto max-w-48 rounded-2xl rounded-br-md bg-[var(--color-primary)] px-3.5 py-2.5">
        <p className="text-xs text-white">Can you help me rewrite my summary?</p>
      </div>

      {/* Input field */}
      <div className="mt-auto flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] px-3 py-2.5">
        <span className="flex-1 text-xs text-[var(--color-muted)]">Ask your AI coach...</span>
        <Send className="h-3.5 w-3.5 text-[var(--color-primary)]" aria-hidden="true" />
      </div>
    </div>
  )
}

/* ── Preview router ──────────────────────────────────────────────── */

const PREVIEW_MAP = {
  'resume-builder': ResumeBuilderPreview,
  'ats-analyzer': ATSAnalyzerPreview,
  'resume-vs-jd': ResumeVsJDPreview,
  'skill-gap': SkillGapPreview,
  'career-roadmap': CareerRoadmapPreview,
  'ai-coach': AICoachPreview,
}

export const DashboardPreview = memo(function DashboardPreview({ featureId }) {
  const Preview = PREVIEW_MAP[featureId]
  return Preview ? <Preview /> : null
})

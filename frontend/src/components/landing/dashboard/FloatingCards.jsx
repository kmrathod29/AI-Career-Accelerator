import { memo } from 'react'
import { motion } from 'framer-motion'
import {
  Target,
  FileText,
  Mic,
  TrendingUp,
  Brain,
  BarChart2,
  CheckCircle2,
} from 'lucide-react'
import { cn } from '@utils/classNames.js'

/* ── Shared card base ────────────────────────────────────────────── */
const BASE =
  'absolute rounded-[18px] border border-slate-100/90 bg-white/96 p-3 ' +
  'shadow-[0_8px_32px_rgba(0,0,0,0.09),0_2px_8px_rgba(0,0,0,0.04)] ' +
  'backdrop-blur-sm'

const ENTER = {
  hidden:  { opacity: 0, y: 16, scale: 0.94 },
  visible: { opacity: 1, y: 0,  scale: 1    },
}

/* ── Generic metric card ─────────────────────────────────────────── */
function MetricCard({
  icon: Icon,
  iconBg,
  iconColor,
  title,
  value,
  sub,
  className,
  delay = 0,
  floatCls = 'animate-float-1',
}) {
  return (
    <motion.div
      variants={ENTER}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.42, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -4, transition: { duration: 0.15 } }}
      className={cn(BASE, floatCls, className)}
    >
      {/* Icon + title row */}
      <div className="mb-1.5 flex items-center gap-1.5">
        <div className={cn('flex h-5 w-5 shrink-0 items-center justify-center rounded-md', iconBg)}>
          <Icon className={cn('h-3 w-3', iconColor)} aria-hidden="true" />
        </div>
        <span className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">
          {title}
        </span>
      </div>

      {/* Large value */}
      <p className="text-[19px] font-bold leading-none tracking-tight text-slate-900">
        {value}
      </p>

      {/* Sub-label */}
      {sub && (
        <p className="mt-1 text-[9px] font-medium text-slate-400">{sub}</p>
      )}
    </motion.div>
  )
}

/* ── Skill Gap card (has mini bars) ─────────────────────────────── */
const SKILLS = [
  { name: 'JavaScript', pct: 72, gain: '+12%' },
  { name: 'React',      pct: 80, gain: '+20%' },
  { name: 'Comms',      pct: 65, gain: '+8%'  },
]

function SkillGapCard({ className, delay = 0 }) {
  return (
    <motion.div
      variants={ENTER}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.42, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -4, transition: { duration: 0.15 } }}
      className={cn(BASE, 'animate-float-2', className)}
    >
      {/* Header */}
      <div className="mb-2 flex items-center gap-1.5">
        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-violet-50">
          <TrendingUp className="h-3 w-3 text-violet-500" aria-hidden="true" />
        </div>
        <span className="text-[9px] font-semibold uppercase tracking-wide text-slate-400">
          Skill Gap
        </span>
      </div>

      {/* Progress bars */}
      <div className="space-y-1.5">
        {SKILLS.map(({ name, pct, gain }, i) => (
          <div key={name}>
            <div className="mb-0.5 flex items-center justify-between">
              <span className="text-[9px] font-medium text-slate-600">{name}</span>
              <span className="text-[9px] font-semibold text-emerald-600">{gain}</span>
            </div>
            <div className="h-1 w-full overflow-hidden rounded-full bg-slate-100">
              <motion.div
                className="h-full rounded-full bg-blue-500"
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{
                  duration: 0.7,
                  delay: delay + 0.18 * i,
                  ease: 'easeOut',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

/* ── All floating cards ──────────────────────────────────────────── */
export const FloatingCards = memo(function FloatingCards() {
  return (
    <>
      {/* 1 – ATS Score: top-right, overlapping dashboard top-right corner */}
      <MetricCard
        icon={Target}
        iconBg="bg-emerald-50" iconColor="text-emerald-500"
        title="ATS Score"  value="94%"  sub="↑ 6% this week"
        delay={0.30}  floatCls="animate-float-1"
        className="right-0 top-0 z-30 w-[118px]"
      />

      {/* 2 – Resume Score: top-left, overlapping dashboard left edge */}
      <MetricCard
        icon={FileText}
        iconBg="bg-blue-50" iconColor="text-blue-500"
        title="Resume Score"  value="91%"  sub="ATS optimised"
        delay={0.45}  floatCls="animate-float-3"
        className="left-0 top-[55px] z-[25] w-[126px]"
      />

      {/* 3 – Interview Score: right side, vertically centred */}
      <MetricCard
        icon={Mic}
        iconBg="bg-amber-50" iconColor="text-amber-500"
        title="Interview"  value="89%"  sub="Top 15%"
        delay={0.60}  floatCls="animate-float-2"
        className="right-0 top-[38%] z-[25] w-[120px] -translate-y-1/2"
      />

      {/* 4 – Skill Gap: left side, lower */}
      <SkillGapCard
        delay={0.75}
        className="bottom-[88px] left-0 z-[25] w-[148px]"
      />

      {/* 5 – Placement Probability: bottom-right */}
      <MetricCard
        icon={BarChart2}
        iconBg="bg-indigo-50" iconColor="text-indigo-500"
        title="Placement Prob."  value="82%"  sub="Based on profile"
        delay={0.90}  floatCls="animate-float-1"
        className="bottom-[28px] right-0 z-[25] w-[134px]"
      />

      {/* 6 – AI Coach: upper area, partially above dashboard */}
      <MetricCard
        icon={Brain}
        iconBg="bg-rose-50" iconColor="text-rose-500"
        title="AI Coach"  value="Resume ✓"  sub="Improved +12 pts"
        delay={1.05}  floatCls="animate-float-3"
        className="left-[96px] top-0 z-30 w-[140px]"
      />

      {/* 7 – Today's Goal: bottom-left */}
      <MetricCard
        icon={CheckCircle2}
        iconBg="bg-teal-50" iconColor="text-teal-500"
        title="Today's Goal"  value="Interview #4"  sub="Complete in 2h"
        delay={1.20}  floatCls="animate-float-2"
        className="bottom-[14px] left-[14px] z-[25] w-[140px]"
      />
    </>
  )
})

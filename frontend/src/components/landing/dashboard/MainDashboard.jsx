import { memo } from 'react'
import { motion } from 'framer-motion'
import { Bell } from 'lucide-react'
import { CircularProgress } from './CircularProgress.jsx'
import { ActivityGraph } from './ActivityGraph.jsx'

/* ── Data ───────────────────────────────────────────────────────── */
const STATS = [
  { label: 'Resume',    value: 87, color: '#2563EB' },
  { label: 'ATS Score', value: 94, color: '#10B981' },
  { label: 'Interview', value: 76, color: '#F59E0B' },
  { label: 'Roadmap',   value: 60, color: '#8B5CF6' },
]

const RECENT = [
  { text: 'ATS score improved to 94%',  time: '2h ago',  dot: '#2563EB'  },
  { text: 'Resume updated successfully', time: '1d ago',  dot: '#10B981' },
  { text: 'Completed Interview Prep #3', time: '2d ago',  dot: '#F59E0B' },
]

/* ── Component ──────────────────────────────────────────────────── */
export const MainDashboard = memo(function MainDashboard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="h-full overflow-auto rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-[0_20px_70px_rgba(0,0,0,0.11),0_4px_16px_rgba(0,0,0,0.05)]"
    >
      {/* ── Header ──────────────────────────────────────── */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-white"
            style={{ background: 'linear-gradient(135deg,#3B82F6 0%,#1D4ED8 100%)' }}
            aria-hidden="true"
          >
            AJ
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">
              Welcome back, Alex 👋
            </p>
            <p className="text-[10px] text-slate-400">
              Senior Job Seeker · 38-day streak 🔥
            </p>
          </div>
        </div>

        {/* Notification bell */}
        <button
          className="flex h-8 w-8 shrink-0 cursor-default items-center justify-center rounded-full border border-slate-100 bg-slate-50 transition-colors hover:bg-slate-100"
          aria-label="Notifications"
          tabIndex={-1}
        >
          <Bell className="h-[14px] w-[14px] text-slate-400" aria-hidden="true" />
        </button>
      </div>

      {/* ── Circular progress stats ──────────────────────── */}
      <div className="mb-5 grid grid-cols-4 gap-1 rounded-2xl bg-slate-50/70 px-2 py-4">
        {STATS.map((s) => (
          <CircularProgress
            key={s.label}
            value={s.value}
            color={s.color}
            size={50}
            strokeWidth={4.5}
            label={s.label}
          />
        ))}
      </div>

      {/* ── Activity graph ───────────────────────────────── */}
      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[9px] font-semibold uppercase tracking-widest text-slate-400">
            Activity · Last 30 days
          </p>
          <span className="text-[9px] font-medium text-slate-400">38 actions</span>
        </div>
        <div className="overflow-hidden rounded-xl bg-slate-50/50 px-2 py-2">
          <ActivityGraph />
        </div>
      </div>

      {/* ── Recent activity ──────────────────────────────── */}
      <div>
        <p className="mb-2.5 text-[9px] font-semibold uppercase tracking-widest text-slate-400">
          Recent Activity
        </p>
        <ul className="space-y-2.5" aria-label="Recent activity items">
          {RECENT.map(({ text, time, dot }) => (
            <li key={text} className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: dot }}
                  aria-hidden="true"
                />
                <span className="truncate text-xs text-slate-600">{text}</span>
              </div>
              <span className="shrink-0 text-[10px] text-slate-400">{time}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  )
})

import { motion } from 'framer-motion'
import {
	FileText, ScanSearch, Mic, BrainCircuit, Map, Bot,
	TrendingUp, Target, Award, BarChart3,
	ArrowRight, Clock, CheckCircle2, Sparkles,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { APP_ROUTES } from '@constants/routes.js'

const fadeUp = {
	initial: { opacity: 0, y: 16 },
	animate: { opacity: 1, y: 0 },
}

/** Placeholder stats data */
const STATS = [
	{ label: 'Total Resumes', value: '3', change: '+1 this week', icon: FileText, color: 'from-blue-500 to-blue-600' },
	{ label: 'Avg. ATS Score', value: '87%', change: '+5% improvement', icon: Target, color: 'from-emerald-500 to-emerald-600' },
	{ label: 'Mock Interviews', value: '12', change: '2 scheduled', icon: Mic, color: 'from-violet-500 to-violet-600' },
	{ label: 'Career Progress', value: '64%', change: 'On track', icon: TrendingUp, color: 'from-amber-500 to-amber-600' },
]

/** Placeholder recent activity */
const RECENT_ACTIVITY = [
	{ text: 'Resume "Full Stack Developer" updated', time: '2 hours ago', icon: FileText, status: 'completed' },
	{ text: 'ATS analysis completed — Score: 92/100', time: '5 hours ago', icon: ScanSearch, status: 'completed' },
	{ text: 'Mock interview scheduled for tomorrow', time: 'Yesterday', icon: Mic, status: 'pending' },
	{ text: 'Skill gap analysis — React mastery achieved', time: '2 days ago', icon: Award, status: 'completed' },
	{ text: 'Career roadmap milestone reached', time: '3 days ago', icon: CheckCircle2, status: 'completed' },
]

/** Quick action buttons */
const QUICK_ACTIONS = [
	{ label: 'Build Resume', icon: FileText, path: APP_ROUTES.RESUME_BUILDER, color: 'text-blue-500' },
	{ label: 'Analyze ATS', icon: ScanSearch, path: APP_ROUTES.ATS_ANALYZER, color: 'text-emerald-500' },
	{ label: 'Mock Interview', icon: Mic, path: APP_ROUTES.MOCK_INTERVIEW, color: 'text-violet-500' },
	{ label: 'AI Coach', icon: Bot, path: APP_ROUTES.AI_COACH, color: 'text-amber-500' },
	{ label: 'Skill Gap', icon: BrainCircuit, path: APP_ROUTES.SKILL_GAP, color: 'text-pink-500' },
	{ label: 'Roadmap', icon: Map, path: APP_ROUTES.CAREER_ROADMAP, color: 'text-cyan-500' },
]

/** Placeholder learning progress */
const LEARNING_PROGRESS = [
	{ skill: 'React & Next.js', progress: 85, level: 'Advanced' },
	{ skill: 'System Design', progress: 62, level: 'Intermediate' },
	{ skill: 'Data Structures', progress: 78, level: 'Advanced' },
	{ skill: 'Behavioral Interview', progress: 45, level: 'Beginner' },
]

function getGreeting() {
	const h = new Date().getHours()
	if (h < 12) return 'Good morning'
	if (h < 17) return 'Good afternoon'
	return 'Good evening'
}

export function DashboardPage() {
	const today = new Date().toLocaleDateString('en-US', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	})

	return (
		<motion.div
			initial="initial"
			animate="animate"
			transition={{ staggerChildren: 0.06 }}
			className="space-y-6"
		>
			{/* ── Welcome Header ── */}
			<motion.div variants={fadeUp} transition={{ duration: 0.4 }}>
				<div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<h2 className="text-xl font-semibold tracking-tight text-[var(--color-text)] sm:text-2xl">
							{getGreeting()}, Krunal 👋
						</h2>
						<p className="mt-0.5 text-sm text-[var(--color-muted)]">
							Here&apos;s what&apos;s happening with your career journey.
						</p>
					</div>
					<p className="text-[12px] text-[var(--color-muted)]">{today}</p>
				</div>
			</motion.div>

			{/* ── Stats Cards ── */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
				{STATS.map((stat) => (
					<motion.div
						key={stat.label}
						variants={fadeUp}
						transition={{ duration: 0.4 }}
						className="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition-all duration-300 hover:shadow-[var(--shadow-card)]"
					>
						<div className="mb-4 flex items-center justify-between">
							<div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} shadow-sm`}>
								<stat.icon className="h-5 w-5 text-white" strokeWidth={2} />
							</div>
							<BarChart3 className="h-4 w-4 text-[var(--color-muted)] opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
						</div>
						<p className="text-2xl font-bold tracking-tight text-[var(--color-text)]">{stat.value}</p>
						<p className="mt-0.5 text-[13px] text-[var(--color-muted)]">{stat.label}</p>
						<p className="mt-2 text-[11px] font-medium text-[var(--color-primary)]">{stat.change}</p>
					</motion.div>
				))}
			</div>

			{/* ── Bottom Grid: Activity + Quick Actions + Progress ── */}
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
				{/* Recent Activity */}
				<motion.div
					variants={fadeUp}
					transition={{ duration: 0.4 }}
					className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 lg:col-span-2"
				>
					<div className="mb-4 flex items-center justify-between">
						<h3 className="text-sm font-semibold text-[var(--color-text)]">Recent Activity</h3>
						<button className="text-[12px] font-medium text-[var(--color-primary)] transition-colors hover:text-[var(--color-secondary)]">
							View all
						</button>
					</div>

					<div className="space-y-1">
						{RECENT_ACTIVITY.map((item, i) => (
							<div
								key={i}
								className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors duration-150 hover:bg-[var(--color-surface-2)]"
							>
								<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--color-surface-2)]">
									<item.icon className="h-4 w-4 text-[var(--color-muted)]" strokeWidth={1.8} />
								</div>
								<div className="min-w-0 flex-1">
									<p className="truncate text-[13px] text-[var(--color-text)]">{item.text}</p>
								</div>
								<div className="flex shrink-0 items-center gap-2">
									{item.status === 'completed' ? (
										<CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
									) : (
										<Clock className="h-3.5 w-3.5 text-amber-500" />
									)}
									<span className="text-[11px] text-[var(--color-muted)]">{item.time}</span>
								</div>
							</div>
						))}
					</div>
				</motion.div>

				{/* Quick Actions */}
				<motion.div
					variants={fadeUp}
					transition={{ duration: 0.4 }}
					className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
				>
					<div className="mb-4 flex items-center gap-2">
						<Sparkles className="h-4 w-4 text-[var(--color-primary)]" />
						<h3 className="text-sm font-semibold text-[var(--color-text)]">Quick Actions</h3>
					</div>

					<div className="grid grid-cols-2 gap-2">
						{QUICK_ACTIONS.map((action) => (
							<Link
								key={action.label}
								to={action.path}
								className="group flex flex-col items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3.5 transition-all duration-200 hover:border-[var(--color-primary)]/20 hover:shadow-sm"
							>
								<action.icon className={`h-5 w-5 ${action.color} transition-transform duration-200 group-hover:scale-110`} strokeWidth={1.8} />
								<span className="text-[11px] font-medium text-[var(--color-text)]">{action.label}</span>
							</Link>
						))}
					</div>
				</motion.div>
			</div>

			{/* ── Learning Progress ── */}
			<motion.div
				variants={fadeUp}
				transition={{ duration: 0.4 }}
				className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
			>
				<div className="mb-4 flex items-center justify-between">
					<h3 className="text-sm font-semibold text-[var(--color-text)]">Learning Progress</h3>
					<button className="inline-flex items-center gap-1 text-[12px] font-medium text-[var(--color-primary)] transition-colors hover:text-[var(--color-secondary)]">
						View details
						<ArrowRight className="h-3 w-3" />
					</button>
				</div>

				<div className="space-y-4">
					{LEARNING_PROGRESS.map((item) => (
						<div key={item.skill}>
							<div className="mb-1.5 flex items-center justify-between">
								<span className="text-[13px] font-medium text-[var(--color-text)]">{item.skill}</span>
								<div className="flex items-center gap-2">
									<span className="rounded-full bg-[var(--color-surface-2)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-muted)]">
										{item.level}
									</span>
									<span className="text-[12px] font-semibold text-[var(--color-text)]">{item.progress}%</span>
								</div>
							</div>
							<div className="h-1.5 overflow-hidden rounded-full bg-[var(--progress-track)]">
								<motion.div
									initial={{ width: 0 }}
									animate={{ width: `${item.progress}%` }}
									transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
									className="h-full rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]"
								/>
							</div>
						</div>
					))}
				</div>
			</motion.div>
		</motion.div>
	)
}
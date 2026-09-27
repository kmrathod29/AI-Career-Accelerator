import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { formatDate } from '@utils/dateTime.js'
import {
	ScanSearch, Bot, BrainCircuit, Map,
	TrendingUp, Target,
	ArrowRight, Clock, CheckCircle2, Sparkles,
	BarChart3, Loader2,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { APP_ROUTES } from '@constants/routes.js'
import { useAuth } from '@providers/useAuth.js'
import { RESUME_BUILDER_ENABLED } from '@/config/features.js'
import { dashboardApi } from '@/services/dashboardApi.js'

const fadeUp = {
	initial: { opacity: 0, y: 16 },
	animate: { opacity: 1, y: 0 },
}

/** Quick action buttons */
const ALL_QUICK_ACTIONS = [
	{ label: 'Analyze ATS', icon: ScanSearch, path: APP_ROUTES.ATS_ANALYZER, color: 'text-emerald-500' },
	{ label: 'AI Coach', icon: Bot, path: APP_ROUTES.AI_COACH, color: 'text-amber-500' },
	{ label: 'Skill Gap', icon: BrainCircuit, path: APP_ROUTES.SKILL_GAP, color: 'text-pink-500' },
	{ label: 'Roadmap', icon: Map, path: APP_ROUTES.CAREER_ROADMAP, color: 'text-cyan-500' },
]

const QUICK_ACTIONS = RESUME_BUILDER_ENABLED
	? ALL_QUICK_ACTIONS
	: ALL_QUICK_ACTIONS.filter((action) => action.path !== APP_ROUTES.RESUME_BUILDER)

function getGreeting() {
	const h = new Date().getHours()
	if (h < 12) return 'Good morning'
	if (h < 17) return 'Good afternoon'
	return 'Good evening'
}

function getRelativeTime(dateStr) {
	if (!dateStr) return ''
	const now = new Date()
	const date = new Date(dateStr)
	const diffMs = now - date
	const diffMins = Math.floor(diffMs / 60000)
	const diffHours = Math.floor(diffMs / 3600000)
	const diffDays = Math.floor(diffMs / 86400000)

	if (diffMins < 1) return 'Just now'
	if (diffMins < 60) return `${diffMins} min ago`
	if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
	if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
	return formatDate(date, { month: 'short', day: 'numeric' })
}

export function DashboardPage() {
	const { user } = useAuth()
	const today = formatDate(new Date(), { weekday: 'long', month: 'long' })

	const [dashboardData, setDashboardData] = useState(null)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState(null)

	const fetchDashboard = useCallback(async () => {
		try {
			setIsLoading(true)
			setError(null)
			const result = await dashboardApi.getDashboard()
			if (result?.data) {
				setDashboardData(result.data)
			}
		} catch (err) {
			console.error('Dashboard fetch error:', err)
			setError(err.response?.data?.message || 'Failed to load dashboard data')
		} finally {
			setIsLoading(false)
		}
	}, [])

	useEffect(() => {
		fetchDashboard()
	}, [fetchDashboard])

	/* ── Derive display values from real data ── */
	const stats = dashboardData?.stats
	const recentActivity = dashboardData?.recentActivity ?? []
	const profileCompletion = dashboardData?.user?.profileCompletion ?? null

	const STATS = [
		{
			label: 'ATS Analyses',
			value: stats?.atsAnalyses != null ? String(stats.atsAnalyses) : '—',
			change: stats?.latestAtsScore != null
				? `Latest: ${stats.latestAtsScore}/100`
				: 'No analyses yet',
			icon: ScanSearch,
			color: 'from-emerald-500 to-emerald-600',
		},
		{
			label: 'Avg. ATS Score',
			value: stats?.avgAtsScore != null ? `${stats.avgAtsScore}%` : '—',
			change: stats?.avgAtsScore != null
				? stats.avgAtsScore >= 80 ? 'Excellent' : stats.avgAtsScore >= 60 ? 'Good progress' : 'Room to improve'
				: 'Run an analysis to see your score',
			icon: Target,
			color: 'from-blue-500 to-blue-600',
		},
		{
			label: 'Profile Completion',
			value: profileCompletion != null ? `${profileCompletion}%` : '—',
			change: profileCompletion != null
				? profileCompletion >= 80 ? 'Well done!' : 'Complete your profile'
				: '',
			icon: TrendingUp,
			color: 'from-amber-500 to-amber-600',
		},
	]

	/* ── Loading skeleton ── */
	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-20">
				<div className="flex flex-col items-center gap-3">
					<Loader2 className="h-8 w-8 animate-spin text-[var(--color-primary)]" />
					<p className="text-sm text-[var(--color-muted)]">Loading dashboard...</p>
				</div>
			</div>
		)
	}

	/* ── Error state ── */
	if (error) {
		return (
			<div className="flex items-center justify-center py-20">
				<div className="flex flex-col items-center gap-3 text-center">
					<p className="text-sm text-red-500">{error}</p>
					<button
						onClick={fetchDashboard}
						className="text-sm font-medium text-[var(--color-primary)] hover:underline"
					>
						Try again
					</button>
				</div>
			</div>
		)
	}

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
						<p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--color-primary)]">
							OVERVIEW
						</p>
						<h2 className="text-[32px] font-black tracking-[-0.05em] leading-[1.05] text-[var(--color-text)]">
							{getGreeting()}, {user?.firstName || 'there'} 👋
						</h2>
						<p className="mt-1 text-base leading-[1.6] text-[var(--color-muted)]">
							Here&apos;s what&apos;s happening with your career journey.
						</p>
					</div>
					<p className="text-[12px] text-[var(--color-muted)]">{today}</p>
				</div>
			</motion.div>

			{/* ── Stats Cards ── */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
						<p className="text-2xl font-black tracking-[-0.06em] text-[var(--color-text)]">{stat.value}</p>
						<p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">{stat.label}</p>
						<p className="mt-2 text-[11px] font-medium text-[var(--color-primary)]">{stat.change}</p>
					</motion.div>
				))}
			</div>

			{/* ── Bottom Grid: Activity + Quick Actions ── */}
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
				{/* Recent Activity */}
				<motion.div
					variants={fadeUp}
					transition={{ duration: 0.4 }}
					className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 lg:col-span-2"
				>
					<div className="mb-4 flex items-center justify-between">
						<h3 className="text-base font-bold tracking-[-0.02em] text-[var(--color-text)]">Recent Activity</h3>
						{recentActivity.length > 0 && (
							<Link
								to={APP_ROUTES.ATS_ANALYZER}
								className="text-[12px] font-medium text-[var(--color-primary)] transition-colors hover:text-[var(--color-secondary)]"
							>
								View all
							</Link>
						)}
					</div>

					{recentActivity.length > 0 ? (
						<div className="space-y-1">
							{recentActivity.map((item, i) => (
								<div
									key={`activity-${i}`}
									className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors duration-150 hover:bg-[var(--color-surface-2)]"
								>
									<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--color-surface-2)]">
										<ScanSearch className="h-4 w-4 text-[var(--color-muted)]" strokeWidth={1.8} />
									</div>
									<div className="min-w-0 flex-1">
										<p className="truncate text-sm text-[var(--color-text)]">{item.text}</p>
										{item.detail && (
											<p className="truncate text-[11px] text-[var(--color-muted)]">{item.detail}</p>
										)}
									</div>
									<div className="flex shrink-0 items-center gap-2">
										{item.status === 'completed' ? (
											<CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
										) : (
											<Clock className="h-3.5 w-3.5 text-amber-500" />
										)}
										<span className="text-[11px] text-[var(--color-muted)]">
											{getRelativeTime(item.time)}
										</span>
									</div>
								</div>
							))}
						</div>
					) : (
						<div className="flex flex-col items-center justify-center py-8 text-center">
							<Clock className="mb-3 h-8 w-8 text-[var(--color-muted)] opacity-40" />
							<p className="text-sm font-medium text-[var(--color-muted)]">No recent activity yet</p>
							<p className="mt-1 text-xs text-[var(--color-muted)] opacity-70">
								Run your first ATS analysis to see activity here.
							</p>
							<Link
								to={APP_ROUTES.ATS_ANALYZER}
								className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-primary)] px-4 py-2 text-xs font-medium text-white transition-opacity hover:opacity-90"
							>
								<ScanSearch className="h-3.5 w-3.5" />
								Analyze Resume
							</Link>
						</div>
					)}
				</motion.div>

				{/* Quick Actions */}
				<motion.div
					variants={fadeUp}
					transition={{ duration: 0.4 }}
					className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
				>
					<div className="mb-4 flex items-center gap-2">
						<Sparkles className="h-4 w-4 text-[var(--color-primary)]" />
						<h3 className="text-base font-bold tracking-[-0.02em] text-[var(--color-text)]">Quick Actions</h3>
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

			{/* ── ATS Analysis Summary (only shown if analyses exist) ── */}
			{stats?.atsAnalyses > 0 && dashboardData?.recentAnalyses?.length > 0 && (
				<motion.div
					variants={fadeUp}
					transition={{ duration: 0.4 }}
					className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
				>
					<div className="mb-4 flex items-center justify-between">
						<h3 className="text-base font-bold tracking-[-0.02em] text-[var(--color-text)]">Recent ATS Analyses</h3>
						<Link
							to={APP_ROUTES.ATS_ANALYZER}
							className="inline-flex items-center gap-1 text-[12px] font-medium text-[var(--color-primary)] transition-colors hover:text-[var(--color-secondary)]"
						>
							View details
							<ArrowRight className="h-3 w-3" />
						</Link>
					</div>

					<div className="space-y-2">
						{dashboardData.recentAnalyses.map((analysis) => (
							<div
								key={analysis.id}
								className="flex items-center justify-between rounded-xl px-3 py-2.5 transition-colors duration-150 hover:bg-[var(--color-surface-2)]"
							>
								<div className="min-w-0 flex-1">
									<p className="truncate text-sm font-medium text-[var(--color-text)]">
										{analysis.fileName}
									</p>
									<p className="text-[11px] text-[var(--color-muted)]">{analysis.date}</p>
								</div>
								<div className="flex items-center gap-2">
									<span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
										analysis.score >= 80
											? 'bg-emerald-500/10 text-emerald-500'
											: analysis.score >= 60
												? 'bg-amber-500/10 text-amber-500'
												: 'bg-red-500/10 text-red-500'
									}`}>
										{analysis.score}/100
									</span>
								</div>
							</div>
						))}
					</div>
				</motion.div>
			)}
		</motion.div>
	)
}
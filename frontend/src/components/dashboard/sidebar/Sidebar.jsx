import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
	LayoutDashboard, FileText, ScanSearch, GitCompareArrows,
	Mic, BrainCircuit, Map, Bot, Bell, UserCircle, Settings,
	PanelLeftClose, PanelLeftOpen,
} from 'lucide-react'
import { SIDEBAR_NAV } from '@constants/dashboardNav.js'
import { APP_ROUTES } from '@constants/routes.js'
import { cn } from '@utils/classNames.js'
import logoSrc from '@assets/logo/AI-Career-Accelerator-only-logo.png'
import { SidebarItem } from './SidebarItem.jsx'
import { UpgradeCard } from './UpgradeCard.jsx'

/** Map icon name strings → Lucide components */
const ICON_MAP = {
	LayoutDashboard, FileText, ScanSearch, GitCompareArrows,
	Mic, BrainCircuit, Map, Bot, Bell, UserCircle, Settings,
}

const STORAGE_KEY = 'aca-sidebar-collapsed'

/**
 * Sidebar — persistent desktop/tablet sidebar.
 * Expanded: 240px | Collapsed: 72px
 * Collapse state persisted to localStorage.
 */
export function Sidebar() {
	const [isCollapsed, setIsCollapsed] = useState(() => {
		try {
			return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? false
		} catch {
			return false
		}
	})

	const toggle = useCallback(() => {
		setIsCollapsed((prev) => {
			const next = !prev
			localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
			return next
		})
	}, [])

	/* Auto-collapse on tablet */
	useEffect(() => {
		const mql = window.matchMedia('(min-width: 768px) and (max-width: 1023px)')
		const handler = (e) => {
			if (e.matches) {
				setIsCollapsed(true)
				localStorage.setItem(STORAGE_KEY, JSON.stringify(true))
			}
		}
		if (mql.matches) handler(mql)
		mql.addEventListener('change', handler)
		return () => mql.removeEventListener('change', handler)
	}, [])

	return (
		<motion.aside
			animate={{ width: isCollapsed ? 72 : 240 }}
			transition={{ type: 'spring', stiffness: 300, damping: 30 }}
			className={cn(
				'fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)] md:flex',
			)}
		>
			{/* ── Logo ── */}
			<div className={cn(
				'flex h-16 shrink-0 items-center border-b border-[var(--color-border)] px-4',
				isCollapsed && 'justify-center px-0',
			)}>
				<Link
					to={APP_ROUTES.HOME}
					className="inline-flex items-center gap-2.5 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
					aria-label="AI Career Accelerator — go to home"
				>
					<img
						src={logoSrc}
						alt=""
						aria-hidden="true"
						draggable={false}
						className="h-8 w-8 shrink-0 object-contain"
					/>
					{!isCollapsed && (
						<motion.span
							initial={{ opacity: 0, x: -4 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.2 }}
							className="text-[14px] font-semibold tracking-tight text-[var(--color-text)]"
						>
							AI Career Accelerator
						</motion.span>
					)}
				</Link>
			</div>

			{/* ── Navigation ── */}
			<nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 sidebar-scrollbar">
				{SIDEBAR_NAV.map((section) => (
					<div key={section.section} className="mb-5">
						{/* Section label */}
						{!isCollapsed && (
							<motion.p
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-muted)]"
							>
								{section.section}
							</motion.p>
						)}

						{isCollapsed && (
							<div className="mx-auto mb-2 h-px w-6 bg-[var(--color-border)]" />
						)}

						<div className="space-y-0.5">
							{section.items.map((item) => (
								<SidebarItem
									key={item.path}
									label={item.label}
									path={item.path}
									icon={ICON_MAP[item.icon]}
									isCollapsed={isCollapsed}
								/>
							))}
						</div>
					</div>
				))}
			</nav>

			{/* ── Upgrade Card (expanded only) ── */}
			{!isCollapsed && <UpgradeCard />}

			{/* ── Collapse Toggle ── */}
			<div className={cn(
				'flex shrink-0 border-t border-[var(--color-border)] p-3',
				isCollapsed ? 'justify-center' : 'justify-end',
			)}>
				<button
					onClick={toggle}
					aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
					className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-muted)] transition-colors duration-200 hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]"
				>
					{isCollapsed ? (
						<PanelLeftOpen className="h-4 w-4" />
					) : (
						<PanelLeftClose className="h-4 w-4" />
					)}
				</button>
			</div>
		</motion.aside>
	)
}

/**
 * Export collapsed state getter for layout margin calculation.
 */
export { STORAGE_KEY as SIDEBAR_STORAGE_KEY }

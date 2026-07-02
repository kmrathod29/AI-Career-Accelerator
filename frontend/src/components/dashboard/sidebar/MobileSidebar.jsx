import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import {
	LayoutDashboard, FileText, ScanSearch, GitCompareArrows,
	Mic, BrainCircuit, Map, Bot, Bell, UserCircle, Settings,
} from 'lucide-react'
import { SIDEBAR_NAV } from '@constants/dashboardNav.js'
import { APP_ROUTES } from '@constants/routes.js'
import logoSrc from '@assets/logo/AI-Career-Accelerator-only-logo.png'
import { SidebarItem } from './SidebarItem.jsx'

const ICON_MAP = {
	LayoutDashboard, FileText, ScanSearch, GitCompareArrows,
	Mic, BrainCircuit, Map, Bot, Bell, UserCircle, Settings,
}

/**
 * MobileSidebar — slide-in drawer for mobile (<768px).
 * Portalled to document.body. Backdrop blur + body scroll lock.
 */
export function MobileSidebar({ isOpen, onClose }) {
	/* ESC key + body scroll lock */
	useEffect(() => {
		if (!isOpen) return

		const onKey = (e) => { if (e.key === 'Escape') onClose() }
		window.addEventListener('keydown', onKey)
		document.body.style.overflow = 'hidden'

		return () => {
			window.removeEventListener('keydown', onKey)
			document.body.style.overflow = ''
		}
	}, [isOpen, onClose])

	if (typeof document === 'undefined') return null

	return createPortal(
		<AnimatePresence>
			{isOpen && (
				<>
					{/* Backdrop */}
					<motion.div
						key="sidebar-backdrop"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.25 }}
						className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm"
						onClick={onClose}
						aria-hidden="true"
					/>

					{/* Drawer panel */}
					<motion.aside
						key="sidebar-drawer"
						role="dialog"
						aria-modal="true"
						aria-label="Mobile navigation"
						initial={{ x: '-100%' }}
						animate={{ x: 0 }}
						exit={{ x: '-100%' }}
						transition={{ type: 'spring', damping: 28, stiffness: 260 }}
						className="fixed inset-y-0 left-0 z-[9999] flex w-[280px] flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)] shadow-2xl"
					>
						{/* Header */}
						<div className="flex h-16 shrink-0 items-center justify-between border-b border-[var(--color-border)] px-4">
							<Link
								to={APP_ROUTES.HOME}
								className="inline-flex items-center gap-2.5"
								aria-label="AI Career Accelerator"
							>
								<img
									src={logoSrc}
									alt=""
									aria-hidden="true"
									draggable={false}
									className="h-8 w-8 shrink-0 object-contain"
								/>
								<span className="text-[14px] font-semibold tracking-tight text-[var(--color-text)]">
									AI Career Accelerator
								</span>
							</Link>

							<button
								onClick={onClose}
								aria-label="Close navigation"
								className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-muted)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]"
							>
								<X className="h-4 w-4" />
							</button>
						</div>

						{/* Navigation */}
						<nav className="flex-1 overflow-y-auto px-3 py-4 sidebar-scrollbar">
							{SIDEBAR_NAV.map((section) => (
								<div key={section.section} className="mb-5">
									<p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-muted)]">
										{section.section}
									</p>
									<div className="space-y-0.5">
										{section.items.map((item) => (
											<SidebarItem
												key={item.path}
												label={item.label}
												path={item.path}
												icon={ICON_MAP[item.icon]}
												isCollapsed={false}
												onClick={onClose}
											/>
										))}
									</div>
								</div>
							))}
						</nav>

						{/* Bottom user info placeholder */}
						<div className="shrink-0 border-t border-[var(--color-border)] p-4">
							<div className="flex items-center gap-3">
								<div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-xs font-bold text-white">
									KR
								</div>
								<div className="min-w-0 flex-1">
									<p className="truncate text-sm font-medium text-[var(--color-text)]">Krunal Rathod</p>
									<p className="truncate text-[11px] text-[var(--color-muted)]">krunal@example.com</p>
								</div>
							</div>
						</div>
					</motion.aside>
				</>
			)}
		</AnimatePresence>,
		document.body,
	)
}

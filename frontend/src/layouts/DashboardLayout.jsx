import { useState, useEffect, useCallback } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { APP_ROUTES } from '@constants/routes.js'
import { Sidebar, SIDEBAR_STORAGE_KEY } from '@components/dashboard/sidebar/Sidebar.jsx'
import { MobileSidebar } from '@components/dashboard/sidebar/MobileSidebar.jsx'
import { TopNavbar } from '@components/dashboard/navbar/TopNavbar.jsx'

function getDashboardOutletKey(pathname) {
	if (pathname === APP_ROUTES.ACCOUNT || pathname.startsWith(`${APP_ROUTES.ACCOUNT}/`)) {
		return APP_ROUTES.ACCOUNT
	}

	return pathname
}

/**
 * DashboardLayout — persistent layout for all /dashboard/* routes.
 *
 * Structure:
 *   Desktop/Tablet: Sidebar (fixed) + scrollable content area with TopNavbar
 *   Mobile: TopNavbar with hamburger → MobileSidebar drawer
 *
 * Content area left margin dynamically adjusts based on sidebar width.
 */
export function DashboardLayout() {
	const location = useLocation()
	const outletKey = getDashboardOutletKey(location.pathname)
	const [isMobileOpen, setIsMobileOpen] = useState(false)
	const [isMobile, setIsMobile] = useState(() =>
		typeof window !== 'undefined' ? window.innerWidth < 768 : false,
	)

	/* Track sidebar collapsed state for margin calculation */
	const [isCollapsed, setIsCollapsed] = useState(() => {
		try {
			return JSON.parse(localStorage.getItem(SIDEBAR_STORAGE_KEY)) ?? false
		} catch {
			return false
		}
	})

	/* Responsive breakpoint tracking */
	useEffect(() => {
		const mql = window.matchMedia('(min-width: 768px)')
		const handler = (e) => setIsMobile(!e.matches)
		setIsMobile(!mql.matches)
		mql.addEventListener('change', handler)
		return () => mql.removeEventListener('change', handler)
	}, [])

	/* Listen for sidebar collapse changes via localStorage (cross-tab) */
	useEffect(() => {
		const handler = (e) => {
			if (e.key === SIDEBAR_STORAGE_KEY) {
				setIsCollapsed(JSON.parse(e.newValue) ?? false)
			}
		}
		window.addEventListener('storage', handler)
		return () => window.removeEventListener('storage', handler)
	}, [])

	/* Poll localStorage for same-tab sidebar changes */
	useEffect(() => {
		const interval = setInterval(() => {
			try {
				const val = JSON.parse(localStorage.getItem(SIDEBAR_STORAGE_KEY)) ?? false
				setIsCollapsed((prev) => (prev !== val ? val : prev))
			} catch { /* noop */ }
		}, 200)
		return () => clearInterval(interval)
	}, [])

	const openMobile = useCallback(() => setIsMobileOpen(true), [])
	const closeMobile = useCallback(() => setIsMobileOpen(false), [])

	/* Calculate margin based on sidebar state and breakpoint */
	const marginLeft = isMobile ? 0 : isCollapsed ? 72 : 240

	return (
		<div className="flex min-h-screen bg-[var(--color-dashboard-bg)] transition-colors duration-300">
			{/* Desktop/Tablet Sidebar */}
			<Sidebar />

			{/* Mobile Sidebar Drawer */}
			<MobileSidebar isOpen={isMobileOpen} onClose={closeMobile} />

			{/* Main content area — margin shifts with sidebar width */}
			<div
				className="flex min-h-screen min-w-0 flex-1 flex-col overflow-x-hidden transition-[margin-left] duration-300 ease-in-out"
				style={{ marginLeft }}
			>
				<TopNavbar onMenuClick={openMobile} />

				<main className="min-w-0 flex-1 overflow-x-hidden px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
					<AnimatePresence mode="wait">
						<motion.div
							key={outletKey}
							initial={{ opacity: 0, y: 8 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -8 }}
							transition={{ duration: 0.25, ease: 'easeInOut' }}
						>
							<Outlet />
						</motion.div>
					</AnimatePresence>
				</main>
			</div>
		</div>
	)
}
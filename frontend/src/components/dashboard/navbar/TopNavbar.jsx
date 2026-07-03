import { useLocation } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { PAGE_META } from '@constants/dashboardNav.js'
import { ThemeToggle } from '@components/ui/ThemeToggle.jsx'
import { SearchBar } from './SearchBar.jsx'
import { NotificationBell } from './NotificationBell.jsx'
import { UserMenu } from '@components/ui/UserMenu.jsx'

/**
 * TopNavbar — sticky top bar for the dashboard.
 * Left: Page Title + Subtitle (desktop) / Hamburger (mobile)
 * Center: SearchBar
 * Right: ThemeToggle | NotificationBell | ProfileAvatar
 */
export function TopNavbar({ onMenuClick }) {
	const { pathname } = useLocation()
	const meta = PAGE_META[pathname] || { title: 'Dashboard', subtitle: '' }

	return (
		<header
			className="sticky top-0 z-30 flex h-16 shrink-0 items-center border-b border-(--color-border) px-4 backdrop-blur-xl sm:px-6"
			style={{ backgroundColor: 'var(--navbar-bg-solid)' }}
		>
			{/* Left section */}
			<div className="flex min-w-0 flex-1 items-center gap-3">
				{/* Mobile hamburger */}
				<button
					onClick={onMenuClick}
					aria-label="Open navigation"
					className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-(--color-muted) transition-colors hover:bg-(--color-surface-2) hover:text-(--color-text) md:hidden"
				>
					<Menu className="h-5 w-5" />
				</button>

				{/* Page title */}
				<div className="min-w-0">
					<h1 className="truncate text-base font-semibold text-(--color-text)">
						{meta.title}
					</h1>
					{meta.subtitle && (
						<p className="hidden truncate text-[12px] text-(--color-muted) sm:block">
							{meta.subtitle}
						</p>
					)}
				</div>
			</div>

			{/* Center — search */}
			<div className="hidden flex-1 justify-center lg:flex">
				<SearchBar />
			</div>

			{/* Right section */}
			<div className="flex shrink-0 items-center gap-1.5">
				<div className="hidden sm:block">
					<ThemeToggle size="sm" />
				</div>
				<NotificationBell />
				<UserMenu />
			</div>
		</header>
	)
}

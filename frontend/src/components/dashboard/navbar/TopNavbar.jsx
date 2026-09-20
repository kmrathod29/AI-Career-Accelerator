import { Link } from 'react-router-dom'
import { Menu } from 'lucide-react'
import { ThemeToggle } from '@components/ui/ThemeToggle.jsx'
import { SearchBar } from './SearchBar.jsx'
import { NotificationBell } from './NotificationBell.jsx'
import { ProfileDropdown } from './ProfileDropdown.jsx'
import logoSrc from '@assets/logo/AI-Career-Accelerator-only-logo.png'
import { APP_ROUTES } from '@constants/routes.js'
import { Component } from 'react'

class NavbarWidgetErrorBoundary extends Component {
	constructor(props) {
		super(props)
		this.state = { hasError: false }
	}

	static getDerivedStateFromError() {
		return { hasError: true }
	}

	render() {
		if (!this.state.hasError) {
			return this.props.children
		}

		return (
			<div
				className="flex h-9 w-9 items-center justify-center rounded-xl text-(--color-muted)"
				aria-hidden="true"
			>
				!
			</div>
		)
	}
}

/**
 * TopNavbar — sticky top bar for the dashboard.
 * Left: Hamburger (mobile) + Logo (mobile only)
 * Center: SearchBar
 * Right: ThemeToggle | NotificationBell | ProfileAvatar
 *
 * Page titles are handled by each page's own PageHeader component,
 * not duplicated here.
 */
export function TopNavbar({ onMenuClick }) {
	return (
		<header
			className="sticky top-0 z-30 flex h-16 min-w-0 shrink-0 items-center border-b border-(--color-border) px-4 backdrop-blur-xl sm:px-6"
			style={{ backgroundColor: 'var(--navbar-bg-solid)' }}
		>
			{/* Left section */}
			<div className="flex min-w-0 shrink-0 items-center gap-3">
				{/* Mobile hamburger */}
				<button
					onClick={onMenuClick}
					aria-label="Open navigation"
					className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-(--color-muted) transition-colors hover:bg-(--color-surface-2) hover:text-(--color-text) md:hidden"
				>
					<Menu className="h-5 w-5" />
				</button>

				{/* Mobile logo — sidebar has logo on desktop */}
				<Link
					to={APP_ROUTES.DASHBOARD}
					className="inline-flex items-center rounded-lg md:hidden"
					aria-label="AI Career Accelerator — go to dashboard"
				>
					<img
						src={logoSrc}
						alt=""
						aria-hidden="true"
						draggable={false}
						className="h-7 w-7 shrink-0 rounded-md object-contain dark:bg-[var(--color-surface-2)] dark:p-0.5"
					/>
				</Link>
			</div>

			{/* Center — search (takes remaining space) */}
			<div className="flex min-w-0 flex-1 justify-center px-4">
				<SearchBar />
			</div>

			{/* Right section */}
			<div className="flex shrink-0 items-center gap-1.5">
				<div className="hidden sm:block">
					<ThemeToggle size="sm" />
				</div>
				<NavbarWidgetErrorBoundary>
					<NotificationBell />
				</NavbarWidgetErrorBoundary>
				<ProfileDropdown />
			</div>
		</header>
	)
}

import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { cn } from '@utils/classNames.js'

/**
 * SidebarItem — single navigation link within the sidebar.
 *
 * Features:
 * - Active state: blue left indicator + tinted background
 * - Hover: subtle bg shift + scale micro-interaction
 * - Collapsed mode: icon-only with native tooltip
 * - Uses NavLink for automatic active detection
 */
export function SidebarItem({ label, path, icon: Icon, isCollapsed, onClick }) {
	return (
		<NavLink
			to={path}
			end={path === '/dashboard'}
			onClick={onClick}
			title={isCollapsed ? label : undefined}
			className={({ isActive }) =>
				cn(
					'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
					isActive
						? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
						: 'text-[var(--color-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]',
					isCollapsed && 'justify-center px-0',
				)
			}
		>
			{({ isActive }) => (
				<>
					{/* Blue active indicator bar */}
					{isActive && (
						<motion.div
							layoutId="sidebar-active-indicator"
							className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-[var(--color-primary)]"
							transition={{ type: 'spring', stiffness: 350, damping: 30 }}
						/>
					)}

					{/* Icon */}
					<motion.div
						whileHover={{ scale: 1.08 }}
						whileTap={{ scale: 0.95 }}
						className="flex shrink-0 items-center justify-center"
					>
						<Icon
							className={cn(
								'h-[18px] w-[18px] transition-colors duration-200',
								isActive ? 'text-[var(--color-primary)]' : 'text-[var(--color-muted)] group-hover:text-[var(--color-text)]',
							)}
							strokeWidth={isActive ? 2.2 : 1.8}
						/>
					</motion.div>

					{/* Label — hidden when collapsed */}
					{!isCollapsed && (
						<span className="truncate">{label}</span>
					)}
				</>
			)}
		</NavLink>
	)
}

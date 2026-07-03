import { useState } from 'react'
import * as LucideIcons from 'lucide-react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ACCOUNT_SECTIONS } from '@constants/account.js'
import { cn } from '@utils/classNames.js'

function resolveIcon(name) {
	return LucideIcons[name] ?? LucideIcons.Circle
}

export function AccountSidebar({ activeSection, onSectionChange, collapsed, onToggleCollapse }) {
	return (
		<aside
			className={cn(
				'hidden shrink-0 md:block',
				collapsed ? 'w-[72px]' : 'w-56',
			)}
		>
			<nav
				className="sticky top-24 space-y-0.5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-2 shadow-[var(--shadow-card)]"
				aria-label="Account sections"
			>
				<div className="mb-2 flex items-center justify-between px-2 pt-1">
					{!collapsed && (
						<span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-muted)]">
							Account
						</span>
					)}
					<button
						type="button"
						onClick={onToggleCollapse}
						className="hidden rounded-lg p-1.5 text-[var(--color-muted)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)] md:flex"
						aria-label={collapsed ? 'Expand navigation' : 'Collapse navigation'}
					>
						{collapsed ? (
							<ChevronRight className="h-4 w-4" />
						) : (
							<ChevronLeft className="h-4 w-4" />
						)}
					</button>
				</div>

				{ACCOUNT_SECTIONS.map(({ id, label, icon }) => {
					const Icon = resolveIcon(icon)
					const isActive = activeSection === id
					const isDanger = id === 'danger'

					return (
						<button
							key={id}
							type="button"
							onClick={() => onSectionChange(id)}
							className={cn(
								'relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors duration-200',
								isActive
									? isDanger
										? 'bg-[var(--notif-error-bg)] text-[var(--notif-error)]'
										: 'bg-[var(--color-surface-2)] text-[var(--color-primary)]'
									: isDanger
										? 'text-[var(--notif-error)] hover:bg-[var(--notif-error-bg)]/50'
										: 'text-[var(--color-muted)] hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]',
							)}
							title={collapsed ? label : undefined}
						>
							{isActive && (
								<motion.span
									layoutId="account-nav-indicator"
									className={cn(
										'absolute inset-y-1.5 left-0 w-0.5 rounded-full',
										isDanger ? 'bg-[var(--notif-error)]' : 'bg-[var(--color-primary)]',
									)}
									transition={{ type: 'spring', stiffness: 400, damping: 30 }}
								/>
							)}
							<Icon className="h-4 w-4 shrink-0" strokeWidth={1.8} />
							{!collapsed && <span className="truncate">{label}</span>}
						</button>
					)
				})}
			</nav>
		</aside>
	)
}

export function AccountMobileNav({ activeSection, onSectionChange }) {
	return (
		<nav
			className="scrollbar-none -mx-1 flex gap-2 overflow-x-auto px-1 pb-1 md:hidden"
			aria-label="Account sections"
		>
			{ACCOUNT_SECTIONS.map(({ id, label }) => {
				const isActive = activeSection === id
				const isDanger = id === 'danger'

				return (
					<button
						key={id}
						type="button"
						onClick={() => onSectionChange(id)}
						className={cn(
							'shrink-0 rounded-full border px-4 py-2 text-xs font-medium transition-colors duration-200',
							isActive
								? isDanger
									? 'border-[var(--notif-error)] bg-[var(--notif-error-bg)] text-[var(--notif-error)]'
									: 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white'
								: 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-muted)]',
						)}
					>
						{label}
					</button>
				)
			})}
		</nav>
	)
}

export function useSidebarCollapse() {
	const [collapsed, setCollapsed] = useState(false)
	return {
		collapsed,
		toggleCollapse: () => setCollapsed((c) => !c),
	}
}

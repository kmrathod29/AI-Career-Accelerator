import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import { motion } from 'framer-motion'
import { ChevronDown, LayoutDashboard, LogOut, Settings, User } from 'lucide-react'
import { APP_ROUTES } from '@constants/routes.js'
import { cn } from '@utils/classNames.js'
import { useAuth } from '@providers/useAuth.js'
import { useProfile } from '@/stores/accountStore.js'
import { LogoutDialog } from './LogoutDialog.jsx'

function getInitials(name) {
	if (!name) return 'U'

	return (
		name
			.split(' ')
			.filter(Boolean)
			.slice(0, 2)
			.map((word) => word[0].toUpperCase())
			.join('') || 'U'
	)
}

function getDisplayName(profile) {
	const fullName = [profile?.firstName, profile?.lastName].filter(Boolean).join(' ').trim()
	if (fullName) return fullName
	return profile?.email?.split('@')[0] ?? 'User'
}

const menuItemClassName =
	'flex cursor-pointer items-center gap-3 rounded-lg px-4 py-2.5 text-sm text-(--color-text) outline-none transition-colors duration-150 hover:bg-(--color-surface-2) focus:bg-(--color-surface-2) data-highlighted:bg-(--color-surface-2)'

/**
 * ProfileDropdown — shared avatar menu for landing and dashboard navbars.
 * Radix DropdownMenu handles portal rendering and collision-aware positioning.
 */
export function ProfileDropdown({ guestLayout = 'inline', className }) {
	const { isAuthenticated, userEmail } = useAuth()
	const profile = useProfile()
	const [isOpen, setIsOpen] = useState(false)
	const [isLogoutOpen, setIsLogoutOpen] = useState(false)

	const displayName = useMemo(() => getDisplayName(profile), [profile])
	const initials = useMemo(() => getInitials(displayName), [displayName])
	const avatarUrl = profile?.avatar ?? null
	const email = userEmail ?? profile?.email ?? ''

	if (!isAuthenticated) {
		return (
			<div
				className={cn(
					'flex items-center gap-2',
					guestLayout === 'stacked' && 'flex-col items-stretch gap-3',
					className,
				)}
			>
				<Link
					to={APP_ROUTES.LOGIN}
					className={cn(
						'inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-medium text-(--color-muted) transition-colors hover:bg-(--color-surface-2) hover:text-(--color-text)',
						guestLayout === 'stacked' && 'w-full border border-(--color-border) bg-(--color-surface)',
					)}
				>
					Login
				</Link>
			</div>
		)
	}

	return (
		<>
			<DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
				<DropdownMenu.Trigger asChild>
					<button
						type="button"
						aria-label="User menu"
						className={cn(
							'flex items-center gap-2 rounded-xl px-1.5 py-1 transition-colors duration-200 hover:bg-(--color-surface-2)',
							className,
						)}
					>
						{avatarUrl ? (
							<img
								src={avatarUrl}
								alt={displayName}
								className="h-8 w-8 rounded-full object-cover ring-2 ring-(--color-border)"
							/>
						) : (
							<div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-(--color-primary) to-(--color-secondary) text-xs font-bold text-white ring-2 ring-(--color-border)">
								{initials}
							</div>
						)}

						<ChevronDown
							className="hidden h-3.5 w-3.5 text-(--color-muted) transition-transform duration-200 sm:block"
							style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
						/>
					</button>
				</DropdownMenu.Trigger>

				<DropdownMenu.Portal>
					<DropdownMenu.Content
						side="bottom"
						align="end"
						sideOffset={8}
						collisionPadding={12}
						avoidCollisions
						className="z-50 outline-none"
					>
						<motion.div
							initial={{ opacity: 0, scale: 0.96 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.18, ease: 'easeOut' }}
							className="w-60 overflow-hidden rounded-2xl border shadow-lg"
							style={{
								backgroundColor: 'var(--floating-bg)',
								borderColor: 'var(--floating-border)',
								boxShadow: 'var(--floating-shadow)',
							}}
						>
							<div className="border-b border-(--color-border) px-4 py-3">
								<p className="text-sm font-semibold text-(--color-text)">{displayName}</p>
								{email && <p className="text-[11px] text-(--color-muted)">{email}</p>}
							</div>

							<div className="py-1.5">
								<DropdownMenu.Item asChild>
									<Link to={APP_ROUTES.DASHBOARD} className={menuItemClassName}>
										<LayoutDashboard className="h-4 w-4 text-(--color-muted)" strokeWidth={1.8} />
										Dashboard
									</Link>
								</DropdownMenu.Item>
								<DropdownMenu.Item asChild>
									<Link to={APP_ROUTES.PROFILE} className={menuItemClassName}>
										<User className="h-4 w-4 text-(--color-muted)" strokeWidth={1.8} />
										Profile
									</Link>
								</DropdownMenu.Item>
								<DropdownMenu.Item asChild>
									<Link to={APP_ROUTES.SETTINGS} className={menuItemClassName}>
										<Settings className="h-4 w-4 text-(--color-muted)" strokeWidth={1.8} />
										Settings
									</Link>
								</DropdownMenu.Item>
							</div>

							<div className="border-t border-(--color-border) py-1.5">
								<DropdownMenu.Item
									className={cn(menuItemClassName, 'text-(--color-danger) data-highlighted:text-(--color-danger)')}
									onSelect={() => {
										setIsLogoutOpen(true)
									}}
								>
									<LogOut className="h-4 w-4" strokeWidth={1.8} />
									Logout
								</DropdownMenu.Item>
							</div>
						</motion.div>
					</DropdownMenu.Content>
				</DropdownMenu.Portal>
			</DropdownMenu.Root>

			<LogoutDialog open={isLogoutOpen} onClose={() => setIsLogoutOpen(false)} />
		</>
	)
}

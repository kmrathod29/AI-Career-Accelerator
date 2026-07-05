import { forwardRef, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import {
	autoUpdate,
	flip,
	FloatingPortal,
	offset,
	shift,
	useClick,
	useDismiss,
	useFloating,
	useInteractions,
	useRole,
} from '@floating-ui/react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, LayoutDashboard, LogOut, Settings, User } from 'lucide-react'
import { APP_ROUTES } from '@constants/routes.js'
import { cn } from '@utils/classNames.js'
import { useAuth } from '@providers/useAuth.js'
import { useProfile } from '@/stores/accountStore.js'
import { LogoutDialog } from './LogoutDialog.jsx'

const VIEWPORT_PADDING = 12
const FLOATING_MENU_Z_INDEX = 10000

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

function FloatingMenuItem({ children, asChild: _asChild }) {
	return <div role="none">{children}</div>
}

const ProfileAvatarTrigger = forwardRef(function ProfileAvatarTrigger(
	{ avatarUrl, displayName, initials, isOpen, className, ...props },
	ref,
) {
	return (
		<button
			ref={ref}
			type="button"
			aria-label="User menu"
			className={cn(
				'flex items-center gap-2 rounded-xl px-1.5 py-1 transition-colors duration-200 hover:bg-(--color-surface-2)',
				className,
			)}
			{...props}
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
	)
})

function ProfileMenuPanel({ displayName, email, onLogout, children }) {
	return (
		<div
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

			<div className="py-1.5">{children}</div>

			<div className="border-t border-(--color-border) py-1.5">
				<button
					type="button"
					role="menuitem"
					className={cn(
						menuItemClassName,
						'w-full text-left text-(--color-danger) hover:text-(--color-danger)',
					)}
					onClick={onLogout}
				>
					<LogOut className="h-4 w-4" strokeWidth={1.8} />
					Logout
				</button>
			</div>
		</div>
	)
}

function ProfileMenuLinks({ onNavigate, MenuItemComponent }) {
	return (
		<>
			<MenuItemComponent asChild>
				<Link to={APP_ROUTES.DASHBOARD} onClick={onNavigate} className={menuItemClassName}>
					<LayoutDashboard className="h-4 w-4 text-(--color-muted)" strokeWidth={1.8} />
					Dashboard
				</Link>
			</MenuItemComponent>
			<MenuItemComponent asChild>
				<Link to={APP_ROUTES.PROFILE} onClick={onNavigate} className={menuItemClassName}>
					<User className="h-4 w-4 text-(--color-muted)" strokeWidth={1.8} />
					Profile
				</Link>
			</MenuItemComponent>
			<MenuItemComponent asChild>
				<Link to={APP_ROUTES.SETTINGS} onClick={onNavigate} className={menuItemClassName}>
					<Settings className="h-4 w-4 text-(--color-muted)" strokeWidth={1.8} />
					Settings
				</Link>
			</MenuItemComponent>
		</>
	)
}

function ProfileDropdownRadix({
	displayName,
	email,
	avatarUrl,
	initials,
	className,
	onNavigate,
	onLogout,
}) {
	const [isOpen, setIsOpen] = useState(false)

	return (
		<DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>
			<DropdownMenu.Trigger asChild>
				<ProfileAvatarTrigger
					avatarUrl={avatarUrl}
					displayName={displayName}
					initials={initials}
					isOpen={isOpen}
					className={className}
				/>
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
					>
						<ProfileMenuPanel
							displayName={displayName}
							email={email}
							onLogout={() => {
								setIsOpen(false)
								onLogout()
							}}
						>
							<ProfileMenuLinks
								onNavigate={onNavigate}
								MenuItemComponent={DropdownMenu.Item}
							/>
						</ProfileMenuPanel>
					</motion.div>
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	)
}

function ProfileDropdownFloating({
	displayName,
	email,
	avatarUrl,
	initials,
	className,
	onNavigate,
	onLogout,
}) {
	const [isOpen, setIsOpen] = useState(false)

	const { refs, floatingStyles, context } = useFloating({
		open: isOpen,
		onOpenChange: setIsOpen,
		placement: 'top-end',
		whileElementsMounted: autoUpdate,
		middleware: [
			offset(10),
			flip({ padding: VIEWPORT_PADDING }),
			shift({ padding: VIEWPORT_PADDING }),
		],
	})

	const click = useClick(context)
	const dismiss = useDismiss(context, { outsidePressEvent: 'mousedown' })
	const role = useRole(context, { role: 'menu' })
	const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role])

	return (
		<div className="relative">
			<ProfileAvatarTrigger
				ref={refs.setReference}
				avatarUrl={avatarUrl}
				displayName={displayName}
				initials={initials}
				isOpen={isOpen}
				className={className}
				{...getReferenceProps()}
			/>

			<FloatingPortal>
				<AnimatePresence>
					{isOpen && (
						<div
							ref={refs.setFloating}
							style={{
								...floatingStyles,
								zIndex: FLOATING_MENU_Z_INDEX,
							}}
							className="outline-none"
							{...getFloatingProps()}
						>
						<motion.div
							key="profile-floating-menu"
							initial={{ opacity: 0, scale: 0.96, y: 6 }}
								animate={{ opacity: 1, scale: 1, y: 0 }}
								exit={{ opacity: 0, scale: 0.96, y: 6 }}
								transition={{ duration: 0.18, ease: 'easeOut' }}
							>
								<ProfileMenuPanel
									displayName={displayName}
									email={email}
									onLogout={() => {
										setIsOpen(false)
										onLogout()
									}}
								>
									<ProfileMenuLinks
										onNavigate={onNavigate}
										MenuItemComponent={FloatingMenuItem}
									/>
								</ProfileMenuPanel>
							</motion.div>
						</div>
					)}
				</AnimatePresence>
			</FloatingPortal>
		</div>
	)
}

/**
 * ProfileDropdown — shared avatar menu for landing, mobile drawer, and dashboard navbars.
 * Desktop uses Radix DropdownMenu (bottom-end). Mobile drawer uses Floating UI (top-end)
 * portaled outside the scroll container to prevent clipping.
 */
export function ProfileDropdown({
	guestLayout = 'inline',
	className,
	onNavigate,
	menuPlacement,
}) {
	const { isAuthenticated, userEmail } = useAuth()
	const profile = useProfile()
	const [isLogoutOpen, setIsLogoutOpen] = useState(false)

	const displayName = useMemo(() => getDisplayName(profile), [profile])
	const initials = useMemo(() => getInitials(displayName), [displayName])
	const avatarUrl = profile?.avatar ?? null
	const email = userEmail ?? profile?.email ?? ''

	const openLogoutDialog = () => setIsLogoutOpen(true)

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
					onClick={onNavigate}
					className={cn(
						'inline-flex h-10 items-center justify-center rounded-xl px-4 text-sm font-medium text-(--color-muted) transition-colors hover:bg-(--color-surface-2) hover:text-(--color-text)',
						guestLayout === 'stacked' && 'w-full border border-(--color-border) bg-(--color-surface)',
						guestLayout === 'drawer' &&
							'h-11 border border-(--color-border) bg-(--color-surface) px-5 font-semibold text-(--color-text) shadow-sm hover:bg-(--color-surface-2)',
					)}
				>
					Login
				</Link>
			</div>
		)
	}

	const sharedProps = {
		displayName,
		email,
		avatarUrl,
		initials,
		className,
		onNavigate,
		onLogout: openLogoutDialog,
	}

	return (
		<>
			{menuPlacement === 'top-end' ? (
				<ProfileDropdownFloating {...sharedProps} />
			) : (
				<ProfileDropdownRadix {...sharedProps} />
			)}

			<LogoutDialog open={isLogoutOpen} onClose={() => setIsLogoutOpen(false)} />
		</>
	)
}

import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
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

export function UserMenu({ guestLayout = 'inline', className }) {
	const { isAuthenticated, userEmail } = useAuth()
	const profile = useProfile()
	const [isOpen, setIsOpen] = useState(false)
	const [isLogoutOpen, setIsLogoutOpen] = useState(false)
	const ref = useRef(null)

	const displayName = useMemo(() => getDisplayName(profile), [profile])
	const initials = useMemo(() => getInitials(displayName), [displayName])
	const avatarUrl = profile?.avatar ?? null
	const email = userEmail ?? profile?.email ?? ''

	useEffect(() => {
		if (!isOpen) return undefined

		const handleOutsideClick = (event) => {
			if (ref.current && !ref.current.contains(event.target)) {
				setIsOpen(false)
			}
		}

		const handleEscape = (event) => {
			if (event.key === 'Escape') {
				setIsOpen(false)
			}
		}

		document.addEventListener('mousedown', handleOutsideClick)
		document.addEventListener('keydown', handleEscape)
		return () => {
			document.removeEventListener('mousedown', handleOutsideClick)
			document.removeEventListener('keydown', handleEscape)
		}
	}, [isOpen])

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
				{/* <Link
					to={APP_ROUTES.REGISTER}
					className={cn(
						'inline-flex h-10 items-center justify-center rounded-xl bg-(--color-primary) px-4 text-sm font-semibold text-white transition-opacity hover:opacity-90',
						guestLayout === 'stacked' && 'w-full',
					)}
				>
					Get Started
				</Link> */}
			</div>
		)
	}

	return (
		<>
			<div ref={ref} className={cn('relative', className)}>
				<button
					type="button"
					onClick={() => setIsOpen((current) => !current)}
					aria-label="User menu"
					aria-expanded={isOpen}
					aria-haspopup="menu"
					className="flex items-center gap-2 rounded-xl px-1.5 py-1 transition-colors duration-200 hover:bg-(--color-surface-2)"
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

				<AnimatePresence>
					{isOpen && (
						<motion.div
							initial={{ opacity: 0, y: 8, scale: 0.96 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{ opacity: 0, y: 8, scale: 0.96 }}
							transition={{ duration: 0.18, ease: 'easeOut' }}
							role="menu"
							className="absolute right-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-2xl border shadow-lg"
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
								<Link
									to={APP_ROUTES.DASHBOARD}
									onClick={() => setIsOpen(false)}
									className="flex items-center gap-3 px-4 py-2.5 text-sm text-(--color-text) transition-colors duration-150 hover:bg-(--color-surface-2)"
								>
									<LayoutDashboard className="h-4 w-4 text-(--color-muted)" strokeWidth={1.8} />
									Dashboard
								</Link>
								<Link
									to={APP_ROUTES.PROFILE}
									onClick={() => setIsOpen(false)}
									className="flex items-center gap-3 px-4 py-2.5 text-sm text-(--color-text) transition-colors duration-150 hover:bg-(--color-surface-2)"
								>
									<User className="h-4 w-4 text-(--color-muted)" strokeWidth={1.8} />
									Profile
								</Link>
								<Link
									to={APP_ROUTES.SETTINGS}
									onClick={() => setIsOpen(false)}
									className="flex items-center gap-3 px-4 py-2.5 text-sm text-(--color-text) transition-colors duration-150 hover:bg-(--color-surface-2)"
								>
									<Settings className="h-4 w-4 text-(--color-muted)" strokeWidth={1.8} />
									Settings
								</Link>
							</div>

							<div className="border-t border-(--color-border) py-1.5">
								<button
									type="button"
									onClick={() => {
										setIsOpen(false)
										setIsLogoutOpen(true)
									}}
									className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-(--color-danger) transition-colors duration-150 hover:bg-(--color-surface-2)"
								>
									<LogOut className="h-4 w-4" strokeWidth={1.8} />
									Logout
								</button>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			<LogoutDialog open={isLogoutOpen} onClose={() => setIsLogoutOpen(false)} />
		</>
	)
}
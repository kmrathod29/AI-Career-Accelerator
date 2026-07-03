import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { User, LogOut, ChevronDown } from 'lucide-react'
import { APP_ROUTES } from '@constants/routes.js'

/** Generate initials from a full name. */
function getInitials(name) {
	return name
		.split(' ')
		.filter(Boolean)
		.slice(0, 2)
		.map((w) => w[0].toUpperCase())
		.join('')
}

const MENU_ITEMS = [
	{ label: 'Account Center', path: APP_ROUTES.ACCOUNT, icon: User },
]

/**
 * ProfileDropdown — avatar button → dropdown menu.
 * Shows initials avatar (or image if provided).
 * Dropdown: Profile, Settings, Logout.
 */
export function ProfileDropdown({ userName = 'Krunal Rathod', userImage = null }) {
	const [isOpen, setIsOpen] = useState(false)
	const ref = useRef(null)
	const initials = getInitials(userName)

	/* Close on outside click */
	useEffect(() => {
		if (!isOpen) return
		const handler = (e) => {
			if (ref.current && !ref.current.contains(e.target)) setIsOpen(false)
		}
		document.addEventListener('mousedown', handler)
		return () => document.removeEventListener('mousedown', handler)
	}, [isOpen])

	return (
		<div ref={ref} className="relative">
			<button
				onClick={() => setIsOpen((o) => !o)}
				aria-label="Profile menu"
				aria-expanded={isOpen}
				className="flex items-center gap-2 rounded-xl px-1.5 py-1 transition-colors duration-200 hover:bg-[var(--color-surface-2)]"
			>
				{/* Avatar */}
				{userImage ? (
					<img
						src={userImage}
						alt={userName}
						className="h-8 w-8 rounded-full object-cover ring-2 ring-[var(--color-border)]"
					/>
				) : (
					<div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-xs font-bold text-white ring-2 ring-[var(--color-border)]">
						{initials}
					</div>
				)}

				<ChevronDown
					className="hidden h-3.5 w-3.5 text-[var(--color-muted)] transition-transform duration-200 sm:block"
					style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
				/>
			</button>

			{/* Dropdown */}
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, y: 8, scale: 0.96 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: 8, scale: 0.96 }}
						transition={{ duration: 0.18, ease: 'easeOut' }}
						className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border shadow-lg"
						style={{
							backgroundColor: 'var(--floating-bg)',
							borderColor: 'var(--floating-border)',
							boxShadow: 'var(--floating-shadow)',
						}}
					>
						{/* User info header */}
						<div className="border-b border-[var(--color-border)] px-4 py-3">
							<p className="text-sm font-semibold text-[var(--color-text)]">{userName}</p>
							<p className="text-[11px] text-[var(--color-muted)]">krunal@example.com</p>
						</div>

						{/* Menu items */}
						<div className="py-1.5">
							{MENU_ITEMS.map(({ label, path, icon: Icon }) => (
								<Link
									key={path}
									to={path}
									onClick={() => setIsOpen(false)}
									className="flex items-center gap-3 px-4 py-2.5 text-sm text-[var(--color-text)] transition-colors duration-150 hover:bg-[var(--color-surface-2)]"
								>
									<Icon className="h-4 w-4 text-[var(--color-muted)]" strokeWidth={1.8} />
									{label}
								</Link>
							))}
						</div>

						{/* Logout */}
						<div className="border-t border-[var(--color-border)] py-1.5">
							<button
								onClick={() => setIsOpen(false)}
								className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-[var(--color-danger)] transition-colors duration-150 hover:bg-[var(--color-surface-2)]"
							>
								<LogOut className="h-4 w-4" strokeWidth={1.8} />
								Logout
							</button>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}

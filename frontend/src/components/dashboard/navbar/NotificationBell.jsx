import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell } from 'lucide-react'
import { NotificationPopup } from '@components/notifications/NotificationPopup.jsx'
import {
	useUnreadCount,
	usePopupNotifications,
	useNotificationLoading,
	useLastArrivalAt,
	notificationStore,
} from '@/stores/notificationStore.js'

/**
 * NotificationBell — bell icon with unread badge, arrival animation, and popup.
 * Popup is portaled and positioned with Floating UI collision detection.
 */
export function NotificationBell() {
	const [isOpen, setIsOpen] = useState(false)
	const [isRinging, setIsRinging] = useState(false)
	const unreadCount = useUnreadCount()
	const popupNotifications = usePopupNotifications()
	const isLoading = useNotificationLoading()
	const lastArrivalAt = useLastArrivalAt()
	const prevArrivalRef = useRef(lastArrivalAt)
	const containerRef = useRef(null)

	/* Animate bell when new notification arrives */
	useEffect(() => {
		if (lastArrivalAt && lastArrivalAt !== prevArrivalRef.current) {
			prevArrivalRef.current = lastArrivalAt
			setIsRinging(true)
			const timer = setTimeout(() => {
				setIsRinging(false)
				notificationStore.clearLastArrival()
			}, 1200)
			return () => clearTimeout(timer)
		}
	}, [lastArrivalAt])

	/* Click outside and Escape key listener to close dropdown */
	useEffect(() => {
		if (!isOpen) return
		const handleOutsideClick = (e) => {
			if (containerRef.current && !containerRef.current.contains(e.target)) {
				setIsOpen(false)
			}
		}
		const handleKeyDown = (e) => {
			if (e.key === 'Escape') setIsOpen(false)
		}
		document.addEventListener('mousedown', handleOutsideClick)
		document.addEventListener('keydown', handleKeyDown)
		return () => {
			document.removeEventListener('mousedown', handleOutsideClick)
			document.removeEventListener('keydown', handleKeyDown)
		}
	}, [isOpen])

	return (
		<div ref={containerRef} className="relative">
			<button
				type="button"
				onClick={() => setIsOpen((prev) => !prev)}
				aria-label={`Notifications${unreadCount ? ` — ${unreadCount} unread` : ''}`}
				aria-expanded={isOpen}
				aria-haspopup="true"
				className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl text-[var(--color-muted)] transition-colors duration-200 hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]"
			>
				<motion.div
					animate={
						isRinging
							? { rotate: [0, 14, -14, 10, -10, 5, -5, 0] }
							: { rotate: 0 }
					}
					transition={{ duration: 0.6, ease: 'easeInOut' }}
				>
					<Bell className="h-[18px] w-[18px]" strokeWidth={1.8} />
				</motion.div>

				<AnimatePresence>
					{unreadCount > 0 && (
						<motion.span
							key={unreadCount}
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							exit={{ scale: 0 }}
							transition={{ type: 'spring', stiffness: 500, damping: 25 }}
							className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-primary)] px-1 text-[9px] font-bold text-white"
						>
							{unreadCount > 99 ? '99+' : unreadCount}
						</motion.span>
					)}
				</AnimatePresence>
			</button>

			<AnimatePresence>
				{isOpen && (
					<div
						className="absolute right-0 top-full z-50 mt-2 w-[min(380px,calc(100vw-32px))] overflow-hidden rounded-2xl border shadow-lg max-lg:fixed max-lg:left-1/2 max-lg:right-auto max-lg:top-[4.5rem] max-lg:mt-0 max-lg:-translate-x-1/2"
						style={{
							backgroundColor: 'var(--floating-bg)',
							borderColor: 'var(--floating-border)',
							boxShadow: 'var(--floating-shadow)',
						}}
					>
						<motion.div
							initial={{ opacity: 0, y: 8, scale: 0.96 }}
							animate={{ opacity: 1, y: 0, scale: 1 }}
							exit={{ opacity: 0, y: 8, scale: 0.96 }}
							transition={{ duration: 0.18, ease: 'easeOut' }}
						>
							<NotificationPopup
								notifications={popupNotifications}
								unreadCount={unreadCount}
								isLoading={isLoading}
								onClose={() => setIsOpen(false)}
							/>
						</motion.div>
					</div>
				)}
			</AnimatePresence>
		</div>
	)
}

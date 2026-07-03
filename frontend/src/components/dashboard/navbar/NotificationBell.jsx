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
 * Synced with the central notification store.
 */
export function NotificationBell() {
	const [isOpen, setIsOpen] = useState(false)
	const [isRinging, setIsRinging] = useState(false)
	const ref = useRef(null)
	const unreadCount = useUnreadCount()
	const popupNotifications = usePopupNotifications()
	const isLoading = useNotificationLoading()
	const lastArrivalAt = useLastArrivalAt()
	const prevArrivalRef = useRef(lastArrivalAt)

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

	/* Close on outside click */
	useEffect(() => {
		if (!isOpen) return
		const handler = (e) => {
			if (ref.current && !ref.current.contains(e.target)) setIsOpen(false)
		}
		document.addEventListener('mousedown', handler)
		return () => document.removeEventListener('mousedown', handler)
	}, [isOpen])

	/* Close on Escape */
	useEffect(() => {
		if (!isOpen) return
		const handler = (e) => {
			if (e.key === 'Escape') setIsOpen(false)
		}
		document.addEventListener('keydown', handler)
		return () => document.removeEventListener('keydown', handler)
	}, [isOpen])

	return (
		<div ref={ref} className="relative">
			<button
				onClick={() => setIsOpen((o) => !o)}
				aria-label={`Notifications${unreadCount ? ` — ${unreadCount} unread` : ''}`}
				aria-expanded={isOpen}
				aria-haspopup="true"
				className="relative flex h-9 w-9 items-center justify-center rounded-xl text-[var(--color-muted)] transition-colors duration-200 hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]"
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

				{/* Unread badge */}
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
					<NotificationPopup
						notifications={popupNotifications}
						unreadCount={unreadCount}
						isLoading={isLoading}
						onClose={() => setIsOpen(false)}
					/>
				)}
			</AnimatePresence>
		</div>
	)
}

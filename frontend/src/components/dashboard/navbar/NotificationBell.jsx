import { useState, useRef, useEffect } from 'react'
import {
	useFloating,
	autoUpdate,
	offset,
	flip,
	shift,
	size,
	useDismiss,
	useClick,
	useRole,
	useInteractions,
	FloatingPortal,
} from '@floating-ui/react'
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

const POPUP_MAX_WIDTH = 380
const VIEWPORT_PADDING = 12

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

	const { refs, floatingStyles, context } = useFloating({
		open: isOpen,
		onOpenChange: setIsOpen,
		placement: 'bottom-end',
		whileElementsMounted: autoUpdate,
		middleware: [
			offset(8),
			flip({
				padding: VIEWPORT_PADDING,
				fallbackPlacements: ['bottom-start', 'top-end', 'top-start'],
			}),
			shift({ padding: VIEWPORT_PADDING }),
			size({
				padding: VIEWPORT_PADDING,
				apply({ availableWidth, elements }) {
					const width = Math.min(POPUP_MAX_WIDTH, availableWidth)
					Object.assign(elements.floating.style, {
						width: `${width}px`,
						maxWidth: `min(${POPUP_MAX_WIDTH}px, calc(100vw - ${VIEWPORT_PADDING * 2}px))`,
					})
				},
			}),
		],
	})

	const click = useClick(context)
	const dismiss = useDismiss(context, { outsidePressEvent: 'mousedown' })
	const role = useRole(context)
	const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role])
	const referenceRef = useRef(null)
	const floatingRef = useRef(null)

	useEffect(() => {
		refs.setReference(referenceRef.current)
		refs.setFloating(floatingRef.current)
	}, [refs.setReference, refs.setFloating])

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

	return (
		<div className="relative">
			<button
				ref={referenceRef}
				aria-label={`Notifications${unreadCount ? ` — ${unreadCount} unread` : ''}`}
				aria-expanded={isOpen}
				aria-haspopup="true"
				className="relative flex h-9 w-9 items-center justify-center rounded-xl text-[var(--color-muted)] transition-colors duration-200 hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]"
				{...getReferenceProps()}
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

			<FloatingPortal>
				<AnimatePresence>
					{isOpen && (
						<div
							ref={floatingRef}
							style={{
								...floatingStyles,
								backgroundColor: 'var(--floating-bg)',
								borderColor: 'var(--floating-border)',
								boxShadow: 'var(--floating-shadow)',
							}}
							className="z-50 flex max-w-[min(380px,calc(100vw-24px))] flex-col overflow-hidden rounded-2xl border shadow-lg"
							{...getFloatingProps()}
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
			</FloatingPortal>
		</div>
	)
}

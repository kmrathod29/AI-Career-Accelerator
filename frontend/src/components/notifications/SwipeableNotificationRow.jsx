import { useState } from 'react'
import { motion, useMotionValue, useTransform } from 'framer-motion'
import { Check, Trash2 } from 'lucide-react'
import { NotificationItem } from './NotificationItem.jsx'

const SWIPE_THRESHOLD = 80

/**
 * Mobile-friendly swipeable notification row.
 * Swipe right → mark read. Swipe left → delete.
 */
export function SwipeableNotificationRow({
	notification,
	onMarkRead,
	onDelete,
	...itemProps
}) {
	const [isDragging, setIsDragging] = useState(false)
	const x = useMotionValue(0)
	const readOpacity = useTransform(x, [0, SWIPE_THRESHOLD], [0, 1])
	const deleteOpacity = useTransform(x, [-SWIPE_THRESHOLD, 0], [1, 0])

	const handleDragEnd = (_event, info) => {
		setIsDragging(false)
		const offset = info.offset.x

		if (offset > SWIPE_THRESHOLD && !notification.read) {
			onMarkRead?.(notification.id)
		} else if (offset < -SWIPE_THRESHOLD) {
			onDelete?.(notification.id)
		}
	}

	return (
		<div className="relative overflow-hidden border-b border-[var(--color-border)] last:border-b-0 md:overflow-visible">
			{/* Swipe backgrounds — mobile only */}
			<div className="pointer-events-none absolute inset-0 flex items-stretch md:hidden">
				<motion.div
					style={{ opacity: readOpacity }}
					className="flex w-1/2 items-center justify-start bg-[var(--notif-success-bg)] pl-5"
				>
					<Check className="h-5 w-5 text-[var(--notif-success)]" strokeWidth={2} />
					<span className="ml-2 text-xs font-medium text-[var(--notif-success)]">Read</span>
				</motion.div>
				<div className="flex-1" />
				<motion.div
					style={{ opacity: deleteOpacity }}
					className="flex w-1/2 items-center justify-end bg-[var(--notif-error-bg)] pr-5"
				>
					<span className="mr-2 text-xs font-medium text-[var(--notif-error)]">Delete</span>
					<Trash2 className="h-5 w-5 text-[var(--notif-error)]" strokeWidth={2} />
				</motion.div>
			</div>

			<motion.div
				style={{ x }}
				drag="x"
				dragConstraints={{ left: -120, right: 120 }}
				dragElastic={0.1}
				onDragStart={() => setIsDragging(true)}
				onDragEnd={handleDragEnd}
				className="relative bg-[var(--color-dashboard-bg)] md:!transform-none md:cursor-default"
				whileDrag={{ cursor: 'grabbing' }}
			>
				<NotificationItem
					notification={notification}
					onMarkRead={onMarkRead}
					onDelete={onDelete}
					{...itemProps}
					/* Prevent link navigation while dragging on mobile */
					onOpen={isDragging ? undefined : itemProps.onOpen}
				/>
			</motion.div>
		</div>
	)
}

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell } from 'lucide-react'

const PLACEHOLDER_NOTIFICATIONS = [
	{ id: 1, text: 'Your resume scored 92/100 on ATS check', time: '2 min ago', unread: true },
	{ id: 2, text: 'New mock interview feedback available', time: '1 hour ago', unread: true },
	{ id: 3, text: 'Career roadmap updated with new milestones', time: '3 hours ago', unread: false },
	{ id: 4, text: 'Skill gap analysis completed for React', time: 'Yesterday', unread: false },
]

/**
 * NotificationBell — bell icon with unread badge + floating popup.
 */
export function NotificationBell() {
	const [isOpen, setIsOpen] = useState(false)
	const ref = useRef(null)
	const unreadCount = PLACEHOLDER_NOTIFICATIONS.filter((n) => n.unread).length

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
				aria-label={`Notifications${unreadCount ? ` — ${unreadCount} unread` : ''}`}
				className="relative flex h-9 w-9 items-center justify-center rounded-xl text-[var(--color-muted)] transition-colors duration-200 hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]"
			>
				<Bell className="h-[18px] w-[18px]" strokeWidth={1.8} />

				{/* Unread badge */}
				{unreadCount > 0 && (
					<span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--color-primary)] px-1 text-[9px] font-bold text-white">
						{unreadCount}
					</span>
				)}
			</button>

			{/* Popup */}
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, y: 8, scale: 0.96 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: 8, scale: 0.96 }}
						transition={{ duration: 0.18, ease: 'easeOut' }}
						className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-2xl border shadow-lg"
						style={{
							backgroundColor: 'var(--floating-bg)',
							borderColor: 'var(--floating-border)',
							boxShadow: 'var(--floating-shadow)',
						}}
					>
						<div className="border-b border-[var(--color-border)] px-4 py-3">
							<p className="text-sm font-semibold text-[var(--color-text)]">Notifications</p>
						</div>

						<div className="max-h-72 overflow-y-auto">
							{PLACEHOLDER_NOTIFICATIONS.map((n) => (
								<div
									key={n.id}
									className="flex items-start gap-3 border-b border-[var(--color-border)] px-4 py-3 transition-colors duration-150 last:border-b-0 hover:bg-[var(--color-surface-2)]"
								>
									{n.unread && (
										<span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--color-primary)]" />
									)}
									{!n.unread && <span className="mt-1.5 h-2 w-2 shrink-0" />}
									<div className="min-w-0 flex-1">
										<p className="text-[13px] leading-snug text-[var(--color-text)]">{n.text}</p>
										<p className="mt-0.5 text-[11px] text-[var(--color-muted)]">{n.time}</p>
									</div>
								</div>
							))}
						</div>

						<div className="border-t border-[var(--color-border)] px-4 py-2.5 text-center">
							<button className="text-[12px] font-medium text-[var(--color-primary)] transition-colors hover:text-[var(--color-secondary)]">
								View all notifications
							</button>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}

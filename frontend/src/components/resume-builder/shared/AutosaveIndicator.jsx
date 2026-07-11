import { motion, AnimatePresence } from 'framer-motion'
import { Check, Loader2, Circle } from 'lucide-react'
import { useAutosaveStatus } from '@/stores/resumeStore.js'

const STATUS_CONFIG = {
	saved: {
		icon: Check,
		label: 'Saved just now',
		color: 'text-emerald-500',
		dotColor: 'bg-emerald-500',
	},
	saving: {
		icon: Loader2,
		label: 'Saving...',
		color: 'text-[var(--color-muted)]',
		dotColor: 'bg-[var(--color-muted)]',
		spin: true,
	},
	pending: {
		icon: Circle,
		label: 'Changes pending',
		color: 'text-amber-500',
		dotColor: 'bg-amber-500',
	},
}

/**
 * AutosaveIndicator — shows save status with animated transitions.
 */
export function AutosaveIndicator() {
	const status = useAutosaveStatus()
	const config = STATUS_CONFIG[status] || STATUS_CONFIG.saved
	const Icon = config.icon

	return (
		<AnimatePresence mode="wait">
			<motion.div
				key={status}
				initial={{ opacity: 0, y: -4 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: 4 }}
				transition={{ duration: 0.2 }}
				className={`flex items-center gap-1.5 ${config.color}`}
			>
				<Icon
					className={`h-3.5 w-3.5 ${config.spin ? 'animate-spin' : ''}`}
					strokeWidth={2}
				/>
				<span className="text-xs font-medium">{config.label}</span>
			</motion.div>
		</AnimatePresence>
	)
}

import { motion } from 'framer-motion'
import { cn } from '@utils/classNames.js'

/**
 * Premium toggle switch for settings panels.
 */
export function ToggleSwitch({ checked, onChange, disabled = false, label, id, size = 'md' }) {
	const trackW = size === 'sm' ? 40 : 48
	const trackH = size === 'sm' ? 22 : 26
	const thumb = trackH - 4
	const travel = trackW - thumb - 4

	return (
		<button
			type="button"
			id={id}
			role="switch"
			aria-checked={checked}
			aria-label={label}
			disabled={disabled}
			onClick={() => onChange(!checked)}
			className={cn(
				'relative shrink-0 rounded-full border transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]',
				disabled && 'cursor-not-allowed opacity-50',
				checked
					? 'border-[var(--color-primary)] bg-[var(--color-primary)]'
					: 'border-[var(--color-border)] bg-[var(--color-surface-inset)]',
			)}
			style={{ width: trackW, height: trackH, padding: 2 }}
		>
			<motion.span
				animate={{ x: checked ? travel : 0 }}
				transition={{ type: 'spring', stiffness: 500, damping: 30 }}
				className="block rounded-full bg-white shadow-sm"
				style={{ width: thumb, height: thumb }}
			/>
		</button>
	)
}

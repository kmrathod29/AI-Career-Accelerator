import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'

/**
 * PlaceholderPage — reusable "Coming Soon" placeholder for feature pages.
 * Props: title, subtitle, icon (Lucide component).
 */
export function PlaceholderPage({ eyebrow, title, subtitle, icon: Icon }) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 16 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, ease: 'easeOut' }}
			className="flex flex-1 min-h-0 items-center justify-center px-4 py-10 sm:py-12"
		>
			<div className="text-center">
				{/* Icon */}
				<motion.div
					initial={{ scale: 0.8, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
					className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-2)]"
				>
					{Icon ? (
						<Icon className="h-9 w-9 text-[var(--color-primary)]" strokeWidth={1.5} />
					) : (
						<Clock className="h-9 w-9 text-[var(--color-primary)]" strokeWidth={1.5} />
					)}
				</motion.div>

				{/* Eyebrow */}
				{eyebrow && (
					<p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--color-primary)]">
						{eyebrow}
					</p>
				)}

				{/* Title */}
				<h2 className="mb-2 text-2xl font-black tracking-[-0.05em] text-[var(--color-text)] sm:text-3xl">
					{title}
				</h2>

				{/* Subtitle */}
				{subtitle && (
					<p className="mx-auto mb-5 max-w-sm text-base leading-[1.6] text-[var(--color-muted)]">
						{subtitle}
					</p>
				)}

				{/* Coming Soon badge */}
				<span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-primary)]/20 bg-[var(--color-primary)]/8 px-4 py-1.5 text-xs font-semibold text-[var(--color-primary)]">
					<span className="relative flex h-2 w-2">
						<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-primary)] opacity-40" />
						<span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-primary)]" />
					</span>
					Coming Soon
				</span>
			</div>
		</motion.div>
	)
}

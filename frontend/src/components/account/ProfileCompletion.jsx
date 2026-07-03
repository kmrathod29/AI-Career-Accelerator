import { motion } from 'framer-motion'

export function ProfileCompletion({ percentage }) {
	const radius = 36
	const circumference = 2 * Math.PI * radius
	const offset = circumference - (percentage / 100) * circumference

	return (
		<div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)] sm:p-5">
			<div className="flex items-center gap-5">
				<div className="relative h-[88px] w-[88px] shrink-0">
					<svg className="h-full w-full -rotate-90" viewBox="0 0 88 88">
						<circle
							cx="44"
							cy="44"
							r={radius}
							fill="none"
							stroke="var(--progress-track)"
							strokeWidth="6"
						/>
						<motion.circle
							cx="44"
							cy="44"
							r={radius}
							fill="none"
							stroke="var(--color-primary)"
							strokeWidth="6"
							strokeLinecap="round"
							strokeDasharray={circumference}
							initial={{ strokeDashoffset: circumference }}
							animate={{ strokeDashoffset: offset }}
							transition={{ duration: 0.8, ease: 'easeOut' }}
						/>
					</svg>
					<div className="absolute inset-0 flex items-center justify-center">
						<span className="text-lg font-bold text-[var(--color-text)]">{percentage}%</span>
					</div>
				</div>

				<div className="min-w-0 flex-1">
					<h3 className="text-sm font-semibold text-[var(--color-text)]">
						Profile Completion
					</h3>
					<p className="mt-1 text-xs leading-relaxed text-[var(--color-muted)]">
						{percentage >= 100
							? 'Your profile is complete. Great work!'
							: percentage >= 75
								? 'Almost there — add a few more details to stand out.'
								: 'Complete your profile to unlock personalized AI recommendations.'}
					</p>
					<div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--color-surface-inset)]">
						<motion.div
							className="h-full rounded-full bg-[var(--color-primary)]"
							initial={{ width: 0 }}
							animate={{ width: `${percentage}%` }}
							transition={{ duration: 0.8, ease: 'easeOut' }}
						/>
					</div>
				</div>
			</div>
		</div>
	)
}

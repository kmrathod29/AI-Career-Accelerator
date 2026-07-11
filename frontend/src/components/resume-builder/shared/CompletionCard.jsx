import { motion } from 'framer-motion'

/**
 * CompletionCard — circular SVG progress ring with animated stroke.
 */
export function CompletionCard({ percentage = 0 }) {
	const radius = 40
	const circumference = 2 * Math.PI * radius
	const offset = circumference - (percentage / 100) * circumference

	return (
		<div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-5">
			<p className="mb-3 text-xs font-semibold tracking-wide text-[var(--color-muted)] uppercase">
				Resume Completion
			</p>

			<div className="flex items-center gap-4">
				{/* SVG progress ring */}
				<div className="relative flex h-20 w-20 shrink-0 items-center justify-center">
					<svg className="-rotate-90" width="80" height="80" viewBox="0 0 88 88">
						{/* Background track */}
						<circle
							cx="44"
							cy="44"
							r={radius}
							fill="none"
							stroke="var(--progress-track)"
							strokeWidth="6"
						/>
						{/* Progress arc */}
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
							transition={{ duration: 1, ease: 'easeOut' }}
						/>
					</svg>
					<div className="absolute inset-0 flex items-center justify-center">
						<motion.span
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.3 }}
							className="text-lg font-bold text-[var(--color-text)]"
						>
							{percentage}%
						</motion.span>
					</div>
				</div>

				<div className="min-w-0">
					<p className="text-sm font-medium text-[var(--color-text)]">
						{percentage < 30
							? 'Getting started'
							: percentage < 60
								? 'Making progress'
								: percentage < 90
									? 'Almost there'
									: 'Complete!'}
					</p>
					<p className="mt-0.5 text-xs text-[var(--color-muted)]">
						Fill out more sections to improve your resume.
					</p>
				</div>
			</div>
		</div>
	)
}

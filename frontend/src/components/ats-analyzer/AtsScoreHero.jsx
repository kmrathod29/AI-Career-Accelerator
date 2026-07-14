import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { getScoreTier } from '@constants/atsAnalyzer.js'
import { cn } from '@utils/classNames.js'

const RADIUS = 85
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

const TIER_COLORS = {
	emerald: { stroke: '#10B981', badge: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
	blue: { stroke: '#3B82F6', badge: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
	amber: { stroke: '#F59E0B', badge: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
	red: { stroke: '#EF4444', badge: 'bg-red-500/10 text-red-500 border-red-500/20' },
}

/**
 * AtsScoreHero — large circular score indicator with animated ring.
 */
export function AtsScoreHero({ score = 0 }) {
	const [displayScore, setDisplayScore] = useState(0)
	const tier = getScoreTier(score)
	const colors = TIER_COLORS[tier.color] ?? TIER_COLORS.blue
	const offset = CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE

	/* Animated count-up */
	useEffect(() => {
		let frame
		const duration = 1200
		const start = performance.now()

		function step(now) {
			const elapsed = now - start
			const progress = Math.min(elapsed / duration, 1)
			/* Ease-out cubic */
			const eased = 1 - Math.pow(1 - progress, 3)
			setDisplayScore(Math.round(eased * score))

			if (progress < 1) {
				frame = requestAnimationFrame(step)
			}
		}

		frame = requestAnimationFrame(step)
		return () => cancelAnimationFrame(frame)
	}, [score])

	return (
		<motion.div
			initial={{ opacity: 0, y: 16 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-card)]"
		>
			<h3 className="mb-5 text-sm font-semibold text-[var(--color-text)]">
				Overall ATS Score
			</h3>

			<div className="flex flex-col items-center">
				{/* Circular score ring */}
				<div className="relative mb-5">
					<svg width="200" height="200" viewBox="0 0 200 200" className="-rotate-90">
						{/* Track */}
						<circle
							cx="100"
							cy="100"
							r={RADIUS}
							fill="none"
							stroke="var(--progress-track)"
							strokeWidth="12"
							strokeLinecap="round"
						/>
						{/* Score arc */}
						<circle
							cx="100"
							cy="100"
							r={RADIUS}
							fill="none"
							stroke={colors.stroke}
							strokeWidth="12"
							strokeLinecap="round"
							strokeDasharray={CIRCUMFERENCE}
							strokeDashoffset={CIRCUMFERENCE}
							className="animate-score-ring"
							style={{
								'--score-circumference': CIRCUMFERENCE,
								'--score-offset': offset,
							}}
						/>
					</svg>

					{/* Center text */}
					<div className="absolute inset-0 flex flex-col items-center justify-center">
						<span className="text-4xl font-bold tracking-tight text-[var(--color-text)]">
							{displayScore}
						</span>
						<span className="text-sm text-[var(--color-muted)]">/ 100</span>
					</div>
				</div>

				{/* Status badge */}
				<span
					className={cn(
						'mb-3 inline-flex items-center rounded-full border px-3.5 py-1 text-xs font-semibold',
						colors.badge,
					)}
				>
					{tier.label}
				</span>

				{/* Description */}
				<p className="max-w-xs text-center text-sm leading-relaxed text-[var(--color-muted)]">
					{tier.description}
				</p>
			</div>
		</motion.div>
	)
}

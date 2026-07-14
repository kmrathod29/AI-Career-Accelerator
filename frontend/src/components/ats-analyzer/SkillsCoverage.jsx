import { motion } from 'framer-motion'
import { BarChart3 } from 'lucide-react'

/**
 * SkillsCoverage — dual progress bars showing current vs recommended match.
 */
export function SkillsCoverage({ skills = [] }) {
	return (
		<div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
			<div className="mb-4 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<BarChart3 className="h-4 w-4 text-[var(--color-primary)]" strokeWidth={1.8} />
					<h3 className="text-sm font-semibold text-[var(--color-text)]">
						Skills Coverage
					</h3>
				</div>
				<div className="flex items-center gap-3">
					<div className="flex items-center gap-1.5">
						<span className="h-2 w-2 rounded-full bg-[var(--color-primary)]" />
						<span className="text-[10px] text-[var(--color-muted)]">Current</span>
					</div>
					<div className="flex items-center gap-1.5">
						<span className="h-2 w-2 rounded-full bg-[var(--color-surface-3)]" />
						<span className="text-[10px] text-[var(--color-muted)]">Recommended</span>
					</div>
				</div>
			</div>

			<div className="space-y-3.5">
				{skills.map((skill, i) => (
					<div key={skill.name}>
						<div className="mb-1.5 flex items-center justify-between">
							<span className="text-[13px] font-medium text-[var(--color-text)]">
								{skill.name}
							</span>
							<span className="text-[11px] text-[var(--color-muted)]">
								{skill.current}% / {skill.recommended}%
							</span>
						</div>

						{/* Stacked bars */}
						<div className="relative h-2 overflow-hidden rounded-full bg-[var(--progress-track)]">
							{/* Recommended (background) */}
							<motion.div
								initial={{ width: 0 }}
								animate={{ width: `${skill.recommended}%` }}
								transition={{ duration: 0.7, delay: 0.1 + i * 0.05, ease: 'easeOut' }}
								className="absolute inset-y-0 left-0 rounded-full bg-[var(--color-surface-3)]"
							/>
							{/* Current (foreground) */}
							<motion.div
								initial={{ width: 0 }}
								animate={{ width: `${skill.current}%` }}
								transition={{ duration: 0.8, delay: 0.2 + i * 0.05, ease: 'easeOut' }}
								className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]"
							/>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

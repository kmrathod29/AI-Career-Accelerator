import { motion } from 'framer-motion'
import {
	FileCheck, Search, BookOpen, LayoutList, SpellCheck,
	Contact, Briefcase, GraduationCap, Code,
} from 'lucide-react'

const ICON_MAP = {
	FileCheck, Search, BookOpen, LayoutList, SpellCheck,
	Contact, Briefcase, GraduationCap, Code,
}

/**
 * ScoreBreakdown — grid of category score cards with animated progress bars.
 */
export function ScoreBreakdown({ breakdown = [] }) {
	return (
		<div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
			<h3 className="mb-4 text-sm font-semibold text-[var(--color-text)]">
				Score Breakdown
			</h3>

			<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
				{breakdown.map((item, i) => {
					const Icon = ICON_MAP[item.icon] ?? FileCheck
					const color =
						item.score >= 90
							? 'from-emerald-500 to-emerald-600'
							: item.score >= 70
								? 'from-blue-500 to-blue-600'
								: item.score >= 50
									? 'from-amber-500 to-amber-600'
									: 'from-red-500 to-red-600'

					return (
						<motion.div
							key={item.id}
							initial={{ opacity: 0, y: 12 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.35, delay: i * 0.04 }}
							className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3.5"
						>
							<div className="mb-2.5 flex items-center justify-between">
								<div className="flex items-center gap-2.5">
									<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-surface)]">
										<Icon className="h-4 w-4 text-[var(--color-muted)]" strokeWidth={1.8} />
									</div>
									<span className="text-[13px] font-medium text-[var(--color-text)]">
										{item.label}
									</span>
								</div>
								<span className="text-sm font-bold text-[var(--color-text)]">
									{item.score}%
								</span>
							</div>

							{/* Progress bar */}
							<div className="mb-2 h-1.5 overflow-hidden rounded-full bg-[var(--progress-track)]">
								<motion.div
									initial={{ width: 0 }}
									animate={{ width: `${item.score}%` }}
									transition={{ duration: 0.8, delay: 0.2 + i * 0.04, ease: 'easeOut' }}
									className={`h-full rounded-full bg-gradient-to-r ${color}`}
								/>
							</div>

							<p className="text-[11px] leading-snug text-[var(--color-muted)]">
								{item.explanation}
							</p>
						</motion.div>
					)
				})}
			</div>
		</div>
	)
}

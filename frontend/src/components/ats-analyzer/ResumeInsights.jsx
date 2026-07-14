import { motion } from 'framer-motion'
import {
	Type, FileText, Clock, AlignLeft,
	Target, MessageCircle, Hash, Zap,
} from 'lucide-react'
import { INSIGHT_DEFINITIONS } from '@constants/atsAnalyzer.js'

const ICON_MAP = {
	Type, FileText, Clock, AlignLeft,
	Target, MessageCircle, Hash, Zap,
}

/**
 * ResumeInsights — compact statistic cards grid.
 */
export function ResumeInsights({ insights = {} }) {
	return (
		<div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
			<h3 className="mb-4 text-sm font-semibold text-[var(--color-text)]">
				Resume Insights
			</h3>

			<div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
				{INSIGHT_DEFINITIONS.map((def, i) => {
					const Icon = ICON_MAP[def.icon] ?? FileText
					const value = insights[def.key]
					if (value == null) return null

					return (
						<motion.div
							key={def.key}
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.3, delay: i * 0.04 }}
							className="flex flex-col items-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3 text-center"
						>
							<Icon className="mb-1.5 h-4 w-4 text-[var(--color-primary)]" strokeWidth={1.8} />
							<span className="text-lg font-bold tracking-tight text-[var(--color-text)]">
								{def.format(value)}
							</span>
							<span className="mt-0.5 text-[10px] text-[var(--color-muted)]">
								{def.label}
							</span>
						</motion.div>
					)
				})}
			</div>
		</div>
	)
}

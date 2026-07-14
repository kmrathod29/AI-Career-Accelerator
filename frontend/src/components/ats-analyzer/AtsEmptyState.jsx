import { motion } from 'framer-motion'
import { Target, Search, Sparkles } from 'lucide-react'

const FEATURES = [
	{
		icon: Target,
		title: 'ATS Score',
		value: '92%',
		description: 'Get an instant compatibility score with modern ATS systems.',
		color: 'from-emerald-500 to-emerald-600',
	},
	{
		icon: Search,
		title: 'Keyword Match',
		value: '3 Categories',
		description: 'See matched, missing, and suggested keywords for your role.',
		color: 'from-blue-500 to-blue-600',
	},
	{
		icon: Sparkles,
		title: 'AI Improvements',
		value: '7+ Tips',
		description: 'Action verbs, formatting, grammar, and keyword optimization.',
		color: 'from-violet-500 to-violet-600',
	},
]

/**
 * FeaturePreviewCards — three preview cards showing what users will receive.
 * Display only — no actions. Used in the onboarding empty state.
 */
export function FeaturePreviewCards() {
	return (
		<div className="mx-auto grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-3 sm:max-w-none">
			{FEATURES.map((feature, i) => (
				<motion.div
					key={feature.title}
					initial={{ opacity: 0, y: 12 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4, delay: 0.15 + i * 0.08 }}
					className="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition-shadow duration-300 hover:shadow-[var(--shadow-card)]"
				>
					{/* Icon */}
					<div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} shadow-sm transition-transform duration-200 group-hover:scale-105`}>
						<feature.icon className="h-5 w-5 text-white" strokeWidth={2} />
					</div>

					{/* Title + value */}
					<h4 className="text-sm font-semibold text-[var(--color-text)]">
						{feature.title}
					</h4>
					<p className="mt-0.5 text-xs font-medium text-[var(--color-primary)]">
						{feature.value}
					</p>

					{/* Description */}
					<p className="mt-2 text-[12px] leading-relaxed text-[var(--color-muted)]">
						{feature.description}
					</p>
				</motion.div>
			))}
		</div>
	)
}

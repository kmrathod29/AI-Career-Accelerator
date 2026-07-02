import { motion } from 'framer-motion'
import { Sparkles, ArrowRight } from 'lucide-react'

/**
 * UpgradeCard — decorative sidebar card prompting upgrade.
 * Only visible when sidebar is expanded. Placeholder — no logic.
 */
export function UpgradeCard() {
	return (
		<motion.div
			initial={{ opacity: 0, y: 8 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.3, duration: 0.4 }}
			className="mx-3 mb-4 overflow-hidden rounded-2xl border border-[var(--color-primary)]/15 p-4"
			style={{
				background: 'linear-gradient(135deg, rgba(37,99,235,0.08) 0%, rgba(99,102,241,0.06) 100%)',
			}}
		>
			<div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-primary)]/15">
				<Sparkles className="h-4 w-4 text-[var(--color-primary)]" />
			</div>

			<p className="mb-1 text-[13px] font-semibold text-[var(--color-text)]">
				Upgrade to Pro
			</p>
			<p className="mb-3 text-[11px] leading-relaxed text-[var(--color-muted)]">
				Unlock all AI tools and premium features.
			</p>

			<button
				type="button"
				className="group inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-primary)] px-3 py-1.5 text-[11px] font-semibold text-white transition-all duration-200 hover:brightness-110"
			>
				Explore Plans
				<ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
			</button>
		</motion.div>
	)
}

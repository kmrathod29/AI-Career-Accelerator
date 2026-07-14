import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ScanSearch } from 'lucide-react'
import { LOADING_STEPS } from '@constants/atsAnalyzer.js'
import { useAtsLoading } from '@/stores/atsStore.js'

/**
 * AtsLoadingState — premium multi-step loading animation with skeleton.
 */
export function AtsLoadingState() {
	const { loadingStep } = useAtsLoading()
	const [dots, setDots] = useState('')

	/* Animate dots */
	useEffect(() => {
		const interval = setInterval(() => {
			setDots((prev) => (prev.length >= 3 ? '' : prev + '.'))
		}, 400)
		return () => clearInterval(interval)
	}, [])

	const stepMessage = LOADING_STEPS[loadingStep] ?? LOADING_STEPS[0]
	const progress = ((loadingStep + 1) / LOADING_STEPS.length) * 100

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="flex flex-col items-center justify-center py-20"
		>
			{/* Animated scanner icon */}
			<motion.div
				animate={{
					rotate: [0, 360],
					scale: [1, 1.1, 1],
				}}
				transition={{
					rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
					scale: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
				}}
				className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--color-primary)]/10"
			>
				<ScanSearch className="h-10 w-10 text-[var(--color-primary)]" strokeWidth={1.5} />
			</motion.div>

			{/* Step message */}
			<AnimatePresence mode="wait">
				<motion.p
					key={loadingStep}
					initial={{ opacity: 0, y: 8 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -8 }}
					transition={{ duration: 0.25 }}
					className="mb-3 text-base font-semibold text-[var(--color-text)]"
				>
					{stepMessage}{dots}
				</motion.p>
			</AnimatePresence>

			{/* Progress bar */}
			<div className="mb-2 h-1.5 w-64 overflow-hidden rounded-full bg-[var(--progress-track)]">
				<motion.div
					animate={{ width: `${progress}%` }}
					transition={{ duration: 0.6, ease: 'easeOut' }}
					className="h-full rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]"
				/>
			</div>

			<p className="text-xs text-[var(--color-muted)]">
				Step {loadingStep + 1} of {LOADING_STEPS.length}
			</p>

			{/* Skeleton cards */}
			<div className="mt-10 grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
				{[...Array(4)].map((_, i) => (
					<div
						key={i}
						className="h-24 rounded-xl animate-shimmer"
					/>
				))}
			</div>
		</motion.div>
	)
}

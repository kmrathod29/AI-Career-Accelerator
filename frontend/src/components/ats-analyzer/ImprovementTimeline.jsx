import { motion } from 'framer-motion'
import { ListTodo } from 'lucide-react'
import { PRIORITY_CONFIG } from '@constants/atsAnalyzer.js'
import { cn } from '@utils/classNames.js'

/**
 * ImprovementTimeline — prioritized roadmap card with visual connector.
 */
export function ImprovementTimeline({ items = [] }) {
	return (
		<div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
			<div className="mb-4 flex items-center gap-2">
				<ListTodo className="h-4 w-4 text-[var(--color-primary)]" strokeWidth={1.8} />
				<h3 className="text-sm font-semibold text-[var(--color-text)]">
					Improvement Timeline
				</h3>
			</div>

			<div className="relative ml-3">
				{/* Vertical line */}
				<div className="absolute bottom-2 left-0 top-2 w-px bg-[var(--color-border)]" />

				<div className="space-y-3">
					{items.map((item, i) => {
						const priority = PRIORITY_CONFIG[item.priority] ?? PRIORITY_CONFIG.low
						return (
							<motion.div
								key={item.id}
								initial={{ opacity: 0, x: -8 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ duration: 0.3, delay: i * 0.06 }}
								className="relative flex items-center gap-3 pl-5"
							>
								{/* Dot on timeline */}
								<div
									className={cn(
										'absolute left-[-4px] h-2 w-2 rounded-full',
										priority.dotClass,
									)}
								/>

								{/* Content */}
								<div className="flex min-w-0 flex-1 items-center justify-between gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3.5 py-2.5">
									<span className="truncate text-[13px] text-[var(--color-text)]">
										{item.label}
									</span>
									<span
										className={cn(
											'shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold',
											priority.bgClass,
											priority.textClass,
										)}
									>
										{priority.label}
									</span>
								</div>
							</motion.div>
						)
					})}
				</div>
			</div>
		</div>
	)
}

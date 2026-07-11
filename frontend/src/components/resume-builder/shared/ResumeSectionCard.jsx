import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
	ChevronDown,
	Copy,
	Trash2,
	ChevronDown as MoveDownIcon,
	ChevronUp as MoveUpIcon,
} from 'lucide-react'
import { cn } from '@utils/classNames.js'

/**
 * ResumeSectionCard — collapsible card wrapper for each resume section.
 * Provides expand/collapse, duplicate, delete, and reorder actions.
 */
export function ResumeSectionCard({
	title,
	icon: Icon,
	isComplete,
	isExpanded,
	onToggle,
	onDuplicate,
	onDelete,
	onMoveUp,
	onMoveDown,
	canMoveUp = true,
	canMoveDown = true,
	children,
	className,
	badge,
}) {
	const [isHovered, setIsHovered] = useState(false)

	return (
		<motion.div
			layout
			initial={{ opacity: 0, y: 12 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -12 }}
			transition={{ duration: 0.25 }}
			className={cn(
				'group rounded-2xl border bg-[var(--color-surface)] transition-all duration-200',
				isExpanded
					? 'border-[var(--color-primary)]/20 shadow-[var(--shadow-card)]'
					: 'border-[var(--color-border)] hover:border-[var(--color-primary)]/15 hover:shadow-[var(--shadow-card)]',
				className,
			)}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			{/* Header */}
			<div
				role="button"
				tabIndex={0}
				onClick={onToggle}
				onKeyDown={(event) => {
					if (event.key === 'Enter' || event.key === ' ') {
						event.preventDefault()
						onToggle?.()
					}
				}}
				className="flex w-full items-center gap-3 px-4 py-3.5 text-left sm:px-5"
			>
				{/* Section icon */}
				<div
					className={cn(
						'flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-colors duration-200',
						isExpanded
							? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
							: 'bg-[var(--color-surface-2)] text-[var(--color-muted)]',
					)}
				>
					{Icon && <Icon className="h-4 w-4" strokeWidth={1.8} />}
				</div>

				{/* Title + badge */}
				<div className="min-w-0 flex-1">
					<div className="flex items-center gap-2">
						<span className="text-sm font-semibold text-[var(--color-text)]">
							{title}
						</span>
						{badge != null && (
							<span className="rounded-full bg-[var(--color-surface-2)] px-2 py-0.5 text-[10px] font-medium text-[var(--color-muted)]">
								{badge}
							</span>
						)}
					</div>
				</div>

				{/* Completion indicator */}
				<div className="flex items-center gap-2">
					{isComplete && (
						<span className="flex h-2 w-2 rounded-full bg-emerald-500" />
					)}

					{/* Action buttons — visible on hover or when expanded */}
					<AnimatePresence>
						{(isHovered || isExpanded) && (
							<motion.div
								initial={{ opacity: 0, width: 0 }}
								animate={{ opacity: 1, width: 'auto' }}
								exit={{ opacity: 0, width: 0 }}
								className="flex items-center gap-0.5 overflow-hidden"
								onClick={(e) => e.stopPropagation()}
							>
								{onMoveUp && (
									<button
										type="button"
										onClick={onMoveUp}
										disabled={!canMoveUp}
										className="rounded-lg p-1.5 text-[var(--color-muted)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)] disabled:opacity-30"
										title="Move up"
									>
										<MoveUpIcon className="h-3.5 w-3.5" />
									</button>
								)}
								{onMoveDown && (
									<button
										type="button"
										onClick={onMoveDown}
										disabled={!canMoveDown}
										className="rounded-lg p-1.5 text-[var(--color-muted)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)] disabled:opacity-30"
										title="Move down"
									>
										<MoveDownIcon className="h-3.5 w-3.5" />
									</button>
								)}
								{onDuplicate && (
									<button
										type="button"
										onClick={onDuplicate}
										className="rounded-lg p-1.5 text-[var(--color-muted)] transition-colors hover:bg-[var(--color-surface-2)] hover:text-[var(--color-text)]"
										title="Duplicate"
									>
										<Copy className="h-3.5 w-3.5" />
									</button>
								)}
								{onDelete && (
									<button
										type="button"
										onClick={onDelete}
										className="rounded-lg p-1.5 text-[var(--color-muted)] transition-colors hover:bg-[var(--notif-error-bg)] hover:text-[var(--color-danger)]"
										title="Delete"
									>
										<Trash2 className="h-3.5 w-3.5" />
									</button>
								)}
							</motion.div>
						)}
					</AnimatePresence>

					{/* Chevron */}
					<motion.div
						animate={{ rotate: isExpanded ? 180 : 0 }}
						transition={{ duration: 0.2 }}
					>
						<ChevronDown className="h-4 w-4 text-[var(--color-muted)]" />
					</motion.div>
				</div>
			</div>

			{/* Expandable content */}
			<AnimatePresence initial={false}>
				{isExpanded && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: 'auto', opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.25, ease: 'easeInOut' }}
						className="overflow-hidden"
					>
						<div className="border-t border-[var(--color-border)] px-4 py-4 sm:px-5 sm:py-5">
							{children}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	)
}

import { cn } from '@utils/classNames.js'
import { GripVertical } from 'lucide-react'

/**
 * SectionListItem — row in the sidebar section list.
 * Shows drag handle, icon, label, and completion indicator.
 */
export function SectionListItem({ icon: Icon, label, isComplete, isActive, onClick }) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				'group flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left transition-all duration-150',
				isActive
					? 'bg-[var(--color-primary)]/8 text-[var(--color-primary)]'
					: 'text-[var(--color-text)] hover:bg-[var(--color-surface-2)]',
			)}
		>
			{/* Drag handle */}
			<GripVertical
				className="h-3.5 w-3.5 shrink-0 cursor-grab text-[var(--color-muted)] opacity-0 transition-opacity group-hover:opacity-60"
				strokeWidth={1.5}
			/>

			{/* Section icon */}
			{Icon && (
				<Icon
					className={cn(
						'h-4 w-4 shrink-0 transition-colors',
						isActive ? 'text-[var(--color-primary)]' : 'text-[var(--color-muted)]',
					)}
					strokeWidth={1.8}
				/>
			)}

			{/* Label */}
			<span className="min-w-0 flex-1 truncate text-[13px] font-medium">{label}</span>

			{/* Completion dot */}
			<span
				className={cn(
					'h-2 w-2 shrink-0 rounded-full transition-colors',
					isComplete ? 'bg-emerald-500' : 'bg-[var(--color-surface-3)]',
				)}
			/>
		</button>
	)
}

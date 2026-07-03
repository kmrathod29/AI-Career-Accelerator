import { Skeleton } from '@components/skeleton/Skeleton.jsx'

/**
 * Skeleton loader for notification lists.
 */
export function NotificationSkeleton({ count = 5, compact = false }) {
	return (
		<div className="divide-y divide-[var(--color-border)]">
			{Array.from({ length: count }).map((_, i) => (
				<div
					key={i}
					className={compact ? 'flex items-start gap-3 px-4 py-3' : 'flex items-start gap-4 px-5 py-4'}
				>
					<Skeleton className={compact ? 'h-7 w-7 shrink-0 rounded-lg' : 'h-9 w-9 shrink-0 rounded-xl'} />
					<div className="min-w-0 flex-1 space-y-2">
						<Skeleton className="h-3.5 w-3/4 rounded-lg" />
						<Skeleton className="h-3 w-full rounded-lg" />
						{!compact && <Skeleton className="h-2.5 w-1/4 rounded-lg" />}
					</div>
				</div>
			))}
		</div>
	)
}

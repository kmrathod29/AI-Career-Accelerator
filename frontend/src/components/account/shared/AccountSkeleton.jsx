import { Skeleton } from '@components/skeleton/Skeleton.jsx'

export function AccountSkeleton() {
	return (
		<div className="mx-auto min-w-0 max-w-6xl overflow-x-hidden">
			<Skeleton className="mb-4 h-7 w-40 sm:mb-6 sm:h-8 sm:w-48" />
			<div className="flex flex-col gap-4 md:flex-row md:gap-6">
				<Skeleton className="hidden h-[520px] w-full shrink-0 rounded-2xl md:block md:w-56" />
				<Skeleton className="h-9 w-full rounded-xl md:hidden" />
				<div className="min-w-0 flex-1 space-y-3 sm:space-y-4">
					<Skeleton className="h-40 w-full rounded-2xl sm:h-48" />
					<div className="grid grid-cols-2 gap-2 md:hidden">
						<Skeleton className="h-24 w-full rounded-2xl" />
						<Skeleton className="h-24 w-full rounded-2xl" />
						<Skeleton className="h-24 w-full rounded-2xl" />
						<Skeleton className="h-24 w-full rounded-2xl" />
					</div>
					<Skeleton className="h-32 w-full rounded-2xl sm:h-40" />
					<Skeleton className="hidden h-64 w-full rounded-2xl md:block" />
				</div>
			</div>
		</div>
	)
}

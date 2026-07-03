import { Skeleton } from '@components/skeleton/Skeleton.jsx'

export function AccountSkeleton() {
	return (
		<div className="mx-auto max-w-6xl">
			<Skeleton className="mb-6 h-8 w-48" />
			<div className="flex flex-col gap-6 lg:flex-row">
				<Skeleton className="hidden h-[520px] w-full shrink-0 rounded-2xl lg:block lg:w-56" />
				<Skeleton className="h-10 w-full rounded-xl lg:hidden" />
				<div className="flex-1 space-y-4">
					<Skeleton className="h-48 w-full rounded-2xl" />
					<Skeleton className="h-64 w-full rounded-2xl" />
					<Skeleton className="h-40 w-full rounded-2xl" />
				</div>
			</div>
		</div>
	)
}

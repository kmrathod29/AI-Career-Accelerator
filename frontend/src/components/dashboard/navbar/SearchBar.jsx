import { Search } from 'lucide-react'

/**
 * SearchBar — UI-only search input.
 * Pill shape, ⌘K shortcut badge, focus ring. No search logic.
 */
export function SearchBar() {
	return (
		<div className="relative hidden w-full max-w-xs lg:block">
			<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted)]" />
			<input
				type="text"
				placeholder="Search anything…"
				readOnly
				className="h-9 w-full cursor-pointer rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] pl-9 pr-14 text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)] transition-all duration-200 focus:border-[var(--color-primary)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
			/>
			<kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-1.5 py-0.5 text-[10px] font-medium text-[var(--color-muted)]">
				⌘K
			</kbd>
		</div>
	)
}

import { useState } from 'react'
import { Search } from 'lucide-react'
import { toast } from 'sonner'

/**
 * UI-only global search. It deliberately has no API or navigation behavior
 * until product search is available.
 */
export function SearchBar() {
	const [query, setQuery] = useState('')

	const handleSubmit = (event) => {
		event.preventDefault()
		if (!query.trim()) return

		toast.info('Search is coming soon.', {
			description: "We're working on making everything easier to find.",
		})
	}

	return (
		<form className="relative hidden w-full max-w-xs lg:block" onSubmit={handleSubmit}>
			<Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted)]" />
			<input
				type="search"
				value={query}
				onChange={(event) => setQuery(event.target.value)}
				placeholder="Search anything…"
				aria-label="Search anything"
				className="h-9 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] pl-9 pr-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)] transition-all duration-200 focus:border-[var(--color-primary)]/40 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
			/>
		</form>
	)
}

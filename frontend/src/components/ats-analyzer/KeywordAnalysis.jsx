import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@utils/classNames.js'

const CHIP_STYLES = {
	matched: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20 dark:text-emerald-400',
	missing: 'bg-red-500/10 text-red-600 border-red-500/20 hover:bg-red-500/20 dark:text-red-400',
	suggested: 'bg-blue-500/10 text-blue-600 border-blue-500/20 hover:bg-blue-500/20 dark:text-blue-400',
}

function KeywordChip({ keyword, variant = 'matched' }) {
	return (
		<motion.button
			type="button"
			whileHover={{ scale: 1.05 }}
			whileTap={{ scale: 0.95 }}
			onClick={() => toast.info(`Keyword: ${keyword}`)}
			className={cn(
				'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors',
				CHIP_STYLES[variant],
			)}
		>
			{keyword}
		</motion.button>
	)
}

/**
 * KeywordAnalysis — search + three keyword sections (matched/missing/suggested).
 */
export function KeywordAnalysis({
	matched = [],
	missing = [],
	suggested = [],
}) {
	const [search, setSearch] = useState('')

	const filteredMatched = useMemo(
		() => matched.filter((k) => k.toLowerCase().includes(search.toLowerCase())),
		[matched, search],
	)
	const filteredMissing = useMemo(
		() => missing.filter((k) => k.toLowerCase().includes(search.toLowerCase())),
		[missing, search],
	)
	const filteredSuggested = useMemo(
		() => suggested.filter((k) => k.toLowerCase().includes(search.toLowerCase())),
		[suggested, search],
	)

	return (
		<div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
			<div className="mb-4 flex items-center justify-between">
				<h3 className="text-sm font-semibold text-[var(--color-text)]">
					Keyword Analysis
				</h3>
				<span className="text-xs text-[var(--color-muted)]">
					{matched.length + missing.length} total
				</span>
			</div>

			{/* Search */}
			<div className="relative mb-4">
				<Search
					className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted)]"
					strokeWidth={1.8}
				/>
				<input
					type="search"
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					placeholder="Search keywords..."
					className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] py-2 pl-9 pr-3 text-sm text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
					aria-label="Search keywords"
				/>
			</div>

			{/* Matched Keywords */}
			{filteredMatched.length > 0 && (
				<div className="mb-4">
					<p className="mb-2 flex items-center gap-2 text-xs font-semibold text-[var(--color-muted)]">
						<span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
						Matched Keywords
					</p>
					<div className="flex flex-wrap gap-2">
						{filteredMatched.map((k) => (
							<KeywordChip key={k} keyword={k} variant="matched" />
						))}
					</div>
				</div>
			)}

			{/* Missing Keywords */}
			{filteredMissing.length > 0 && (
				<div className="mb-4">
					<p className="mb-2 flex items-center gap-2 text-xs font-semibold text-[var(--color-muted)]">
						<span className="h-1.5 w-1.5 rounded-full bg-red-500" />
						Missing Keywords
					</p>
					<div className="flex flex-wrap gap-2">
						{filteredMissing.map((k) => (
							<KeywordChip key={k} keyword={k} variant="missing" />
						))}
					</div>
				</div>
			)}

			{/* Suggested Keywords */}
			{filteredSuggested.length > 0 && (
				<div>
					<p className="mb-2 flex items-center gap-2 text-xs font-semibold text-[var(--color-muted)]">
						<span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
						Suggested Keywords
					</p>
					<div className="flex flex-wrap gap-2">
						{filteredSuggested.map((k) => (
							<KeywordChip key={k} keyword={k} variant="suggested" />
						))}
					</div>
				</div>
			)}
		</div>
	)
}

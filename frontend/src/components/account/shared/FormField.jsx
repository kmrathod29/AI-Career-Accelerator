import { cn } from '@utils/classNames.js'

const inputBase =
	'w-full rounded-xl border bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] outline-none transition-colors duration-200 placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20'

export function FormField({
	label,
	id,
	error,
	hint,
	type = 'text',
	as = 'input',
	options = [],
	className,
	...props
}) {
	const errorClass = error ? 'border-red-400' : 'border-[var(--color-border)]'

	return (
		<div className={className}>
			{label && (
				<label htmlFor={id} className="mb-1.5 block text-sm font-medium text-[var(--color-text)]">
					{label}
				</label>
			)}

			{as === 'select' ? (
				<select
					id={id}
					className={cn(inputBase, errorClass, 'cursor-pointer appearance-none')}
					aria-invalid={!!error}
					{...props}
				>
					{options.map((opt) => (
						<option key={opt.value} value={opt.value}>
							{opt.label}
						</option>
					))}
				</select>
			) : as === 'textarea' ? (
				<textarea
					id={id}
					className={cn(inputBase, errorClass, 'min-h-[100px] resize-y')}
					aria-invalid={!!error}
					{...props}
				/>
			) : (
				<input
					id={id}
					type={type}
					className={cn(inputBase, errorClass)}
					aria-invalid={!!error}
					{...props}
				/>
			)}

			{hint && !error && (
				<p className="mt-1.5 text-xs text-[var(--color-muted)]">{hint}</p>
			)}
			{error && (
				<p role="alert" className="mt-1.5 text-xs text-red-500">
					{error}
				</p>
			)}
		</div>
	)
}

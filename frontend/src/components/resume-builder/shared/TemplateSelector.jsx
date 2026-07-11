import { motion } from 'framer-motion'
import { RESUME_TEMPLATES } from '@constants/resumeBuilder.js'
import { useResumeTemplate, resumeStore } from '@/stores/resumeStore.js'
import { cn } from '@utils/classNames.js'

/**
 * TemplateSelector — grid of template cards to switch preview styling.
 */
export function TemplateSelector() {
	const activeTemplate = useResumeTemplate()

	return (
		<div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 sm:p-5">
			<p className="mb-3 text-xs font-semibold tracking-wide text-[var(--color-muted)] uppercase">
				Template
			</p>

			<div className="grid grid-cols-2 gap-2 sm:grid-cols-1 lg:grid-cols-1">
				{RESUME_TEMPLATES.map((template) => {
					const isActive = activeTemplate === template.id
					return (
						<motion.button
							key={template.id}
							type="button"
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.98 }}
							onClick={() => resumeStore.setTemplate(template.id)}
							className={cn(
								'rounded-xl border px-3 py-2.5 text-left transition-all duration-200',
								isActive
									? 'border-[var(--color-primary)]/30 bg-[var(--color-primary)]/5 shadow-sm'
									: 'border-[var(--color-border)] hover:border-[var(--color-primary)]/15 hover:bg-[var(--color-surface-2)]',
							)}
						>
							<div className="flex items-center gap-2.5">
								{/* Active indicator */}
								<span
									className={cn(
										'flex h-3 w-3 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
										isActive
											? 'border-[var(--color-primary)]'
											: 'border-[var(--color-border)]',
									)}
								>
									{isActive && (
										<motion.span
											initial={{ scale: 0 }}
											animate={{ scale: 1 }}
											className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]"
										/>
									)}
								</span>

								<div className="min-w-0">
									<p
										className={cn(
											'text-[13px] font-medium',
											isActive
												? 'text-[var(--color-primary)]'
												: 'text-[var(--color-text)]',
										)}
									>
										{template.label}
									</p>
									<p className="text-[11px] text-[var(--color-muted)]">
										{template.description}
									</p>
								</div>
							</div>
						</motion.button>
					)
				})}
			</div>
		</div>
	)
}

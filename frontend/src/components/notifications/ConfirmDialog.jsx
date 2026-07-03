import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import { cn } from '@utils/classNames.js'

/**
 * Premium confirmation dialog for destructive actions.
 */
export function ConfirmDialog({
	open,
	onClose,
	onConfirm,
	title = 'Are you sure?',
	description = 'This action cannot be undone.',
	confirmLabel = 'Confirm',
	cancelLabel = 'Cancel',
	variant = 'danger',
	loading = false,
}) {
	useEffect(() => {
		if (!open) return

		const handleKey = (e) => {
			if (e.key === 'Escape') onClose()
		}
		document.addEventListener('keydown', handleKey)
		document.body.style.overflow = 'hidden'

		return () => {
			document.removeEventListener('keydown', handleKey)
			document.body.style.overflow = ''
		}
	}, [open, onClose])

	if (typeof document === 'undefined') return null

	return createPortal(
		<AnimatePresence>
			{open && (
				<>
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
						className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-[2px]"
						onClick={onClose}
						aria-hidden
					/>

					<div className="fixed inset-0 z-[101] flex items-center justify-center p-4">
						<motion.div
							role="alertdialog"
							aria-modal="true"
							aria-labelledby="confirm-dialog-title"
							aria-describedby="confirm-dialog-desc"
							initial={{ opacity: 0, scale: 0.96, y: 8 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.96, y: 8 }}
							transition={{ duration: 0.2, ease: 'easeOut' }}
							className="w-full max-w-md overflow-hidden rounded-2xl border shadow-xl"
							style={{
								backgroundColor: 'var(--floating-bg)',
								borderColor: 'var(--floating-border)',
								boxShadow: 'var(--floating-shadow)',
							}}
							onClick={(e) => e.stopPropagation()}
						>
							<div className="p-6">
								<div className="mb-4 flex items-start gap-4">
									<div
										className={cn(
											'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
											variant === 'danger'
												? 'bg-[var(--notif-error-bg)] text-[var(--notif-error)]'
												: 'bg-[var(--color-surface-2)] text-[var(--color-primary)]',
										)}
									>
										<AlertTriangle className="h-5 w-5" strokeWidth={1.8} />
									</div>
									<div>
										<h2
											id="confirm-dialog-title"
											className="text-base font-semibold text-[var(--color-text)]"
										>
											{title}
										</h2>
										<p
											id="confirm-dialog-desc"
											className="mt-1.5 text-sm leading-relaxed text-[var(--color-muted)]"
										>
											{description}
										</p>
									</div>
								</div>

								<div className="flex items-center justify-end gap-2.5">
									<button
										type="button"
										onClick={onClose}
										disabled={loading}
										className="rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface-2)] disabled:opacity-50"
									>
										{cancelLabel}
									</button>
									<button
										type="button"
										onClick={onConfirm}
										disabled={loading}
										className={cn(
											'rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-opacity disabled:opacity-50',
											variant === 'danger'
												? 'bg-[var(--color-danger)] hover:opacity-90'
												: 'bg-[var(--color-primary)] hover:opacity-90',
										)}
									>
										{loading ? 'Processing...' : confirmLabel}
									</button>
								</div>
							</div>
						</motion.div>
					</div>
				</>
			)}
		</AnimatePresence>,
		document.body,
	)
}

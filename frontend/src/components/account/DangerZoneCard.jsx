import { useState } from 'react'
import { AlertTriangle, Trash2, PauseCircle } from 'lucide-react'
import { toast } from 'sonner'
import { SettingsCard } from './shared/SettingsCard.jsx'
import { ConfirmDialog } from '@components/notifications/ConfirmDialog.jsx'

export function DangerZoneCard() {
	const [confirmDelete, setConfirmDelete] = useState(false)
	const [confirmDeactivate, setConfirmDeactivate] = useState(false)
	const [loading, setLoading] = useState(false)

	const handleDelete = async () => {
		setLoading(true)
		await new Promise((r) => setTimeout(r, 800))
		setLoading(false)
		setConfirmDelete(false)
		toast.info('Coming Soon', { description: 'Account deletion will require email verification in production.' })
	}

	const handleDeactivate = async () => {
		setLoading(true)
		await new Promise((r) => setTimeout(r, 800))
		setLoading(false)
		setConfirmDeactivate(false)
		toast.info('Coming Soon', { description: 'Account deactivation will be available in a future update.' })
	}

	return (
		<div className="space-y-4">
			<div className="flex items-start gap-3 rounded-2xl border border-[var(--notif-error)]/20 bg-[var(--notif-error-bg)] px-5 py-4">
				<AlertTriangle className="h-5 w-5 shrink-0 text-[var(--notif-error)]" />
				<div>
					<p className="text-sm font-semibold text-[var(--notif-error)]">Danger Zone</p>
					<p className="mt-1 text-xs leading-relaxed text-[var(--color-muted)]">
						These actions are permanent or significantly affect your account. Proceed with caution.
					</p>
				</div>
			</div>

			<SettingsCard title="Account Actions" description="Irreversible and destructive actions.">
				<div className="space-y-4">
					<div className="flex flex-col gap-3 rounded-xl border border-[var(--color-border)] p-4 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<p className="text-sm font-medium text-[var(--color-text)]">Deactivate Account</p>
							<p className="mt-0.5 text-xs text-[var(--color-muted)]">
								Temporarily disable your account. You can reactivate anytime.
							</p>
						</div>
						<button
							type="button"
							onClick={() => setConfirmDeactivate(true)}
							className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface-2)]"
						>
							<PauseCircle className="h-4 w-4" />
							Deactivate
						</button>
					</div>

					<div className="flex flex-col gap-3 rounded-xl border border-[var(--notif-error)]/30 bg-[var(--notif-error-bg)]/30 p-4 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<p className="text-sm font-medium text-[var(--notif-error)]">Delete Account</p>
							<p className="mt-0.5 text-xs text-[var(--color-muted)]">
								Permanently delete your account and all associated data. This cannot be undone.
							</p>
						</div>
						<button
							type="button"
							onClick={() => setConfirmDelete(true)}
							className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-danger)] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
						>
							<Trash2 className="h-4 w-4" />
							Delete Account
						</button>
					</div>
				</div>
			</SettingsCard>

			<ConfirmDialog
				open={confirmDeactivate}
				onClose={() => setConfirmDeactivate(false)}
				onConfirm={handleDeactivate}
				title="Deactivate your account?"
				description="Your profile will be hidden and you won't receive notifications. You can reactivate by signing in again."
				confirmLabel="Deactivate Account"
				variant="default"
				loading={loading}
			/>

			<ConfirmDialog
				open={confirmDelete}
				onClose={() => setConfirmDelete(false)}
				onConfirm={handleDelete}
				title="Delete your account permanently?"
				description="All your resumes, interview history, roadmaps, and personal data will be permanently removed. This action cannot be undone."
				confirmLabel="Delete Account"
				loading={loading}
			/>
		</div>
	)
}

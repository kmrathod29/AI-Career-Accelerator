import { Monitor, Info } from 'lucide-react'
import { SettingsCard } from './shared/SettingsCard.jsx'

export function SessionsCard() {
	return (
		<div className="space-y-4">
			<SettingsCard
				title="Active Sessions"
				description="Devices where you're currently signed in."
			>
				<div className="py-8 text-center">
					<Monitor className="mx-auto h-10 w-10 text-[var(--color-muted)]" strokeWidth={1.5} />
					<p className="mt-3 text-sm font-medium text-[var(--color-text)]">Session tracking not yet available</p>
					<p className="mx-auto mt-1.5 max-w-sm text-xs leading-relaxed text-[var(--color-muted)]">
						Your current session is managed via a secure HttpOnly cookie. Individual device tracking will be available in a future update.
					</p>
				</div>
			</SettingsCard>

			<div className="flex items-start gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-4">
				<Info className="h-5 w-5 shrink-0 text-[var(--color-primary)]" />
				<div>
					<p className="text-sm font-medium text-[var(--color-text)]">About sessions</p>
					<p className="mt-1 text-xs leading-relaxed text-[var(--color-muted)]">
						Session tracking requires per-device metadata storage, which is not yet implemented. You can log out from the current device using the sidebar logout button.
					</p>
				</div>
			</div>
		</div>
	)
}

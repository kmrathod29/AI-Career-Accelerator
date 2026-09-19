import { useState } from 'react'
import { Download, FileText, Activity, Clock } from 'lucide-react'
import { toast } from 'sonner'
import { SettingsCard, SettingsRow } from './shared/SettingsCard.jsx'
import { accountStore } from '@/stores/accountStore.js'

export function DataExportCard() {
	const [exporting, setExporting] = useState(false)

	const handleExportProfile = async () => {
		setExporting(true)
		const result = await accountStore.exportData()
		setExporting(false)

		if (result.success && result.data) {
			const blob = new Blob([JSON.stringify(result.data, null, 2)], { type: 'application/json' })
			const url = URL.createObjectURL(blob)
			const a = document.createElement('a')
			a.href = url
			a.download = `profile-export-${Date.now()}.json`
			a.click()
			URL.revokeObjectURL(url)
			toast.success('Profile data downloaded')
		} else {
			toast.error(result.message || 'Failed to export data')
		}
	}

	const handleComingSoon = (feature) => {
		toast.info('Coming Soon', { description: `${feature} will be available in a future update.` })
	}

	return (
		<SettingsCard
			title="Data & Export"
			description="Download your data or export your career assets."
		>
			<div className="divide-y divide-[var(--color-border)]">
				<SettingsRow label="Download Profile Data" description="Export all your profile information as JSON from the database.">
					<button
						type="button"
						onClick={handleExportProfile}
						disabled={exporting}
						className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface-2)] disabled:opacity-50"
					>
						<Download className="h-4 w-4" />
						{exporting ? 'Exporting...' : 'Download'}
					</button>
				</SettingsRow>

				<SettingsRow label="Export Resume" description="Download your latest resume in export format.">
					<button
						type="button"
						onClick={() => handleComingSoon('Resume export')}
						className="inline-flex items-center gap-2 rounded-xl border border-dashed border-[var(--color-border)] px-4 py-2.5 text-sm font-medium text-[var(--color-muted)] transition-colors hover:bg-[var(--color-surface-2)]"
					>
						<FileText className="h-4 w-4" />
						Coming Soon
					</button>
				</SettingsRow>

				<SettingsRow label="Download Activity" description="Export your complete activity history and analytics.">
					<button
						type="button"
						onClick={() => handleComingSoon('Activity export')}
						className="inline-flex items-center gap-2 rounded-xl border border-dashed border-[var(--color-border)] px-4 py-2.5 text-sm font-medium text-[var(--color-muted)] transition-colors hover:bg-[var(--color-surface-2)]"
					>
						<Activity className="h-4 w-4" />
						Coming Soon
					</button>
				</SettingsRow>
			</div>

			<div className="mt-5 flex items-center gap-2 rounded-xl bg-[var(--color-surface-2)] px-4 py-3">
				<Clock className="h-4 w-4 shrink-0 text-[var(--color-muted)]" />
				<p className="text-xs text-[var(--color-muted)]">
					Data exports are generated on-demand from your database and reflect your current account state.
				</p>
			</div>
		</SettingsCard>
	)
}

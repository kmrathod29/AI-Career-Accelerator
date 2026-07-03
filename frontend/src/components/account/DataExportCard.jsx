import { Download, FileText, Activity, Clock } from 'lucide-react'
import { toast } from 'sonner'
import { SettingsCard, SettingsRow } from './shared/SettingsCard.jsx'
import { useProfile } from '@/stores/accountStore.js'

export function DataExportCard() {
	const profile = useProfile()

	const handleExport = (type) => {
		if (type === 'activity') {
			toast.info('Coming Soon', { description: 'Activity export will be available in a future update.' })
			return
		}

		const data = type === 'profile'
			? profile
			: { message: 'Resume export placeholder', generatedAt: new Date().toISOString() }

		const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		a.href = url
		a.download = `${type}-export-${Date.now()}.json`
		a.click()
		URL.revokeObjectURL(url)

		toast.success(`${type === 'profile' ? 'Profile data' : 'Resume'} downloaded`)
	}

	return (
		<SettingsCard
			title="Data & Export"
			description="Download your data or export your career assets."
		>
			<div className="divide-y divide-[var(--color-border)]">
				<SettingsRow label="Download Profile Data" description="Export all your profile information as JSON.">
					<button
						type="button"
						onClick={() => handleExport('profile')}
						className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface-2)]"
					>
						<Download className="h-4 w-4" />
						Download
					</button>
				</SettingsRow>

				<SettingsRow label="Export Resume" description="Download your latest resume in export format.">
					<button
						type="button"
						onClick={() => handleExport('resume')}
						className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface-2)]"
					>
						<FileText className="h-4 w-4" />
						Export
					</button>
				</SettingsRow>

				<SettingsRow label="Download Activity" description="Export your complete activity history and analytics.">
					<button
						type="button"
						onClick={() => handleExport('activity')}
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
					Data exports are generated on-demand and reflect your current account state.
				</p>
			</div>
		</SettingsCard>
	)
}

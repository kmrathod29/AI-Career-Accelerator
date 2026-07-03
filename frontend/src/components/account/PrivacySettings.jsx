import { toast } from 'sonner'
import { SettingsCard, SettingsRow } from './shared/SettingsCard.jsx'
import { ToggleSwitch } from './shared/ToggleSwitch.jsx'
import { FormField } from './shared/FormField.jsx'
import { RESUME_VISIBILITY_OPTIONS } from '@constants/account.js'
import { accountStore, usePrivacyPrefs } from '@/stores/accountStore.js'

export function PrivacySettings() {
	const prefs = usePrivacyPrefs()

	const handleToggle = (key, value) => {
		accountStore.updatePrivacyPrefs({ [key]: value })
		toast.success('Privacy setting updated')
	}

	const handleVisibility = (value) => {
		accountStore.updatePrivacyPrefs({ resumeVisibility: value })
		toast.success('Resume visibility updated')
	}

	return (
		<SettingsCard
			title="Privacy Controls"
			description="Manage who can see your profile and career data."
		>
			<div className="divide-y divide-[var(--color-border)]">
				<SettingsRow label="Public Profile" description="Allow others to view your public career profile.">
					<ToggleSwitch
						checked={prefs.publicProfile}
						onChange={(val) => handleToggle('publicProfile', val)}
						label="Public profile"
					/>
				</SettingsRow>

				<SettingsRow label="Resume Visibility" description="Control who can access your generated resumes.">
					<FormField
						id="resumeVisibility"
						as="select"
						options={RESUME_VISIBILITY_OPTIONS}
						value={prefs.resumeVisibility}
						onChange={(e) => handleVisibility(e.target.value)}
						className="w-full sm:w-56"
					/>
				</SettingsRow>

				<SettingsRow label="Analytics Sharing" description="Help improve AI recommendations by sharing anonymous usage data.">
					<ToggleSwitch
						checked={prefs.analyticsSharing}
						onChange={(val) => handleToggle('analyticsSharing', val)}
						label="Analytics sharing"
					/>
				</SettingsRow>

				<SettingsRow label="Search Visibility" description="Allow recruiters to discover your profile in search results.">
					<ToggleSwitch
						checked={prefs.searchVisibility}
						onChange={(val) => handleToggle('searchVisibility', val)}
						label="Search visibility"
					/>
				</SettingsRow>
			</div>
		</SettingsCard>
	)
}

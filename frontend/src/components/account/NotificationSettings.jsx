import { toast } from 'sonner'
import { SettingsCard, SettingsRow } from './shared/SettingsCard.jsx'
import { ToggleSwitch } from './shared/ToggleSwitch.jsx'
import { accountStore, useNotificationPrefs } from '@/stores/accountStore.js'

const NOTIFICATION_OPTIONS = [
	{ key: 'emailNotifications', label: 'Email Notifications', description: 'Receive important updates via email.' },
	{ key: 'browserNotifications', label: 'Browser Notifications', description: 'Get real-time alerts in your browser.' },
	{ key: 'interviewUpdates', label: 'Interview Updates', description: 'Mock interview results, schedules, and feedback.' },
	{ key: 'atsUpdates', label: 'ATS Updates', description: 'Resume analysis scores and optimization tips.' },
	{ key: 'roadmapUpdates', label: 'Roadmap Updates', description: 'Career roadmap milestones and progress alerts.' },
	{ key: 'marketingEmails', label: 'Marketing Emails', description: 'Product news, tips, and feature announcements.' },
	{ key: 'newsletter', label: 'Newsletter', description: 'Weekly career insights and industry trends.' },
]

export function NotificationSettings() {
	const prefs = useNotificationPrefs()

	const handleToggle = (key, value) => {
		accountStore.updateNotificationPrefs({ [key]: value })
		toast.success('Notification preference updated')
	}

	return (
		<SettingsCard
			title="Notification Preferences"
			description="Control how and when you receive updates from AI Career Accelerator."
		>
			<div className="divide-y divide-[var(--color-border)]">
				{NOTIFICATION_OPTIONS.map(({ key, label, description }) => (
					<SettingsRow key={key} label={label} description={description}>
						<ToggleSwitch
							checked={prefs[key]}
							onChange={(val) => handleToggle(key, val)}
							label={label}
						/>
					</SettingsRow>
				))}
			</div>
		</SettingsCard>
	)
}

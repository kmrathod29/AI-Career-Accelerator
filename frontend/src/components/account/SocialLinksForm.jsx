import { useState } from 'react'
import { toast } from 'sonner'
import { FormField } from './shared/FormField.jsx'
import { SettingsCard } from './shared/SettingsCard.jsx'
import { UnsavedChangesBanner } from './shared/UnsavedChangesBanner.jsx'
import { accountStore, useProfile, useHasUnsavedChanges } from '@/stores/accountStore.js'
import { validateUrl } from '@utils/accountHelpers.js'
import { PrimaryButton } from '@components/ui/PrimaryButton.jsx'

const SOCIAL_FIELDS = [
	{ key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/username' },
	{ key: 'github', label: 'GitHub', placeholder: 'https://github.com/username' },
	{ key: 'portfolio', label: 'Portfolio', placeholder: 'https://yourportfolio.com' },
	{ key: 'leetcode', label: 'LeetCode', placeholder: 'https://leetcode.com/username' },
	{ key: 'codeforces', label: 'Codeforces', placeholder: 'https://codeforces.com/profile/username' },
	{ key: 'hackerrank', label: 'HackerRank', placeholder: 'https://hackerrank.com/username' },
	{ key: 'website', label: 'Website', placeholder: 'https://yourwebsite.com' },
]

export function SocialLinksForm() {
	const profile = useProfile()
	const hasUnsaved = useHasUnsavedChanges()
	const [saving, setSaving] = useState(false)
	const [errors, setErrors] = useState({})

	const update = (key, value) => {
		accountStore.updateSocial({ [key]: value })
		setErrors((prev) => ({ ...prev, [key]: validateUrl(value) ? undefined : 'Enter a valid URL (https://...)' }))
	}

	const handleSave = async () => {
		const newErrors = {}
		for (const { key } of SOCIAL_FIELDS) {
			const val = profile.social[key]
			if (val && !validateUrl(val)) newErrors[key] = 'Enter a valid URL (https://...)'
		}
		setErrors(newErrors)
		if (Object.keys(newErrors).length > 0) {
			toast.error('Please fix validation errors before saving')
			return
		}

		setSaving(true)
		await new Promise((r) => setTimeout(r, 500))
		accountStore.saveProfile()
		setSaving(false)
		toast.success('Social links updated')
	}

	return (
		<div>
			<UnsavedChangesBanner
				visible={hasUnsaved}
				onSave={handleSave}
				onDiscard={() => { accountStore.discardChanges(); toast.info('Changes discarded') }}
				saving={saving}
			/>

			<SettingsCard
				title="Social Links"
				description="Connect your professional profiles to enhance your career presence."
				footer={
					<div className="flex justify-end">
						<PrimaryButton onClick={handleSave} disabled={saving || !hasUnsaved} className="px-5 py-2.5">
							{saving ? 'Saving...' : 'Save Changes'}
						</PrimaryButton>
					</div>
				}
			>
				<div className="space-y-4">
					{SOCIAL_FIELDS.map(({ key, label, placeholder }) => (
						<FormField
							key={key}
							label={label}
							id={key}
							value={profile.social[key] ?? ''}
							onChange={(e) => update(key, e.target.value)}
							placeholder={placeholder}
							error={errors[key]}
						/>
					))}
				</div>
			</SettingsCard>
		</div>
	)
}

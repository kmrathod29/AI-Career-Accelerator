import { useState, useRef } from 'react'
import { Camera } from 'lucide-react'
import { toast } from 'sonner'
import { FormField } from './shared/FormField.jsx'
import { SettingsCard } from './shared/SettingsCard.jsx'
import { UnsavedChangesBanner } from './shared/UnsavedChangesBanner.jsx'
import { GENDER_OPTIONS } from '@constants/account.js'
import { accountStore, useProfile, useHasUnsavedChanges } from '@/stores/accountStore.js'
import { getInitials } from '@utils/accountHelpers.js'
import { PrimaryButton } from '@components/ui/PrimaryButton.jsx'

export function PersonalInfoForm() {
	const profile = useProfile()
	const hasUnsaved = useHasUnsavedChanges()
	const fileRef = useRef(null)
	const [saving, setSaving] = useState(false)
	const [form, setForm] = useState(null)

	const data = form ?? profile
	const initials = getInitials(data.firstName, data.lastName)

	const update = (field, value) => {
		setForm((prev) => ({ ...(prev ?? profile), [field]: value }))
		accountStore.updateProfile({ [field]: value })
	}

	const handleSave = async () => {
		setSaving(true)
		await new Promise((r) => setTimeout(r, 500))
		accountStore.saveProfile()
		setForm(null)
		setSaving(false)
		toast.success('Profile updated successfully')
	}

	const handleDiscard = () => {
		accountStore.discardChanges()
		setForm(null)
		toast.info('Changes discarded')
	}

	const handleAvatarUpload = (e) => {
		const file = e.target.files?.[0]
		if (!file) return
		if (!file.type.startsWith('image/')) {
			toast.error('Please select a valid image file')
			return
		}
		const reader = new FileReader()
		reader.onload = () => {
			accountStore.setAvatar(reader.result)
			toast.success('Avatar uploaded')
		}
		reader.readAsDataURL(file)
	}

	return (
		<div>
			<UnsavedChangesBanner
				visible={hasUnsaved}
				onSave={handleSave}
				onDiscard={handleDiscard}
				saving={saving}
			/>

			<SettingsCard title="Profile Photo" description="This will be displayed on your profile and resume.">
				<div className="flex items-center gap-5">
					{profile.avatar ? (
						<img src={profile.avatar} alt="Profile" className="h-20 w-20 rounded-2xl object-cover" />
					) : (
						<div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-linear-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-xl font-bold text-white">
							{initials}
						</div>
					)}
					<div>
						<input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
						<button
							type="button"
							onClick={() => fileRef.current?.click()}
							className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface-2)]"
						>
							<Camera className="h-4 w-4" />
							Upload Photo
						</button>
						<p className="mt-2 text-xs text-[var(--color-muted)]">JPG, PNG or GIF. Max 2MB.</p>
					</div>
				</div>
			</SettingsCard>

			<SettingsCard
				title="Personal Details"
				description="Update your personal information and contact details."
				className="mt-4"
				footer={
					<div className="flex justify-end">
						<PrimaryButton onClick={handleSave} disabled={saving || !hasUnsaved} className="px-5 py-2.5">
							{saving ? 'Saving...' : 'Save Changes'}
						</PrimaryButton>
					</div>
				}
			>
				<div className="grid gap-4 sm:grid-cols-2">
					<FormField label="First Name" id="firstName" value={data.firstName} onChange={(e) => update('firstName', e.target.value)} />
					<FormField label="Last Name" id="lastName" value={data.lastName} onChange={(e) => update('lastName', e.target.value)} />
					<FormField label="Email" id="email" type="email" value={data.email} onChange={(e) => update('email', e.target.value)} className="sm:col-span-2" />
					<FormField label="Phone" id="phone" type="tel" value={data.phone} onChange={(e) => update('phone', e.target.value)} />
					<FormField label="Gender" id="gender" as="select" options={GENDER_OPTIONS} value={data.gender} onChange={(e) => update('gender', e.target.value)} />
					<FormField label="Date of Birth" id="dob" type="date" value={data.dateOfBirth} onChange={(e) => update('dateOfBirth', e.target.value)} />
					<FormField label="Country" id="country" value={data.country} onChange={(e) => update('country', e.target.value)} />
					<FormField label="City" id="city" value={data.city} onChange={(e) => update('city', e.target.value)} />
					<FormField label="State" id="state" value={data.state} onChange={(e) => update('state', e.target.value)} />
					<FormField label="Bio" id="bio" as="textarea" value={data.bio} onChange={(e) => update('bio', e.target.value)} className="sm:col-span-2" hint="Brief description for your public profile." />
				</div>
			</SettingsCard>
		</div>
	)
}

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

	// Merge form edits over profile data
	const personal = form ?? {
		firstName: profile.firstName,
		lastName: profile.lastName,
		phone: profile.profile?.phone ?? '',
		gender: profile.profile?.gender ?? '',
		dateOfBirth: profile.profile?.dateOfBirth ?? '',
		country: profile.profile?.country ?? '',
		city: profile.profile?.city ?? '',
		state: profile.profile?.state ?? '',
		bio: profile.profile?.bio ?? '',
	}

	const initials = getInitials(personal.firstName, personal.lastName)

	const update = (field, value) => {
		setForm((prev) => ({ ...personal, ...prev, [field]: value }))
		// Mark unsaved in store
		accountStore.updateProfile({})
	}

	const handleSave = async () => {
		setSaving(true)
		const result = await accountStore.saveProfile({
			firstName: personal.firstName,
			lastName: personal.lastName,
			phone: personal.phone,
			gender: personal.gender,
			dateOfBirth: personal.dateOfBirth,
			country: personal.country,
			city: personal.city,
			state: personal.state,
			bio: personal.bio,
		})
		setSaving(false)
		if (result.success) {
			setForm(null)
			toast.success('Profile updated successfully')
		} else {
			toast.error(result.message || 'Failed to save profile')
		}
	}

	const handleDiscard = async () => {
		setForm(null)
		await accountStore.discardChanges()
		toast.info('Changes discarded')
	}

	const handleAvatarUpload = (e) => {
		const file = e.target.files?.[0]
		if (!file) return
		if (!file.type.startsWith('image/')) {
			toast.error('Please select a valid image file')
			return
		}
		if (file.size > 2 * 1024 * 1024) {
			toast.error('Image must be under 2MB')
			return
		}
		const reader = new FileReader()
		reader.onload = async () => {
			const result = await accountStore.saveAvatar(reader.result)
			if (result.success) {
				toast.success('Avatar uploaded')
			} else {
				toast.error(result.message || 'Failed to upload avatar')
			}
		}
		reader.readAsDataURL(file)
	}

	return (
		<div>
			<UnsavedChangesBanner
				visible={hasUnsaved || !!form}
				onSave={handleSave}
				onDiscard={handleDiscard}
				saving={saving}
			/>

			<SettingsCard title="Profile Photo" description="This will be displayed on your profile and resume.">
				<div className="flex items-center gap-5">
					{profile.profile?.avatar ? (
						<img src={profile.profile.avatar} alt="Profile" className="h-20 w-20 rounded-2xl object-cover" />
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
						<PrimaryButton onClick={handleSave} disabled={saving || (!hasUnsaved && !form)} className="px-5 py-2.5">
							{saving ? 'Saving...' : 'Save Changes'}
						</PrimaryButton>
					</div>
				}
			>
				<div className="grid gap-4 sm:grid-cols-2">
					<FormField label="First Name" id="firstName" value={personal.firstName} onChange={(e) => update('firstName', e.target.value)} />
					<FormField label="Last Name" id="lastName" value={personal.lastName} onChange={(e) => update('lastName', e.target.value)} />
					<FormField label="Email" id="email" type="email" value={profile.email} disabled className="sm:col-span-2" />
					<FormField label="Phone" id="phone" type="tel" value={personal.phone} onChange={(e) => update('phone', e.target.value)} />
					<FormField label="Gender" id="gender" as="select" options={GENDER_OPTIONS} value={personal.gender} onChange={(e) => update('gender', e.target.value)} />
					<FormField label="Date of Birth" id="dob" type="date" value={personal.dateOfBirth} onChange={(e) => update('dateOfBirth', e.target.value)} />
					<FormField label="Country" id="country" value={personal.country} onChange={(e) => update('country', e.target.value)} />
					<FormField label="City" id="city" value={personal.city} onChange={(e) => update('city', e.target.value)} />
					<FormField label="State" id="state" value={personal.state} onChange={(e) => update('state', e.target.value)} />
					<FormField label="Bio" id="bio" as="textarea" value={personal.bio} onChange={(e) => update('bio', e.target.value)} className="sm:col-span-2" hint="Brief description for your public profile." />
				</div>
			</SettingsCard>
		</div>
	)
}

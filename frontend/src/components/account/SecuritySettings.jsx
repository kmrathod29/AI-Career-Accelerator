import { useState } from 'react'
import { Shield, Mail, Phone, Lock } from 'lucide-react'
import { toast } from 'sonner'
import { PasswordInput } from '@components/auth/PasswordInput.jsx'
import { SettingsCard, SettingsRow } from './shared/SettingsCard.jsx'
import { getPasswordStrength } from '@utils/accountHelpers.js'
import { PrimaryButton } from '@components/ui/PrimaryButton.jsx'
import { cn } from '@utils/classNames.js'

export function SecuritySettings() {
	const [currentPassword, setCurrentPassword] = useState('')
	const [newPassword, setNewPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [errors, setErrors] = useState({})
	const [saving, setSaving] = useState(false)

	const strength = getPasswordStrength(newPassword)

	const handleChangePassword = async (e) => {
		e.preventDefault()
		const newErrors = {}

		if (!currentPassword) newErrors.current = 'Current password is required'
		if (!newPassword) newErrors.new = 'New password is required'
		if (newPassword.length < 8) newErrors.new = 'Password must be at least 8 characters'
		if (newPassword !== confirmPassword) newErrors.confirm = 'Passwords do not match'

		setErrors(newErrors)
		if (Object.keys(newErrors).length > 0) {
			toast.error('Please fix validation errors')
			return
		}

		setSaving(true)
		await new Promise((r) => setTimeout(r, 700))
		setSaving(false)
		setCurrentPassword('')
		setNewPassword('')
		setConfirmPassword('')
		toast.success('Password changed successfully')
	}

	const handleComingSoon = (feature) => {
		toast.info('Coming Soon', { description: `${feature} will be available in a future update.` })
	}

	return (
		<div className="space-y-4">
			<SettingsCard title="Change Password" description="Ensure your account stays secure with a strong password.">
				<form onSubmit={handleChangePassword} className="space-y-4">
					<PasswordInput
						id="currentPassword"
						label="Current Password"
						value={currentPassword}
						onChange={(e) => setCurrentPassword(e.target.value)}
						error={errors.current}
					/>
					<PasswordInput
						id="newPassword"
						label="New Password"
						value={newPassword}
						onChange={(e) => setNewPassword(e.target.value)}
						error={errors.new}
					/>

					{newPassword && (
						<div>
							<div className="mb-1.5 flex items-center justify-between">
								<span className="text-xs font-medium text-[var(--color-muted)]">Password strength</span>
								<span className="text-xs font-medium" style={{ color: strength.color }}>{strength.label}</span>
							</div>
							<div className="flex gap-1">
								{[1, 2, 3, 4, 5].map((level) => (
									<div
										key={level}
										className={cn(
											'h-1.5 flex-1 rounded-full transition-colors duration-300',
											strength.score >= level ? '' : 'bg-[var(--color-surface-inset)]',
										)}
										style={strength.score >= level ? { backgroundColor: strength.color } : undefined}
									/>
								))}
							</div>
						</div>
					)}

					<PasswordInput
						id="confirmPassword"
						label="Confirm Password"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						error={errors.confirm}
					/>

					<div className="flex justify-end pt-2">
						<PrimaryButton type="submit" disabled={saving} className="px-5 py-2.5">
							<Lock className="h-4 w-4" />
							{saving ? 'Updating...' : 'Change Password'}
						</PrimaryButton>
					</div>
				</form>
			</SettingsCard>

			<SettingsCard title="Additional Security" description="Extra layers of protection for your account.">
				<div className="divide-y divide-[var(--color-border)]">
					<SettingsRow label="Two-Factor Authentication" description="Add an extra layer of security to your account.">
						<button type="button" onClick={() => handleComingSoon('Two-Factor Authentication')} className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] px-4 py-2 text-xs font-medium text-[var(--color-muted)] transition-colors hover:bg-[var(--color-surface-2)]">
							<Shield className="h-4 w-4" />
							Coming Soon
						</button>
					</SettingsRow>
					<SettingsRow label="Email Verification" description="Verify your email address for account recovery.">
						<button type="button" onClick={() => handleComingSoon('Email Verification')} className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] px-4 py-2 text-xs font-medium text-[var(--color-muted)] transition-colors hover:bg-[var(--color-surface-2)]">
							<Mail className="h-4 w-4" />
							Coming Soon
						</button>
					</SettingsRow>
					<SettingsRow label="Phone Verification" description="Add a phone number for SMS-based verification.">
						<button type="button" onClick={() => handleComingSoon('Phone Verification')} className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] px-4 py-2 text-xs font-medium text-[var(--color-muted)] transition-colors hover:bg-[var(--color-surface-2)]">
							<Phone className="h-4 w-4" />
							Coming Soon
						</button>
					</SettingsRow>
				</div>
			</SettingsCard>
		</div>
	)
}

import { useState } from 'react'
import { X, Plus } from 'lucide-react'
import { toast } from 'sonner'
import { FormField } from './shared/FormField.jsx'
import { SettingsCard } from './shared/SettingsCard.jsx'
import { UnsavedChangesBanner } from './shared/UnsavedChangesBanner.jsx'
import { EXPERIENCE_LEVELS, EDUCATION_LEVELS, EMPLOYMENT_TYPES } from '@constants/account.js'
import { accountStore, useProfile, useHasUnsavedChanges } from '@/stores/accountStore.js'
import { PrimaryButton } from '@components/ui/PrimaryButton.jsx'
import { cn } from '@utils/classNames.js'

export function CareerForm() {
	const profile = useProfile()
	const hasUnsaved = useHasUnsavedChanges()
	const [saving, setSaving] = useState(false)
	const [skillInput, setSkillInput] = useState('')
	const [form, setForm] = useState(null)

	// Merge form edits over career data from API
	const career = form ?? {
		currentRole: profile.career?.currentRole ?? '',
		experienceLevel: profile.career?.experienceLevel ?? '',
		education: profile.career?.education ?? '',
		university: profile.career?.university ?? '',
		degree: profile.career?.degree ?? '',
		branch: profile.career?.branch ?? '',
		passingYear: profile.career?.passingYear ?? '',
		skills: profile.career?.skills ?? [],
		preferredRole: profile.career?.preferredRole ?? '',
		preferredLocation: profile.career?.preferredLocation ?? '',
		expectedSalary: profile.career?.expectedSalary ?? '',
		employmentType: profile.career?.employmentType ?? '',
	}

	const update = (field, value) => {
		setForm((prev) => ({ ...career, ...prev, [field]: value }))
		accountStore.updateProfile({})
	}

	const addSkill = () => {
		const skill = skillInput.trim()
		if (!skill) return
		if (career.skills.includes(skill)) {
			toast.error('Skill already added')
			return
		}
		update('skills', [...career.skills, skill])
		setSkillInput('')
	}

	const removeSkill = (skill) => {
		update('skills', career.skills.filter((s) => s !== skill))
	}

	const handleSave = async () => {
		setSaving(true)
		const result = await accountStore.saveCareer(career)
		setSaving(false)
		if (result.success) {
			setForm(null)
			toast.success('Career information saved')
		} else {
			toast.error(result.message || 'Failed to save career information')
		}
	}

	const handleDiscard = async () => {
		setForm(null)
		await accountStore.discardChanges()
		toast.info('Changes discarded')
	}

	return (
		<div>
			<UnsavedChangesBanner visible={hasUnsaved || !!form} onSave={handleSave} onDiscard={handleDiscard} saving={saving} />

			<SettingsCard
				title="Career Information"
				description="Help us personalize your AI career recommendations."
				footer={
					<div className="flex justify-end">
						<PrimaryButton onClick={handleSave} disabled={saving || (!hasUnsaved && !form)} className="px-5 py-2.5">
							{saving ? 'Saving...' : 'Save Changes'}
						</PrimaryButton>
					</div>
				}
			>
				<div className="grid gap-4 sm:grid-cols-2">
					<FormField label="Current Role" id="currentRole" value={career.currentRole} onChange={(e) => update('currentRole', e.target.value)} className="sm:col-span-2" />
					<FormField label="Experience Level" id="experienceLevel" as="select" options={EXPERIENCE_LEVELS} value={career.experienceLevel} onChange={(e) => update('experienceLevel', e.target.value)} />
					<FormField label="Education" id="education" as="select" options={EDUCATION_LEVELS} value={career.education} onChange={(e) => update('education', e.target.value)} />
					<FormField label="University" id="university" value={career.university} onChange={(e) => update('university', e.target.value)} className="sm:col-span-2" />
					<FormField label="Degree" id="degree" value={career.degree} onChange={(e) => update('degree', e.target.value)} />
					<FormField label="Branch" id="branch" value={career.branch} onChange={(e) => update('branch', e.target.value)} />
					<FormField label="Passing Year" id="passingYear" type="number" value={career.passingYear} onChange={(e) => update('passingYear', e.target.value)} />
					<FormField label="Preferred Role" id="preferredRole" value={career.preferredRole} onChange={(e) => update('preferredRole', e.target.value)} />
					<FormField label="Preferred Location" id="preferredLocation" value={career.preferredLocation} onChange={(e) => update('preferredLocation', e.target.value)} />
					<FormField label="Expected Salary" id="expectedSalary" value={career.expectedSalary} onChange={(e) => update('expectedSalary', e.target.value)} hint="e.g. 8-12 LPA or $80k-$100k" />
					<FormField label="Employment Type" id="employmentType" as="select" options={EMPLOYMENT_TYPES} value={career.employmentType} onChange={(e) => update('employmentType', e.target.value)} />
				</div>

				<div className="mt-6 border-t border-[var(--color-border)] pt-6">
					<label className="mb-2 block text-sm font-medium text-[var(--color-text)]">Skills</label>
					<div className="flex flex-wrap gap-2">
						{career.skills.map((skill) => (
							<span
								key={skill}
								className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3 py-1 text-xs font-medium text-[var(--color-text)]"
							>
								{skill}
								<button type="button" onClick={() => removeSkill(skill)} className="text-[var(--color-muted)] hover:text-[var(--color-danger)]" aria-label={`Remove ${skill}`}>
									<X className="h-3 w-3" />
								</button>
							</span>
						))}
						{career.skills.length === 0 && (
							<span className="text-xs text-[var(--color-muted)]">No skills added yet</span>
						)}
					</div>
					<div className="mt-3 flex gap-2">
						<input
							value={skillInput}
							onChange={(e) => setSkillInput(e.target.value)}
							onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
							placeholder="Add a skill..."
							className={cn(
								'flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20',
							)}
						/>
						<button type="button" onClick={addSkill} className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface-2)]">
							<Plus className="h-4 w-4" />
							Add
						</button>
					</div>
				</div>
			</SettingsCard>
		</div>
	)
}

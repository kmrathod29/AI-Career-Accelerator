import { useSkills, resumeStore } from '@/stores/resumeStore.js'
import { SkillInput } from '@components/resume-builder/shared/SkillInput.jsx'

/**
 * SkillsSection — chip-based skill input using SkillInput component.
 */
export function SkillsSection() {
	const skills = useSkills()

	return (
		<div>
			<label className="mb-1.5 block text-xs font-medium text-[var(--color-muted)]">
				Skills
			</label>
			<SkillInput
				skills={skills}
				onAdd={(skill) => resumeStore.addSkill(skill)}
				onRemove={(skill) => resumeStore.removeSkill(skill)}
			/>
			<p className="mt-2 text-[11px] text-[var(--color-muted)]">
				{skills.length} skill{skills.length !== 1 ? 's' : ''} added
			</p>
		</div>
	)
}

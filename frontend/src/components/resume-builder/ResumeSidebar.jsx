import {
	User, AlignLeft, Briefcase, GraduationCap, Wrench,
	FolderGit2, Award, Trophy, Globe, Link, Plus,
} from 'lucide-react'
import { RESUME_SECTIONS, calculateResumeCompletion, isSectionComplete } from '@constants/resumeBuilder.js'
import { useResumeStore, resumeStore } from '@/stores/resumeStore.js'
import { CompletionCard } from '@components/resume-builder/shared/CompletionCard.jsx'
import { SectionListItem } from '@components/resume-builder/shared/SectionListItem.jsx'
import { TemplateSelector } from '@components/resume-builder/shared/TemplateSelector.jsx'

/** Map icon name strings to Lucide components */
const ICON_MAP = {
	User, AlignLeft, Briefcase, GraduationCap, Wrench,
	FolderGit2, Award, Trophy, Globe, Link, Plus,
}

/**
 * ResumeSidebar — left panel with completion ring, section list, and template selector.
 */
export function ResumeSidebar({ activeSectionId, onSectionClick }) {
	const state = useResumeStore((s) => s)
	const completion = calculateResumeCompletion(state)

	return (
		<div className="space-y-4">
			{/* Completion ring */}
			<CompletionCard percentage={completion} />

			{/* Section list */}
			<div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3 sm:p-4">
				<p className="mb-2 text-xs font-semibold tracking-wide text-[var(--color-muted)] uppercase">
					Sections
				</p>
				<div className="space-y-0.5">
					{RESUME_SECTIONS.map((section) => {
						const Icon = ICON_MAP[section.icon]
						return (
							<SectionListItem
								key={section.id}
								icon={Icon}
								label={section.label}
								isComplete={isSectionComplete(section.id, state)}
								isActive={activeSectionId === section.id}
								onClick={() => onSectionClick(section.id)}
							/>
						)
					})}
				</div>
			</div>

			{/* Template selector */}
			<TemplateSelector />
		</div>
	)
}

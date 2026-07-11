import { useRef, useCallback } from 'react'
import {
	User, AlignLeft, Briefcase, GraduationCap, Wrench,
	FolderGit2, Award, Trophy, Globe, Link, Plus,
} from 'lucide-react'
import { RESUME_SECTIONS, isSectionComplete } from '@constants/resumeBuilder.js'
import {
	useSectionOrder,
	useExpandedSections,
	useResumeStore,
	resumeStore,
} from '@/stores/resumeStore.js'
import { ResumeSectionCard } from '@components/resume-builder/shared/ResumeSectionCard.jsx'
import { AISuggestionCard } from '@components/resume-builder/shared/AISuggestionCard.jsx'

/* Section form components */
import { PersonalInfoSection } from '@components/resume-builder/sections/PersonalInfoSection.jsx'
import { SummarySection } from '@components/resume-builder/sections/SummarySection.jsx'
import { ExperienceSection } from '@components/resume-builder/sections/ExperienceSection.jsx'
import { EducationSection } from '@components/resume-builder/sections/EducationSection.jsx'
import { SkillsSection } from '@components/resume-builder/sections/SkillsSection.jsx'
import { ProjectsSection } from '@components/resume-builder/sections/ProjectsSection.jsx'
import { CertificationsSection } from '@components/resume-builder/sections/CertificationsSection.jsx'
import { AchievementsSection } from '@components/resume-builder/sections/AchievementsSection.jsx'
import { LanguagesSection } from '@components/resume-builder/sections/LanguagesSection.jsx'
import { SocialLinksSection } from '@components/resume-builder/sections/SocialLinksSection.jsx'
import { CustomSection } from '@components/resume-builder/sections/CustomSection.jsx'

/** Map icon strings to Lucide components */
const ICON_MAP = {
	User, AlignLeft, Briefcase, GraduationCap, Wrench,
	FolderGit2, Award, Trophy, Globe, Link, Plus,
}

/** Map section ids to form components */
const SECTION_COMPONENTS = {
	personalInfo: PersonalInfoSection,
	summary: SummarySection,
	experience: ExperienceSection,
	education: EducationSection,
	skills: SkillsSection,
	projects: ProjectsSection,
	certifications: CertificationsSection,
	achievements: AchievementsSection,
	languages: LanguagesSection,
	socialLinks: SocialLinksSection,
	customSections: CustomSection,
}

/** Section meta map for quick lookup */
const SECTION_META = Object.fromEntries(RESUME_SECTIONS.map((s) => [s.id, s]))

/** Badge text for list sections */
function getSectionBadge(sectionId, state) {
	switch (sectionId) {
		case 'experience': return state.experiences.length || null
		case 'education': return state.education.length || null
		case 'skills': return state.skills.length || null
		case 'projects': return state.projects.length || null
		case 'certifications': return state.certifications.length || null
		case 'achievements': return state.achievements.length || null
		case 'languages': return state.languages.length || null
		case 'customSections': return state.customSections.length || null
		default: return null
	}
}

/**
 * ResumeEditor — center panel. Renders section cards in order with AI suggestions.
 */
export function ResumeEditor({ sectionRefs }) {
	const sectionOrder = useSectionOrder()
	const expandedSections = useExpandedSections()
	const state = useResumeStore((s) => s)

	const handleMoveUp = useCallback((idx) => {
		if (idx > 0) resumeStore.moveSection(idx, idx - 1)
	}, [])

	const handleMoveDown = useCallback((idx) => {
		if (idx < sectionOrder.length - 1) resumeStore.moveSection(idx, idx + 1)
	}, [sectionOrder.length])

	return (
		<div className="space-y-4">
			{sectionOrder.map((sectionId, idx) => {
				const meta = SECTION_META[sectionId]
				if (!meta) return null
				const SectionComponent = SECTION_COMPONENTS[sectionId]
				if (!SectionComponent) return null
				const Icon = ICON_MAP[meta.icon]
				const isExpanded = expandedSections.has(sectionId)
				const isComplete = isSectionComplete(sectionId, state)
				const badge = getSectionBadge(sectionId, state)

				return (
					<div
						key={sectionId}
						ref={(el) => {
							if (sectionRefs?.current) sectionRefs.current[sectionId] = el
						}}
					>
						<ResumeSectionCard
							title={meta.label}
							icon={Icon}
							isComplete={isComplete}
							isExpanded={isExpanded}
							onToggle={() => resumeStore.toggleSection(sectionId)}
							onMoveUp={() => handleMoveUp(idx)}
							onMoveDown={() => handleMoveDown(idx)}
							canMoveUp={idx > 0}
							canMoveDown={idx < sectionOrder.length - 1}
							badge={badge}
						>
							<SectionComponent />
						</ResumeSectionCard>
					</div>
				)
			})}

			{/* AI Suggestions — after editor sections */}
			<AISuggestionCard />
		</div>
	)
}

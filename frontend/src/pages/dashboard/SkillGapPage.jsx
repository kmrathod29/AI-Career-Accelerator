import { BrainCircuit } from 'lucide-react'
import { PlaceholderPage } from '@components/dashboard/shared/PlaceholderPage.jsx'

export function SkillGapPage() {
	return (
		<PlaceholderPage
			title="Skill Gap Analysis"
			subtitle="Identify missing skills for your dream role and get personalized learning recommendations."
			icon={BrainCircuit}
		/>
	)
}

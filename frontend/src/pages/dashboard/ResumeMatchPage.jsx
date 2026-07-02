import { GitCompareArrows } from 'lucide-react'
import { PlaceholderPage } from '@components/dashboard/shared/PlaceholderPage.jsx'

export function ResumeMatchPage() {
	return (
		<PlaceholderPage
			title="Resume Match"
			subtitle="Compare your resume against specific job descriptions to maximize your match score."
			icon={GitCompareArrows}
		/>
	)
}

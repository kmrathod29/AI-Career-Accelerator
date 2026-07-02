import { Mic } from 'lucide-react'
import { PlaceholderPage } from '@components/dashboard/shared/PlaceholderPage.jsx'

export function MockInterviewPage() {
	return (
		<PlaceholderPage
			title="Mock Interview"
			subtitle="Practice with AI-powered mock interviews tailored to your target role and experience level."
			icon={Mic}
		/>
	)
}

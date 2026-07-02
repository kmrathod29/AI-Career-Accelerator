import { UserCircle } from 'lucide-react'
import { PlaceholderPage } from '@components/dashboard/shared/PlaceholderPage.jsx'

export function ProfilePage() {
	return (
		<PlaceholderPage
			title="Profile"
			subtitle="Manage your personal information, career preferences, and professional details."
			icon={UserCircle}
		/>
	)
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { ConfirmDialog } from '@components/notifications/ConfirmDialog.jsx'
import { APP_ROUTES } from '@constants/routes.js'
import { notificationStore } from '@/stores/notificationStore.js'
import { accountStore } from '@/stores/accountStore.js'
import { useAuth } from '@providers/useAuth.js'

export function LogoutDialog({ open, onClose }) {
	const navigate = useNavigate()
	const { logout } = useAuth()
	const [isLoggingOut, setIsLoggingOut] = useState(false)

	const handleConfirm = async () => {
		setIsLoggingOut(true)
		try {
			logout({ clearStorage: true })
			accountStore.reset()
			notificationStore.reset()
			toast.success('Logged out successfully')
			onClose()
			navigate(APP_ROUTES.HOME, { replace: true })
		} finally {
			setIsLoggingOut(false)
		}
	}

	return (
		<ConfirmDialog
			open={open}
			onClose={onClose}
			onConfirm={handleConfirm}
			title="Logout"
			description="Are you sure you want to logout? You can sign back in anytime."
			confirmLabel="Logout"
			cancelLabel="Cancel"
			variant="danger"
			loading={isLoggingOut}
		/>
	)
}
import { useState } from 'react'
import { Monitor, LogOut, Globe } from 'lucide-react'
import { toast } from 'sonner'
import { SettingsCard } from './shared/SettingsCard.jsx'
import { ConfirmDialog } from '@components/notifications/ConfirmDialog.jsx'
import { accountStore, useSessions } from '@/stores/accountStore.js'
import { cn } from '@utils/classNames.js'

function getBrowserIcon(browser) {
	return Monitor
}

export function SessionsCard() {
	const sessions = useSessions()
	const [confirmLogout, setConfirmLogout] = useState(null)
	const [confirmAll, setConfirmAll] = useState(false)

	const handleLogout = (sessionId) => {
		accountStore.logoutSession(sessionId)
		setConfirmLogout(null)
		toast.success('Session logged out')
	}

	const handleLogoutAll = () => {
		accountStore.logoutAllSessions()
		setConfirmAll(false)
		toast.success('All other devices logged out')
	}

	return (
		<div className="space-y-4">
			<SettingsCard
				title="Active Sessions"
				description="Devices where you're currently signed in."
				footer={
					sessions.length > 1 && (
						<div className="flex justify-end">
							<button
								type="button"
								onClick={() => setConfirmAll(true)}
								className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-danger)]/30 px-4 py-2.5 text-sm font-medium text-[var(--color-danger)] transition-colors hover:bg-[var(--notif-error-bg)]"
							>
								<LogOut className="h-4 w-4" />
								Logout All Devices
							</button>
						</div>
					)
				}
			>
				{sessions.length === 0 ? (
					<div className="py-8 text-center">
						<Monitor className="mx-auto h-10 w-10 text-[var(--color-muted)]" strokeWidth={1.5} />
						<p className="mt-3 text-sm font-medium text-[var(--color-text)]">No active sessions</p>
						<p className="mt-1 text-xs text-[var(--color-muted)]">Sign in on a device to see it here.</p>
					</div>
				) : (
					<div className="divide-y divide-[var(--color-border)]">
						{sessions.map((session) => {
							const Icon = getBrowserIcon(session.browser)
							return (
								<div key={session.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
									<div className="flex items-start gap-3">
										<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-surface-2)] text-[var(--color-primary)]">
											<Icon className="h-5 w-5" strokeWidth={1.8} />
										</div>
										<div>
											<div className="flex flex-wrap items-center gap-2">
												<p className="text-sm font-medium text-[var(--color-text)]">
													{session.browser} on {session.os}
												</p>
												{session.isCurrent && (
													<span className="rounded-full bg-[var(--badge-green-bg)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--badge-green-text)]">
														Current Device
													</span>
												)}
											</div>
											<div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[var(--color-muted)]">
												<span className="inline-flex items-center gap-1">
													<Globe className="h-3 w-3" />
													{session.location}
												</span>
												<span>{session.lastActive}</span>
											</div>
										</div>
									</div>

									{!session.isCurrent && (
										<button
											type="button"
											onClick={() => setConfirmLogout(session.id)}
											className={cn(
												'shrink-0 rounded-xl border border-[var(--color-border)] px-3.5 py-2 text-xs font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface-2)]',
											)}
										>
											Logout Session
										</button>
									)}
								</div>
							)
						})}
					</div>
				)}
			</SettingsCard>

			<ConfirmDialog
				open={!!confirmLogout}
				onClose={() => setConfirmLogout(null)}
				onConfirm={() => handleLogout(confirmLogout)}
				title="Logout this session?"
				description="This device will be signed out and will need to log in again."
				confirmLabel="Logout Session"
			/>

			<ConfirmDialog
				open={confirmAll}
				onClose={() => setConfirmAll(false)}
				onConfirm={handleLogoutAll}
				title="Logout all other devices?"
				description="All sessions except your current device will be terminated."
				confirmLabel="Logout All"
			/>
		</div>
	)
}

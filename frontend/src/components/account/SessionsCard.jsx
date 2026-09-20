import { useCallback, useEffect, useState } from 'react'
import { Clock3, LogOut, Monitor, ShieldCheck } from 'lucide-react'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { SettingsCard } from './shared/SettingsCard.jsx'
import { ConfirmDialog } from '@components/notifications/ConfirmDialog.jsx'
import { accountService } from '@/services/accountService.js'
import { useAuth } from '@providers/useAuth.js'
import { APP_ROUTES } from '@constants/routes.js'
import { formatDateTime } from '@utils/dateTime.js'

function SessionRow({ session, onRevoke, revoking }) {
	const lastActive = session.lastActiveAt ? formatDateTime(session.lastActiveAt) : null
	const created = session.createdAt ? formatDateTime(session.createdAt) : null
	const expires = session.expiresAt ? formatDateTime(session.expiresAt) : null

	return (
		<div className="flex flex-col gap-4 rounded-xl border border-[var(--color-border)] p-4 sm:flex-row sm:items-center sm:justify-between">
			<div className="flex min-w-0 gap-3">
				<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-surface-2)] text-[var(--color-primary)]">
					<Monitor className="h-5 w-5" strokeWidth={1.8} />
				</div>
				<div className="min-w-0">
					<div className="flex flex-wrap items-center gap-2">
						<p className="truncate text-sm font-semibold text-[var(--color-text)]">{session.device}</p>
						{session.isCurrent && (
							<span className="rounded-full bg-[var(--color-primary)]/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--color-primary)]">
								Current session
							</span>
						)}
					</div>
					<div className="mt-1 space-y-0.5 text-xs leading-relaxed text-[var(--color-muted)]">
						{lastActive && <p>Last active {lastActive}</p>}
						{created && <p>Signed in {created}</p>}
						{expires && <p>Expires {expires}</p>}
						{!lastActive && !created && <p>Session activity metadata is unavailable.</p>}
					</div>
				</div>
			</div>
			<button
				type="button"
				onClick={() => onRevoke(session)}
				disabled={revoking}
				className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] px-3 py-2 text-sm font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface-2)] disabled:opacity-50"
			>
				<LogOut className="h-4 w-4" />
				{session.isCurrent ? 'Sign out' : 'Revoke'}
			</button>
		</div>
	)
}

export function SessionsCard() {
	const [sessions, setSessions] = useState([])
	const [status, setStatus] = useState('loading')
	const [selectedSession, setSelectedSession] = useState(null)
	const [revoking, setRevoking] = useState(false)
	const navigate = useNavigate()
	const { logout } = useAuth()

	const loadSessions = useCallback(async () => {
		try {
			const result = await accountService.getSessions()
			setSessions(result?.data?.sessions ?? [])
			setStatus('ready')
		} catch {
			setStatus('error')
		}
	}, [])

	useEffect(() => {
		const timer = window.setTimeout(() => {
			loadSessions()
		}, 0)

		return () => window.clearTimeout(timer)
	}, [loadSessions])

	const handleRetry = () => {
		setStatus('loading')
		loadSessions()
	}

	const handleRevoke = async () => {
		if (!selectedSession) return

		setRevoking(true)
		try {
			const result = await accountService.revokeSession(selectedSession.id)
			const wasCurrent = result?.data?.currentSessionRevoked
			setSelectedSession(null)

			if (wasCurrent) {
				await logout()
				toast.success('You have been signed out of this session.')
				navigate(APP_ROUTES.LOGIN, { replace: true })
				return
			}

			setSessions((current) => current.filter((session) => session.id !== selectedSession.id))
			toast.success('Session revoked successfully.')
		} catch (error) {
			toast.error(error.response?.data?.message || 'Unable to revoke this session.')
		} finally {
			setRevoking(false)
		}
	}

	return (
		<div className="space-y-4">
			<SettingsCard title="Active Sessions" description="Devices where you're currently signed in.">
				{status === 'loading' && (
					<div className="flex items-center justify-center gap-2 py-8 text-sm text-[var(--color-muted)]">
						<Clock3 className="h-4 w-4 animate-spin" />
						Loading active sessions...
					</div>
				)}

				{status === 'error' && (
					<div className="py-8 text-center">
						<p className="text-sm font-medium text-[var(--color-text)]">Unable to load your active sessions. Please try again.</p>
						<button type="button" onClick={handleRetry} className="mt-3 text-sm font-semibold text-[var(--color-primary)] hover:underline">
							Try again
						</button>
					</div>
				)}

				{status === 'ready' && sessions.length === 0 && (
					<div className="py-8 text-center">
						<Monitor className="mx-auto h-10 w-10 text-[var(--color-muted)]" strokeWidth={1.5} />
						<p className="mt-3 text-sm font-medium text-[var(--color-text)]">No active sessions found.</p>
					</div>
				)}

				{status === 'ready' && sessions.length > 0 && (
					<div className="space-y-3">
						{sessions.map((session) => (
							<SessionRow
								key={session.id}
								session={session}
								onRevoke={setSelectedSession}
								revoking={revoking}
							/>
						))}
					</div>
				)}
			</SettingsCard>

			<div className="flex items-start gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-4">
				<ShieldCheck className="h-5 w-5 shrink-0 text-[var(--color-primary)]" />
				<div>
					<p className="text-sm font-medium text-[var(--color-text)]">Session security</p>
					<p className="mt-1 text-xs leading-relaxed text-[var(--color-muted)]">
						Only active sessions for this account are shown. Device details are derived from browser information and no session IDs or cookies are exposed.
					</p>
				</div>
			</div>

			<ConfirmDialog
				open={!!selectedSession}
				onClose={() => !revoking && setSelectedSession(null)}
				onConfirm={handleRevoke}
				title={selectedSession?.isCurrent ? 'Sign out of this session?' : 'Revoke this session?'}
				description={selectedSession?.isCurrent
					? 'You will be signed out on this device and redirected to login.'
					: 'This device will need to sign in again to regain access.'}
				confirmLabel={selectedSession?.isCurrent ? 'Sign out' : 'Revoke session'}
				loading={revoking}
			/>
		</div>
	)
}

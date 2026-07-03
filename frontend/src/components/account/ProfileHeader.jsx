import { motion } from 'framer-motion'
import { Camera, Mail, Calendar, Shield } from 'lucide-react'
import { getInitials, formatJoinedDate } from '@utils/accountHelpers.js'
import { cn } from '@utils/classNames.js'

export function ProfileHeader({ profile, onUploadAvatar, onEditProfile }) {
	const fullName = `${profile.firstName} ${profile.lastName}`.trim()
	const initials = getInitials(profile.firstName, profile.lastName)

	return (
		<div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-elevated)]">
			<div className="relative h-20 bg-linear-to-br from-[var(--color-primary)] via-[var(--color-secondary)] to-[#1E3A8A] sm:h-36">
				<div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0zMCAwaDEwdjEwSDMwek0wIDMwaDEwdjEwSDB6TTAgNTBoMTB2MTBIMHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNCkiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IGZpbGw9InVybCgjYSkiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiLz48L3N2Zz4=')] opacity-60" />
			</div>

			<div className="relative px-4 pb-4 sm:px-6 sm:pb-6">
				<div className="absolute -top-10 left-4 sm:-top-14 sm:left-6">
					<div className="group relative">
						{profile.avatar ? (
							<img
								src={profile.avatar}
								alt={fullName}
								className="h-20 w-20 rounded-2xl border-4 border-[var(--color-surface)] object-cover shadow-lg sm:h-28 sm:w-28"
							/>
						) : (
							<div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-[var(--color-surface)] bg-linear-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-xl font-bold text-white shadow-lg sm:h-28 sm:w-28 sm:text-2xl">
								{initials}
							</div>
						)}
						<button
							type="button"
							onClick={onUploadAvatar}
							className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
							aria-label="Upload avatar"
						>
							<Camera className="h-5 w-5 text-white" />
						</button>
					</div>
				</div>

				<div className="pt-12 sm:pt-[4.5rem]">
					<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
						<div className="min-w-0">
							<h2 className="text-lg font-semibold text-[var(--color-text)] sm:text-2xl">
								{fullName}
							</h2>
							<p className="mt-0.5 text-sm text-[var(--color-muted)]">{profile.role}</p>

							<div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-[var(--color-muted)] sm:mt-3 sm:gap-x-4 sm:gap-y-2">
								<span className="inline-flex min-w-0 max-w-full items-center gap-1.5">
									<Mail className="h-3.5 w-3.5 shrink-0" />
									<span className="truncate">{profile.email}</span>
								</span>
								<span className="inline-flex items-center gap-1.5">
									<Calendar className="h-3.5 w-3.5 shrink-0" />
									Joined {formatJoinedDate(profile.joinedAt)}
								</span>
								<span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--badge-green-bg)] px-2.5 py-0.5 font-medium text-[var(--badge-green-text)]">
									<Shield className="h-3 w-3 shrink-0" />
									Verified
								</span>
							</div>
						</div>

						<button
							type="button"
							onClick={onEditProfile}
							className="w-fit rounded-xl border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface-2)]"
						>
							Edit Profile
						</button>
					</div>
				</div>
			</div>
		</div>
	)
}

export function QuickStatCard({ label, value, icon: Icon, colorClass }) {
	return (
		<motion.div
			whileHover={{ y: -2 }}
			transition={{ duration: 0.2 }}
			className="min-w-0 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3 shadow-[var(--shadow-card)] sm:p-4"
		>
			<div className="flex items-center justify-between">
				<div
					className={cn(
						'flex h-8 w-8 items-center justify-center rounded-xl bg-linear-to-br text-white sm:h-10 sm:w-10',
						colorClass,
					)}
				>
					<Icon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.8} />
				</div>
			</div>
			<p className="mt-2 text-xl font-semibold tracking-tight text-[var(--color-text)] sm:mt-3 sm:text-2xl">
				{value}
			</p>
			<p className="mt-0.5 truncate text-[11px] text-[var(--color-muted)] sm:text-xs">{label}</p>
		</motion.div>
	)
}

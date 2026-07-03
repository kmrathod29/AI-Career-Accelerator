import { motion } from 'framer-motion'
import { Camera, Mail, Calendar, Shield } from 'lucide-react'
import { getInitials, formatJoinedDate } from '@utils/accountHelpers.js'
import { cn } from '@utils/classNames.js'

export function ProfileHeader({ profile, onUploadAvatar, onEditProfile }) {
	const fullName = `${profile.firstName} ${profile.lastName}`.trim()
	const initials = getInitials(profile.firstName, profile.lastName)

	return (
		<div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-elevated)]">
			{/* Cover banner */}
			<div className="relative h-28 bg-linear-to-br from-[var(--color-primary)] via-[var(--color-secondary)] to-[#1E3A8A] sm:h-36">
				<div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0zMCAwaDEwdjEwSDMwek0wIDMwaDEwdjEwSDB6TTAgNTBoMTB2MTBIMHoiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNCkiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IGZpbGw9InVybCgjYSkiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiLz48L3N2Zz4=')] opacity-60" />
			</div>

			<div className="relative px-5 pb-6 sm:px-6">
				{/* Avatar */}
				<div className="absolute -top-12 left-5 sm:-top-14 sm:left-6">
					<div className="group relative">
						{profile.avatar ? (
							<img
								src={profile.avatar}
								alt={fullName}
								className="h-24 w-24 rounded-2xl border-4 border-[var(--color-surface)] object-cover shadow-lg sm:h-28 sm:w-28"
							/>
						) : (
							<div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-[var(--color-surface)] bg-linear-to-br from-[var(--color-primary)] to-[var(--color-secondary)] text-2xl font-bold text-white shadow-lg sm:h-28 sm:w-28">
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

				<div className="pt-16 sm:pt-[4.5rem]">
					<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
						<div>
							<h2 className="text-xl font-semibold text-[var(--color-text)] sm:text-2xl">
								{fullName}
							</h2>
							<p className="mt-0.5 text-sm text-[var(--color-muted)]">{profile.role}</p>

							<div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[var(--color-muted)]">
								<span className="inline-flex items-center gap-1.5">
									<Mail className="h-3.5 w-3.5" />
									{profile.email}
								</span>
								<span className="inline-flex items-center gap-1.5">
									<Calendar className="h-3.5 w-3.5" />
									Joined {formatJoinedDate(profile.joinedAt)}
								</span>
								<span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--badge-green-bg)] px-2.5 py-0.5 font-medium text-[var(--badge-green-text)]">
									<Shield className="h-3 w-3" />
									Verified
								</span>
							</div>
						</div>

						<button
							type="button"
							onClick={onEditProfile}
							className="shrink-0 rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface-2)]"
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
			className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)]"
		>
			<div className="flex items-center justify-between">
				<div
					className={cn(
						'flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br text-white',
						colorClass,
					)}
				>
					<Icon className="h-5 w-5" strokeWidth={1.8} />
				</div>
			</div>
			<p className="mt-3 text-2xl font-semibold tracking-tight text-[var(--color-text)]">
				{value}
			</p>
			<p className="mt-0.5 text-xs text-[var(--color-muted)]">{label}</p>
		</motion.div>
	)
}

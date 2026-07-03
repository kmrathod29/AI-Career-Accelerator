import { Outlet } from 'react-router-dom'
import { AccountSidebar, AccountMobileNav, useSidebarCollapse } from './AccountSidebar.jsx'

export function AccountLayout({ outletContext }) {
	const { collapsed, toggleCollapse } = useSidebarCollapse()

	return (
		<div className="mx-auto min-w-0 max-w-6xl overflow-x-hidden">
			<div className="mb-4 sm:mb-6">
				<h1 className="text-lg font-semibold tracking-tight text-[var(--color-text)] sm:text-2xl">
					Account Center
				</h1>
				<p className="mt-0.5 text-xs text-[var(--color-muted)] sm:mt-1 sm:text-sm">
					Manage your profile, preferences, and account security.
				</p>
			</div>

			<AccountMobileNav />

			<div className="mt-3 flex flex-col gap-4 md:mt-4 md:flex-row md:gap-6 lg:gap-8">
				<AccountSidebar
					collapsed={collapsed}
					onToggleCollapse={toggleCollapse}
				/>

				<div className="min-w-0 flex-1">
					<Outlet context={outletContext} />
				</div>
			</div>
		</div>
	)
}

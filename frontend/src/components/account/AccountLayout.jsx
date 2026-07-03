import { motion, AnimatePresence } from 'framer-motion'
import { AccountSidebar, AccountMobileNav, useSidebarCollapse } from './AccountSidebar.jsx'

const fadeUp = {
	initial: { opacity: 0, y: 12 },
	animate: { opacity: 1, y: 0 },
	exit: { opacity: 0, y: -8 },
}

export function AccountLayout({ activeSection, onSectionChange, children }) {
	const { collapsed, toggleCollapse } = useSidebarCollapse()

	return (
		<div className="mx-auto max-w-6xl">
			<div className="mb-6">
				<h1 className="text-xl font-semibold tracking-tight text-[var(--color-text)] sm:text-2xl">
					Account Center
				</h1>
				<p className="mt-1 text-sm text-[var(--color-muted)]">
					Manage your profile, preferences, and account security.
				</p>
			</div>

			<AccountMobileNav activeSection={activeSection} onSectionChange={onSectionChange} />

			<div className="mt-4 flex flex-col gap-6 lg:flex-row lg:gap-8">
				<AccountSidebar
					activeSection={activeSection}
					onSectionChange={onSectionChange}
					collapsed={collapsed}
					onToggleCollapse={toggleCollapse}
				/>

				<div className="min-w-0 flex-1">
					<AnimatePresence mode="wait">
						<motion.div
							key={activeSection}
							variants={fadeUp}
							initial="initial"
							animate="animate"
							exit="exit"
							transition={{ duration: 0.25, ease: 'easeOut' }}
						>
							{children}
						</motion.div>
					</AnimatePresence>
				</div>
			</div>
		</div>
	)
}

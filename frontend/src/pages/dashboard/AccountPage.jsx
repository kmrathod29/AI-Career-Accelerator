import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
	FileText,
	ScanSearch,
	Mic,
	Map,
	Camera,
	Download,
	Pencil,
} from 'lucide-react'
import { toast } from 'sonner'
import { AccountLayout } from '@components/account/AccountLayout.jsx'
import { AccountSkeleton } from '@components/account/shared/AccountSkeleton.jsx'
import { SectionHeader } from '@components/account/shared/SettingsCard.jsx'
import { ProfileHeader, QuickStatCard } from '@components/account/ProfileHeader.jsx'
import { ProfileCompletion } from '@components/account/ProfileCompletion.jsx'
import { PersonalInfoForm } from '@components/account/PersonalInfoForm.jsx'
import { CareerForm } from '@components/account/CareerForm.jsx'
import { SocialLinksForm } from '@components/account/SocialLinksForm.jsx'
import { AppearanceSettings } from '@components/account/AppearanceSettings.jsx'
import { NotificationSettings } from '@components/account/NotificationSettings.jsx'
import { SecuritySettings } from '@components/account/SecuritySettings.jsx'
import { PrivacySettings } from '@components/account/PrivacySettings.jsx'
import { SessionsCard } from '@components/account/SessionsCard.jsx'
import { DataExportCard } from '@components/account/DataExportCard.jsx'
import { DangerZoneCard } from '@components/account/DangerZoneCard.jsx'
import { ACCOUNT_SECTIONS } from '@constants/account.js'
import {
	useProfile,
	useAccountStats,
	useAccountLoading,
	accountStore,
} from '@/stores/accountStore.js'
import { calculateProfileCompletion } from '@utils/accountHelpers.js'

const SECTION_META = {
	overview: { title: 'Overview', description: 'Your account at a glance.' },
	personal: { title: 'Personal Information', description: 'Manage your personal details and contact information.' },
	career: { title: 'Career Information', description: 'Your professional background and career preferences.' },
	social: { title: 'Social Links', description: 'Connect your professional online presence.' },
	appearance: { title: 'Appearance', description: 'Customize how the platform looks and feels.' },
	notifications: { title: 'Notifications', description: 'Control your notification preferences.' },
	security: { title: 'Security', description: 'Protect your account with strong security settings.' },
	privacy: { title: 'Privacy', description: 'Manage your data visibility and sharing preferences.' },
	sessions: { title: 'Sessions', description: 'View and manage your active login sessions.' },
	data: { title: 'Data & Export', description: 'Download and export your account data.' },
	danger: { title: 'Danger Zone', description: 'Irreversible account actions.' },
}

const STAT_CONFIG = [
	{ key: 'resumesCreated', label: 'Resumes Created', icon: FileText, color: 'from-blue-500 to-blue-600' },
	{ key: 'atsAnalyses', label: 'ATS Analyses', icon: ScanSearch, color: 'from-emerald-500 to-emerald-600' },
	{ key: 'mockInterviews', label: 'Mock Interviews', icon: Mic, color: 'from-violet-500 to-violet-600' },
	{ key: 'careerRoadmaps', label: 'Career Roadmaps', icon: Map, color: 'from-cyan-500 to-cyan-600' },
]

function OverviewSection({ onNavigate, onUploadAvatar }) {
	const profile = useProfile()
	const stats = useAccountStats()
	const completion = calculateProfileCompletion(profile)

	return (
		<div className="space-y-4">
			<ProfileHeader
				profile={profile}
				onUploadAvatar={onUploadAvatar}
				onEditProfile={() => onNavigate('personal')}
			/>

			<div className="grid gap-4 lg:grid-cols-3">
				<div className="lg:col-span-1">
					<ProfileCompletion percentage={completion} />
				</div>
				<div className="grid grid-cols-2 gap-3 lg:col-span-2 lg:grid-cols-2">
					{STAT_CONFIG.map(({ key, label, icon, color }) => (
						<QuickStatCard
							key={key}
							label={label}
							value={stats[key]}
							icon={icon}
							colorClass={color}
						/>
					))}
				</div>
			</div>

			<div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
				<h3 className="text-sm font-semibold text-[var(--color-text)]">Quick Actions</h3>
				<div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
					{[
						{ label: 'Edit Profile', icon: Pencil, action: () => onNavigate('personal') },
						{ label: 'Upload Avatar', icon: Camera, action: onUploadAvatar },
						{ label: 'Download Resume', icon: Download, action: () => toast.info('Coming Soon', { description: 'Resume download will be available from the Resume Builder.' }) },
					].map(({ label, icon: Icon, action }) => (
						<motion.button
							key={label}
							type="button"
							whileHover={{ y: -1 }}
							whileTap={{ scale: 0.98 }}
							onClick={action}
							className="flex items-center gap-3 rounded-xl border border-[var(--color-border)] px-4 py-3 text-left text-sm font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface-2)]"
						>
							<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-surface-2)] text-[var(--color-primary)]">
								<Icon className="h-4 w-4" strokeWidth={1.8} />
							</div>
							{label}
						</motion.button>
					))}
				</div>
			</div>
		</div>
	)
}

export function AccountPage() {
	const isLoading = useAccountLoading()
	const [activeSection, setActiveSection] = useState('overview')

	const syncHash = useCallback(() => {
		const hash = window.location.hash.slice(1)
		if (hash && ACCOUNT_SECTIONS.some((s) => s.id === hash)) {
			setActiveSection(hash)
		}
	}, [])

	useEffect(() => {
		syncHash()
		window.addEventListener('hashchange', syncHash)
		return () => window.removeEventListener('hashchange', syncHash)
	}, [syncHash])

	const handleSectionChange = (id) => {
		setActiveSection(id)
		window.history.replaceState(null, '', `#${id}`)
	}

	const handleAvatarUpload = () => {
		const input = document.createElement('input')
		input.type = 'file'
		input.accept = 'image/*'
		input.onchange = (e) => {
			const file = e.target.files?.[0]
			if (!file) return
			if (!file.type.startsWith('image/')) {
				toast.error('Please select a valid image file')
				return
			}
			const reader = new FileReader()
			reader.onload = () => {
				accountStore.setAvatar(reader.result)
				accountStore.saveProfile()
				toast.success('Avatar updated')
			}
			reader.readAsDataURL(file)
		}
		input.click()
	}

	if (isLoading) return <AccountSkeleton />

	const meta = SECTION_META[activeSection]

	const renderSection = () => {
		switch (activeSection) {
			case 'overview':
				return (
					<OverviewSection
						onNavigate={handleSectionChange}
						onUploadAvatar={handleAvatarUpload}
					/>
				)
			case 'personal':
				return <PersonalInfoForm />
			case 'career':
				return <CareerForm />
			case 'social':
				return <SocialLinksForm />
			case 'appearance':
				return <AppearanceSettings />
			case 'notifications':
				return <NotificationSettings />
			case 'security':
				return <SecuritySettings />
			case 'privacy':
				return <PrivacySettings />
			case 'sessions':
				return <SessionsCard />
			case 'data':
				return <DataExportCard />
			case 'danger':
				return <DangerZoneCard />
			default:
				return null
		}
	}

	return (
		<AccountLayout activeSection={activeSection} onSectionChange={handleSectionChange}>
			{activeSection !== 'overview' && (
				<SectionHeader title={meta.title} description={meta.description} />
			)}
			{renderSection()}
		</AccountLayout>
	)
}

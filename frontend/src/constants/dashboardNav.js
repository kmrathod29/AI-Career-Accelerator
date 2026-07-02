import { APP_ROUTES } from './routes.js'

/**
 * Dashboard sidebar navigation configuration.
 * Each item: { label, path, icon (Lucide icon name as string), section }
 * Icon names are resolved to components in the Sidebar.
 */
export const SIDEBAR_NAV = [
	{
		section: 'Overview',
		items: [
			{ label: 'Dashboard', path: APP_ROUTES.DASHBOARD, icon: 'LayoutDashboard' },
		],
	},
	{
		section: 'AI Tools',
		items: [
			{ label: 'Resume Builder', path: APP_ROUTES.RESUME_BUILDER, icon: 'FileText' },
			{ label: 'ATS Analyzer', path: APP_ROUTES.ATS_ANALYZER, icon: 'ScanSearch' },
			{ label: 'Resume Match', path: APP_ROUTES.RESUME_MATCH, icon: 'GitCompareArrows' },
			{ label: 'Mock Interview', path: APP_ROUTES.MOCK_INTERVIEW, icon: 'Mic' },
			{ label: 'Skill Gap', path: APP_ROUTES.SKILL_GAP, icon: 'BrainCircuit' },
			{ label: 'Career Roadmap', path: APP_ROUTES.CAREER_ROADMAP, icon: 'Map' },
			{ label: 'AI Career Coach', path: APP_ROUTES.AI_COACH, icon: 'Bot' },
		],
	},
	{
		section: 'Account',
		items: [
			{ label: 'Notifications', path: APP_ROUTES.NOTIFICATIONS, icon: 'Bell' },
			{ label: 'Profile', path: APP_ROUTES.PROFILE, icon: 'UserCircle' },
			{ label: 'Settings', path: APP_ROUTES.SETTINGS, icon: 'Settings' },
		],
	},
]

/**
 * Map route paths to page metadata (title + subtitle) for the TopNavbar.
 */
export const PAGE_META = {
	[APP_ROUTES.DASHBOARD]: { title: 'Dashboard', subtitle: 'Your career at a glance' },
	[APP_ROUTES.RESUME_BUILDER]: { title: 'Resume Builder', subtitle: 'Craft your perfect resume' },
	[APP_ROUTES.ATS_ANALYZER]: { title: 'ATS Analyzer', subtitle: 'Optimize for applicant tracking systems' },
	[APP_ROUTES.RESUME_MATCH]: { title: 'Resume Match', subtitle: 'Match your resume to job descriptions' },
	[APP_ROUTES.MOCK_INTERVIEW]: { title: 'Mock Interview', subtitle: 'Practice with AI-powered interviews' },
	[APP_ROUTES.SKILL_GAP]: { title: 'Skill Gap Analysis', subtitle: 'Identify and bridge skill gaps' },
	[APP_ROUTES.CAREER_ROADMAP]: { title: 'Career Roadmap', subtitle: 'Plan your career trajectory' },
	[APP_ROUTES.AI_COACH]: { title: 'AI Career Coach', subtitle: 'Get personalized career guidance' },
	[APP_ROUTES.NOTIFICATIONS]: { title: 'Notifications', subtitle: 'Stay updated on your progress' },
	[APP_ROUTES.PROFILE]: { title: 'Profile', subtitle: 'Manage your account details' },
	[APP_ROUTES.SETTINGS]: { title: 'Settings', subtitle: 'Customize your experience' },
}

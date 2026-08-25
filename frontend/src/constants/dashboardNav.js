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
			{ label: 'Skill Gap', path: APP_ROUTES.SKILL_GAP, icon: 'BrainCircuit' },
			{ label: 'Career Roadmap', path: APP_ROUTES.CAREER_ROADMAP, icon: 'Map' },
			{ label: 'AI Career Coach', path: APP_ROUTES.AI_COACH, icon: 'Bot' },
		],
	},
	{
		section: 'Account',
		items: [
			{ label: 'Notifications', path: APP_ROUTES.NOTIFICATIONS, icon: 'Bell' },
			{ label: 'Account', path: APP_ROUTES.ACCOUNT, icon: 'UserCircle' },
		],
	},
]

/**
 * Map route paths to page metadata (title + subtitle) for the TopNavbar.
 */
export const PAGE_META = {
	[APP_ROUTES.DASHBOARD]: { title: 'Dashboard', subtitle: 'Your career at a glance' },
	[APP_ROUTES.RESUME_BUILDER]: { title: 'Resume Builder', subtitle: 'Craft your perfect resume' },
	[APP_ROUTES.ATS_ANALYZER]: { title: 'ATS Analyzer', subtitle: 'Check whether your resume is ATS-friendly and identify formatting, keyword, and structure issues that could hurt your chances of getting shortlisted.' },
	[APP_ROUTES.RESUME_MATCH]: { title: 'Resume Match', subtitle: 'Compare your resume with a specific job description to see how closely your experience and skills match that job.' },
	[APP_ROUTES.SKILL_GAP]: { title: 'Skill Gap Analysis', subtitle: 'Find the skills you are missing for your target role and get clear recommendations on what to learn next.' },
	[APP_ROUTES.CAREER_ROADMAP]: { title: 'Career Roadmap', subtitle: 'Follow a step-by-step career path from your current level to your target role, with skills, milestones, and progression stages.' },
	[APP_ROUTES.AI_COACH]: { title: 'AI Career Coach', subtitle: 'Get personalized career guidance' },
	[APP_ROUTES.NOTIFICATIONS]: { title: 'Notifications', subtitle: 'Stay updated on your progress' },
	[APP_ROUTES.ACCOUNT]: { title: 'Account Center', subtitle: 'Manage your profile and preferences' },
	[APP_ROUTES.PROFILE]: { title: 'Account Center', subtitle: 'Manage your profile and preferences' },
	[APP_ROUTES.SETTINGS]: { title: 'Account Center', subtitle: 'Manage your profile and preferences' },
}

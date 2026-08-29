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
	[APP_ROUTES.RESUME_BUILDER]: { title: 'Resume Builder', subtitle: 'Build ATS-optimized resumes with AI assistance.' },
	[APP_ROUTES.ATS_ANALYZER]: { title: 'ATS Resume Analyzer', subtitle: 'Check your resume for ATS compatibility, formatting issues, and missing keywords before you apply.' },
	[APP_ROUTES.RESUME_MATCH]: { title: 'Resume Match', subtitle: 'Compare your resume with a specific job description to see how closely your experience matches the role.' },
	[APP_ROUTES.SKILL_GAP]: { title: 'Skill Gap Analysis', subtitle: 'Identify the skills you are missing for your target role and see what you should learn or strengthen next.' },
	[APP_ROUTES.CAREER_ROADMAP]: { title: 'Career Roadmap', subtitle: 'Build a step-by-step career plan showing what to learn, build, and achieve to move toward your target role.' },
	[APP_ROUTES.AI_COACH]: { title: 'AI Career Coach', subtitle: 'Get personalized career guidance and interview prep from your AI coach.' },
	[APP_ROUTES.NOTIFICATIONS]: { title: 'Notifications', subtitle: 'Stay updated on your progress' },
	[APP_ROUTES.ACCOUNT]: { title: 'Account Center', subtitle: 'Manage your profile and preferences' },
	[APP_ROUTES.PROFILE]: { title: 'Account Center', subtitle: 'Manage your profile and preferences' },
	[APP_ROUTES.SETTINGS]: { title: 'Account Center', subtitle: 'Manage your profile and preferences' },
}

export const APP_ROUTES = {
	ROOT: '/',
	HOME: '/',
	LOGIN: '/auth/login',
	REGISTER: '/auth/register',
	FORGOT_PASSWORD: '/auth/forgot-password',
	RESET_PASSWORD: '/auth/reset-password',
	DASHBOARD: '/dashboard',
	RESUME_BUILDER: '/dashboard/resume-builder',
	ATS_ANALYZER: '/dashboard/ats-analyzer',
	RESUME_MATCH: '/dashboard/resume-match',
	MOCK_INTERVIEW: '/dashboard/mock-interview',
	SKILL_GAP: '/dashboard/skill-gap',
	CAREER_ROADMAP: '/dashboard/career-roadmap',
	AI_COACH: '/dashboard/ai-coach',
	NOTIFICATIONS: '/dashboard/notifications',
	ACCOUNT: '/dashboard/account',
	ACCOUNT_SECTION_PARAM: ':sectionId',
	ACCOUNT_OVERVIEW: '/dashboard/account/overview',
	ACCOUNT_APPEARANCE: '/dashboard/account/appearance',
	PROFILE: '/dashboard/profile',
	SETTINGS: '/dashboard/settings',
	NOT_FOUND: '*',
}

export function getAccountSectionRoute(sectionId) {
	return `${APP_ROUTES.ACCOUNT}/${sectionId}`
}
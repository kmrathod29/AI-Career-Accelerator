import { notificationStore } from '@/stores/notificationStore.js'
import { NOTIFICATION_TYPES } from '@constants/notifications.js'
import { APP_ROUTES } from '@constants/routes.js'

/**
 * Application-wide notification service.
 * Call from any module when an important action completes.
 *
 * @example
 * notify.success('Resume exported', 'PDF downloaded to your device.', { actionUrl: '/dashboard/resume-builder' })
 */
export const notify = {
	/**
	 * @param {string} title
	 * @param {string} description
	 * @param {{ actionUrl?: string, actionLabel?: string }} [options]
	 */
	success(title, description, options = {}) {
		return notificationStore.addNotification({
			title,
			description,
			type: NOTIFICATION_TYPES.SUCCESS,
			...options,
		})
	},

	error(title, description, options = {}) {
		return notificationStore.addNotification({
			title,
			description,
			type: NOTIFICATION_TYPES.ERROR,
			...options,
		})
	},

	warning(title, description, options = {}) {
		return notificationStore.addNotification({
			title,
			description,
			type: NOTIFICATION_TYPES.WARNING,
			...options,
		})
	},

	info(title, description, options = {}) {
		return notificationStore.addNotification({
			title,
			description,
			type: NOTIFICATION_TYPES.INFO,
			...options,
		})
	},

	ai(title, description, options = {}) {
		return notificationStore.addNotification({
			title,
			description,
			type: NOTIFICATION_TYPES.AI,
			...options,
		})
	},

	job(title, description, options = {}) {
		return notificationStore.addNotification({
			title,
			description,
			type: NOTIFICATION_TYPES.JOB,
			...options,
		})
	},

	resume(title, description, options = {}) {
		return notificationStore.addNotification({
			title,
			description,
			type: NOTIFICATION_TYPES.RESUME,
			...options,
		})
	},

	interview(title, description, options = {}) {
		return notificationStore.addNotification({
			title,
			description,
			type: NOTIFICATION_TYPES.INTERVIEW,
			...options,
		})
	},

	ats(title, description, options = {}) {
		return notificationStore.addNotification({
			title,
			description,
			type: NOTIFICATION_TYPES.ATS,
			...options,
		})
	},

	careerRoadmap(title, description, options = {}) {
		return notificationStore.addNotification({
			title,
			description,
			type: NOTIFICATION_TYPES.CAREER_ROADMAP,
			...options,
		})
	},

	subscription(title, description, options = {}) {
		return notificationStore.addNotification({
			title,
			description,
			type: NOTIFICATION_TYPES.SUBSCRIPTION,
			...options,
		})
	},

	system(title, description, options = {}) {
		return notificationStore.addNotification({
			title,
			description,
			type: NOTIFICATION_TYPES.SYSTEM,
			...options,
		})
	},

	/** Generic — pass any supported type */
	create(payload) {
		return notificationStore.addNotification(payload)
	},
}

/** Pre-built notification triggers for common app events */
export const notificationEvents = {
	resumeGenerated() {
		return notify.resume(
			'Resume generated successfully',
			'Your new resume is ready to review, edit, and export.',
			{ actionUrl: APP_ROUTES.RESUME_BUILDER, actionLabel: 'View Resume' },
		)
	},

	resumeExported(format = 'PDF') {
		return notify.success(
			'Resume exported',
			`Your resume has been exported as ${format}.`,
			{ actionUrl: APP_ROUTES.RESUME_BUILDER, actionLabel: 'Open Builder' },
		)
	},

	atsScoreCompleted(score) {
		return notify.ats(
			'ATS score completed',
			`Your resume scored ${score}/100 on ATS compatibility.`,
			{ actionUrl: APP_ROUTES.ATS_ANALYZER, actionLabel: 'View Report' },
		)
	},

	interviewFinished() {
		return notify.interview(
			'Mock interview finished',
			'Your session is complete. AI feedback and scores are ready.',
			{ actionUrl: APP_ROUTES.MOCK_INTERVIEW, actionLabel: 'See Feedback' },
		)
	},

	jobSaved(company) {
		return notify.job(
			'Job saved to tracker',
			`${company} has been added to your saved jobs.`,
			{ actionUrl: APP_ROUTES.DASHBOARD, actionLabel: 'View Jobs' },
		)
	},

	jobApplied(company, role) {
		return notify.success(
			'Application submitted',
			`Your application to ${company} — ${role} was sent successfully.`,
			{ actionUrl: APP_ROUTES.DASHBOARD, actionLabel: 'Track Status' },
		)
	},

	profileUpdated() {
		return notify.info(
			'Profile updated',
			'Your career preferences and settings have been saved.',
			{ actionUrl: APP_ROUTES.PROFILE, actionLabel: 'View Profile' },
		)
	},

	subscriptionChanged(plan) {
		return notify.subscription(
			'Subscription updated',
			`Your plan has been changed to ${plan}.`,
			{ actionUrl: APP_ROUTES.SETTINGS, actionLabel: 'Manage Plan' },
		)
	},

	roadmapGenerated() {
		return notify.ai(
			'AI Roadmap generated',
			'Your personalized career roadmap with milestones is ready.',
			{ actionUrl: APP_ROUTES.CAREER_ROADMAP, actionLabel: 'Open Roadmap' },
		)
	},

	searchCompleted(count, query) {
		return notify.job(
			'Search completed',
			`Found ${count} matching roles for "${query}".`,
			{ actionUrl: APP_ROUTES.DASHBOARD, actionLabel: 'Browse Results' },
		)
	},

	welcomeBack(name) {
		return notify.info(
			`Welcome back, ${name}`,
			'Your dashboard is ready. Pick up where you left off.',
			{ actionUrl: APP_ROUTES.DASHBOARD, actionLabel: 'Go to Dashboard' },
		)
	},
}

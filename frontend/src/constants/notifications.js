import {
	CheckCircle2,
	XCircle,
	AlertTriangle,
	Info,
	Sparkles,
	Briefcase,
	FileText,
	Mic,
	ScanSearch,
	Map,
	CreditCard,
	Settings,
} from 'lucide-react'

/** @typedef {'success'|'error'|'warning'|'info'|'ai'|'job'|'resume'|'interview'|'ats'|'career_roadmap'|'subscription'|'system'} NotificationType */

export const NOTIFICATION_STORAGE_KEY = 'aca-notifications'

export const NOTIFICATION_TYPES = {
	SUCCESS: 'success',
	ERROR: 'error',
	WARNING: 'warning',
	INFO: 'info',
	AI: 'ai',
	JOB: 'job',
	RESUME: 'resume',
	INTERVIEW: 'interview',
	ATS: 'ats',
	CAREER_ROADMAP: 'career_roadmap',
	SUBSCRIPTION: 'subscription',
	SYSTEM: 'system',
}

/** Visual config per notification type */
export const NOTIFICATION_TYPE_CONFIG = {
	success: {
		label: 'Success',
		icon: CheckCircle2,
		color: 'var(--notif-success)',
		bg: 'var(--notif-success-bg)',
	},
	error: {
		label: 'Error',
		icon: XCircle,
		color: 'var(--notif-error)',
		bg: 'var(--notif-error-bg)',
	},
	warning: {
		label: 'Warning',
		icon: AlertTriangle,
		color: 'var(--notif-warning)',
		bg: 'var(--notif-warning-bg)',
	},
	info: {
		label: 'Info',
		icon: Info,
		color: 'var(--notif-info)',
		bg: 'var(--notif-info-bg)',
	},
	ai: {
		label: 'AI',
		icon: Sparkles,
		color: 'var(--notif-ai)',
		bg: 'var(--notif-ai-bg)',
	},
	job: {
		label: 'Job',
		icon: Briefcase,
		color: 'var(--notif-job)',
		bg: 'var(--notif-job-bg)',
	},
	resume: {
		label: 'Resume',
		icon: FileText,
		color: 'var(--notif-resume)',
		bg: 'var(--notif-resume-bg)',
	},
	interview: {
		label: 'Interview',
		icon: Mic,
		color: 'var(--notif-interview)',
		bg: 'var(--notif-interview-bg)',
	},
	ats: {
		label: 'ATS',
		icon: ScanSearch,
		color: 'var(--notif-ats)',
		bg: 'var(--notif-ats-bg)',
	},
	career_roadmap: {
		label: 'Career Roadmap',
		icon: Map,
		color: 'var(--notif-roadmap)',
		bg: 'var(--notif-roadmap-bg)',
	},
	subscription: {
		label: 'Subscription',
		icon: CreditCard,
		color: 'var(--notif-subscription)',
		bg: 'var(--notif-subscription-bg)',
	},
	system: {
		label: 'System',
		icon: Settings,
		color: 'var(--notif-system)',
		bg: 'var(--notif-system-bg)',
	},
}

/** Filter options for the notifications page */
export const NOTIFICATION_FILTERS = [
	{ id: 'all', label: 'All' },
	{ id: 'unread', label: 'Unread' },
	{ id: 'read', label: 'Read' },
	{ id: 'success', label: 'Success' },
	{ id: 'error', label: 'Errors' },
	{ id: 'ai', label: 'AI' },
	{ id: 'job', label: 'Jobs' },
	{ id: 'resume', label: 'Resume' },
	{ id: 'interview', label: 'Interview' },
	{ id: 'system', label: 'System' },
]

export const NOTIFICATION_SORT_OPTIONS = [
	{ id: 'newest', label: 'Newest' },
	{ id: 'oldest', label: 'Oldest' },
	{ id: 'unread_first', label: 'Unread First' },
	{ id: 'read_first', label: 'Read First' },
]

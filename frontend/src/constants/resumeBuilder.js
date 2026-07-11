import { z } from 'zod'

/* ─────────────────────────────────────────────────────────────────
   Resume Builder — Constants & Configuration
   ───────────────────────────────────────────────────────────────── */

export const RESUME_STORAGE_KEY = 'aca_resume_data'

/* ─── Section definitions ───────────────────────────────────────── */

export const RESUME_SECTIONS = [
	{ id: 'personalInfo', label: 'Personal Information', icon: 'User' },
	{ id: 'summary', label: 'Summary', icon: 'AlignLeft' },
	{ id: 'experience', label: 'Experience', icon: 'Briefcase' },
	{ id: 'education', label: 'Education', icon: 'GraduationCap' },
	{ id: 'skills', label: 'Skills', icon: 'Wrench' },
	{ id: 'projects', label: 'Projects', icon: 'FolderGit2' },
	{ id: 'certifications', label: 'Certifications', icon: 'Award' },
	{ id: 'achievements', label: 'Achievements', icon: 'Trophy' },
	{ id: 'languages', label: 'Languages', icon: 'Globe' },
	{ id: 'socialLinks', label: 'Social Links', icon: 'Link' },
	{ id: 'customSections', label: 'Custom Section', icon: 'Plus' },
]

export const DEFAULT_SECTION_ORDER = RESUME_SECTIONS.map((s) => s.id)

/* ─── Template definitions ──────────────────────────────────────── */

export const RESUME_TEMPLATES = [
	{ id: 'modern', label: 'Modern', description: 'Clean layout with blue accents' },
	{ id: 'minimal', label: 'Minimal', description: 'Understated elegance' },
	{ id: 'professional', label: 'Professional', description: 'Traditional and formal' },
	{ id: 'executive', label: 'Executive', description: 'Bold and commanding' },
	{ id: 'creative', label: 'Creative', description: 'Colorful and unique' },
]

/* ─── Default data shapes ───────────────────────────────────────── */

export function createDefaultPersonalInfo() {
	return {
		name: '',
		headline: '',
		email: '',
		phone: '',
		location: '',
		website: '',
		linkedin: '',
		github: '',
		portfolio: '',
	}
}

export function createDefaultExperience() {
	return {
		id: crypto.randomUUID(),
		company: '',
		role: '',
		startDate: '',
		endDate: '',
		currentlyWorking: false,
		description: '',
	}
}

export function createDefaultEducation() {
	return {
		id: crypto.randomUUID(),
		college: '',
		degree: '',
		branch: '',
		cgpa: '',
		passingYear: '',
	}
}

export function createDefaultProject() {
	return {
		id: crypto.randomUUID(),
		name: '',
		techStack: '',
		description: '',
		github: '',
		liveUrl: '',
	}
}

export function createDefaultCertification() {
	return {
		id: crypto.randomUUID(),
		name: '',
		issuer: '',
		credentialUrl: '',
	}
}

export function createDefaultAchievement() {
	return {
		id: crypto.randomUUID(),
		text: '',
	}
}

export function createDefaultLanguage() {
	return {
		id: crypto.randomUUID(),
		language: '',
		proficiency: 'Intermediate',
	}
}

export function createDefaultCustomSection() {
	return {
		id: crypto.randomUUID(),
		title: '',
		content: '',
	}
}

export function createDefaultResumeState() {
	return {
		personalInfo: createDefaultPersonalInfo(),
		summary: '',
		experiences: [],
		education: [],
		skills: [],
		projects: [],
		certifications: [],
		achievements: [],
		languages: [],
		socialLinks: { linkedin: '', github: '', twitter: '', portfolio: '', other: '' },
		customSections: [],
		sectionOrder: [...DEFAULT_SECTION_ORDER],
		activeTemplate: 'modern',
		expandedSections: new Set(['personalInfo']),
		autosaveStatus: 'saved',
		isLoading: true,
	}
}

/* ─── Zod validation schemas ────────────────────────────────────── */

export const personalInfoSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	headline: z.string().optional(),
	email: z.string().email('Invalid email address').or(z.literal('')),
	phone: z.string().optional(),
	location: z.string().optional(),
	website: z.string().url('Invalid URL').or(z.literal('')).optional(),
	linkedin: z.string().url('Invalid URL').or(z.literal('')).optional(),
	github: z.string().url('Invalid URL').or(z.literal('')).optional(),
	portfolio: z.string().url('Invalid URL').or(z.literal('')).optional(),
})

export const experienceSchema = z.object({
	company: z.string().min(1, 'Company name is required'),
	role: z.string().min(1, 'Role is required'),
	startDate: z.string().min(1, 'Start date is required'),
	endDate: z.string().optional(),
	currentlyWorking: z.boolean().optional(),
	description: z.string().optional(),
})

export const educationSchema = z.object({
	college: z.string().min(1, 'College name is required'),
	degree: z.string().min(1, 'Degree is required'),
	branch: z.string().optional(),
	cgpa: z.string().optional(),
	passingYear: z.string().optional(),
})

export const projectSchema = z.object({
	name: z.string().min(1, 'Project name is required'),
	techStack: z.string().optional(),
	description: z.string().optional(),
	github: z.string().url('Invalid URL').or(z.literal('')).optional(),
	liveUrl: z.string().url('Invalid URL').or(z.literal('')).optional(),
})

export const certificationSchema = z.object({
	name: z.string().min(1, 'Certification name is required'),
	issuer: z.string().optional(),
	credentialUrl: z.string().url('Invalid URL').or(z.literal('')).optional(),
})

/* ─── Proficiency levels ────────────────────────────────────────── */

export const LANGUAGE_PROFICIENCY_LEVELS = [
	'Beginner',
	'Elementary',
	'Intermediate',
	'Upper Intermediate',
	'Advanced',
	'Native',
]

/* ─── Dummy AI suggestions ──────────────────────────────────────── */

export const DUMMY_AI_SUGGESTIONS = [
	{
		id: 'sug-1',
		text: 'Improve your summary with stronger action verbs',
		type: 'improvement',
		section: 'summary',
	},
	{
		id: 'sug-2',
		text: 'Add quantified achievements to your experience',
		type: 'enhancement',
		section: 'experience',
	},
	{
		id: 'sug-3',
		text: 'ATS keyword "project management" is missing',
		type: 'ats',
		section: 'skills',
	},
	{
		id: 'sug-4',
		text: 'Replace passive language in your descriptions',
		type: 'improvement',
		section: 'experience',
	},
	{
		id: 'sug-5',
		text: 'Add a professional headline to stand out',
		type: 'enhancement',
		section: 'personalInfo',
	},
]

/* ─── Completion calculation ────────────────────────────────────── */

export function calculateResumeCompletion(state) {
	let total = 0
	let filled = 0

	/* Personal info fields (9 fields, heavily weighted) */
	const pi = state.personalInfo
	const piFields = ['name', 'headline', 'email', 'phone', 'location', 'website', 'linkedin', 'github', 'portfolio']
	total += piFields.length
	filled += piFields.filter((f) => pi[f]?.trim()).length

	/* Summary */
	total += 1
	if (state.summary?.trim()) filled += 1

	/* Experiences */
	total += 1
	if (state.experiences?.length > 0) filled += 1

	/* Education */
	total += 1
	if (state.education?.length > 0) filled += 1

	/* Skills */
	total += 1
	if (state.skills?.length > 0) filled += 1

	/* Projects */
	total += 1
	if (state.projects?.length > 0) filled += 1

	/* Certifications */
	total += 1
	if (state.certifications?.length > 0) filled += 1

	/* Achievements */
	total += 1
	if (state.achievements?.length > 0) filled += 1

	/* Languages */
	total += 1
	if (state.languages?.length > 0) filled += 1

	return total > 0 ? Math.round((filled / total) * 100) : 0
}

/* ─── Section completion check ──────────────────────────────────── */

export function isSectionComplete(sectionId, state) {
	switch (sectionId) {
		case 'personalInfo': {
			const pi = state.personalInfo
			return !!(pi.name?.trim() && pi.email?.trim())
		}
		case 'summary':
			return !!state.summary?.trim()
		case 'experience':
			return state.experiences?.length > 0
		case 'education':
			return state.education?.length > 0
		case 'skills':
			return state.skills?.length > 0
		case 'projects':
			return state.projects?.length > 0
		case 'certifications':
			return state.certifications?.length > 0
		case 'achievements':
			return state.achievements?.length > 0
		case 'languages':
			return state.languages?.length > 0
		case 'socialLinks': {
			const sl = state.socialLinks
			return !!(sl?.linkedin?.trim() || sl?.github?.trim() || sl?.twitter?.trim())
		}
		case 'customSections':
			return state.customSections?.length > 0
		default:
			return false
	}
}

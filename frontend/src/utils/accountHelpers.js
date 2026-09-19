import { formatDate } from './dateTime.js'

/**
 * Profile fields checked for completion calculation.
 * These are the nested paths within the user object from the API.
 */
const PERSONAL_FIELDS = [
	{ path: 'firstName' },
	{ path: 'lastName' },
	{ path: 'email' },
	{ path: 'profile.phone' },
	{ path: 'profile.country' },
	{ path: 'profile.city' },
	{ path: 'profile.bio' },
]

const CAREER_FIELDS = [
	{ path: 'career.currentRole' },
	{ path: 'career.experienceLevel' },
	{ path: 'career.preferredRole' },
	{ path: 'career.skills', isArray: true },
]

const SOCIAL_FIELDS = [
	{ path: 'socialLinks.linkedin' },
	{ path: 'socialLinks.github' },
]

const ALL_COMPLETION_FIELDS = [...PERSONAL_FIELDS, ...CAREER_FIELDS, ...SOCIAL_FIELDS]

/**
 * Get a nested value from an object using a dot-separated path.
 */
function getNestedValue(obj, path) {
	return path.split('.').reduce((acc, key) => acc?.[key], obj)
}

export function getInitials(firstName = '', lastName = '') {
	const first = firstName.trim()[0] ?? ''
	const last = lastName.trim()[0] ?? ''
	return (first + last).toUpperCase() || '?'
}

/**
 * Calculate profile completion from actual database data.
 * Deterministic: completed fields / total fields × 100
 */
export function calculateProfileCompletion(profile) {
	if (!profile) return 0

	let filled = 0
	const total = ALL_COMPLETION_FIELDS.length

	for (const { path, isArray } of ALL_COMPLETION_FIELDS) {
		const value = getNestedValue(profile, path)
		if (isArray) {
			if (Array.isArray(value) && value.length > 0) filled += 1
		} else if (value && String(value).trim()) {
			filled += 1
		}
	}

	return Math.round((filled / total) * 100)
}

export function validateUrl(value) {
	if (!value?.trim()) return true
	try {
		const url = new URL(value.trim())
		return url.protocol === 'http:' || url.protocol === 'https:'
	} catch {
		return false
	}
}

export function getPasswordStrength(password = '') {
	if (!password) return { score: 0, label: 'Enter a password', color: 'var(--color-muted)' }

	let score = 0
	if (password.length >= 8) score += 1
	if (password.length >= 12) score += 1
	if (/[A-Z]/.test(password)) score += 1
	if (/[0-9]/.test(password)) score += 1
	if (/[^A-Za-z0-9]/.test(password)) score += 1

	const levels = [
		{ score: 0, label: 'Very weak', color: 'var(--color-danger)' },
		{ score: 1, label: 'Weak', color: '#F97316' },
		{ score: 2, label: 'Fair', color: '#EAB308' },
		{ score: 3, label: 'Good', color: '#22C55E' },
		{ score: 4, label: 'Strong', color: '#059669' },
		{ score: 5, label: 'Excellent', color: '#047857' },
	]

	return { score, ...levels[Math.min(score, levels.length - 1)] }
}

export function formatJoinedDate(dateStr) {
	if (!dateStr) return 'Unknown'
	return formatDate(dateStr, { month: 'long', year: 'numeric' })
}

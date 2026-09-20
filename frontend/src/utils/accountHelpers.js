import { formatDate } from './dateTime.js'

/**
 * Profile fields checked for completion calculation.
 * These are the nested paths within the user object from the API.
 */
function isCompletedValue(value) {
	if (Array.isArray(value)) return value.length > 0
	return value !== null && value !== undefined && String(value).trim() !== ''
}

/**
 * Collect leaf values from the persisted Account Center categories. The API
 * already returns every field defined by the User schema with its defaults,
 * so new profile/career/social fields participate without maintaining a
 * second hard-coded field list on the frontend.
 */
function getAccountCompletionValues(user) {
	return [
		user.firstName,
		user.lastName,
		user.email,
		...Object.values(user.profile ?? {}),
		...Object.values(user.career ?? {}),
		...Object.values(user.socialLinks ?? {}),
	]
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

	const values = getAccountCompletionValues(profile)
	if (!values.length) return 0

	const completed = values.filter(isCompletedValue).length
	return Math.round((completed / values.length) * 100)
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

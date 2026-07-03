const PROFILE_FIELDS = [
	'firstName',
	'lastName',
	'email',
	'phone',
	'gender',
	'dateOfBirth',
	'country',
	'city',
	'state',
	'bio',
	'currentRole',
	'experienceLevel',
	'education',
	'university',
	'degree',
	'branch',
	'passingYear',
	'preferredRole',
	'preferredLocation',
	'expectedSalary',
	'employmentType',
]

const SOCIAL_FIELDS = ['linkedin', 'github', 'portfolio', 'leetcode', 'codeforces', 'hackerrank', 'website']

export function getInitials(firstName = '', lastName = '') {
	const first = firstName.trim()[0] ?? ''
	const last = lastName.trim()[0] ?? ''
	return (first + last).toUpperCase() || '?'
}

export function calculateProfileCompletion(profile) {
	if (!profile) return 0

	let filled = 0
	let total = PROFILE_FIELDS.length + SOCIAL_FIELDS.length + 1

	for (const field of PROFILE_FIELDS) {
		const value = profile[field]
		if (Array.isArray(value) ? value.length > 0 : Boolean(value?.toString().trim())) {
			filled += 1
		}
	}

	for (const field of SOCIAL_FIELDS) {
		if (profile.social?.[field]?.trim()) filled += 1
	}

	if (profile.avatar) filled += 1

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
	if (!dateStr) return ''
	return new Date(dateStr).toLocaleDateString('en-US', {
		month: 'long',
		day: 'numeric',
		year: 'numeric',
	})
}

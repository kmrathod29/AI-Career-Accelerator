const INDIA_TIME_ZONE = 'Asia/Kolkata'

const DATE_TIME_FORMATTER = new Intl.DateTimeFormat('en-IN', {
	timeZone: INDIA_TIME_ZONE,
	day: '2-digit',
	month: 'short',
	year: 'numeric',
	hour: '2-digit',
	minute: '2-digit',
	hour12: true,
	timeZoneName: 'short',
})

const DATE_FORMATTER = new Intl.DateTimeFormat('en-IN', {
	timeZone: INDIA_TIME_ZONE,
	day: '2-digit',
	month: 'short',
	year: 'numeric',
})

function toDate(value) {
	if (value instanceof Date) return value
	if (typeof value === 'number' || typeof value === 'string') {
		const date = new Date(value)
		return Number.isNaN(date.getTime()) ? null : date
	}
	return null
}

/** Format an API/MongoDB timestamp for Indian users. */
export function formatDateTime(value) {
	const date = toDate(value)
	return date ? DATE_TIME_FORMATTER.format(date) : ''
}

/** Format an API/MongoDB date for Indian users without a time. */
export function formatDate(value, options = {}) {
	const date = toDate(value)
	if (!date) return ''

	return new Intl.DateTimeFormat('en-IN', {
		timeZone: INDIA_TIME_ZONE,
		day: '2-digit',
		month: 'short',
		year: 'numeric',
		...options,
	}).format(date)
}

export function getIndiaDateParts(value = new Date()) {
	const date = toDate(value) ?? new Date()
	return Object.fromEntries(
		new Intl.DateTimeFormat('en-CA', {
			timeZone: INDIA_TIME_ZONE,
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
		}).formatToParts(date).map(({ type, value: partValue }) => [type, partValue]),
	)
}

export { INDIA_TIME_ZONE }
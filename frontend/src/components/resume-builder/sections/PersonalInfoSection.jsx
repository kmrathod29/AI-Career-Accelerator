import { usePersonalInfo, resumeStore } from '@/stores/resumeStore.js'

const FIELDS = [
	{ key: 'name', label: 'Full Name', placeholder: 'John Doe', type: 'text', colSpan: 2 },
	{ key: 'headline', label: 'Professional Headline', placeholder: 'Senior Software Engineer', type: 'text', colSpan: 2 },
	{ key: 'email', label: 'Email', placeholder: 'john@example.com', type: 'email' },
	{ key: 'phone', label: 'Phone', placeholder: '+1 (555) 000-0000', type: 'tel' },
	{ key: 'location', label: 'Location', placeholder: 'San Francisco, CA', type: 'text' },
	{ key: 'website', label: 'Website', placeholder: 'https://johndoe.com', type: 'url' },
	{ key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/johndoe', type: 'url' },
	{ key: 'github', label: 'GitHub', placeholder: 'https://github.com/johndoe', type: 'url' },
	{ key: 'portfolio', label: 'Portfolio', placeholder: 'https://portfolio.dev', type: 'url' },
]

/**
 * PersonalInfoSection — form fields for personal information.
 */
export function PersonalInfoSection() {
	const personalInfo = usePersonalInfo()

	const handleChange = (key, value) => {
		resumeStore.updatePersonalInfo({ [key]: value })
	}

	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
			{FIELDS.map((field) => (
				<div
					key={field.key}
					className={field.colSpan === 2 ? 'sm:col-span-2' : ''}
				>
					<label className="mb-1.5 block text-xs font-medium text-[var(--color-muted)]">
						{field.label}
					</label>
					<input
						type={field.type}
						value={personalInfo[field.key] || ''}
						onChange={(e) => handleChange(field.key, e.target.value)}
						placeholder={field.placeholder}
						className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3.5 py-2.5 text-sm text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-muted)]/60 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
					/>
				</div>
			))}
		</div>
	)
}

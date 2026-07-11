import { useSocialLinks, resumeStore } from '@/stores/resumeStore.js'

const FIELDS = [
	{ key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/username' },
	{ key: 'github', label: 'GitHub', placeholder: 'https://github.com/username' },
	{ key: 'twitter', label: 'Twitter / X', placeholder: 'https://x.com/username' },
	{ key: 'portfolio', label: 'Portfolio', placeholder: 'https://yourportfolio.com' },
	{ key: 'other', label: 'Other', placeholder: 'https://...' },
]

/**
 * SocialLinksSection — social media profile links.
 */
export function SocialLinksSection() {
	const socialLinks = useSocialLinks()

	return (
		<div className="space-y-3">
			{FIELDS.map((field) => (
				<div key={field.key}>
					<label className="mb-1 block text-[11px] font-medium text-[var(--color-muted)]">
						{field.label}
					</label>
					<input
						type="url"
						value={socialLinks[field.key] || ''}
						onChange={(e) => resumeStore.updateSocialLinks({ [field.key]: e.target.value })}
						placeholder={field.placeholder}
						className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-muted)]/60 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
					/>
				</div>
			))}
		</div>
	)
}

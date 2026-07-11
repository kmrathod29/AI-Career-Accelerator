import { motion, AnimatePresence } from 'framer-motion'
import { useResumeData, useResumeTemplate } from '@/stores/resumeStore.js'
import { ModernTemplate } from '@components/resume-builder/preview/ModernTemplate.jsx'
import { MinimalTemplate } from '@components/resume-builder/preview/MinimalTemplate.jsx'
import { ProfessionalTemplate } from '@components/resume-builder/preview/ProfessionalTemplate.jsx'
import { ExecutiveTemplate } from '@components/resume-builder/preview/ExecutiveTemplate.jsx'
import { CreativeTemplate } from '@components/resume-builder/preview/CreativeTemplate.jsx'

const TEMPLATE_MAP = {
	modern: ModernTemplate,
	minimal: MinimalTemplate,
	professional: ProfessionalTemplate,
	executive: ExecutiveTemplate,
	creative: CreativeTemplate,
}

/**
 * ResumePreview — right sticky panel with live HTML preview.
 * Renders inside a scaled A4-proportioned container.
 */
export function ResumePreview() {
	const data = useResumeData()
	const template = useResumeTemplate()
	const TemplateComponent = TEMPLATE_MAP[template] || ModernTemplate

	return (
		<div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3 sm:p-4">
			<p className="mb-3 text-xs font-semibold tracking-wide text-[var(--color-muted)] uppercase">
				Live Preview
			</p>

			{/* A4-proportioned preview container */}
			<div
				className="overflow-hidden rounded-lg border border-[var(--color-border)] bg-white shadow-sm"
				style={{ aspectRatio: '210 / 297' }}
			>
				<div className="h-full w-full overflow-y-auto scrollbar-none">
					<AnimatePresence mode="wait">
						<motion.div
							key={template}
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							transition={{ duration: 0.25 }}
						>
							<TemplateComponent data={data} />
						</motion.div>
					</AnimatePresence>
				</div>
			</div>

			<p className="mt-2 text-center text-[10px] text-[var(--color-muted)]">
				Preview updates as you type
			</p>
		</div>
	)
}

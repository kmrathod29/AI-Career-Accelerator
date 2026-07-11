import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Award } from 'lucide-react'
import { useCertifications, resumeStore } from '@/stores/resumeStore.js'
import { SectionEmptyState } from '@components/resume-builder/shared/SectionEmptyState.jsx'

/**
 * CertificationsSection — list of certifications.
 */
export function CertificationsSection() {
	const certifications = useCertifications()

	if (certifications.length === 0) {
		return (
			<SectionEmptyState
				icon={Award}
				message="Add your professional certifications to validate your expertise."
				actionLabel="Add Certification"
				onAction={() => resumeStore.addCertification()}
			/>
		)
	}

	return (
		<div className="space-y-4">
			<AnimatePresence>
				{certifications.map((cert, idx) => (
					<motion.div
						key={cert.id}
						layout
						initial={{ opacity: 0, y: 12 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.2 }}
						className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-inset)] p-4"
					>
						<div className="mb-3 flex items-center justify-between">
							<span className="text-xs font-medium text-[var(--color-muted)]">
								Certification {idx + 1}
							</span>
							<button
								type="button"
								onClick={() => resumeStore.removeCertification(cert.id)}
								className="rounded-lg p-1.5 text-[var(--color-muted)] transition-colors hover:bg-[var(--notif-error-bg)] hover:text-[var(--color-danger)]"
							>
								<Trash2 className="h-3.5 w-3.5" />
							</button>
						</div>

						<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
							<div className="sm:col-span-2">
								<label className="mb-1 block text-[11px] font-medium text-[var(--color-muted)]">Certification Name</label>
								<input
									type="text"
									value={cert.name}
									onChange={(e) => resumeStore.updateCertification(cert.id, { name: e.target.value })}
									placeholder="AWS Solutions Architect"
									className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-muted)]/60 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
								/>
							</div>
							<div>
								<label className="mb-1 block text-[11px] font-medium text-[var(--color-muted)]">Issuer</label>
								<input
									type="text"
									value={cert.issuer}
									onChange={(e) => resumeStore.updateCertification(cert.id, { issuer: e.target.value })}
									placeholder="Amazon Web Services"
									className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-muted)]/60 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
								/>
							</div>
							<div>
								<label className="mb-1 block text-[11px] font-medium text-[var(--color-muted)]">Credential URL</label>
								<input
									type="url"
									value={cert.credentialUrl}
									onChange={(e) => resumeStore.updateCertification(cert.id, { credentialUrl: e.target.value })}
									placeholder="https://credly.com/badges/..."
									className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] outline-none transition-colors placeholder:text-[var(--color-muted)]/60 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
								/>
							</div>
						</div>
					</motion.div>
				))}
			</AnimatePresence>

			<motion.button
				type="button"
				whileHover={{ scale: 1.01 }}
				whileTap={{ scale: 0.99 }}
				onClick={() => resumeStore.addCertification()}
				className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--color-border)] py-3 text-sm font-medium text-[var(--color-muted)] transition-colors hover:border-[var(--color-primary)]/30 hover:bg-[var(--color-primary)]/5 hover:text-[var(--color-primary)]"
			>
				<Plus className="h-4 w-4" />
				Add Certification
			</motion.button>
		</div>
	)
}

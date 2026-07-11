import { useRef, useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { resumeStore } from '@/stores/resumeStore.js'
import { ResumeHeader } from '@components/resume-builder/ResumeHeader.jsx'
import { ResumeSidebar } from '@components/resume-builder/ResumeSidebar.jsx'
import { ResumeEditor } from '@components/resume-builder/ResumeEditor.jsx'
import { ResumePreview } from '@components/resume-builder/ResumePreview.jsx'
import { MobileActionBar } from '@components/resume-builder/shared/MobileActionBar.jsx'

/**
 * ResumeBuilderPage — three-column layout inside existing DashboardLayout.
 *
 * Desktop (xl+): Sidebar | Editor | Preview
 * Tablet (lg–xl): Sidebar | Editor, Preview below
 * Mobile (<lg): Single column, all stacked, bottom action bar
 */
export function ResumeBuilderPage() {
	const sectionRefs = useRef({})
	const [activeSectionId, setActiveSectionId] = useState('personalInfo')

	/* Initialize store on mount */
	useEffect(() => {
		resumeStore.init()
	}, [])

	/* Scroll to section + expand it */
	const handleSectionClick = useCallback((sectionId) => {
		setActiveSectionId(sectionId)
		resumeStore.expandSection(sectionId)

		/* Scroll into view after a short delay for expansion animation */
		requestAnimationFrame(() => {
			const el = sectionRefs.current[sectionId]
			if (el) {
				el.scrollIntoView({ behavior: 'smooth', block: 'start' })
			}
		})
	}, [])

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.35 }}
		>
			{/* Page header */}
			<ResumeHeader />

			{/* Three-column layout */}
			<div className="flex flex-col gap-5 lg:flex-row">
				{/* Left panel — sidebar */}
				<div className="w-full shrink-0 lg:w-56 xl:w-64">
					<div className="lg:sticky lg:top-4">
						<ResumeSidebar
							activeSectionId={activeSectionId}
							onSectionClick={handleSectionClick}
						/>
					</div>
				</div>

				{/* Center panel — editor */}
				<div className="min-w-0 flex-1">
					<ResumeEditor sectionRefs={sectionRefs} />
				</div>

				{/* Right panel — preview (desktop: sticky, tablet+: below editor on smaller screens) */}
				<div className="w-full shrink-0 xl:w-96">
					<div className="xl:sticky xl:top-4">
						<ResumePreview />
					</div>
				</div>
			</div>

			{/* Mobile bottom action bar — adds safe padding */}
			<div className="pb-20 lg:pb-0">
				<MobileActionBar />
			</div>
		</motion.div>
	)
}

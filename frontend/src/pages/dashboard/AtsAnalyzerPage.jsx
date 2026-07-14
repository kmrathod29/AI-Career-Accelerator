import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ScanSearch, RefreshCw } from 'lucide-react'
import {
	atsStore,
	useAtsViewMode,
	useAtsResult,
	useAtsFile,
	useAtsHistory,
	useAtsError,
} from '@/stores/atsStore.js'
import { AtsHeader } from '@components/ats-analyzer/AtsHeader.jsx'
import { UploadCardHero, UploadCardCompact } from '@components/ats-analyzer/UploadCard.jsx'
import { FeaturePreviewCards } from '@components/ats-analyzer/AtsEmptyState.jsx'
import { AtsScoreHero } from '@components/ats-analyzer/AtsScoreHero.jsx'
import { ScoreBreakdown } from '@components/ats-analyzer/ScoreBreakdown.jsx'
import { KeywordAnalysis } from '@components/ats-analyzer/KeywordAnalysis.jsx'
import { AtsIssues } from '@components/ats-analyzer/AtsIssues.jsx'
import { AiSuggestions } from '@components/ats-analyzer/AiSuggestions.jsx'
import { ResumePreviewPanel } from '@components/ats-analyzer/ResumePreviewPanel.jsx'
import { CompatibilityMeter } from '@components/ats-analyzer/CompatibilityMeter.jsx'
import { SkillsCoverage } from '@components/ats-analyzer/SkillsCoverage.jsx'
import { RecruiterChecklist } from '@components/ats-analyzer/RecruiterChecklist.jsx'
import { ResumeInsights } from '@components/ats-analyzer/ResumeInsights.jsx'
import { ImprovementTimeline } from '@components/ats-analyzer/ImprovementTimeline.jsx'
import { AnalysisHistory } from '@components/ats-analyzer/AnalysisHistory.jsx'
import { AtsLoadingState } from '@components/ats-analyzer/AtsLoadingState.jsx'
import { AtsErrorState } from '@components/ats-analyzer/AtsErrorState.jsx'

const fadeUp = {
	initial: { opacity: 0, y: 12 },
	animate: { opacity: 1, y: 0 },
}

/**
 * AtsAnalyzerPage — redesigned with a single-path onboarding flow.
 *
 * Flow:
 *   Empty State → Upload → Uploaded Card → Analyze → ATS Report Dashboard
 *
 * CTA rules:
 *   Before upload  → "Upload Resume" (one button only)
 *   After upload   → "Analyze Resume" (upload button disappears)
 *   After analysis → "Re-analyze Resume"
 *   Never duplicate CTAs.
 */
export function AtsAnalyzerPage() {
	const viewMode = useAtsViewMode()
	const result = useAtsResult()
	const file = useAtsFile()
	const history = useAtsHistory()
	const error = useAtsError()

	/* Initialize store on mount */
	useEffect(() => {
		atsStore.init()
	}, [])

	/* Determine mobile CTA label + icon */
	const mobileCta = !file
		? null
		: viewMode === 'results'
			? { label: 'Re-analyze Resume', icon: RefreshCw }
			: viewMode !== 'analyzing'
				? { label: 'Analyze Resume', icon: ScanSearch }
				: null

	return (
		<motion.div
			initial="initial"
			animate="animate"
			transition={{ staggerChildren: 0.06 }}
			className="space-y-5"
		>
			{/* Page header — single contextual CTA */}
			<AtsHeader />

			{/* Main content — conditional on viewMode */}
			<AnimatePresence mode="wait">

				{/* ─── ANALYZING ─────────────────────────────────────── */}
				{viewMode === 'analyzing' && (
					<motion.div
						key="loading"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.3 }}
					>
						<AtsLoadingState />
					</motion.div>
				)}

				{/* ─── ERROR ────────────────────────────────────────── */}
				{viewMode === 'error' && (
					<motion.div
						key="error"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.3 }}
					>
						<AtsErrorState message={error} />
					</motion.div>
				)}

				{/* ─── EMPTY — Onboarding experience ────────────────── */}
				{viewMode === 'empty' && !file && (
					<motion.div
						key="onboarding"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.3 }}
						className="space-y-8"
					>
						{/* Hero upload card — centered, single CTA */}
						<UploadCardHero />

						{/* Feature preview cards — what you'll get */}
						<motion.div variants={fadeUp} transition={{ duration: 0.4 }}>
							<FeaturePreviewCards />
						</motion.div>

						{/* Recent analyses — separated visually */}
						{history.length > 0 && (
							<motion.div variants={fadeUp} transition={{ duration: 0.4 }}>
								<AnalysisHistory history={history} />
							</motion.div>
						)}
					</motion.div>
				)}

				{/* ─── UPLOADED — File ready, awaiting analysis ──────── */}
				{viewMode === 'empty' && file && (
					<motion.div
						key="uploaded"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.3 }}
						className="space-y-8"
					>
						{/* Compact file card with Analyze CTA */}
						<div className="mx-auto max-w-xl">
							<UploadCardCompact showAnalyzeButton />
						</div>

						{/* Feature preview cards */}
						<motion.div variants={fadeUp} transition={{ duration: 0.4 }}>
							<FeaturePreviewCards />
						</motion.div>

						{/* Recent analyses */}
						{history.length > 0 && (
							<motion.div variants={fadeUp} transition={{ duration: 0.4 }}>
								<AnalysisHistory history={history} />
							</motion.div>
						)}
					</motion.div>
				)}

				{/* ─── RESULTS — Full ATS dashboard ─────────────────── */}
				{viewMode === 'results' && result && (
					<motion.div
						key="results"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.3 }}
						className="space-y-5"
					>
						{/* Compact file info card (shrunken) + Re-analyze */}
						<motion.div variants={fadeUp} transition={{ duration: 0.4 }}>
							<UploadCardCompact showAnalyzeButton isReAnalyze />
						</motion.div>

						{/* Two-column dashboard layout */}
						<div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
							{/* LEFT COLUMN — Analysis details */}
							<div className="space-y-5 lg:col-span-7">
								{/* Compatibility meter */}
								<motion.div variants={fadeUp} transition={{ duration: 0.4 }}>
									<CompatibilityMeter
										compatible={result.compatibility.compatible}
										needsImprovement={result.compatibility.needsImprovement}
										critical={result.compatibility.critical}
									/>
								</motion.div>

								{/* Score breakdown */}
								<motion.div variants={fadeUp} transition={{ duration: 0.4 }}>
									<ScoreBreakdown breakdown={result.scoreBreakdown} />
								</motion.div>

								{/* Keyword analysis */}
								<motion.div variants={fadeUp} transition={{ duration: 0.4 }}>
									<KeywordAnalysis
										matched={result.matchedKeywords}
										missing={result.missingKeywords}
										suggested={result.suggestedKeywords}
									/>
								</motion.div>

								{/* ATS Issues */}
								<motion.div variants={fadeUp} transition={{ duration: 0.4 }}>
									<AtsIssues issues={result.issues} />
								</motion.div>

								{/* Resume insights */}
								<motion.div variants={fadeUp} transition={{ duration: 0.4 }}>
									<ResumeInsights insights={result.insights} />
								</motion.div>

								{/* Improvement timeline */}
								<motion.div variants={fadeUp} transition={{ duration: 0.4 }}>
									<ImprovementTimeline items={result.timeline} />
								</motion.div>

								{/* Analysis history */}
								<motion.div variants={fadeUp} transition={{ duration: 0.4 }}>
									<AnalysisHistory history={history} />
								</motion.div>
							</div>

							{/* RIGHT COLUMN — Score + Preview + Suggestions */}
							<div className="lg:col-span-5">
								<div className="space-y-5 lg:sticky lg:top-4">
									<AtsScoreHero score={result.overallScore} />
									<ResumePreviewPanel />
									<AiSuggestions suggestions={result.suggestions} />
									<SkillsCoverage skills={result.skillsCoverage} />
									<RecruiterChecklist items={result.checklist} />
								</div>
							</div>
						</div>
					</motion.div>
				)}

			</AnimatePresence>

			{/* ─── Mobile sticky bottom CTA ─────────────────────── */}
			{mobileCta && (
				<div className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--color-border)] bg-[var(--navbar-bg-solid)] p-3 backdrop-blur-sm sm:hidden">
					<button
						type="button"
						onClick={() => atsStore.startAnalysis()}
						className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
					>
						<mobileCta.icon className="h-4 w-4" />
						{mobileCta.label}
					</button>
				</div>
			)}

			{/* Mobile bottom padding */}
			{mobileCta && <div className="h-16 sm:hidden" />}
		</motion.div>
	)
}

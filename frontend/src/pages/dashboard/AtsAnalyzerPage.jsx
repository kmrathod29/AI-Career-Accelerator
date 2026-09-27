import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ScanSearch, RefreshCw } from 'lucide-react'
import {
	atsStore,
	useAtsViewMode,
	useAtsResult,
	useAtsFile,
	useAtsHistory,
	useAtsError,
	useAtsJobDescription,
} from '@/stores/atsStore.js'
import { AtsHeader } from '@components/ats-analyzer/AtsHeader.jsx'
import { UploadCardHero, UploadCardCompact } from '@components/ats-analyzer/UploadCard.jsx'
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
import { APP_ROUTES } from '@constants/routes.js'

/**
 * AtsAnalyzerPage — production ATS analysis dashboard.
 *
 * Route architecture:
 * - /dashboard/ats-analyzer         -> Landing page / upload onboarding / history
 * - /dashboard/ats-analyzer/:id     -> Specific ATS analysis report (isolated source of truth)
 */
export function AtsAnalyzerPage() {
	const { analysisId } = useParams()
	const navigate = useNavigate()

	const viewMode = useAtsViewMode()
	const result = useAtsResult()
	const file = useAtsFile()
	const history = useAtsHistory()
	const error = useAtsError()
	const jobDescription = useAtsJobDescription()

	/* Initialize history on mount */
	useEffect(() => {
		atsStore.init()
	}, [])

	/* Synchronize with dynamic URL analysisId */
	useEffect(() => {
		if (analysisId) {
			atsStore.loadAnalysis(analysisId)
		} else {
			// On base route /dashboard/ats-analyzer, ensure clean state
			// Never display an analysis report on the base route without an ID
			atsStore.resetToEmpty()
		}
	}, [analysisId])

	/* Mobile CTA */
	const jdLength = jobDescription ? jobDescription.trim().length : 0
	const isJdInvalid = jdLength > 0 && jdLength < 20
	const canAnalyze = Boolean(file) && !isJdInvalid

	const isDetailRoute = Boolean(analysisId)
	const isMatchingResultLoaded = isDetailRoute && Boolean(result && result.id === analysisId)
	const isDetailLoading = isDetailRoute && (!result || result.id !== analysisId || viewMode === 'analyzing') && !error

	const mobileCta = !file
		? null
		: isMatchingResultLoaded
			? { label: 'Re-analyze Resume', icon: RefreshCw }
			: viewMode !== 'analyzing' && canAnalyze
				? { label: jdLength >= 20 ? 'Analyze Match' : 'Analyze Resume', icon: ScanSearch }
				: null

	const handleMobileAnalyze = async () => {
		const analysis = await atsStore.startAnalysis()
		if (analysis?.id) {
			navigate(`/dashboard/ats-analyzer/${analysis.id}`)
		}
	}

	const analysisMode = result?.analysisMode || (result?.missingKeywords?.length > 0 ? 'job_match' : 'resume_only')

	return (
		<div className="space-y-5">
			{/* Page header */}
			<AtsHeader />

			{/* Main content area */}
			<AnimatePresence mode="wait">

				{/* ─── LOADING STATE (analyzing new upload or loading dynamic analysis) ─── */}
				{(viewMode === 'analyzing' || isDetailLoading) && !error && (
					<motion.div
						key="loading"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
					>
						<AtsLoadingState />
					</motion.div>
				)}

				{/* ─── ERROR STATE (e.g. 404 Analysis Not Found) ───────── */}
				{error && (
					<motion.div
						key="error"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
					>
						<AtsErrorState
							message={error}
							onReturn={() => navigate(APP_ROUTES.ATS_ANALYZER)}
						/>
					</motion.div>
				)}

				{/* ─── BASE ROUTE: EMPTY STATE (upload onboarding) ─────── */}
				{!isDetailRoute && viewMode === 'empty' && !file && (
					<motion.div
						key="onboarding"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.25 }}
						className="space-y-8"
					>
						{/* Hero upload card */}
						<UploadCardHero />

						{/* Recent analyses */}
						{history.length > 0 && (
							<AnalysisHistory history={history} />
						)}
					</motion.div>
				)}

				{/* ─── BASE ROUTE: FILE UPLOADED AWAITING ANALYSIS ─────── */}
				{!isDetailRoute && viewMode === 'empty' && file && (
					<motion.div
						key="uploaded"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.25 }}
						className="space-y-8"
					>
						<div className="mx-auto max-w-xl">
							<UploadCardCompact showAnalyzeButton />
						</div>

						{/* Recent analyses */}
						{history.length > 0 && (
							<AnalysisHistory history={history} />
						)}
					</motion.div>
				)}

				{/* ─── DETAIL ROUTE: FULL ATS REPORT DASHBOARD ──────────── */}
				{isMatchingResultLoaded && (
					<motion.div
						key={result.id}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.25 }}
						className="space-y-5"
					>
						{/* Top compact file card + Re-analyze */}
						<UploadCardCompact showAnalyzeButton isReAnalyze />

						{/* Two-column dashboard layout */}
						<div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
							{/* LEFT COLUMN — Analysis details (rendered directly without broken opacity: 0 wrappers) */}
							<div className="space-y-5 lg:col-span-7">
								{/* Compatibility meter */}
								{result.compatibility && (
									<CompatibilityMeter
										compatible={result.compatibility.compatible}
										needsImprovement={result.compatibility.needsImprovement}
										critical={result.compatibility.critical}
									/>
								)}

								{/* Score breakdown */}
								{result.scoreBreakdown?.length > 0 && (
									<ScoreBreakdown breakdown={result.scoreBreakdown} />
								)}

								{/* Keyword analysis */}
								{(result.matchedKeywords?.length > 0 || result.missingKeywords?.length > 0) && (
									<KeywordAnalysis
										matched={result.matchedKeywords}
										missing={result.missingKeywords}
										suggested={result.suggestedKeywords}
										mode={analysisMode}
									/>
								)}

								{/* ATS Issues */}
								{result.issues?.length > 0 && (
									<AtsIssues issues={result.issues} />
								)}

								{/* Resume insights */}
								{result.insights && (
									<ResumeInsights insights={result.insights} />
								)}

								{/* Improvement timeline */}
								{result.timeline?.length > 0 && (
									<ImprovementTimeline items={result.timeline} />
								)}

								{/* Analysis history */}
								{history.length > 0 && (
									<AnalysisHistory history={history} />
								)}
							</div>

							{/* RIGHT COLUMN — Score + Preview + Suggestions */}
							<div className="lg:col-span-5">
								<div className="space-y-5 lg:sticky lg:top-4">
									<AtsScoreHero score={result.overallScore} />
									<ResumePreviewPanel />
									{result.suggestions?.length > 0 && (
										<AiSuggestions suggestions={result.suggestions} />
									)}
									{result.skillsCoverage?.length > 0 && (
										<SkillsCoverage skills={result.skillsCoverage} mode={analysisMode} />
									)}
									{result.checklist?.length > 0 && (
										<RecruiterChecklist items={result.checklist} />
									)}
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
						onClick={handleMobileAnalyze}
						className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
					>
						<mobileCta.icon className="h-4 w-4" />
						{mobileCta.label}
					</button>
				</div>
			)}

			{/* Mobile bottom padding */}
			{mobileCta && <div className="h-16 sm:hidden" />}
		</div>
	)
}

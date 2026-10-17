import { useEffect, useRef, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import {
	AlertCircle,
	AlertTriangle,
	ArrowLeft,
	BrainCircuit,
	BookOpen,
	CheckCircle2,
	ChevronDown,
	ChevronRight,
	Clock,
	Eye,
	FileText,
	History,
	RefreshCw,
	Target,
	Trash2,
	TrendingUp,
	Upload,
	X,
	Zap,
} from 'lucide-react'
import {
	skillGapStore,
	useSkillGapStore,
	useSkillGapResult,
	useSkillGapHistory,
	useSkillGapError,
	useSkillGapForm,
	SKILL_GAP_LOADING_STEPS,
} from '@/stores/skillGapStore.js'
import { cn } from '@utils/classNames.js'
import { formatDate } from '@utils/dateTime.js'
import { APP_ROUTES } from '@constants/routes.js'

/* ── Shared helpers ──────────────────────────────────────────── */

const MAX_FILE_SIZE = 5 * 1024 * 1024

function formatFileSize(bytes) {
	if (bytes < 1024) return `${bytes} B`
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
	return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

function getReadinessTier(score) {
	if (score >= 80) return { label: 'Strong Match', color: 'emerald' }
	if (score >= 60) return { label: 'Good Progress', color: 'blue' }
	if (score >= 40) return { label: 'Building Skills', color: 'amber' }
	return { label: 'Early Stage', color: 'red' }
}

const TIER_COLORS = {
	emerald: { stroke: '#10B981', badge: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
	blue: { stroke: '#3B82F6', badge: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
	amber: { stroke: '#F59E0B', badge: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
	red: { stroke: '#EF4444', badge: 'bg-red-500/10 text-red-500 border-red-500/20' },
}

const PRIORITY_BADGE = {
	high: 'bg-red-500/10 text-red-500 border border-red-500/20',
	medium: 'bg-amber-500/10 text-amber-500 border border-amber-500/20',
	low: 'bg-blue-500/10 text-blue-500 border border-blue-500/20',
}

const RADIUS = 85
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

/* ═══════════════════════════════════════════════════════════════════
   PAGE HEADER — mirrors ResumeMatchHeader exactly
   ═══════════════════════════════════════════════════════════════════ */

function SkillGapHeader({ isDetail = false, targetRole = '', onBack = null }) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 12 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.35 }}
			className="mb-5 flex flex-col items-start gap-4 sm:mb-6 sm:flex-row sm:items-end sm:justify-between"
		>
			<div className="min-w-0">
				<p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--color-primary)]">
					SKILL GAP
				</p>
				<h2 className="text-2xl font-black tracking-[-0.05em] leading-[1.05] text-[var(--color-text)] sm:text-[32px]">
					{isDetail && targetRole ? `${targetRole} Analysis` : 'Skill Gap Analysis'}
				</h2>
				<p className="mt-1 text-base leading-[1.6] text-[var(--color-muted)]">
					{isDetail
						? 'Review your skill gap and actionable learning priorities.'
						: 'Identify missing skills for your dream role and get personalized learning recommendations.'}
				</p>
			</div>

			{isDetail && onBack && (
				<div className="shrink-0">
					<button
						type="button"
						onClick={onBack}
						className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm font-medium text-[var(--color-text)] shadow-sm transition-all hover:bg-[var(--color-surface-2)] hover:border-[var(--color-primary)]/40 hover:text-[var(--color-primary)] cursor-pointer"
					>
						<ArrowLeft className="h-4 w-4" />
						Back to Skill Gap
					</button>
				</div>
			)}
		</motion.div>
	)
}

/* ═══════════════════════════════════════════════════════════════════
   LOADING STATE — mirrors MatchLoadingState with Skill Gap steps
   ═══════════════════════════════════════════════════════════════════ */

function SkillGapLoadingState() {
	const loadingStep = useSkillGapStore((s) => s.loadingStep)
	const [dots, setDots] = useState('')

	useEffect(() => {
		const interval = setInterval(() => {
			setDots((prev) => (prev.length >= 3 ? '' : prev + '.'))
		}, 400)
		return () => clearInterval(interval)
	}, [])

	const primaryMessage = SKILL_GAP_LOADING_STEPS[loadingStep] ?? SKILL_GAP_LOADING_STEPS[0]
	const progress = ((loadingStep + 1) / SKILL_GAP_LOADING_STEPS.length) * 100

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="flex flex-col items-center justify-center py-20"
		>
			{/* Animated icon */}
			<motion.div
				animate={{
					rotate: [0, 360],
					scale: [1, 1.1, 1],
				}}
				transition={{
					rotate: { duration: 2, repeat: Infinity, ease: 'linear' },
					scale: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
				}}
				className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--color-primary)]/10"
			>
				<BrainCircuit className="h-10 w-10 text-[var(--color-primary)]" strokeWidth={1.5} />
			</motion.div>

			{/* Step message */}
			<AnimatePresence mode="wait">
				<motion.div
					key={`${primaryMessage}-${loadingStep}`}
					initial={{ opacity: 0, y: 8 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -8 }}
					transition={{ duration: 0.25 }}
					className="text-center"
				>
					<p className="mb-1 text-base font-semibold text-[var(--color-text)]">
						{primaryMessage}{dots}
					</p>
				</motion.div>
			</AnimatePresence>

			{/* Progress bar */}
			<div className="mb-2 h-1.5 w-64 overflow-hidden rounded-full bg-[var(--progress-track)]">
				<motion.div
					animate={{ width: `${progress}%` }}
					transition={{ duration: 0.6, ease: 'easeOut' }}
					className="h-full rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]"
				/>
			</div>

			<p className="text-xs text-[var(--color-muted)]">
				Step {loadingStep + 1} of {SKILL_GAP_LOADING_STEPS.length}
			</p>

			{/* Skeleton cards */}
			<div className="mt-10 grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
				{[...Array(4)].map((_, i) => (
					<div key={i} className="h-24 rounded-xl animate-shimmer" />
				))}
			</div>
		</motion.div>
	)
}

/* ═══════════════════════════════════════════════════════════════════
   ERROR STATE — mirrors MatchErrorState
   ═══════════════════════════════════════════════════════════════════ */

function SkillGapErrorState({ message, onReturn, onRetry }) {
	const isNotFound = message?.toLowerCase().includes('not found')

	return (
		<motion.div
			initial={{ opacity: 0, y: 16 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, ease: 'easeOut' }}
			className="flex flex-col items-center justify-center py-16 text-center"
		>
			<motion.div
				initial={{ scale: 0.8, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
				className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10"
			>
				<AlertCircle className="h-9 w-9 text-red-500" strokeWidth={1.5} />
			</motion.div>

			<h3 className="mb-2 text-lg font-semibold text-[var(--color-text)]">
				{isNotFound ? 'Analysis Not Found' : 'Analysis could not be completed'}
			</h3>

			<p className="mx-auto mb-6 max-w-sm text-sm leading-relaxed text-[var(--color-muted)]">
				{message ?? 'Something went wrong. Please try again.'}
			</p>

			<div className="flex flex-wrap items-center justify-center gap-3">
				{onRetry && (
					<motion.button
						type="button"
						whileHover={{ scale: 1.03 }}
						whileTap={{ scale: 0.97 }}
						onClick={onRetry}
						className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
					>
						<RefreshCw className="h-4 w-4" />
						Try Again
					</motion.button>
				)}
				{onReturn && (
					<motion.button
						type="button"
						whileHover={{ scale: 1.03 }}
						whileTap={{ scale: 0.97 }}
						onClick={onReturn}
						className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-2.5 text-sm font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface-2)]"
					>
						<ArrowLeft className="h-4 w-4" />
						Return to Skill Gap
					</motion.button>
				)}
			</div>
		</motion.div>
	)
}

/* ═══════════════════════════════════════════════════════════════════
   UPLOAD HERO / INPUT FORM — skill input + optional resume upload
   ═══════════════════════════════════════════════════════════════════ */

function SkillGapInputForm() {
	const inputRef = useRef(null)
	const [isDragging, setIsDragging] = useState(false)
	const { targetRole, currentSkills, uploadedFile } = useSkillGapForm()
	const isAnalyzing = useSkillGapStore((s) => s.isAnalyzing)
	const navigate = useNavigate()

	const validateAndUpload = useCallback((rawFile) => {
		if (!rawFile) return
		if (!rawFile.name.toLowerCase().endsWith('.pdf')) {
			toast.error('Only PDF files are supported')
			return
		}
		if (rawFile.size > MAX_FILE_SIZE) {
			toast.error('File size must be under 5 MB')
			return
		}
		skillGapStore.uploadFile(rawFile)
		toast.success(`${rawFile.name} uploaded`)
	}, [])

	const handleDrop = useCallback((e) => {
		e.preventDefault()
		setIsDragging(false)
		const droppedFile = e.dataTransfer.files?.[0]
		if (droppedFile) validateAndUpload(droppedFile)
	}, [validateAndUpload])

	const handleDragOver = useCallback((e) => { e.preventDefault(); setIsDragging(true) }, [])
	const handleDragLeave = useCallback((e) => { e.preventDefault(); setIsDragging(false) }, [])
	const handleFileChange = useCallback((e) => {
		const selected = e.target.files?.[0]
		if (selected) validateAndUpload(selected)
		if (inputRef.current) inputRef.current.value = ''
	}, [validateAndUpload])

	const trimmedRole = targetRole.trim()
	const trimmedSkills = currentSkills.trim()
	const hasInput = Boolean(trimmedSkills || uploadedFile)
	const canAnalyze = trimmedRole.length >= 2 && hasInput && !isAnalyzing

	const handleAnalyze = async () => {
		if (!canAnalyze) return
		const analysis = await skillGapStore.startAnalysis()
		if (analysis?.id) {
			navigate(`${APP_ROUTES.SKILL_GAP}/${analysis.id}`)
		}
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 16 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.45, ease: 'easeOut' }}
			className="mx-auto max-w-xl"
		>
			<input
				ref={inputRef}
				id="skill-gap-file-input"
				type="file"
				accept=".pdf"
				onChange={handleFileChange}
				className="hidden"
				aria-label="Upload resume file for skill extraction"
			/>

			<div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-[var(--shadow-card)]">
				{/* Icon */}
				<motion.div
					initial={{ scale: 0.85, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
					className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary)]/10"
				>
					<BrainCircuit className="h-6 w-6 text-[var(--color-primary)]" strokeWidth={1.5} />
				</motion.div>

				<h3 className="mb-2 text-center text-xl font-bold tracking-[-0.04em] text-[var(--color-text)]">
					Analyze Your Skill Gap
				</h3>
				<p className="mx-auto mb-6 max-w-sm text-center text-sm leading-relaxed text-[var(--color-muted)]">
					Enter your target role and describe your current skills. Optionally upload a PDF resume for more accurate skill extraction.
				</p>

				{/* Target Role */}
				<div className="mb-5">
					<label htmlFor="skill-gap-target-role" className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-[var(--color-text)]">
						<Target className="h-4 w-4 text-[var(--color-primary)]" strokeWidth={1.5} />
						Target Role <span className="text-red-500">*</span>
					</label>
					<p className="mb-2 text-xs text-[var(--color-muted)]">
						What role are you aiming for? Be specific for the most accurate gap analysis.
					</p>
					<input
						id="skill-gap-target-role"
						type="text"
						value={targetRole}
						onChange={(e) => skillGapStore.setTargetRole(e.target.value)}
						placeholder="e.g., Senior Frontend Engineer, Full Stack Developer, Data Scientist…"
						maxLength={200}
						className="w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-3 text-sm text-[var(--color-text)] placeholder-[var(--color-muted)] transition-colors duration-200 focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]/20"
					/>
					{trimmedRole.length > 0 && trimmedRole.length < 2 && (
						<p className="mt-1 text-[11px] text-amber-500">Enter at least 2 characters</p>
					)}
				</div>

				{/* Current Skills text */}
				<div className="mb-5">
					<label htmlFor="skill-gap-current-skills" className="mb-1.5 flex items-center gap-2 text-sm font-semibold text-[var(--color-text)]">
						<Zap className="h-4 w-4 text-[var(--color-primary)]" strokeWidth={1.5} />
						Your Current Skills
						{!uploadedFile && <span className="text-red-500">*</span>}
						{uploadedFile && <span className="ml-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-[10px] font-semibold text-blue-500">Optional with resume</span>}
					</label>
					<p className="mb-2 text-xs text-[var(--color-muted)]">
						List your skills, technologies, and tools. Comma-separated or free-text descriptions both work.
					</p>
					<textarea
						id="skill-gap-current-skills"
						value={currentSkills}
						onChange={(e) => skillGapStore.setCurrentSkills(e.target.value)}
						placeholder="e.g., React, JavaScript, HTML, CSS, Git, REST APIs, Node.js basics…"
						rows={4}
						maxLength={5000}
						className="w-full resize-none rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-3 text-sm text-[var(--color-text)] placeholder-[var(--color-muted)] transition-colors duration-200 focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]/20"
					/>
					<div className="mt-1 flex items-center justify-between text-[11px] text-[var(--color-muted)]">
						<span>
							{!hasInput && !uploadedFile ? (
								<span>Provide skills or upload a resume to continue</span>
							) : trimmedSkills.length > 0 ? (
								<span className="text-emerald-500">Skills entered</span>
							) : null}
						</span>
						<span>{currentSkills.length.toLocaleString()} / 5,000</span>
					</div>
				</div>

				{/* Optional resume upload */}
				<div className="mb-6">
					<div className="mb-2 flex items-center gap-2">
						<Upload className="h-4 w-4 text-[var(--color-primary)]" strokeWidth={1.5} />
						<span className="text-sm font-semibold text-[var(--color-text)]">
							Upload Resume
							<span className="ml-1.5 text-[11px] font-normal text-[var(--color-muted)]">(optional — for better skill extraction)</span>
						</span>
					</div>

					{!uploadedFile ? (
						<motion.div
							onDrop={handleDrop}
							onDragOver={handleDragOver}
							onDragLeave={handleDragLeave}
							onClick={() => inputRef.current?.click()}
							whileHover={{ scale: 1.01 }}
							className={`flex min-h-[90px] cursor-pointer flex-col items-center justify-center rounded-[20px] border-2 border-dashed p-5 transition-colors duration-200 ${
								isDragging
									? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
									: 'border-[var(--color-border)] bg-[var(--color-surface-2)] hover:border-[var(--color-primary)]/40'
							}`}
						>
							<div className="mb-1.5 flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--color-surface)]">
								<FileText className="h-4 w-4 text-[var(--color-muted)]" strokeWidth={1.5} />
							</div>
							<p className="text-sm font-semibold text-[var(--color-text)]">
								Drag & drop your resume
							</p>
							<p className="mt-0.5 text-xs text-[var(--color-muted)]">PDF · Max 5 MB</p>
						</motion.div>
					) : (
						<div className="flex items-center gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3.5">
							<div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)]/10">
								<FileText className="h-5 w-5 text-[var(--color-primary)]" />
							</div>
							<div className="min-w-0 flex-1">
								<p className="truncate text-sm font-semibold text-[var(--color-text)]">
									{uploadedFile.name}
								</p>
								<p className="mt-0.5 text-xs text-[var(--color-muted)]">
									{uploadedFile.size > 0 ? formatFileSize(uploadedFile.size) : 'Uploaded PDF'}
								</p>
							</div>
							<div className="flex shrink-0 items-center gap-1.5">
								<button
									type="button"
									onClick={() => inputRef.current?.click()}
									className="rounded-lg p-2 text-[var(--color-muted)] transition-colors hover:bg-[var(--color-surface-3)] hover:text-[var(--color-text)]"
									title="Replace file"
								>
									<RefreshCw className="h-4 w-4" />
								</button>
								<button
									type="button"
									onClick={() => {
										skillGapStore.removeFile()
										toast.info('Resume removed')
									}}
									className="rounded-lg p-2 text-[var(--color-muted)] transition-colors hover:bg-red-500/10 hover:text-red-500"
									title="Remove file"
								>
									<X className="h-4 w-4" />
								</button>
							</div>
						</div>
					)}
				</div>

				{/* Analyze CTA */}
				<motion.button
					type="button"
					initial={{ opacity: 0, y: 6 }}
					animate={{ opacity: 1, y: 0 }}
					whileHover={{ scale: canAnalyze ? 1.02 : 1 }}
					whileTap={{ scale: canAnalyze ? 0.97 : 1 }}
					onClick={handleAnalyze}
					disabled={!canAnalyze}
					id="skill-gap-analyze-btn"
					className={`flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-white transition-opacity ${
						canAnalyze
							? 'bg-[var(--color-primary)] hover:opacity-90'
							: 'cursor-not-allowed bg-[var(--color-muted)] opacity-50'
					}`}
				>
					<BrainCircuit className="h-4 w-4" />
					Analyze Skill Gap
				</motion.button>

				{!trimmedRole && (
					<p className="mt-3 text-center text-[11px] text-[var(--color-muted)]">
						Enter your target role to continue.
					</p>
				)}
				{trimmedRole.length >= 2 && !hasInput && (
					<p className="mt-3 text-center text-[11px] text-[var(--color-muted)]">
						Provide your current skills or upload a resume.
					</p>
				)}
			</div>
		</motion.div>
	)
}

/* ═══════════════════════════════════════════════════════════════════
   ANALYSIS HISTORY — mirrors MatchAnalysisHistory pattern
   ═══════════════════════════════════════════════════════════════════ */

function SkillGapHistory({ history = [] }) {
	const navigate = useNavigate()
	const [pendingDelete, setPendingDelete] = useState(null)
	const [isDeleting, setIsDeleting] = useState(false)

	if (history.length === 0) return null

	function handleView(analysisId) {
		navigate(`${APP_ROUTES.SKILL_GAP}/${analysisId}`)
	}

	async function executeDelete() {
		if (!pendingDelete) return
		setIsDeleting(true)
		try {
			const { id, targetRole } = pendingDelete
			const result = await skillGapStore.deleteAnalysis(id)
			if (result.success) {
				toast.success(`Analysis for "${targetRole}" deleted`)
				if (result.wasActive) {
					navigate(APP_ROUTES.SKILL_GAP)
				}
			} else {
				toast.error(result.message || 'Failed to delete analysis')
			}
		} finally {
			setIsDeleting(false)
			setPendingDelete(null)
		}
	}

	return (
		<>
			<div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
				<div className="mb-4 flex items-center justify-between">
					<div className="flex items-center gap-2">
						<History className="h-4 w-4 text-[var(--color-primary)]" strokeWidth={1.8} />
						<h3 className="text-sm font-semibold text-[var(--color-text)]">Recent Analyses</h3>
					</div>
					<span className="text-xs text-[var(--color-muted)]">
						{history.length} {history.length === 1 ? 'record' : 'records'}
					</span>
				</div>

				<div className="space-y-2">
					{history.map((entry, i) => {
						const tier = getReadinessTier(entry.readinessScore)
						const colors = TIER_COLORS[tier.color] ?? TIER_COLORS.blue
						const badgeClass = colors.badge

						return (
							<motion.div
								key={entry.id}
								initial={{ opacity: 0, y: 8 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.3, delay: i * 0.04 }}
								className="group flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3.5 py-3 transition-colors hover:border-[var(--color-primary)]/30"
							>
								{/* Role info */}
								<div className="min-w-0 flex-1 cursor-pointer" onClick={() => handleView(entry.id)}>
									<div className="flex items-center gap-2">
										<p className="truncate text-[13px] font-medium text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">
											{entry.targetRole}
										</p>
									</div>
									<p className="mt-0.5 text-[11px] text-[var(--color-muted)]">
										{formatDate(entry.date)}
										{entry.resumeFileName && <span className="ml-1.5">· {entry.resumeFileName}</span>}
									</p>
								</div>

								{/* Score badge */}
								<span className={cn('shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-semibold', badgeClass)}>
									{entry.readinessScore}/100
								</span>

								{/* Actions */}
								<div className="flex shrink-0 items-center gap-1">
									<button
										type="button"
										onClick={() => handleView(entry.id)}
										className="rounded-lg p-1.5 text-[var(--color-muted)] transition-colors hover:bg-[var(--color-surface-3)] hover:text-[var(--color-text)]"
										title="View Analysis"
									>
										<Eye className="h-3.5 w-3.5" />
									</button>
									<button
										type="button"
										onClick={() => setPendingDelete(entry)}
										className="rounded-lg p-1.5 text-[var(--color-muted)] transition-colors hover:bg-red-500/10 hover:text-red-500"
										title="Delete analysis"
									>
										<Trash2 className="h-3.5 w-3.5" />
									</button>
								</div>
							</motion.div>
						)
					})}
				</div>
			</div>

			{/* Delete Confirmation Modal */}
			<AnimatePresence>
				{pendingDelete && (
					<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={() => !isDeleting && setPendingDelete(null)}
							className="absolute inset-0 bg-black/60 backdrop-blur-sm"
						/>
						<motion.div
							initial={{ opacity: 0, scale: 0.95, y: 10 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.95, y: 10 }}
							transition={{ duration: 0.2 }}
							className="relative w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-2xl"
						>
							<div className="flex items-start gap-4">
								<div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
									<AlertTriangle className="h-5 w-5" strokeWidth={2} />
								</div>
								<div className="min-w-0 flex-1">
									<h4 className="text-base font-bold text-[var(--color-text)]">Delete Analysis?</h4>
									<p className="mt-1.5 text-sm text-[var(--color-muted)] leading-relaxed">
										Are you sure you want to delete the skill gap analysis for{' '}
										<span className="font-semibold text-[var(--color-text)]">
											&ldquo;{pendingDelete.targetRole}&rdquo;
										</span>? This action cannot be undone.
									</p>
								</div>
							</div>
							<div className="mt-6 flex items-center justify-end gap-3">
								<button
									type="button"
									disabled={isDeleting}
									onClick={() => setPendingDelete(null)}
									className="rounded-xl border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface-2)] disabled:opacity-50"
								>
									Cancel
								</button>
								<button
									type="button"
									disabled={isDeleting}
									onClick={executeDelete}
									className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
								>
									{isDeleting ? 'Deleting…' : 'Delete Analysis'}
								</button>
							</div>
						</motion.div>
					</div>
				)}
			</AnimatePresence>
		</>
	)
}

/* ═══════════════════════════════════════════════════════════════════
   READINESS SCORE HERO — circular ring matching AtsScoreHero
   ═══════════════════════════════════════════════════════════════════ */

function ReadinessScoreHero({ score = 0, targetRole = '', summary = '' }) {
	const [displayScore, setDisplayScore] = useState(0)
	const tier = getReadinessTier(score)
	const colors = TIER_COLORS[tier.color] ?? TIER_COLORS.blue
	const offset = CIRCUMFERENCE - (score / 100) * CIRCUMFERENCE

	useEffect(() => {
		let frame
		const duration = 1200
		const start = performance.now()

		function step(now) {
			const elapsed = now - start
			const progress = Math.min(elapsed / duration, 1)
			const eased = 1 - Math.pow(1 - progress, 3)
			setDisplayScore(Math.round(eased * score))
			if (progress < 1) frame = requestAnimationFrame(step)
		}

		frame = requestAnimationFrame(step)
		return () => cancelAnimationFrame(frame)
	}, [score])

	return (
		<motion.div
			initial={{ opacity: 0, y: 16 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
			className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-card)]"
		>
			{targetRole && (
				<p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-primary)]">
					{targetRole}
				</p>
			)}
			<h3 className="mb-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
				Role Readiness Score
			</h3>
			<p className="mb-3 text-[10px] text-[var(--color-muted)] leading-relaxed">
				Score reflects how well your evidenced skills match this specific role's common requirements.
			</p>

			<div className="flex flex-col items-center">
				<div className="relative mb-5">
					<svg width="200" height="200" viewBox="0 0 200 200" className="-rotate-90">
						<circle cx="100" cy="100" r={RADIUS} fill="none" stroke="var(--progress-track)" strokeWidth="12" strokeLinecap="round" />
						<circle
							cx="100" cy="100" r={RADIUS} fill="none" stroke={colors.stroke} strokeWidth="12" strokeLinecap="round"
							strokeDasharray={CIRCUMFERENCE} strokeDashoffset={CIRCUMFERENCE}
							className="animate-score-ring"
							style={{ '--score-circumference': CIRCUMFERENCE, '--score-offset': offset }}
						/>
					</svg>
					<div className="absolute inset-0 flex flex-col items-center justify-center">
						<span className="text-4xl font-black tracking-[-0.06em] text-[var(--color-text)]">{displayScore}</span>
						<span className="text-sm text-[var(--color-muted)]">/ 100</span>
					</div>
				</div>

				<span className={cn('mb-3 inline-flex items-center rounded-full border px-3.5 py-1 text-xs font-semibold', colors.badge)}>
					{tier.label}
				</span>

				{summary && (
					<p className="max-w-xs text-center text-sm leading-relaxed text-[var(--color-muted)]">
						{summary}
					</p>
				)}
			</div>
		</motion.div>
	)
}

/* ═══════════════════════════════════════════════════════════════════
   SKILL CHIP LISTS — current, matching, role requirements
   ═══════════════════════════════════════════════════════════════════ */

function SkillChipCard({ icon: Icon, title, items = [], tone = 'default', emptyText }) {
	const chipClass =
		tone === 'success'
			? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
			: tone === 'primary'
			? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
			: 'bg-[var(--color-surface-2)] text-[var(--color-text)]'

	return (
		<section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
			<div className="flex items-center gap-3 mb-3">
				{Icon && (
					<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)]/10">
						<Icon className="h-4 w-4 text-[var(--color-primary)]" strokeWidth={1.8} />
					</div>
				)}
				<h3 className="text-sm font-bold text-[var(--color-text)]">{title}</h3>
				{items.length > 0 && (
					<span className="ml-auto text-xs text-[var(--color-muted)]">{items.length}</span>
				)}
			</div>
			{items.length > 0 ? (
				<div className="flex flex-wrap gap-2">
					{items.map((item) => (
						<span key={item} className={`rounded-full px-3 py-1 text-xs font-semibold ${chipClass}`}>
							{item}
						</span>
					))}
				</div>
			) : (
				<p className="text-sm text-[var(--color-muted)]">{emptyText || 'None identified.'}</p>
			)}
		</section>
	)
}

/* ═══════════════════════════════════════════════════════════════════
   SKILL ITEM CARD — missing/improve with priority, steps, duration
   ═══════════════════════════════════════════════════════════════════ */

function SkillItemCard({ item, index }) {
	const [expanded, setExpanded] = useState(false)
	const isMissing = item.type === 'missing'

	return (
		<motion.div
			initial={{ opacity: 0, y: 8 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3, delay: index * 0.04 }}
			className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] overflow-hidden"
		>
			<div className="p-4">
				<div className="flex items-start gap-3">
					<div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${isMissing ? 'bg-red-500/10' : 'bg-amber-500/10'}`}>
						{isMissing
							? <AlertCircle className="h-3.5 w-3.5 text-red-500" strokeWidth={2} />
							: <TrendingUp className="h-3.5 w-3.5 text-amber-500" strokeWidth={2} />}
					</div>

					<div className="flex-1 min-w-0">
						<div className="flex flex-wrap items-center gap-2 mb-1">
							<span className="text-sm font-bold text-[var(--color-text)]">{item.skill}</span>
							<span className={cn('rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide', PRIORITY_BADGE[item.priority] ?? PRIORITY_BADGE.medium)}>
								{item.priority}
							</span>
							<span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${isMissing ? 'bg-red-500/8 text-red-500' : 'bg-amber-500/8 text-amber-500'}`}>
								{isMissing ? 'Missing' : 'Improve'}
							</span>
						</div>

						{item.reason && (
							<p className="text-[13px] leading-relaxed text-[var(--color-muted)]">{item.reason}</p>
						)}

						{item.estimatedDuration && (
							<div className="mt-2 flex items-center gap-1.5">
								<Clock className="h-3 w-3 text-[var(--color-muted)]" />
								<span className="text-[11px] text-[var(--color-muted)]">Est. {item.estimatedDuration}</span>
							</div>
						)}
					</div>

					{item.learningSteps?.length > 0 && (
						<button
							type="button"
							onClick={() => setExpanded((v) => !v)}
							className="shrink-0 rounded-lg p-1.5 text-[var(--color-muted)] transition-colors hover:bg-[var(--color-surface-3)] hover:text-[var(--color-text)]"
							aria-label={expanded ? 'Hide learning steps' : 'Show learning steps'}
						>
							{expanded
								? <ChevronDown className="h-4 w-4" />
								: <ChevronRight className="h-4 w-4" />}
						</button>
					)}
				</div>
			</div>

			{/* Expandable learning steps */}
			<AnimatePresence>
				{expanded && item.learningSteps?.length > 0 && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: 'auto', opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.2 }}
						className="overflow-hidden border-t border-[var(--color-border)]"
					>
						<div className="p-4 pt-3">
							<div className="flex items-center gap-2 mb-2">
								<BookOpen className="h-3.5 w-3.5 text-[var(--color-primary)]" strokeWidth={1.8} />
								<p className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-primary)]">
									Learning Path
								</p>
							</div>
							<ol className="space-y-1.5">
								{item.learningSteps.map((step, si) => (
									<li key={si} className="flex items-start gap-2">
										<span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)]/10 text-[9px] font-bold text-[var(--color-primary)]">
											{si + 1}
										</span>
										<p className="text-[13px] leading-relaxed text-[var(--color-muted)]">{step}</p>
									</li>
								))}
							</ol>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	)
}

/* ═══════════════════════════════════════════════════════════════════
   SKILL ITEMS SECTION — prioritized list of missing/improve skills
   ═══════════════════════════════════════════════════════════════════ */

function SkillItemsSection({ title, icon: Icon, items = [], emptyText, iconColor = 'text-[var(--color-primary)]' }) {
	if (items.length === 0) return null

	const sorted = [...items].sort((a, b) => {
		const order = { high: 0, medium: 1, low: 2 }
		return (order[a.priority] ?? 1) - (order[b.priority] ?? 1)
	})

	return (
		<section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
			<div className="flex items-center gap-3 mb-4">
				<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)]/10">
					<Icon className={`h-4 w-4 ${iconColor}`} strokeWidth={1.8} />
				</div>
				<div>
					<h3 className="text-sm font-bold text-[var(--color-text)]">{title}</h3>
					<p className="text-[11px] text-[var(--color-muted)]">Sorted by priority — high first</p>
				</div>
				<span className="ml-auto rounded-full bg-[var(--color-surface-2)] px-2.5 py-0.5 text-xs font-semibold text-[var(--color-text)]">
					{items.length}
				</span>
			</div>

			<div className="space-y-3">
				{sorted.map((item, i) => (
					<SkillItemCard key={`${item.skill}-${i}`} item={item} index={i} />
				))}
			</div>

			{items.length === 0 && (
				<p className="text-sm text-[var(--color-muted)]">{emptyText}</p>
			)}
		</section>
	)
}

/* ═══════════════════════════════════════════════════════════════════
   DETAIL VIEW — full skill gap report
   ═══════════════════════════════════════════════════════════════════ */

function SkillGapDetailView({ analysis, analysisId }) {
	const navigate = useNavigate()
	const [deleteOpen, setDeleteOpen] = useState(false)
	const [isDeleting, setIsDeleting] = useState(false)
	const history = useSkillGapStore((s) => s.analysisHistory)

	const handleDelete = async () => {
		setIsDeleting(true)
		try {
			const result = await skillGapStore.deleteAnalysis(analysisId)
			if (result.success) {
				toast.success(`Analysis for "${analysis.targetRole}" deleted`)
				navigate(APP_ROUTES.SKILL_GAP)
			} else {
				toast.error(result.message || 'Failed to delete analysis')
			}
		} finally {
			setIsDeleting(false)
			setDeleteOpen(false)
		}
	}

	return (
		<motion.div
			key={analysis.id}
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.25 }}
			className="space-y-5"
		>
			{/* Two-column layout */}
			<div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
				{/* LEFT COLUMN */}
				<div className="space-y-5 lg:col-span-7">
					{/* Missing Skills */}
					{analysis.missingSkills?.length > 0 && (
						<SkillItemsSection
							title="Missing Skills"
							icon={AlertCircle}
							items={analysis.missingSkills}
							iconColor="text-red-500"
							emptyText="No missing skills identified — great job!"
						/>
					)}

					{/* Skills to Improve */}
					{analysis.skillsToImprove?.length > 0 && (
						<SkillItemsSection
							title="Skills to Strengthen"
							icon={TrendingUp}
							items={analysis.skillsToImprove}
							iconColor="text-amber-500"
							emptyText="No improvement areas identified."
						/>
					)}

					{/* Matching Skills chip list */}
					{analysis.matchingSkills?.length > 0 && (
						<SkillChipCard
							icon={CheckCircle2}
							title="Matching Skills"
							items={analysis.matchingSkills}
							tone="success"
							emptyText="No matching skills found between your profile and the target role."
						/>
					)}

					{/* All current skills */}
					{analysis.currentSkills?.length > 0 && (
						<SkillChipCard
							icon={Zap}
							title="Your Current Skills (Identified)"
							items={analysis.currentSkills}
							tone="default"
							emptyText="No current skills were identified."
						/>
					)}

					{/* History in detail view */}
					{history.length > 0 && (
						<SkillGapHistory history={history} />
					)}
				</div>

				{/* RIGHT COLUMN */}
				<div className="lg:col-span-5">
					<div className="space-y-5 lg:sticky lg:top-4">
						{/* Readiness Score */}
						<ReadinessScoreHero
							score={analysis.readinessScore}
							targetRole={analysis.targetRole}
							summary={analysis.summary}
						/>

						{/* Role Requirements */}
						{analysis.roleRequirements?.length > 0 && (
							<SkillChipCard
								icon={Target}
								title="Role Requirements"
								items={analysis.roleRequirements}
								tone="primary"
								emptyText="Role requirements could not be identified."
							/>
						)}

						{/* Actions */}
						<div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
							<h3 className="mb-3 text-sm font-bold text-[var(--color-text)]">Actions</h3>
							<div className="space-y-2">
								<button
									type="button"
									onClick={() => navigate(APP_ROUTES.SKILL_GAP)}
									className="flex w-full items-center gap-2 rounded-xl border border-[var(--color-border)] px-4 py-2.5 text-sm font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface-2)]"
								>
									<BrainCircuit className="h-4 w-4 text-[var(--color-primary)]" />
									New Analysis
								</button>
								<button
									type="button"
									onClick={() => setDeleteOpen(true)}
									className="flex w-full items-center gap-2 rounded-xl border border-red-500/20 px-4 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/5"
								>
									<Trash2 className="h-4 w-4" />
									Delete Analysis
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Delete Confirmation Modal */}
			<AnimatePresence>
				{deleteOpen && (
					<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={() => !isDeleting && setDeleteOpen(false)}
							className="absolute inset-0 bg-black/60 backdrop-blur-sm"
						/>
						<motion.div
							initial={{ opacity: 0, scale: 0.95, y: 10 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.95, y: 10 }}
							transition={{ duration: 0.2 }}
							className="relative w-full max-w-md rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-2xl"
						>
							<div className="flex items-start gap-4">
								<div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
									<AlertTriangle className="h-5 w-5" strokeWidth={2} />
								</div>
								<div className="min-w-0 flex-1">
									<h4 className="text-base font-bold text-[var(--color-text)]">Delete Analysis?</h4>
									<p className="mt-1.5 text-sm text-[var(--color-muted)] leading-relaxed">
										This will permanently delete the skill gap analysis for{' '}
										<span className="font-semibold text-[var(--color-text)]">
											&ldquo;{analysis.targetRole}&rdquo;
										</span>. This action cannot be undone.
									</p>
								</div>
							</div>
							<div className="mt-6 flex items-center justify-end gap-3">
								<button
									type="button"
									disabled={isDeleting}
									onClick={() => setDeleteOpen(false)}
									className="rounded-xl border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface-2)] disabled:opacity-50"
								>
									Cancel
								</button>
								<button
									type="button"
									disabled={isDeleting}
									onClick={handleDelete}
									className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
								>
									{isDeleting ? 'Deleting…' : 'Delete Analysis'}
								</button>
							</div>
						</motion.div>
					</div>
				)}
			</AnimatePresence>
		</motion.div>
	)
}

/* ═══════════════════════════════════════════════════════════════════
   SKILL GAP PAGE — main orchestrating component
   Route architecture:
   - /dashboard/skill-gap           → Form / onboarding / history
   - /dashboard/skill-gap/:id       → Specific analysis report
   ═══════════════════════════════════════════════════════════════════ */

export function SkillGapPage() {
	const { analysisId } = useParams()
	const navigate = useNavigate()

	const viewMode = useSkillGapStore((s) => s.viewMode)
	const result = useSkillGapResult()
	const history = useSkillGapHistory()
	const error = useSkillGapError()

	/* Initialize history on mount */
	useEffect(() => {
		skillGapStore.init()
	}, [])

	/* Synchronize with URL analysisId */
	useEffect(() => {
		if (analysisId) {
			skillGapStore.loadAnalysis(analysisId)
		} else {
			skillGapStore.resetToEmpty()
		}
	}, [analysisId])

	const isDetailRoute = Boolean(analysisId)
	const isMatchingResultLoaded = isDetailRoute && Boolean(result && result.id === analysisId)
	const isDetailLoading = isDetailRoute && (!result || result.id !== analysisId || viewMode === 'analyzing') && !error

	const handleRetry = () => {
		skillGapStore.clearError()
		navigate(APP_ROUTES.SKILL_GAP)
	}

	return (
		<div className="space-y-5">
			{/* Page header */}
			<SkillGapHeader
				isDetail={isDetailRoute}
				targetRole={result?.targetRole || ''}
				onBack={() => navigate(APP_ROUTES.SKILL_GAP)}
			/>

			{/* Main content area */}
			<AnimatePresence mode="wait">

				{/* ─── LOADING STATE ─────────────────────────────────────── */}
				{(viewMode === 'analyzing' || isDetailLoading) && !error && (
					<motion.div
						key="loading"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
					>
						<SkillGapLoadingState />
					</motion.div>
				)}

				{/* ─── ERROR STATE ────────────────────────────────────────── */}
				{error && (
					<motion.div
						key="error"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
					>
						<SkillGapErrorState
							message={error}
							onReturn={isDetailRoute ? () => navigate(APP_ROUTES.SKILL_GAP) : null}
							onRetry={!isDetailRoute ? handleRetry : null}
						/>
					</motion.div>
				)}

				{/* ─── BASE ROUTE: INPUT FORM + HISTORY ──────────────────── */}
				{!isDetailRoute && viewMode === 'empty' && !error && (
					<motion.div
						key="onboarding"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.25 }}
						className="space-y-8"
					>
						<SkillGapInputForm />

						{history.length > 0 && (
							<SkillGapHistory history={history} />
						)}
					</motion.div>
				)}

				{/* ─── DETAIL ROUTE: FULL SKILL GAP REPORT ───────────────── */}
				{isMatchingResultLoaded && (
					<SkillGapDetailView
						key={result.id}
						analysis={result}
						analysisId={analysisId}
					/>
				)}

			</AnimatePresence>
		</div>
	)
}

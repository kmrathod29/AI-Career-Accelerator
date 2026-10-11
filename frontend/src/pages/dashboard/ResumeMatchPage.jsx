import { useEffect, useRef, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import {
	AlertCircle,
	ArrowLeft,
	Briefcase,
	Eye,
	FileText,
	GitCompareArrows,
	GraduationCap,
	History,
	RefreshCw,
	Target,
	Trash2,
	Upload,
	X,
	AlertTriangle,
	CheckCircle2,
	XCircle,
	Lightbulb,
} from 'lucide-react'
import {
	resumeMatchStore,
	useResumeMatchStore,
	RESUME_MATCH_LOADING_STEPS,
} from '@/stores/resumeMatchStore.js'
import { getScoreTier, SCORE_TIERS } from '@constants/atsAnalyzer.js'
import { cn } from '@utils/classNames.js'
import { formatDate } from '@utils/dateTime.js'
import { APP_ROUTES } from '@constants/routes.js'

/* ── Shared helpers ───────────────────────────────────────────── */

const MAX_FILE_SIZE = 5 * 1024 * 1024

const TIER_BADGE = {
	emerald: 'bg-emerald-500/10 text-emerald-500',
	blue: 'bg-blue-500/10 text-blue-500',
	amber: 'bg-amber-500/10 text-amber-500',
	red: 'bg-red-500/10 text-red-500',
}

const TIER_COLORS = {
	emerald: { stroke: '#10B981', badge: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
	blue: { stroke: '#3B82F6', badge: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
	amber: { stroke: '#F59E0B', badge: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
	red: { stroke: '#EF4444', badge: 'bg-red-500/10 text-red-500 border-red-500/20' },
}

const RADIUS = 85
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

function formatFileSize(bytes) {
	if (bytes < 1024) return `${bytes} B`
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
	return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

/* ═══════════════════════════════════════════════════════════════════
   PAGE HEADER — mirrors AtsHeader pattern
   ═══════════════════════════════════════════════════════════════════ */

function ResumeMatchHeader({ isDetail = false, onBack = null }) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 12 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.35 }}
			className="mb-5 flex flex-col items-start gap-4 sm:mb-6 sm:flex-row sm:items-end sm:justify-between"
		>
			<div className="min-w-0">
				<p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--color-primary)]">
					TARGETED COMPARISON
				</p>
				<h2 className="text-2xl font-black tracking-[-0.05em] leading-[1.05] text-[var(--color-text)] sm:text-[32px]">
					Resume Match
				</h2>
				<p className="mt-1 text-base leading-[1.6] text-[var(--color-muted)]">
					Compare one resume against one specific job description. Both are required.
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
						Back to Resume Match
					</button>
				</div>
			)}
		</motion.div>
	)
}

/* ═══════════════════════════════════════════════════════════════════
   LOADING STATE — mirrors AtsLoadingState with Resume Match steps
   ═══════════════════════════════════════════════════════════════════ */

function MatchLoadingState() {
	const { isAnalyzing, loadingStep } = useResumeMatchStore((s) => ({
		isAnalyzing: s.isAnalyzing,
		loadingStep: s.loadingStep,
	}))
	const [dots, setDots] = useState('')

	useEffect(() => {
		const interval = setInterval(() => {
			setDots((prev) => (prev.length >= 3 ? '' : prev + '.'))
		}, 400)
		return () => clearInterval(interval)
	}, [])

	const primaryMessage = RESUME_MATCH_LOADING_STEPS[loadingStep] ?? RESUME_MATCH_LOADING_STEPS[0]
	const progress = ((loadingStep + 1) / RESUME_MATCH_LOADING_STEPS.length) * 100

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
				<GitCompareArrows className="h-10 w-10 text-[var(--color-primary)]" strokeWidth={1.5} />
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
				Step {loadingStep + 1} of {RESUME_MATCH_LOADING_STEPS.length}
			</p>

			{/* Skeleton cards */}
			<div className="mt-10 grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
				{[...Array(4)].map((_, i) => (
					<div
						key={i}
						className="h-24 rounded-xl animate-shimmer"
					/>
				))}
			</div>
		</motion.div>
	)
}

/* ═══════════════════════════════════════════════════════════════════
   ERROR STATE — mirrors AtsErrorState
   ═══════════════════════════════════════════════════════════════════ */

function MatchErrorState({ message, onReturn }) {
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
				{isNotFound ? 'Analysis Not Found' : 'Resume match could not be completed'}
			</h3>

			<p className="mx-auto mb-6 max-w-sm text-sm leading-relaxed text-[var(--color-muted)]">
				{message ?? 'Something went wrong while analyzing your resume. Please try again.'}
			</p>

			<div className="flex flex-wrap items-center justify-center gap-3">
				{onReturn && (
					<motion.button
						type="button"
						whileHover={{ scale: 1.03 }}
						whileTap={{ scale: 0.97 }}
						onClick={onReturn}
						className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-2.5 text-sm font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface-2)]"
					>
						<ArrowLeft className="h-4 w-4" />
						Return to Resume Match
					</motion.button>
				)}
			</div>
		</motion.div>
	)
}

/* ═══════════════════════════════════════════════════════════════════
   UPLOAD HERO — mirrors UploadCardHero pattern for Resume Match
   ═══════════════════════════════════════════════════════════════════ */

function ResumeMatchUploadHero() {
	const inputRef = useRef(null)
	const [isDragging, setIsDragging] = useState(false)
	const file = useResumeMatchStore((s) => s.uploadedFile)
	const jobDescription = useResumeMatchStore((s) => s.jobDescription)
	const isAnalyzing = useResumeMatchStore((s) => s.isAnalyzing)
	const navigate = useNavigate()

	const validateAndUpload = useCallback((rawFile) => {
		if (!rawFile) return
		if (!rawFile.name.toLowerCase().endsWith('.pdf') && !rawFile.name.toLowerCase().endsWith('.docx')) {
			toast.error('Only PDF and DOCX files are supported')
			return
		}
		if (rawFile.size > MAX_FILE_SIZE) {
			toast.error('File size must be under 5 MB')
			return
		}
		resumeMatchStore.uploadFile(rawFile)
		toast.success(`${rawFile.name} uploaded successfully`)
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

	const jdLength = jobDescription ? jobDescription.trim().length : 0
	const canAnalyze = Boolean(file) && jdLength >= 20 && !isAnalyzing

	const handleAnalyze = async () => {
		if (!canAnalyze) return
		const analysis = await resumeMatchStore.startAnalysis()
		if (analysis?.id) {
			navigate(`${APP_ROUTES.RESUME_MATCH}/${analysis.id}`)
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
				id="resume-match-file-input"
				type="file"
				accept=".pdf,.docx"
				onChange={handleFileChange}
				className="hidden"
				aria-label="Upload resume file"
			/>

			<div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-[var(--shadow-card)]">
				{/* Icon */}
				<motion.div
					initial={{ scale: 0.85, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
					className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary)]/10"
				>
					<GitCompareArrows className="h-6 w-6 text-[var(--color-primary)]" strokeWidth={1.5} />
				</motion.div>

				<h3 className="mb-2 text-center text-xl font-bold tracking-[-0.04em] text-[var(--color-text)]">
					Match Your Resume
				</h3>
				<p className="mx-auto mb-6 max-w-sm text-center text-sm leading-relaxed text-[var(--color-muted)]">
					Upload a PDF or DOCX resume and paste the target job description for an AI-powered compatibility report.
				</p>

				{/* File section */}
				{!file ? (
					/* Drop zone */
					<motion.div
						onDrop={handleDrop}
						onDragOver={handleDragOver}
						onDragLeave={handleDragLeave}
						onClick={() => inputRef.current?.click()}
						whileHover={{ scale: 1.01 }}
						className={`flex min-h-[110px] cursor-pointer flex-col items-center justify-center rounded-[20px] border-2 border-dashed p-6 transition-colors duration-200 ${isDragging
								? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
								: 'border-[var(--color-border)] bg-[var(--color-surface-2)] hover:border-[var(--color-primary)]/40'
							}`}
					>
						<div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-surface)]">
							<FileText className="h-5 w-5 text-[var(--color-muted)]" strokeWidth={1.5} />
						</div>
						<p className="text-sm font-semibold text-[var(--color-text)]">
							Drag & drop your resume here
						</p>
						<p className="mt-1 text-xs text-[var(--color-muted)]">
							PDF, DOCX · Max 5 MB
						</p>
					</motion.div>
				) : (
					/* File info card */
					<div className="flex items-center gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] p-3.5">
						<div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)]/10">
							<FileText className="h-5 w-5 text-[var(--color-primary)]" />
						</div>
						<div className="min-w-0 flex-1">
							<p className="truncate text-sm font-semibold text-[var(--color-text)]">
								{file.name}
							</p>
							<p className="mt-0.5 text-xs text-[var(--color-muted)]">
								{file.size > 0 ? formatFileSize(file.size) : 'Uploaded Document'}
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
									resumeMatchStore.removeFile()
									toast.info('File removed')
								}}
								className="rounded-lg p-2 text-[var(--color-muted)] transition-colors hover:bg-red-500/10 hover:text-red-500"
								title="Remove file"
							>
								<X className="h-4 w-4" />
							</button>
						</div>
					</div>
				)}

				{/* Job Description */}
				<div className="mt-5">
					<div className="mb-1 flex items-center justify-between">
						<div className="flex items-center gap-2">
							<Briefcase className="h-4 w-4 text-[var(--color-primary)]" strokeWidth={1.5} />
							<label htmlFor="resume-match-jd" className="text-sm font-semibold text-[var(--color-text)]">
								Job Description <span className="text-red-500">*</span>
							</label>
						</div>
					</div>
					<p className="mb-2 text-xs text-[var(--color-muted)]">
						Paste the complete role description so we can compare your resume against the right requirements.
					</p>
					<textarea
						id="resume-match-jd"
						value={jobDescription}
						onChange={(e) => resumeMatchStore.setJobDescription(e.target.value)}
						placeholder="Paste the job description here (e.g., Senior Frontend Engineer requirements)..."
						rows={5}
						maxLength={10000}
						className="w-full resize-none rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-3 text-sm text-[var(--color-text)] placeholder-[var(--color-muted)] transition-colors duration-200 focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]/20"
					/>
					<div className="mt-1 flex items-center justify-between text-[11px] text-[var(--color-muted)]">
						<span>
							{jdLength > 0 && jdLength < 20 ? (
								<span className="text-amber-500">Min 20 characters required</span>
							) : jdLength >= 20 ? (
								<span className="text-emerald-500">Ready to compare</span>
							) : (
								<span>Add at least 20 characters to continue</span>
							)}
						</span>
						<span>{jobDescription.length.toLocaleString()} / 10,000</span>
					</div>
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
					className={`mt-5 flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-white transition-opacity ${canAnalyze
							? 'bg-[var(--color-primary)] hover:opacity-90'
							: 'cursor-not-allowed bg-[var(--color-muted)] opacity-50'
						}`}
				>
					<GitCompareArrows className="h-4 w-4" />
					Analyze Match
				</motion.button>

				{!file && (
					<p className="mt-3 text-center text-[11px] text-[var(--color-muted)]">
						Upload your resume to continue.
					</p>
				)}
			</div>
		</motion.div>
	)
}

/* ═══════════════════════════════════════════════════════════════════
   ANALYSIS HISTORY — mirrors ATS AnalysisHistory pattern exactly
   ═══════════════════════════════════════════════════════════════════ */

function MatchAnalysisHistory({ history = [] }) {
	const navigate = useNavigate()
	const [pendingDelete, setPendingDelete] = useState(null)
	const [isDeleting, setIsDeleting] = useState(false)

	if (history.length === 0) return null

	function handleView(analysisId) {
		navigate(`${APP_ROUTES.RESUME_MATCH}/${analysisId}`)
	}

	function confirmDelete(entry) {
		setPendingDelete(entry)
	}

	async function executeDelete() {
		if (!pendingDelete) return
		setIsDeleting(true)
		try {
			const { id, fileName } = pendingDelete
			const result = await resumeMatchStore.deleteAnalysis(id)
			if (result.success) {
				toast.success(`Analysis for "${fileName}" deleted`)
				if (result.wasActive) {
					navigate(APP_ROUTES.RESUME_MATCH)
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
						<h3 className="text-sm font-semibold text-[var(--color-text)]">
							Recent Analyses
						</h3>
					</div>
					<span className="text-xs text-[var(--color-muted)]">
						{history.length} {history.length === 1 ? 'record' : 'records'}
					</span>
				</div>

				<div className="space-y-2">
					{history.map((entry, i) => {
						const tier = getScoreTier(entry.score)
						const badgeClass = TIER_BADGE[tier.color] ?? TIER_BADGE.blue

						return (
							<motion.div
								key={entry.id}
								initial={{ opacity: 0, y: 8 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.3, delay: i * 0.04 }}
								className="group flex items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-3.5 py-3 transition-colors hover:border-[var(--color-primary)]/30"
							>
								{/* File info */}
								<div className="min-w-0 flex-1 cursor-pointer" onClick={() => handleView(entry.id)}>
									<div className="flex items-center gap-2">
										<p className="truncate text-[13px] font-medium text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">
											{entry.fileName}
										</p>
										<span className="shrink-0 rounded-full border border-[var(--color-border)] px-1.5 py-0.5 text-[10px] text-[var(--color-muted)]">
											Resume Match
										</span>
									</div>
									<p className="mt-0.5 text-[11px] text-[var(--color-muted)]">
										{formatDate(entry.date)}
										{entry.jobTitle && <span className="ml-1.5 truncate">· {entry.jobTitle}</span>}
									</p>
								</div>

								{/* Score badge */}
								<span
									className={cn(
										'shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold',
										badgeClass,
									)}
								>
									{entry.score}/100
								</span>

								{/* Actions */}
								<div className="flex shrink-0 items-center gap-1">
									<button
										type="button"
										onClick={() => handleView(entry.id)}
										className="rounded-lg p-1.5 text-[var(--color-muted)] transition-colors hover:bg-[var(--color-surface-3)] hover:text-[var(--color-text)]"
										title="View Report"
									>
										<Eye className="h-3.5 w-3.5" />
									</button>
									<button
										type="button"
										onClick={() => confirmDelete(entry)}
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

			{/* ─── Delete Confirmation Modal ─────────────────────────────── */}
			<AnimatePresence>
				{pendingDelete && (
					<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
						{/* Backdrop */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							onClick={() => !isDeleting && setPendingDelete(null)}
							className="absolute inset-0 bg-black/60 backdrop-blur-sm"
						/>

						{/* Modal Box */}
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
									<h4 className="text-base font-bold text-[var(--color-text)]">
										Delete Analysis?
									</h4>
									<p className="mt-1.5 text-sm text-[var(--color-muted)] leading-relaxed">
										Are you sure you want to delete the resume match analysis for{' '}
										<span className="font-semibold text-[var(--color-text)]">
											&ldquo;{pendingDelete.fileName}&rdquo;
										</span>
										? This action cannot be undone.
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
									{isDeleting ? 'Deleting...' : 'Delete Analysis'}
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
   MATCH SCORE HERO — same circular ring as AtsScoreHero
   ═══════════════════════════════════════════════════════════════════ */

function MatchScoreHero({ score = 0, summary = '', jobTitle = '' }) {
	const [displayScore, setDisplayScore] = useState(0)
	const tier = getScoreTier(score)
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
			{jobTitle && (
				<p className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-primary)]">
					{jobTitle}
				</p>
			)}
			<h3 className="mb-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
				Overall Match Score
			</h3>

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
   DETAIL RESULT CARDS — chip lists, insight cards, recommendations
   ═══════════════════════════════════════════════════════════════════ */

function ChipListCard({ icon: Icon, title, items, tone = 'default', empty }) {
	const classes = tone === 'success'
		? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
		: tone === 'danger'
			? 'bg-red-500/10 text-red-600 dark:text-red-400'
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
			</div>
			{items?.length ? (
				<div className="flex flex-wrap gap-2">
					{items.map((item) => (
						<span key={item} className={`rounded-full px-3 py-1 text-xs font-semibold ${classes}`}>
							{item}
						</span>
					))}
				</div>
			) : (
				<p className="text-sm text-[var(--color-muted)]">{empty || 'No items identified.'}</p>
			)}
		</section>
	)
}

function InsightCard({ icon: Icon, title, data }) {
	const notApplicable = data?.score === null || data?.score === undefined
	const tier = notApplicable ? null : getScoreTier(data.score)
	const badgeClass = tier ? (TIER_BADGE[tier.color] ?? TIER_BADGE.blue) : ''

	return (
		<section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
			<div className="flex items-center gap-3">
				<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)]/10">
					<Icon className="h-4 w-4 text-[var(--color-primary)]" strokeWidth={1.8} />
				</div>
				<h3 className="flex-1 font-bold text-[var(--color-text)]">{title}</h3>
				{!notApplicable && (
					<span className={cn('rounded-full px-2.5 py-0.5 text-xs font-bold', badgeClass)}>
						{data.score}/100
					</span>
				)}
			</div>
			<p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)]">
				{data?.analysis || 'This requirement could not be evaluated from the provided inputs.'}
			</p>
		</section>
	)
}

/* ═══════════════════════════════════════════════════════════════════
   DETAIL PAGE — full resume match report
   ═══════════════════════════════════════════════════════════════════ */

function MatchDetailView({ analysis, analysisId }) {
	const navigate = useNavigate()
	const inputRef = useRef(null)
	const [reanalysisOpen, setReanalysisOpen] = useState(false)
	const [deleteOpen, setDeleteOpen] = useState(false)
	const [isDeleting, setIsDeleting] = useState(false)
	const history = useResumeMatchStore((s) => s.analysisHistory)

	const handleReanalyze = async (e) => {
		const file = e.target.files?.[0]
		if (!file) return
		if (inputRef.current) inputRef.current.value = ''

		if (!file.name.toLowerCase().endsWith('.pdf') && !file.name.toLowerCase().endsWith('.docx')) {
			toast.error('Only PDF and DOCX files are supported')
			return
		}
		if (file.size > MAX_FILE_SIZE) {
			toast.error('File size must be under 5 MB')
			return
		}

		const result = await resumeMatchStore.reAnalyzeWithFile(file, analysisId)
		if (result?.analysis) {
			setReanalysisOpen(false)
			toast.success('Resume match updated')
		}
	}

	const handleDelete = async () => {
		setIsDeleting(true)
		const result = await resumeMatchStore.deleteAnalysis(analysisId)
		setIsDeleting(false)
		setDeleteOpen(false)
		if (result.success) {
			toast.success('Resume match analysis deleted')
			navigate(APP_ROUTES.RESUME_MATCH)
		} else {
			toast.error(result.message)
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
			{/* Detail action bar */}
			<div className="flex flex-wrap items-center justify-end gap-2">
				<button
					type="button"
					onClick={() => setReanalysisOpen(!reanalysisOpen)}
					className="inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm font-medium text-[var(--color-text)] shadow-sm transition-all hover:bg-[var(--color-surface-2)] hover:border-[var(--color-primary)]/40"
				>
					<RefreshCw className="h-4 w-4" />
					Re-analyze
				</button>
				<button
					type="button"
					onClick={() => setDeleteOpen(true)}
					className="rounded-xl border border-red-500/20 bg-[var(--color-surface)] p-2 text-red-500 transition-colors hover:bg-red-500/10"
					aria-label="Delete analysis"
				>
					<Trash2 className="h-4 w-4" />
				</button>
			</div>

			{/* Re-analyze panel */}
			<AnimatePresence>
				{reanalysisOpen && (
					<motion.section
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: 'auto' }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.2 }}
						className="overflow-hidden rounded-2xl border border-[var(--color-primary)]/30 bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)]"
					>
						<h3 className="font-bold text-[var(--color-text)]">Re-analyze with your latest resume</h3>
						<p className="mt-1 text-sm text-[var(--color-muted)]">
							The saved job description will be reused. Upload a new PDF or DOCX for a fresh comparison.
						</p>
						<input
							ref={inputRef}
							type="file"
							accept=".pdf,.docx"
							className="hidden"
							onChange={handleReanalyze}
						/>
						<motion.button
							type="button"
							whileHover={{ scale: 1.02 }}
							whileTap={{ scale: 0.97 }}
							onClick={() => inputRef.current?.click()}
							className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-4 text-sm font-semibold text-[var(--color-text)] transition-colors hover:border-[var(--color-primary)]/50"
						>
							<Upload className="h-4 w-4 text-[var(--color-primary)]" />
							Upload updated resume
						</motion.button>
					</motion.section>
				)}
			</AnimatePresence>

			{/* Two-column dashboard layout */}
			<div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
				{/* LEFT COLUMN — analysis details */}
				<div className="space-y-5 lg:col-span-7">
					{/* Skills */}
					<div className="grid gap-5 sm:grid-cols-2">
						<ChipListCard icon={CheckCircle2} title="Matching Skills" items={analysis.matchingSkills} tone="success" empty="No explicit shared skills were identified." />
						<ChipListCard icon={XCircle} title="Missing Skills" items={analysis.missingSkills} tone="danger" empty="No missing JD skills were identified." />
					</div>

					{/* Keywords */}
					<div className="grid gap-5 sm:grid-cols-2">
						<ChipListCard icon={Target} title="Matching Keywords" items={analysis.matchingKeywords} tone="success" empty="No meaningful matched keywords were identified." />
						<ChipListCard icon={Target} title="Missing Keywords" items={analysis.missingKeywords} tone="danger" empty="No missing JD keywords were identified." />
					</div>

					{/* Experience & Education */}
					<div className="grid gap-5 sm:grid-cols-2">
						<InsightCard icon={Briefcase} title="Experience Match" data={analysis.experienceMatch} />
						<InsightCard icon={GraduationCap} title="Education Match" data={analysis.educationMatch} />
					</div>

					{/* Strengths & Gaps */}
					<div className="grid gap-5 sm:grid-cols-2">
						<ChipListCard icon={CheckCircle2} title="Strengths" items={analysis.strengths} tone="success" empty="No strengths were returned." />
						<ChipListCard icon={AlertTriangle} title="Gaps to Address" items={analysis.gaps} tone="danger" empty="No material gaps were identified." />
					</div>

					{/* Recommendations */}
					<ChipListCard icon={Lightbulb} title="Recommendations" items={analysis.recommendations} empty="No additional recommendations were returned." />

					{/* Analyzed inputs */}
					<section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-card)]">
						<div className="flex items-center gap-3 mb-3">
							<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)]/10">
								<FileText className="h-4 w-4 text-[var(--color-primary)]" strokeWidth={1.8} />
							</div>
							<h3 className="text-sm font-bold text-[var(--color-text)]">Analyzed Inputs</h3>
						</div>
						<p className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
							<FileText className="h-4 w-4 shrink-0" />
							{analysis.resumeFileName}
						</p>
						<details className="mt-3">
							<summary className="cursor-pointer text-xs font-medium text-[var(--color-primary)] hover:underline">
								Show job description
							</summary>
							<p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[var(--color-muted)]">
								{analysis.jobDescription}
							</p>
						</details>
					</section>

					{/* History */}
					{history.length > 0 && (
						<MatchAnalysisHistory history={history} />
					)}
				</div>

				{/* RIGHT COLUMN — Score hero */}
				<div className="lg:col-span-5">
					<div className="space-y-5 lg:sticky lg:top-4">
						<MatchScoreHero
							score={analysis.overallMatchScore}
							summary={analysis.summary}
							jobTitle={analysis.jobTitle}
						/>
					</div>
				</div>
			</div>

			{/* Delete confirmation dialog */}
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
									<h4 className="text-base font-bold text-[var(--color-text)]">Delete this resume match analysis?</h4>
									<p className="mt-1.5 text-sm text-[var(--color-muted)] leading-relaxed">
										This permanently removes the saved resume match report. This action cannot be undone.
									</p>
								</div>
							</div>
							<div className="mt-6 flex items-center justify-end gap-3">
								<button type="button" disabled={isDeleting} onClick={() => setDeleteOpen(false)}
									className="rounded-xl border border-[var(--color-border)] px-4 py-2 text-sm font-medium text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface-2)] disabled:opacity-50">
									Cancel
								</button>
								<button type="button" disabled={isDeleting} onClick={handleDelete}
									className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50">
									{isDeleting ? 'Deleting...' : 'Delete Analysis'}
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
   MAIN PAGE — mirrors AtsAnalyzerPage route architecture
   ═══════════════════════════════════════════════════════════════════ */

export function ResumeMatchPage() {
	const { analysisId } = useParams()
	const navigate = useNavigate()

	const viewMode = useResumeMatchStore((s) => s.viewMode)
	const result = useResumeMatchStore((s) => s.currentAnalysis)
	const error = useResumeMatchStore((s) => s.error)
	const history = useResumeMatchStore((s) => s.analysisHistory)

	/* Initialize history on mount */
	useEffect(() => {
		resumeMatchStore.init()
	}, [])

	/* Synchronize with dynamic URL analysisId */
	useEffect(() => {
		if (analysisId) {
			resumeMatchStore.loadAnalysis(analysisId)
		} else {
			resumeMatchStore.resetToEmpty()
		}
	}, [analysisId])

	const isDetailRoute = Boolean(analysisId)
	const isMatchingResultLoaded = isDetailRoute && Boolean(result && result.id === analysisId)
	const isDetailLoading = isDetailRoute && (!result || result.id !== analysisId || viewMode === 'analyzing') && !error

	const file = useResumeMatchStore((s) => s.uploadedFile)
	const jobDescription = useResumeMatchStore((s) => s.jobDescription)
	const isAnalyzing = useResumeMatchStore((s) => s.isAnalyzing)
	const jdLength = jobDescription ? jobDescription.trim().length : 0
	const canAnalyze = Boolean(file) && jdLength >= 20 && !isAnalyzing

	const mobileCta = !file || isDetailRoute
		? null
		: viewMode !== 'analyzing' && canAnalyze
			? { label: 'Analyze Match', icon: GitCompareArrows }
			: null

	const handleMobileAnalyze = async () => {
		const analysis = await resumeMatchStore.startAnalysis()
		if (analysis?.id) {
			navigate(`${APP_ROUTES.RESUME_MATCH}/${analysis.id}`)
		}
	}

	return (
		<div className="space-y-5">
			{/* Page header */}
			<ResumeMatchHeader
				isDetail={isDetailRoute}
				onBack={() => navigate(APP_ROUTES.RESUME_MATCH)}
			/>

			{/* Main content area */}
			<AnimatePresence mode="wait">
				{/* ─── LOADING STATE ─── */}
				{(viewMode === 'analyzing' || isDetailLoading) && !error && (
					<motion.div
						key="loading"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
					>
						<MatchLoadingState />
					</motion.div>
				)}

				{/* ─── ERROR STATE ─── */}
				{error && (
					<motion.div
						key="error"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
					>
						<MatchErrorState
							message={error}
							onReturn={() => navigate(APP_ROUTES.RESUME_MATCH)}
						/>
					</motion.div>
				)}

				{/* ─── BASE ROUTE: UPLOAD ONBOARDING ─── */}
				{!isDetailRoute && viewMode === 'empty' && (
					<motion.div
						key="onboarding"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.25 }}
						className="space-y-8"
					>
						<ResumeMatchUploadHero />

						{history.length > 0 && (
							<MatchAnalysisHistory history={history} />
						)}
					</motion.div>
				)}

				{/* ─── DETAIL ROUTE: FULL REPORT ─── */}
				{isMatchingResultLoaded && (
					<MatchDetailView analysis={result} analysisId={analysisId} />
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

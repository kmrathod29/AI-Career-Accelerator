import { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, X, RefreshCw, ScanSearch, Briefcase } from 'lucide-react'
import { toast } from 'sonner'
import { atsStore, useAtsFile, useAtsJobDescription } from '@/stores/atsStore.js'
import { fileValidationSchema, ACCEPTED_EXTENSIONS } from '@constants/atsAnalyzer.js'

function formatFileSize(bytes) {
	if (bytes < 1024) return `${bytes} B`
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
	return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

/**
 * Shared drag-and-drop + file input logic.
 * Both Hero and Compact variants use this hook.
 */
function useFileUpload() {
	const inputRef = useRef(null)
	const [isDragging, setIsDragging] = useState(false)

	const validateAndUpload = useCallback((rawFile) => {
		const result = fileValidationSchema.safeParse({ file: rawFile })
		if (!result.success) {
			toast.error(result.error.errors[0]?.message ?? 'Invalid file')
			return
		}
		atsStore.uploadFile(rawFile)
		toast.success(`${rawFile.name} uploaded successfully`)
	}, [])

	const handleDrop = useCallback((e) => {
		e.preventDefault()
		setIsDragging(false)
		const droppedFile = e.dataTransfer.files?.[0]
		if (droppedFile) validateAndUpload(droppedFile)
	}, [validateAndUpload])

	const handleDragOver = useCallback((e) => {
		e.preventDefault()
		setIsDragging(true)
	}, [])

	const handleDragLeave = useCallback((e) => {
		e.preventDefault()
		setIsDragging(false)
	}, [])

	const handleFileChange = useCallback((e) => {
		const selected = e.target.files?.[0]
		if (selected) validateAndUpload(selected)
		if (inputRef.current) inputRef.current.value = ''
	}, [validateAndUpload])

	return { inputRef, isDragging, handleDrop, handleDragOver, handleDragLeave, handleFileChange }
}

/* ─── Hidden file input (shared across all variants) ────────────── */

function HiddenFileInput({ inputRef, onChange }) {
	return (
		<input
			ref={inputRef}
			id="ats-file-input"
			type="file"
			accept=".pdf,.docx"
			onChange={onChange}
			className="hidden"
			aria-label="Upload resume file"
		/>
	)
}

/* ─── Job Description Input ─────────────────────────────────────── */

function JobDescriptionInput({ compact = false }) {
	const jobDescription = useAtsJobDescription()

	return (
		<div className={compact ? 'mt-3' : 'mt-5'}>
			<div className="mb-1 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Briefcase className="h-4 w-4 text-[var(--color-primary)]" strokeWidth={1.5} />
					<label
						htmlFor="job-description"
						className="text-sm font-semibold text-[var(--color-text)]"
					>
						Target Job Description <span className="text-xs font-normal text-[var(--color-muted)]">(Optional)</span>
					</label>
				</div>
			</div>
			<p className="mb-2 text-xs text-[var(--color-muted)]">
				Add a job description to get role-specific keyword matching, skill gaps, and job compatibility analysis. Leave empty for resume-only ATS readability & quality analysis.
			</p>
			<textarea
				id="job-description"
				value={jobDescription}
				onChange={(e) => atsStore.setJobDescription(e.target.value)}
				placeholder="Paste the target job description here (e.g., Senior Frontend Engineer requirements)... Or leave empty to analyze your resume as a standalone document."
				rows={compact ? 3 : 5}
				maxLength={10000}
				className="w-full resize-none rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-3 text-sm text-[var(--color-text)] placeholder-[var(--color-muted)] transition-colors duration-200 focus:border-[var(--color-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--color-primary)]/20"
			/>
			<div className="mt-1 flex items-center justify-between text-[11px] text-[var(--color-muted)]">
				<span>
					{jobDescription.trim().length > 0 && jobDescription.trim().length < 20 ? (
						<span className="text-amber-500">Min 20 characters for JD matching, or clear it for resume-only mode</span>
					) : jobDescription.trim().length >= 20 ? (
						<span className="text-emerald-500">Role-specific job match mode active</span>
					) : (
						<span>Resume-only mode (analyzes resume quality & detected skills)</span>
					)}
				</span>
				<span>{jobDescription.length.toLocaleString()} / 10,000</span>
			</div>
		</div>
	)
}

/* ═══════════════════════════════════════════════════════════════════
   HERO VARIANT — Large centered onboarding upload card
   Used in the empty state before any file is uploaded.
   ═══════════════════════════════════════════════════════════════════ */

export function UploadCardHero() {
	const { inputRef, isDragging, handleDrop, handleDragOver, handleDragLeave, handleFileChange } = useFileUpload()

	return (
		<motion.div
			initial={{ opacity: 0, y: 16 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.45, ease: 'easeOut' }}
			className="mx-auto max-w-xl"
		>
			<HiddenFileInput inputRef={inputRef} onChange={handleFileChange} />

			<div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-[var(--shadow-card)]">
				{/* Icon */}
				<motion.div
					initial={{ scale: 0.85, opacity: 0 }}
					animate={{ scale: 1, opacity: 1 }}
					transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
					className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary)]/10"
				>
					<Upload className="h-6 w-6 text-[var(--color-primary)]" strokeWidth={1.5} />
				</motion.div>

				{/* Headline + description */}
				<h3 className="mb-2 text-center text-xl font-bold tracking-[-0.04em] text-[var(--color-text)]">
					Analyze Your Resume
				</h3>
				<p className="mx-auto mb-6 max-w-sm text-center text-sm leading-relaxed text-[var(--color-muted)]">
					Upload a PDF or DOCX file and paste a target job description to receive an AI-powered ATS compatibility report.
				</p>

				{/* Drop zone */}
				<motion.div
					onDrop={handleDrop}
					onDragOver={handleDragOver}
					onDragLeave={handleDragLeave}
					onClick={() => inputRef.current?.click()}
					whileHover={{ scale: 1.01 }}
					className={`flex min-h-[110px] cursor-pointer flex-col items-center justify-center rounded-[20px] border-2 border-dashed p-6 transition-colors duration-200 ${
						isDragging
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
						{ACCEPTED_EXTENSIONS.join(', ')} · Max 5 MB
					</p>
				</motion.div>


			</div>
		</motion.div>
	)
}

/* ═══════════════════════════════════════════════════════════════════
   COMPACT VARIANT — Small file info card after upload / in results
   Shows file details + Replace / Remove + Analyze/Re-analyze CTA
   ═══════════════════════════════════════════════════════════════════ */

export function UploadCardCompact({ showAnalyzeButton = false, isReAnalyze = false }) {
	const navigate = useNavigate()
	const file = useAtsFile()
	const jobDescription = useAtsJobDescription()
	const { inputRef, handleFileChange } = useFileUpload()

	if (!file) return null

	const jdLength = jobDescription ? jobDescription.trim().length : 0
	const isJdInvalid = jdLength > 0 && jdLength < 20
	const canAnalyze = Boolean(file) && !isJdInvalid

	const handleAnalyze = async () => {
		if (!canAnalyze) return
		const analysis = await atsStore.startAnalysis()
		if (analysis?.id) {
			navigate(`/dashboard/ats-analyzer/${analysis.id}`)
		}
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.35 }}
			className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-card)]"
		>
			<HiddenFileInput inputRef={inputRef} onChange={handleFileChange} />

			<div className="flex items-center gap-4">
				{/* File icon */}
				<div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary)]/10">
					<FileText className="h-5 w-5 text-[var(--color-primary)]" />
				</div>

				{/* File info */}
				<div className="min-w-0 flex-1">
					<p className="truncate text-sm font-semibold text-[var(--color-text)]">
						{file.name}
					</p>
					<p className="mt-0.5 text-xs text-[var(--color-muted)]">
						{file.size > 0 ? formatFileSize(file.size) : 'Uploaded Document'}
					</p>
				</div>

				{/* Replace / Remove */}
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
							atsStore.removeFile()
							toast.info('File removed')
							navigate('/dashboard/ats-analyzer')
						}}
						className="rounded-lg p-2 text-[var(--color-muted)] transition-colors hover:bg-red-500/10 hover:text-red-500"
						title="Remove file"
					>
						<X className="h-4 w-4" />
					</button>
				</div>
			</div>

			{/* Job description input */}
			{showAnalyzeButton && !isReAnalyze && (
				<JobDescriptionInput compact />
			)}

			{/* Analyze / Re-analyze CTA (only shown when explicitly requested) */}
			{showAnalyzeButton && (
				<motion.button
					type="button"
					initial={{ opacity: 0, y: 6 }}
					animate={{ opacity: 1, y: 0 }}
					whileHover={{ scale: canAnalyze ? 1.02 : 1 }}
					whileTap={{ scale: canAnalyze ? 0.97 : 1 }}
					onClick={handleAnalyze}
					disabled={!canAnalyze}
					className={`mt-3 flex w-full items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-white transition-opacity ${
						canAnalyze
							? 'bg-[var(--color-primary)] hover:opacity-90'
							: 'cursor-not-allowed bg-[var(--color-muted)] opacity-50'
					}`}
				>
					{isReAnalyze ? (
						<>
							<RefreshCw className="h-4 w-4" />
							Re-analyze Resume
						</>
					) : (
						<>
							<ScanSearch className="h-4 w-4" />
							{jdLength >= 20 ? 'Analyze Match with Job Description' : 'Analyze Resume (Resume-Only)'}
						</>
					)}
				</motion.button>
			)}

			{showAnalyzeButton && isJdInvalid && !isReAnalyze && (
				<p className="mt-2 text-center text-[11px] text-amber-500">
					Job description must be at least 20 characters, or clear it for resume-only mode.
				</p>
			)}
		</motion.div>
	)
}

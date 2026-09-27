import { useSyncExternalStore, useCallback, useRef } from 'react'
import { atsApi } from '@/services/atsApi.js'
import { accountStore } from '@/stores/accountStore.js'
import { LOADING_STEPS } from '@constants/atsAnalyzer.js'

/* ─────────────────────────────────────────────────────────────────
   ATS Store — useSyncExternalStore pattern
   Supports:
   - Unique analysis ID routing & isolation
   - In-memory per-analysis caching (analysesById)
   - Synchronized currentAnalysis & currentAnalysisId
   - Optional Job Description (resume-only vs job-match)
   - Automatic sync with account statistics
   ───────────────────────────────────────────────────────────────── */

function createDefaultState() {
	return {
		currentAnalysisId: null,  // Active analysis ID (string or null)
		currentAnalysis: null,    // Full analysis object for current active analysis
		analysisResult: null,     // Alias for currentAnalysis for backward compatibility
		analysesById: {},         // Cache: { [id]: analysisObject }
		uploadedFile: null,       // File metadata { name, size, type }
		rawFile: null,            // Actual browser File object for uploading
		jobDescription: '',       // Optional target job description
		isAnalyzing: false,
		loadingStep: 0,
		error: null,
		viewMode: 'empty',        // 'empty' | 'analyzing' | 'results' | 'error'
		analysisHistory: [],      // User's past analyses from backend
		isLoadingHistory: false,
		dismissedSuggestions: new Set(),
	}
}

let state = createDefaultState()
const listeners = new Set()
let loadingSnapshot = null

function emit() {
	listeners.forEach((l) => l())
}

function setState(updater) {
	state = typeof updater === 'function' ? updater(state) : { ...state, ...updater }
	emit()
}

export const atsStore = {
	subscribe(listener) {
		listeners.add(listener)
		return () => listeners.delete(listener)
	},

	getSnapshot() {
		return state
	},

	/**
	 * Initialize store — fetch analysis history from backend.
	 */
	async init() {
		if (state.isLoadingHistory) return
		setState({ isLoadingHistory: true })
		try {
			const result = await atsApi.getAnalyses(1, 20)
			if (result?.data?.analyses) {
				setState({
					analysisHistory: result.data.analyses,
					isLoadingHistory: false,
				})
			} else {
				setState({ isLoadingHistory: false })
			}
		} catch (error) {
			console.error('ATS history fetch error:', error)
			setState({ isLoadingHistory: false })
		}
	},

	/* ── File management ──────────────────────────────────────── */

	uploadFile(file) {
		setState({
			uploadedFile: {
				name: file.name,
				size: file.size,
				type: file.type,
				lastModified: file.lastModified,
			},
			rawFile: file,
			error: null,
			viewMode: 'empty',
			currentAnalysisId: null,
			currentAnalysis: null,
			analysisResult: null,
		})
	},

	removeFile() {
		setState({
			uploadedFile: null,
			rawFile: null,
			currentAnalysisId: null,
			currentAnalysis: null,
			analysisResult: null,
			viewMode: 'empty',
			error: null,
		})
	},

	/* ── Job description (Optional) ────────────────────────────── */

	setJobDescription(text) {
		setState({ jobDescription: text })
	},

	/* ── Real backend analysis ────────────────────────────────── */

	async startAnalysis() {
		if (state.isAnalyzing) return null
		if (!state.rawFile) {
			setState({
				error: 'Please upload a resume file before analyzing.',
				viewMode: 'error',
			})
			return null
		}

		// Job description is optional! If provided, check min length
		const trimmedJd = state.jobDescription ? state.jobDescription.trim() : ''
		if (trimmedJd.length > 0 && trimmedJd.length < 20) {
			setState({
				error: 'Job description is too short. Please provide at least 20 characters or leave it empty for resume-only analysis.',
				viewMode: 'error',
			})
			return null
		}

		setState({
			isAnalyzing: true,
			loadingStep: 0,
			error: null,
			viewMode: 'analyzing',
			currentAnalysisId: null,
			currentAnalysis: null,
			analysisResult: null,
		})

		/* Step through loading messages for UX feedback */
		let step = 0
		const stepInterval = setInterval(() => {
			step += 1
			if (step >= LOADING_STEPS.length) {
				clearInterval(stepInterval)
				return
			}
			setState({ loadingStep: step })
		}, 2500)

		try {
			const result = await atsApi.analyze(state.rawFile, trimmedJd)
			clearInterval(stepInterval)

			if (result?.data?.analysis) {
				const analysis = result.data.analysis

				// Add to history at the front
				const historyEntry = {
					id: analysis.id,
					fileName: analysis.resumeFileName,
					date: analysis.createdAt
						? new Date(analysis.createdAt).toISOString().split('T')[0]
						: new Date().toISOString().split('T')[0],
					score: analysis.overallScore,
					status: analysis.status || 'completed',
					analysisMode: analysis.analysisMode || (trimmedJd ? 'job_match' : 'resume_only'),
					jobTitle: analysis.jobDescription ? analysis.jobDescription.slice(0, 60).replace(/\n/g, ' ') : null,
					createdAt: analysis.createdAt,
				}

				const updatedHistory = [historyEntry, ...state.analysisHistory.filter((a) => a.id !== analysis.id)]
				const updatedCache = { ...state.analysesById, [analysis.id]: analysis }

				setState({
					isAnalyzing: false,
					loadingStep: 0,
					currentAnalysisId: analysis.id,
					currentAnalysis: analysis,
					analysisResult: analysis,
					analysesById: updatedCache,
					viewMode: 'results',
					analysisHistory: updatedHistory,
					uploadedFile: {
						name: analysis.resumeFileName,
						size: state.rawFile?.size || 0,
						type: state.rawFile?.type || (analysis.resumeFileName?.endsWith('.pdf') ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'),
					},
					jobDescription: analysis.jobDescription || '',
				})

				// Synchronize account statistics
				accountStore.refreshStats().catch(() => {})

				return analysis
			} else {
				setState({
					isAnalyzing: false,
					loadingStep: 0,
					error: 'Unexpected response from server.',
					viewMode: 'error',
				})
				return null
			}
		} catch (error) {
			clearInterval(stepInterval)
			const message =
				error.response?.data?.message ||
				error.message ||
				'ATS analysis failed. Please try again.'

			setState({
				isAnalyzing: false,
				loadingStep: 0,
				error: message,
				viewMode: 'error',
			})
			return null
		}
	},

	/* ── Load a specific analysis by ID ───────────────────────── */

	async loadAnalysis(analysisId) {
		if (!analysisId) {
			this.resetToEmpty()
			return null
		}

		// If already displaying this exact analysis without loading, no-op
		if (state.currentAnalysisId === analysisId && state.currentAnalysis && !state.isAnalyzing) {
			return state.currentAnalysis
		}

		// If present in cache, switch immediately while validating
		const cached = state.analysesById[analysisId]
		if (cached) {
			setState({
				currentAnalysisId: analysisId,
				currentAnalysis: cached,
				analysisResult: cached,
				uploadedFile: {
					name: cached.resumeFileName,
					size: 0,
					type: cached.resumeFileName?.endsWith('.pdf') ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
				},
				jobDescription: cached.jobDescription || '',
				viewMode: 'results',
				isAnalyzing: false,
				error: null,
			})
			return cached
		}

		// Otherwise show clean loading state for this specific analysis
		setState({
			currentAnalysisId: analysisId,
			currentAnalysis: null,
			analysisResult: null,
			isAnalyzing: true,
			loadingStep: 0,
			error: null,
			viewMode: 'analyzing',
		})

		try {
			const result = await atsApi.getAnalysisById(analysisId)

			if (result?.data?.analysis) {
				const analysis = result.data.analysis
				const updatedCache = { ...state.analysesById, [analysis.id]: analysis }

				setState({
					isAnalyzing: false,
					currentAnalysisId: analysis.id,
					currentAnalysis: analysis,
					analysisResult: analysis,
					analysesById: updatedCache,
					uploadedFile: {
						name: analysis.resumeFileName,
						size: 0,
						type: analysis.resumeFileName?.endsWith('.pdf') ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
					},
					jobDescription: analysis.jobDescription || '',
					viewMode: 'results',
					error: null,
				})
				return analysis
			} else {
				setState({
					isAnalyzing: false,
					currentAnalysisId: null,
					currentAnalysis: null,
					analysisResult: null,
					error: 'Analysis not found.',
					viewMode: 'error',
				})
				return null
			}
		} catch (error) {
			const message = error.response?.data?.message || 'Failed to load analysis.'
			setState({
				isAnalyzing: false,
				currentAnalysisId: null,
				currentAnalysis: null,
				analysisResult: null,
				error: message,
				viewMode: 'error',
			})
			return null
		}
	},

	/* ── Delete an analysis from history ──────────────────────── */

	async deleteAnalysis(analysisId) {
		try {
			await atsApi.deleteAnalysis(analysisId)

			const wasActive = state.currentAnalysisId === analysisId
			const remainingHistory = state.analysisHistory.filter((a) => a.id !== analysisId)
			const nextCache = { ...state.analysesById }
			delete nextCache[analysisId]

			if (wasActive) {
				// Return to empty state cleanly
				setState({
					analysisHistory: remainingHistory,
					analysesById: nextCache,
					currentAnalysisId: null,
					currentAnalysis: null,
					analysisResult: null,
					uploadedFile: null,
					rawFile: null,
					jobDescription: '',
					viewMode: 'empty',
					error: null,
				})
			} else {
				setState({
					analysisHistory: remainingHistory,
					analysesById: nextCache,
				})
			}

			// Immediately refresh account stats
			accountStore.refreshStats().catch(() => {})

			return { success: true, wasActive }
		} catch (error) {
			return {
				success: false,
				message: error.response?.data?.message || 'Failed to delete analysis.',
			}
		}
	},

	/* ── Suggestion management ────────────────────────────────── */

	dismissSuggestion(id) {
		const next = new Set(state.dismissedSuggestions)
		next.add(id)
		setState({ dismissedSuggestions: next })
	},

	/* ── Error handling ───────────────────────────────────────── */

	setError(message) {
		setState({
			error: message,
			isAnalyzing: false,
			viewMode: 'error',
		})
	},

	/* ── Reset to empty / new upload ──────────────────────────── */

	resetToEmpty() {
		setState({
			currentAnalysisId: null,
			currentAnalysis: null,
			analysisResult: null,
			uploadedFile: null,
			rawFile: null,
			jobDescription: '',
			viewMode: 'empty',
			error: null,
			dismissedSuggestions: new Set(),
		})
	},

	clearAnalysis() {
		this.resetToEmpty()
	},

	reAnalyze() {
		if (state.rawFile) {
			atsStore.startAnalysis()
		}
	},
}

/* ─── Hooks ─────────────────────────────────────────────────────── */

export function useAtsStore(selector) {
	const selectorRef = useRef(selector)
	selectorRef.current = selector

	const getSnapshot = useCallback(
		() => selectorRef.current(atsStore.getSnapshot()),
		[],
	)

	return useSyncExternalStore(atsStore.subscribe, getSnapshot, getSnapshot)
}

export function useAtsFile() {
	return useAtsStore((s) => s.uploadedFile)
}

export function useAtsResult() {
	return useAtsStore((s) => s.currentAnalysis || s.analysisResult)
}

export function useAtsCurrentId() {
	return useAtsStore((s) => s.currentAnalysisId)
}

export function useAtsLoading() {
	return useAtsStore((s) => {
		if (
			loadingSnapshot &&
			loadingSnapshot.isAnalyzing === s.isAnalyzing &&
			loadingSnapshot.loadingStep === s.loadingStep
		) {
			return loadingSnapshot
		}

		loadingSnapshot = {
			isAnalyzing: s.isAnalyzing,
			loadingStep: s.loadingStep,
		}
		return loadingSnapshot
	})
}

export function useAtsHistory() {
	return useAtsStore((s) => s.analysisHistory)
}

export function useAtsViewMode() {
	return useAtsStore((s) => s.viewMode)
}

export function useAtsError() {
	return useAtsStore((s) => s.error)
}

export function useAtsDismissed() {
	return useAtsStore((s) => s.dismissedSuggestions)
}

export function useAtsJobDescription() {
	return useAtsStore((s) => s.jobDescription)
}

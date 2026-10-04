import { useSyncExternalStore } from 'react'
import { resumeMatchApi } from '@/services/resumeMatchApi.js'

/* ─────────────────────────────────────────────────────────────────
   Resume Match Store — useSyncExternalStore pattern
   Mirrors the ATS store architecture for consistency.
   ───────────────────────────────────────────────────────────────── */

const LOADING_STEPS = [
	'Scanning Resume…',
	'Parsing Job Description…',
	'Comparing Skills & Keywords…',
	'Evaluating Experience Match…',
	'Generating Recommendations…',
]

function createDefaultState() {
	return {
		currentAnalysisId: null,
		currentAnalysis: null,
		analysesById: {},
		uploadedFile: null,
		rawFile: null,
		jobDescription: '',
		isAnalyzing: false,
		loadingStep: 0,
		error: null,
		viewMode: 'empty',        // 'empty' | 'analyzing' | 'results' | 'error'
		analysisHistory: [],
		isLoadingHistory: false,
	}
}

let state = createDefaultState()
const listeners = new Set()

function emit() {
	listeners.forEach((l) => l())
}

function setState(updater) {
	state = typeof updater === 'function' ? updater(state) : { ...state, ...updater }
	emit()
}

export const resumeMatchStore = {
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
			const result = await resumeMatchApi.getAnalyses(1, 20)
			if (result?.data?.analyses) {
				setState({
					analysisHistory: result.data.analyses,
					isLoadingHistory: false,
				})
			} else {
				setState({ isLoadingHistory: false })
			}
		} catch (error) {
			console.error('Resume Match history fetch error:', error)
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
			viewMode: state.viewMode === 'results' ? state.viewMode : 'empty',
		})
	},

	removeFile() {
		setState({
			uploadedFile: null,
			rawFile: null,
			error: null,
		})
	},

	/* ── Job description (REQUIRED for Resume Match) ─────────── */

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

		const trimmedJd = state.jobDescription ? state.jobDescription.trim() : ''
		if (!trimmedJd || trimmedJd.length < 20) {
			setState({
				error: 'Please provide a job description (at least 20 characters) to compare your resume against.',
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
			const result = await resumeMatchApi.analyze(state.rawFile, trimmedJd)
			clearInterval(stepInterval)

			if (result?.data?.analysis) {
				const analysis = result.data.analysis

				const historyEntry = {
					id: analysis.id,
					fileName: analysis.resumeFileName,
					date: analysis.createdAt
						? new Date(analysis.createdAt).toISOString().split('T')[0]
						: new Date().toISOString().split('T')[0],
					score: analysis.overallMatchScore,
					status: analysis.status || 'completed',
					jobTitle: analysis.jobTitle || analysis.jobDescription?.slice(0, 60).replace(/\n/g, ' ') || '',
					createdAt: analysis.createdAt,
				}

				const updatedHistory = [historyEntry, ...state.analysisHistory.filter((a) => a.id !== analysis.id)]
				const updatedCache = { ...state.analysesById, [analysis.id]: analysis }

				setState({
					isAnalyzing: false,
					loadingStep: 0,
					currentAnalysisId: analysis.id,
					currentAnalysis: analysis,
					analysesById: updatedCache,
					viewMode: 'results',
					analysisHistory: updatedHistory,
					uploadedFile: {
						name: analysis.resumeFileName,
						size: state.rawFile?.size || 0,
						type: state.rawFile?.type || 'application/pdf',
					},
					jobDescription: analysis.jobDescription || trimmedJd,
				})

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
				'Resume match analysis failed. Please try again.'

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

		if (state.currentAnalysisId === analysisId && state.currentAnalysis && !state.isAnalyzing) {
			return state.currentAnalysis
		}

		const cached = state.analysesById[analysisId]
		if (cached) {
			setState({
				currentAnalysisId: analysisId,
				currentAnalysis: cached,
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

		setState({
			currentAnalysisId: analysisId,
			currentAnalysis: null,
			isAnalyzing: true,
			loadingStep: 0,
			error: null,
			viewMode: 'analyzing',
		})

		try {
			const result = await resumeMatchApi.getAnalysisById(analysisId)

			if (result?.data?.analysis) {
				const analysis = result.data.analysis
				const updatedCache = { ...state.analysesById, [analysis.id]: analysis }

				setState({
					isAnalyzing: false,
					currentAnalysisId: analysis.id,
					currentAnalysis: analysis,
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
				error: message,
				viewMode: 'error',
			})
			return null
		}
	},

	/* ── Delete an analysis ───────────────────────────────────── */

	async deleteAnalysis(analysisId) {
		try {
			await resumeMatchApi.deleteAnalysis(analysisId)

			const wasActive = state.currentAnalysisId === analysisId
			const remainingHistory = state.analysisHistory.filter((a) => a.id !== analysisId)
			const nextCache = { ...state.analysesById }
			delete nextCache[analysisId]

			if (wasActive) {
				setState({
					analysisHistory: remainingHistory,
					analysesById: nextCache,
					currentAnalysisId: null,
					currentAnalysis: null,
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

			return { success: true, wasActive }
		} catch (error) {
			return {
				success: false,
				message: error.response?.data?.message || 'Failed to delete analysis.',
			}
		}
	},

	/* ── Re-analyze with new file ─────────────────────────────── */

	async reAnalyzeWithFile(file, targetAnalysisId) {
		if (state.isAnalyzing) return null
		const analysisId = targetAnalysisId || state.currentAnalysisId

		if (!analysisId) {
			this.uploadFile(file)
			return this.startAnalysis()
		}

		if (!file) {
			setState({
				error: 'Please upload an updated resume file to re-analyze.',
				viewMode: state.currentAnalysis ? 'results' : 'error',
			})
			return null
		}

		setState({
			isAnalyzing: true,
			loadingStep: 0,
			error: null,
			viewMode: 'analyzing',
		})

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
			const result = await resumeMatchApi.reAnalyze(analysisId, file, state.jobDescription)
			clearInterval(stepInterval)

			if (result?.data?.analysis) {
				const analysis = result.data.analysis

				const updatedHistory = state.analysisHistory.map((h) =>
					h.id === analysis.id
						? {
								...h,
								fileName: analysis.resumeFileName,
								score: analysis.overallMatchScore,
								date: new Date().toISOString().split('T')[0],
								jobTitle: analysis.jobTitle || h.jobTitle,
							}
						: h,
				)

				const updatedCache = { ...state.analysesById, [analysis.id]: analysis }

				setState({
					isAnalyzing: false,
					loadingStep: 0,
					currentAnalysisId: analysis.id,
					currentAnalysis: analysis,
					analysesById: updatedCache,
					viewMode: 'results',
					analysisHistory: updatedHistory,
					uploadedFile: {
						name: analysis.resumeFileName,
						size: file.size,
						type: file.type,
					},
					rawFile: file,
					error: null,
				})

				return { analysis }
			} else {
				setState({
					isAnalyzing: false,
					loadingStep: 0,
					error: 'Unexpected response from server during re-analysis.',
					viewMode: state.currentAnalysis ? 'results' : 'error',
				})
				return null
			}
		} catch (error) {
			clearInterval(stepInterval)
			const message =
				error.response?.data?.message ||
				error.message ||
				'Resume match re-analysis failed. Please try again.'

			setState({
				isAnalyzing: false,
				loadingStep: 0,
				error: message,
				viewMode: state.currentAnalysis ? 'results' : 'error',
			})
			return null
		}
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
			uploadedFile: null,
			rawFile: null,
			jobDescription: '',
			viewMode: 'empty',
			error: null,
		})
	},
}

/* ─── Hooks ─────────────────────────────────────────────────────── */

export function useResumeMatchStore(selector) {
	const snapshot = useSyncExternalStore(
		resumeMatchStore.subscribe,
		resumeMatchStore.getSnapshot,
		resumeMatchStore.getSnapshot,
	)
	return selector(snapshot)
}

export function useResumeMatchFile() {
	return useResumeMatchStore((s) => s.uploadedFile)
}

export function useResumeMatchResult() {
	return useResumeMatchStore((s) => s.currentAnalysis)
}

export function useResumeMatchCurrentId() {
	return useResumeMatchStore((s) => s.currentAnalysisId)
}

export function useResumeMatchLoading() {
	return useResumeMatchStore((s) => ({
		isAnalyzing: s.isAnalyzing,
		loadingStep: s.loadingStep,
	}))
}

export function useResumeMatchHistory() {
	return useResumeMatchStore((s) => s.analysisHistory)
}

export function useResumeMatchViewMode() {
	return useResumeMatchStore((s) => s.viewMode)
}

export function useResumeMatchError() {
	return useResumeMatchStore((s) => s.error)
}

export function useResumeMatchJobDescription() {
	return useResumeMatchStore((s) => s.jobDescription)
}

export { LOADING_STEPS as RESUME_MATCH_LOADING_STEPS }

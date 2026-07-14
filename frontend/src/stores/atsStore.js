import { useSyncExternalStore, useCallback, useRef } from 'react'
import {
	ATS_STORAGE_KEY,
	DUMMY_ANALYSIS,
	DUMMY_HISTORY,
	LOADING_STEPS,
} from '@constants/atsAnalyzer.js'

/* ─────────────────────────────────────────────────────────────────
   ATS Store — useSyncExternalStore pattern
   Mirrors resumeStore.js / accountStore.js architecture.
   ───────────────────────────────────────────────────────────────── */

function createDefaultState() {
	return {
		uploadedFile: null,       // { name, size, type, lastModified }
		analysisResult: null,     // full analysis object
		isAnalyzing: false,
		loadingStep: 0,           // index into LOADING_STEPS
		error: null,
		viewMode: 'empty',        // 'empty' | 'analyzing' | 'results' | 'error'
		analysisHistory: [],
		dismissedSuggestions: new Set(),
	}
}

function loadPersistedState() {
	try {
		const raw = localStorage.getItem(ATS_STORAGE_KEY)
		if (!raw) return createDefaultState()
		const saved = JSON.parse(raw)
		return {
			...createDefaultState(),
			analysisHistory: saved.analysisHistory ?? [],
		}
	} catch {
		return createDefaultState()
	}
}

function persistHistory(history) {
	try {
		localStorage.setItem(
			ATS_STORAGE_KEY,
			JSON.stringify({ analysisHistory: history }),
		)
	} catch { /* noop */ }
}

let state = loadPersistedState()
const listeners = new Set()

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

	init() {
		/* Merge persisted history with dummy data if empty */
		if (state.analysisHistory.length === 0) {
			setState({ analysisHistory: [...DUMMY_HISTORY] })
			persistHistory(DUMMY_HISTORY)
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
			error: null,
			viewMode: 'empty',
			analysisResult: null,
		})
	},

	removeFile() {
		setState({
			uploadedFile: null,
			analysisResult: null,
			viewMode: 'empty',
			error: null,
		})
	},

	/* ── Analysis simulation ──────────────────────────────────── */

	startAnalysis() {
		if (!state.uploadedFile) return

		setState({
			isAnalyzing: true,
			loadingStep: 0,
			error: null,
			viewMode: 'analyzing',
			analysisResult: null,
		})

		/* Step through loading messages */
		let step = 0
		const stepInterval = setInterval(() => {
			step += 1
			if (step >= LOADING_STEPS.length) {
				clearInterval(stepInterval)
				/* Complete analysis after final step */
				setTimeout(() => {
					const historyEntry = {
						id: `h-${Date.now()}`,
						fileName: state.uploadedFile?.name ?? 'Resume',
						date: new Date().toISOString().split('T')[0],
						score: DUMMY_ANALYSIS.overallScore,
						status: 'completed',
					}
					const newHistory = [historyEntry, ...state.analysisHistory].slice(0, 10)
					setState({
						isAnalyzing: false,
						loadingStep: 0,
						analysisResult: { ...DUMMY_ANALYSIS },
						viewMode: 'results',
						analysisHistory: newHistory,
					})
					persistHistory(newHistory)
				}, 600)
				return
			}
			setState({ loadingStep: step })
		}, 900)
	},

	/* ── Suggestion management ────────────────────────────────── */

	dismissSuggestion(id) {
		const next = new Set(state.dismissedSuggestions)
		next.add(id)
		setState({ dismissedSuggestions: next })
	},

	/* ── Error simulation ─────────────────────────────────────── */

	setError(message) {
		setState({
			error: message,
			isAnalyzing: false,
			viewMode: 'error',
		})
	},

	/* ── Reset ────────────────────────────────────────────────── */

	clearAnalysis() {
		setState({
			analysisResult: null,
			viewMode: state.uploadedFile ? 'empty' : 'empty',
			error: null,
			dismissedSuggestions: new Set(),
		})
	},

	reAnalyze() {
		if (state.uploadedFile) {
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
	return useAtsStore((s) => s.analysisResult)
}

export function useAtsLoading() {
	return useAtsStore((s) => ({
		isAnalyzing: s.isAnalyzing,
		loadingStep: s.loadingStep,
	}))
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

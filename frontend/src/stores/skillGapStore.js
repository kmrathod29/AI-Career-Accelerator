import { useSyncExternalStore } from 'react'
import { skillGapApi } from '@/services/skillGapApi.js'
import { accountStore } from '@/stores/accountStore.js'
import { notificationStore } from '@/stores/notificationStore.js'

/* ─────────────────────────────────────────────────────────────────
   Skill Gap Store — useSyncExternalStore pattern
   Mirrors the resumeMatchStore architecture for consistency.
   ───────────────────────────────────────────────────────────────── */

export const SKILL_GAP_LOADING_STEPS = [
  'Reading your skills…',
  'Identifying target role requirements…',
  'Comparing skill sets…',
  'Finding learning priorities…',
  'Generating recommendations…',
]

function createDefaultState() {
  return {
    currentAnalysisId: null,
    currentAnalysis: null,
    analysesById: {},
    // Form state
    targetRole: '',
    currentSkills: '',
    uploadedFile: null,
    rawFile: null,
    // UI state
    isAnalyzing: false,
    loadingStep: 0,
    error: null,
    viewMode: 'empty', // 'empty' | 'analyzing' | 'results' | 'error'
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

export const skillGapStore = {
  subscribe(listener) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },

  getSnapshot() {
    return state
  },

  /**
   * Initialize store — fetch skill gap analysis history from backend.
   */
  async init() {
    if (state.isLoadingHistory) return
    setState({ isLoadingHistory: true })
    try {
      const result = await skillGapApi.getAnalyses(1, 20)
      if (result?.data?.analyses) {
        setState({
          analysisHistory: result.data.analyses,
          isLoadingHistory: false,
        })
      } else {
        setState({ isLoadingHistory: false })
      }
    } catch (error) {
      console.error('Skill Gap history fetch error:', error)
      setState({ isLoadingHistory: false })
    }
  },

  /* ── Form field setters ─────────────────────────────────────── */

  setTargetRole(value) {
    setState({ targetRole: value })
  },

  setCurrentSkills(value) {
    setState({ currentSkills: value })
  },

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
    })
  },

  removeFile() {
    setState({
      uploadedFile: null,
      rawFile: null,
      error: null,
    })
  },

  /* ── Real backend analysis ──────────────────────────────────── */

  async startAnalysis() {
    if (state.isAnalyzing) return null

    const targetRole = state.targetRole.trim()
    const currentSkills = state.currentSkills.trim()

    if (!targetRole || targetRole.length < 2) {
      setState({
        error: 'Please enter your target role before analyzing.',
        viewMode: 'error',
      })
      return null
    }

    if (!currentSkills && !state.rawFile) {
      setState({
        error: 'Please provide your current skills or upload a resume.',
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
      if (step >= SKILL_GAP_LOADING_STEPS.length) {
        clearInterval(stepInterval)
        return
      }
      setState({ loadingStep: step })
    }, 2500)

    try {
      const result = await skillGapApi.analyze({
        targetRole,
        currentSkills,
        resumeFile: state.rawFile || null,
      })
      clearInterval(stepInterval)

      if (result?.data?.analysis) {
        const analysis = result.data.analysis

        const historyEntry = {
          id: analysis.id,
          targetRole: analysis.targetRole,
          readinessScore: analysis.readinessScore,
          summary: analysis.summary ? analysis.summary.slice(0, 200) : '',
          status: analysis.status || 'completed',
          resumeFileName: analysis.resumeFileName || '',
          createdAt: analysis.createdAt,
          date: analysis.createdAt
            ? new Date(analysis.createdAt).toISOString().split('T')[0]
            : new Date().toISOString().split('T')[0],
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
        })

        // Synchronize account statistics and notifications
        accountStore.refreshStats().catch(() => {})
        notificationStore.init().catch(() => {})

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
        'Skill gap analysis failed. Please try again.'

      setState({
        isAnalyzing: false,
        loadingStep: 0,
        error: message,
        viewMode: 'error',
      })
      return null
    }
  },

  /* ── Load a specific analysis by ID ─────────────────────────── */

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
      const result = await skillGapApi.getAnalysisById(analysisId)

      if (result?.data?.analysis) {
        const analysis = result.data.analysis
        const updatedCache = { ...state.analysesById, [analysis.id]: analysis }

        setState({
          isAnalyzing: false,
          currentAnalysisId: analysis.id,
          currentAnalysis: analysis,
          analysesById: updatedCache,
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

  /* ── Delete an analysis ─────────────────────────────────────── */

  async deleteAnalysis(analysisId) {
    try {
      await skillGapApi.deleteAnalysis(analysisId)

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
          viewMode: 'empty',
          error: null,
        })
      } else {
        setState({
          analysisHistory: remainingHistory,
          analysesById: nextCache,
        })
      }

      // Synchronize account statistics
      accountStore.refreshStats().catch(() => {})

      return { success: true, wasActive }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to delete analysis.',
      }
    }
  },

  /* ── Error handling ─────────────────────────────────────────── */

  setError(message) {
    setState({
      error: message,
      isAnalyzing: false,
      viewMode: 'error',
    })
  },

  clearError() {
    setState({ error: null })
  },

  /* ── Reset to empty / new analysis ─────────────────────────── */

  resetToEmpty() {
    setState({
      currentAnalysisId: null,
      currentAnalysis: null,
      viewMode: 'empty',
      error: null,
    })
  },

  /* ── Reset form fields (but keep history) ────────────────────── */

  resetForm() {
    setState({
      targetRole: '',
      currentSkills: '',
      uploadedFile: null,
      rawFile: null,
      error: null,
    })
  },
}

/* ─── Hooks ─────────────────────────────────────────────────────── */

export function useSkillGapStore(selector) {
  const snapshot = useSyncExternalStore(
    skillGapStore.subscribe,
    skillGapStore.getSnapshot,
    skillGapStore.getSnapshot,
  )
  return selector(snapshot)
}

export function useSkillGapResult() {
  return useSkillGapStore((s) => s.currentAnalysis)
}

export function useSkillGapCurrentId() {
  return useSkillGapStore((s) => s.currentAnalysisId)
}

export function useSkillGapLoading() {
  return useSkillGapStore((s) => ({
    isAnalyzing: s.isAnalyzing,
    loadingStep: s.loadingStep,
  }))
}

export function useSkillGapHistory() {
  return useSkillGapStore((s) => s.analysisHistory)
}

export function useSkillGapViewMode() {
  return useSkillGapStore((s) => s.viewMode)
}

export function useSkillGapError() {
  return useSkillGapStore((s) => s.error)
}

export function useSkillGapForm() {
  return useSkillGapStore((s) => ({
    targetRole: s.targetRole,
    currentSkills: s.currentSkills,
    uploadedFile: s.uploadedFile,
  }))
}

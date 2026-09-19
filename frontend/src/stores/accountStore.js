import { useSyncExternalStore, useCallback } from 'react'
import { accountService } from '@/services/accountService.js'
import {
  ACCOUNT_STORAGE_KEY,
  DEFAULT_NOTIFICATION_PREFS,
  DEFAULT_PRIVACY_PREFS,
  DEFAULT_APPEARANCE_PREFS,
} from '@constants/account.js'

/* ── Empty profile shape (used before API data loads) ──── */

const EMPTY_PROFILE = {
  id: '',
  firstName: '',
  lastName: '',
  email: '',
  profile: {
    phone: '',
    gender: '',
    dateOfBirth: '',
    country: '',
    city: '',
    state: '',
    bio: '',
    avatar: '',
  },
  career: {
    currentRole: '',
    experienceLevel: '',
    education: '',
    university: '',
    degree: '',
    branch: '',
    passingYear: '',
    skills: [],
    preferredRole: '',
    preferredLocation: '',
    expectedSalary: '',
    employmentType: '',
  },
  socialLinks: {
    linkedin: '',
    github: '',
    portfolio: '',
    leetcode: '',
    codeforces: '',
    hackerrank: '',
    website: '',
  },
  createdAt: null,
  updatedAt: null,
}

/* ── localStorage helpers for client-only preferences ──── */

function loadPrefs() {
  try {
    const raw = localStorage.getItem(ACCOUNT_STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

function persistPrefs(notificationPrefs, privacyPrefs, appearancePrefs) {
  try {
    localStorage.setItem(
      ACCOUNT_STORAGE_KEY,
      JSON.stringify({ notificationPrefs, privacyPrefs, appearancePrefs }),
    )
  } catch {
    /* localStorage unavailable */
  }
}

/* ── Store state ───────────────────────────────────────── */

function createInitialState() {
  const saved = loadPrefs()
  return {
    profile: { ...EMPTY_PROFILE },
    stats: { resumesCreated: 0, atsAnalyses: 0, careerRoadmaps: 0 },
    notificationPrefs: { ...DEFAULT_NOTIFICATION_PREFS, ...saved?.notificationPrefs },
    privacyPrefs: { ...DEFAULT_PRIVACY_PREFS, ...saved?.privacyPrefs },
    appearancePrefs: { ...DEFAULT_APPEARANCE_PREFS, ...saved?.appearancePrefs },
    isLoading: true,
    isSaving: false,
    error: null,
    hasUnsavedChanges: false,
  }
}

let state = createInitialState()
const listeners = new Set()

function emit() {
  listeners.forEach((fn) => fn())
}

function setState(updater) {
  state = typeof updater === 'function' ? updater(state) : { ...state, ...updater }
  emit()
}

/**
 * Merge API user data into the store profile shape.
 */
function mergeUserData(user) {
  return {
    id: user.id ?? '',
    firstName: user.firstName ?? '',
    lastName: user.lastName ?? '',
    email: user.email ?? '',
    profile: { ...EMPTY_PROFILE.profile, ...user.profile },
    career: { ...EMPTY_PROFILE.career, ...user.career },
    socialLinks: { ...EMPTY_PROFILE.socialLinks, ...user.socialLinks },
    createdAt: user.createdAt ?? null,
    updatedAt: user.updatedAt ?? null,
  }
}

/* ── Public store API ──────────────────────────────────── */

export const accountStore = {
  subscribe(listener) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },

  getSnapshot() {
    return state
  },

  /**
   * Fetch profile from backend API.
   */
  async init() {
    setState({ isLoading: true, error: null })
    try {
      const result = await accountService.getProfile()
      if (result?.data?.user) {
        setState({
          profile: mergeUserData(result.data.user),
          isLoading: false,
          error: null,
        })
      } else {
        setState({ isLoading: false })
      }
    } catch (error) {
      console.error('Account init error:', error)
      setState({
        isLoading: false,
        error: error.response?.data?.message || 'Failed to load profile',
      })
    }
  },

  /**
   * Set profile from an already-fetched user object (e.g. from AuthProvider).
   */
  setFromUser(user) {
    if (!user) return
    setState({
      profile: mergeUserData(user),
      isLoading: false,
      error: null,
    })
  },

  /**
   * Update local form state (before saving).
   */
  updateProfile(updates) {
    setState((prev) => ({
      ...prev,
      profile: { ...prev.profile, ...updates },
      hasUnsavedChanges: true,
    }))
  },

  /**
   * Update nested profile fields locally.
   */
  updateProfileNested(updates) {
    setState((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        profile: { ...prev.profile.profile, ...updates },
      },
      hasUnsavedChanges: true,
    }))
  },

  /**
   * Update career fields locally.
   */
  updateCareerLocal(updates) {
    setState((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        career: { ...prev.profile.career, ...updates },
      },
      hasUnsavedChanges: true,
    }))
  },

  /**
   * Update social fields locally.
   */
  updateSocialLocal(updates) {
    setState((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        socialLinks: { ...prev.profile.socialLinks, ...updates },
      },
      hasUnsavedChanges: true,
    }))
  },

  /**
   * Save personal info to backend.
   */
  async saveProfile(formData) {
    setState({ isSaving: true, error: null })
    try {
      const result = await accountService.updateProfile(formData)
      if (result?.data?.user) {
        setState({
          profile: mergeUserData(result.data.user),
          isSaving: false,
          hasUnsavedChanges: false,
          error: null,
        })
      }
      return { success: true }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to save profile'
      setState({ isSaving: false, error: msg })
      return { success: false, message: msg }
    }
  },

  /**
   * Save career info to backend.
   */
  async saveCareer(careerData) {
    setState({ isSaving: true, error: null })
    try {
      const result = await accountService.updateCareer(careerData)
      if (result?.data?.user) {
        setState({
          profile: mergeUserData(result.data.user),
          isSaving: false,
          hasUnsavedChanges: false,
          error: null,
        })
      }
      return { success: true }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to save career information'
      setState({ isSaving: false, error: msg })
      return { success: false, message: msg }
    }
  },

  /**
   * Save social links to backend.
   */
  async saveSocial(socialData) {
    setState({ isSaving: true, error: null })
    try {
      const result = await accountService.updateSocial(socialData)
      if (result?.data?.user) {
        setState({
          profile: mergeUserData(result.data.user),
          isSaving: false,
          hasUnsavedChanges: false,
          error: null,
        })
      }
      return { success: true }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to save social links'
      setState({ isSaving: false, error: msg })
      return { success: false, message: msg }
    }
  },

  /**
   * Upload avatar to backend.
   */
  async saveAvatar(dataUrl) {
    setState((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        profile: { ...prev.profile.profile, avatar: dataUrl },
      },
      isSaving: true,
    }))
    try {
      const result = await accountService.updateAvatar(dataUrl)
      if (result?.data?.user) {
        setState({
          profile: mergeUserData(result.data.user),
          isSaving: false,
          error: null,
        })
      }
      return { success: true }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to update avatar'
      setState({ isSaving: false, error: msg })
      return { success: false, message: msg }
    }
  },

  /**
   * Change password via backend.
   */
  async changePassword({ currentPassword, newPassword }) {
    setState({ isSaving: true, error: null })
    try {
      await accountService.changePassword({ currentPassword, newPassword })
      setState({ isSaving: false, error: null })
      return { success: true }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to change password'
      setState({ isSaving: false, error: msg })
      return { success: false, message: msg }
    }
  },

  /**
   * Export user data from backend.
   */
  async exportData() {
    try {
      const result = await accountService.exportData()
      return { success: true, data: result?.data }
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Failed to export data' }
    }
  },

  /**
   * Delete account via backend.
   */
  async deleteAccount() {
    setState({ isSaving: true, error: null })
    try {
      await accountService.deleteAccount()
      setState({ isSaving: false })
      return { success: true }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to delete account'
      setState({ isSaving: false, error: msg })
      return { success: false, message: msg }
    }
  },

  /**
   * Discard unsaved local changes by re-fetching from backend.
   */
  async discardChanges() {
    setState({ hasUnsavedChanges: false })
    await accountStore.init()
  },

  /* ── Client-only preference updates (localStorage) ───── */

  updateNotificationPrefs(updates) {
    setState((prev) => {
      const next = { ...prev.notificationPrefs, ...updates }
      persistPrefs(next, prev.privacyPrefs, prev.appearancePrefs)
      return { ...prev, notificationPrefs: next }
    })
  },

  updatePrivacyPrefs(updates) {
    setState((prev) => {
      const next = { ...prev.privacyPrefs, ...updates }
      persistPrefs(prev.notificationPrefs, next, prev.appearancePrefs)
      return { ...prev, privacyPrefs: next }
    })
  },

  updateAppearancePrefs(updates) {
    setState((prev) => {
      const next = { ...prev.appearancePrefs, ...updates }
      persistPrefs(prev.notificationPrefs, prev.privacyPrefs, next)
      return { ...prev, appearancePrefs: next }
    })
  },

  /**
   * Reset store to initial state.
   */
  reset() {
    state = { ...createInitialState(), isLoading: false }
    emit()
  },
}

/* ── React hooks ───────────────────────────────────────── */

export function useAccountStore(selector) {
  const getSnapshot = useCallback(() => selector(accountStore.getSnapshot()), [selector])
  return useSyncExternalStore(accountStore.subscribe, getSnapshot, getSnapshot)
}

export function useProfile() {
  return useAccountStore((s) => s.profile)
}

export function useAccountStats() {
  return useAccountStore((s) => s.stats)
}

export function useAccountLoading() {
  return useAccountStore((s) => s.isLoading)
}

export function useAccountSaving() {
  return useAccountStore((s) => s.isSaving)
}

export function useHasUnsavedChanges() {
  return useAccountStore((s) => s.hasUnsavedChanges)
}

export function useAccountError() {
  return useAccountStore((s) => s.error)
}

export function useNotificationPrefs() {
  return useAccountStore((s) => s.notificationPrefs)
}

export function usePrivacyPrefs() {
  return useAccountStore((s) => s.privacyPrefs)
}

export function useAppearancePrefs() {
  return useAccountStore((s) => s.appearancePrefs)
}

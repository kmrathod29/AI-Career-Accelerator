import { useSyncExternalStore, useCallback, useRef } from 'react'
import { resumeApi } from '@/services/resumeApi.js'
import {
	createDefaultResumeState,
	createDefaultExperience,
	createDefaultEducation,
	createDefaultProject,
	createDefaultCertification,
	createDefaultAchievement,
	createDefaultLanguage,
	createDefaultCustomSection,
	calculateResumeCompletion,
} from '@constants/resumeBuilder.js'

/* ─────────────────────────────────────────────────────────────────
   Resume Store — useSyncExternalStore pattern
   Backend-persistent via resumeApi. Autosave with debounce.
   ───────────────────────────────────────────────────────────────── */

let state = { ...createDefaultResumeState(), isLoading: true, autosaveStatus: 'saved' }
const listeners = new Set()
let autosaveTimer = null
let saveInFlight = false
let pendingAfterSave = false

function emit() {
	listeners.forEach((l) => l())
}

function setState(partial) {
	state = { ...state, ...partial }
	emit()
}

/* ── Serialize resume data for API (strip UI-only fields) ──── */
function getResumePayload() {
	return {
		personalInfo: state.personalInfo,
		summary: state.summary,
		experiences: state.experiences,
		education: state.education,
		skills: state.skills,
		projects: state.projects,
		certifications: state.certifications,
		achievements: state.achievements,
		languages: state.languages,
		socialLinks: state.socialLinks,
		customSections: state.customSections,
		sectionOrder: state.sectionOrder,
		activeTemplate: state.activeTemplate,
	}
}

/* ── Debounced autosave ──────────────────────────────────────── */
function scheduleAutosave() {
	if (autosaveTimer) clearTimeout(autosaveTimer)
	setState({ autosaveStatus: 'pending' })

	autosaveTimer = setTimeout(async () => {
		if (saveInFlight) {
			pendingAfterSave = true
			return
		}

		setState({ autosaveStatus: 'saving' })
		saveInFlight = true

		try {
			const result = await resumeApi.saveResume(getResumePayload())
			if (result?.data?.resume) {
				// Update completionPercentage from server
				setState({
					autosaveStatus: pendingAfterSave ? 'pending' : 'saved',
					completionPercentage: result.data.resume.completionPercentage,
				})
			} else {
				setState({ autosaveStatus: 'saved' })
			}
		} catch (error) {
			console.error('Autosave failed:', error)
			setState({ autosaveStatus: 'error' })
		} finally {
			saveInFlight = false
			if (pendingAfterSave) {
				pendingAfterSave = false
				scheduleAutosave()
			}
		}
	}, 800)
}

/* ── Hydrate state from backend resume doc ────────────────── */
function hydrateFromBackend(resume) {
	const defaults = createDefaultResumeState()
	setState({
		personalInfo: { ...defaults.personalInfo, ...resume.personalInfo },
		summary: resume.summary ?? '',
		experiences: resume.experiences ?? [],
		education: resume.education ?? [],
		skills: resume.skills ?? [],
		projects: resume.projects ?? [],
		certifications: resume.certifications ?? [],
		achievements: resume.achievements ?? [],
		languages: resume.languages ?? [],
		socialLinks: { ...defaults.socialLinks, ...resume.socialLinks },
		customSections: resume.customSections ?? [],
		sectionOrder: resume.sectionOrder?.length ? resume.sectionOrder : defaults.sectionOrder,
		activeTemplate: resume.activeTemplate ?? 'modern',
		completionPercentage: resume.completionPercentage ?? 0,
		isLoading: false,
		autosaveStatus: 'saved',
	})
}

export const resumeStore = {
	subscribe(listener) {
		listeners.add(listener)
		return () => listeners.delete(listener)
	},

	getSnapshot() {
		return state
	},

	/**
	 * Fetch resume from backend API.
	 */
	async init() {
		setState({ isLoading: true })
		try {
			const result = await resumeApi.getResume()
			if (result?.data?.resume) {
				hydrateFromBackend(result.data.resume)
			} else {
				// No resume exists yet — show clean empty state
				const defaults = createDefaultResumeState()
				setState({
					...defaults,
					isLoading: false,
					autosaveStatus: 'saved',
					completionPercentage: 0,
				})
			}
		} catch (error) {
			// 401 means not authenticated
			if (error.response?.status === 401) {
				setState({ isLoading: false })
			} else {
				console.error('Resume init error:', error)
				setState({
					isLoading: false,
					autosaveStatus: 'error',
				})
			}
		}
	},

	/* ── Personal Info ─────────────────────────────────────────── */
	updatePersonalInfo(updates) {
		state = {
			...state,
			personalInfo: { ...state.personalInfo, ...updates },
		}
		emit()
		scheduleAutosave()
	},

	/* ── Summary ───────────────────────────────────────────────── */
	updateSummary(text) {
		state = { ...state, summary: text }
		emit()
		scheduleAutosave()
	},

	/* ── Experiences ───────────────────────────────────────────── */
	addExperience() {
		state = {
			...state,
			experiences: [...state.experiences, createDefaultExperience()],
		}
		emit()
		scheduleAutosave()
	},

	updateExperience(id, updates) {
		state = {
			...state,
			experiences: state.experiences.map((e) =>
				e.id === id ? { ...e, ...updates } : e,
			),
		}
		emit()
		scheduleAutosave()
	},

	removeExperience(id) {
		state = {
			...state,
			experiences: state.experiences.filter((e) => e.id !== id),
		}
		emit()
		scheduleAutosave()
	},

	duplicateExperience(id) {
		const original = state.experiences.find((e) => e.id === id)
		if (!original) return
		const copy = { ...original, id: crypto.randomUUID() }
		const idx = state.experiences.findIndex((e) => e.id === id)
		const next = [...state.experiences]
		next.splice(idx + 1, 0, copy)
		state = { ...state, experiences: next }
		emit()
		scheduleAutosave()
	},

	/* ── Education ─────────────────────────────────────────────── */
	addEducation() {
		state = {
			...state,
			education: [...state.education, createDefaultEducation()],
		}
		emit()
		scheduleAutosave()
	},

	updateEducation(id, updates) {
		state = {
			...state,
			education: state.education.map((e) =>
				e.id === id ? { ...e, ...updates } : e,
			),
		}
		emit()
		scheduleAutosave()
	},

	removeEducation(id) {
		state = {
			...state,
			education: state.education.filter((e) => e.id !== id),
		}
		emit()
		scheduleAutosave()
	},

	duplicateEducation(id) {
		const original = state.education.find((e) => e.id === id)
		if (!original) return
		const copy = { ...original, id: crypto.randomUUID() }
		const idx = state.education.findIndex((e) => e.id === id)
		const next = [...state.education]
		next.splice(idx + 1, 0, copy)
		state = { ...state, education: next }
		emit()
		scheduleAutosave()
	},

	/* ── Skills ────────────────────────────────────────────────── */
	addSkill(skill) {
		if (!skill?.trim() || state.skills.includes(skill.trim())) return
		state = { ...state, skills: [...state.skills, skill.trim()] }
		emit()
		scheduleAutosave()
	},

	removeSkill(skill) {
		state = { ...state, skills: state.skills.filter((s) => s !== skill) }
		emit()
		scheduleAutosave()
	},

	/* ── Projects ──────────────────────────────────────────────── */
	addProject() {
		state = {
			...state,
			projects: [...state.projects, createDefaultProject()],
		}
		emit()
		scheduleAutosave()
	},

	updateProject(id, updates) {
		state = {
			...state,
			projects: state.projects.map((p) =>
				p.id === id ? { ...p, ...updates } : p,
			),
		}
		emit()
		scheduleAutosave()
	},

	removeProject(id) {
		state = {
			...state,
			projects: state.projects.filter((p) => p.id !== id),
		}
		emit()
		scheduleAutosave()
	},

	duplicateProject(id) {
		const original = state.projects.find((p) => p.id === id)
		if (!original) return
		const copy = { ...original, id: crypto.randomUUID() }
		const idx = state.projects.findIndex((p) => p.id === id)
		const next = [...state.projects]
		next.splice(idx + 1, 0, copy)
		state = { ...state, projects: next }
		emit()
		scheduleAutosave()
	},

	/* ── Certifications ────────────────────────────────────────── */
	addCertification() {
		state = {
			...state,
			certifications: [...state.certifications, createDefaultCertification()],
		}
		emit()
		scheduleAutosave()
	},

	updateCertification(id, updates) {
		state = {
			...state,
			certifications: state.certifications.map((c) =>
				c.id === id ? { ...c, ...updates } : c,
			),
		}
		emit()
		scheduleAutosave()
	},

	removeCertification(id) {
		state = {
			...state,
			certifications: state.certifications.filter((c) => c.id !== id),
		}
		emit()
		scheduleAutosave()
	},

	/* ── Achievements ──────────────────────────────────────────── */
	addAchievement() {
		state = {
			...state,
			achievements: [...state.achievements, createDefaultAchievement()],
		}
		emit()
		scheduleAutosave()
	},

	updateAchievement(id, updates) {
		state = {
			...state,
			achievements: state.achievements.map((a) =>
				a.id === id ? { ...a, ...updates } : a,
			),
		}
		emit()
		scheduleAutosave()
	},

	removeAchievement(id) {
		state = {
			...state,
			achievements: state.achievements.filter((a) => a.id !== id),
		}
		emit()
		scheduleAutosave()
	},

	/* ── Languages ─────────────────────────────────────────────── */
	addLanguage() {
		state = {
			...state,
			languages: [...state.languages, createDefaultLanguage()],
		}
		emit()
		scheduleAutosave()
	},

	updateLanguage(id, updates) {
		state = {
			...state,
			languages: state.languages.map((l) =>
				l.id === id ? { ...l, ...updates } : l,
			),
		}
		emit()
		scheduleAutosave()
	},

	removeLanguage(id) {
		state = {
			...state,
			languages: state.languages.filter((l) => l.id !== id),
		}
		emit()
		scheduleAutosave()
	},

	/* ── Social Links ──────────────────────────────────────────── */
	updateSocialLinks(updates) {
		state = {
			...state,
			socialLinks: { ...state.socialLinks, ...updates },
		}
		emit()
		scheduleAutosave()
	},

	/* ── Custom Sections ───────────────────────────────────────── */
	addCustomSection() {
		state = {
			...state,
			customSections: [...state.customSections, createDefaultCustomSection()],
		}
		emit()
		scheduleAutosave()
	},

	updateCustomSection(id, updates) {
		state = {
			...state,
			customSections: state.customSections.map((c) =>
				c.id === id ? { ...c, ...updates } : c,
			),
		}
		emit()
		scheduleAutosave()
	},

	removeCustomSection(id) {
		state = {
			...state,
			customSections: state.customSections.filter((c) => c.id !== id),
		}
		emit()
		scheduleAutosave()
	},

	/* ── Section order & UI ────────────────────────────────────── */
	moveSection(fromIndex, toIndex) {
		const next = [...state.sectionOrder]
		const [moved] = next.splice(fromIndex, 1)
		next.splice(toIndex, 0, moved)
		state = { ...state, sectionOrder: next }
		emit()
		scheduleAutosave()
	},

	toggleSection(sectionId) {
		const next = new Set(state.expandedSections)
		if (next.has(sectionId)) next.delete(sectionId)
		else next.add(sectionId)
		state = { ...state, expandedSections: next }
		emit()
	},

	expandSection(sectionId) {
		const next = new Set(state.expandedSections)
		next.add(sectionId)
		state = { ...state, expandedSections: next }
		emit()
	},

	setTemplate(templateId) {
		state = { ...state, activeTemplate: templateId }
		emit()
		scheduleAutosave()
	},

	/* ── Reset ─────────────────────────────────────────────────── */
	reset() {
		state = { ...createDefaultResumeState(), isLoading: false, autosaveStatus: 'saved', completionPercentage: 0 }
		emit()
	},
}

/* ─── Hooks ─────────────────────────────────────────────────────── */

export function useResumeStore(selector) {
	const selectorRef = useRef(selector)
	selectorRef.current = selector

	const getSnapshot = useCallback(
		() => selectorRef.current(resumeStore.getSnapshot()),
		[],
	)

	return useSyncExternalStore(resumeStore.subscribe, getSnapshot, getSnapshot)
}

export function usePersonalInfo() {
	return useResumeStore((s) => s.personalInfo)
}

export function useResumeSummary() {
	return useResumeStore((s) => s.summary)
}

export function useExperiences() {
	return useResumeStore((s) => s.experiences)
}

export function useEducation() {
	return useResumeStore((s) => s.education)
}

export function useSkills() {
	return useResumeStore((s) => s.skills)
}

export function useProjects() {
	return useResumeStore((s) => s.projects)
}

export function useCertifications() {
	return useResumeStore((s) => s.certifications)
}

export function useAchievements() {
	return useResumeStore((s) => s.achievements)
}

export function useLanguages() {
	return useResumeStore((s) => s.languages)
}

export function useSocialLinks() {
	return useResumeStore((s) => s.socialLinks)
}

export function useCustomSections() {
	return useResumeStore((s) => s.customSections)
}

export function useSectionOrder() {
	return useResumeStore((s) => s.sectionOrder)
}

export function useResumeTemplate() {
	return useResumeStore((s) => s.activeTemplate)
}

export function useExpandedSections() {
	return useResumeStore((s) => s.expandedSections)
}

export function useAutosaveStatus() {
	return useResumeStore((s) => s.autosaveStatus)
}

export function useResumeLoading() {
	return useResumeStore((s) => s.isLoading)
}

/** Returns all resume data for preview rendering */
export function useResumeData() {
	return useResumeStore((s) => s)
}

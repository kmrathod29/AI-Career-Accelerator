import { useSyncExternalStore, useCallback, useRef } from 'react'
import {
	RESUME_STORAGE_KEY,
	createDefaultResumeState,
	createDefaultExperience,
	createDefaultEducation,
	createDefaultProject,
	createDefaultCertification,
	createDefaultAchievement,
	createDefaultLanguage,
	createDefaultCustomSection,
} from '@constants/resumeBuilder.js'

/* ─────────────────────────────────────────────────────────────────
   Resume Store — useSyncExternalStore pattern
   Mirrors accountStore.js architecture for consistency.
   ───────────────────────────────────────────────────────────────── */

function loadPersistedState() {
	try {
		const raw = localStorage.getItem(RESUME_STORAGE_KEY)
		if (!raw) return createDefaultResumeState()
		const saved = JSON.parse(raw)
		const defaults = createDefaultResumeState()
		return {
			...defaults,
			personalInfo: { ...defaults.personalInfo, ...saved.personalInfo },
			summary: saved.summary ?? '',
			experiences: saved.experiences ?? [],
			education: saved.education ?? [],
			skills: saved.skills ?? [],
			projects: saved.projects ?? [],
			certifications: saved.certifications ?? [],
			achievements: saved.achievements ?? [],
			languages: saved.languages ?? [],
			socialLinks: { ...defaults.socialLinks, ...saved.socialLinks },
			customSections: saved.customSections ?? [],
			sectionOrder: saved.sectionOrder ?? defaults.sectionOrder,
			activeTemplate: saved.activeTemplate ?? 'modern',
			expandedSections: new Set(saved.expandedSections ?? ['personalInfo']),
			autosaveStatus: 'saved',
			isLoading: false,
		}
	} catch {
		return createDefaultResumeState()
	}
}

function serializeForStorage(state) {
	return JSON.stringify({
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
		expandedSections: [...state.expandedSections],
	})
}

let state = loadPersistedState()
const listeners = new Set()
let autosaveTimer = null

function emit() {
	listeners.forEach((l) => l())
}

function scheduleAutosave() {
	if (autosaveTimer) clearTimeout(autosaveTimer)
	state = { ...state, autosaveStatus: 'pending' }
	emit()

	autosaveTimer = setTimeout(() => {
		state = { ...state, autosaveStatus: 'saving' }
		emit()

		/* Simulate async save delay */
		setTimeout(() => {
			try {
				localStorage.setItem(RESUME_STORAGE_KEY, serializeForStorage(state))
				state = { ...state, autosaveStatus: 'saved' }
			} catch {
				state = { ...state, autosaveStatus: 'pending' }
			}
			emit()
		}, 400)
	}, 600)
}

export const resumeStore = {
	subscribe(listener) {
		listeners.add(listener)
		return () => listeners.delete(listener)
	},

	getSnapshot() {
		return state
	},

	init() {
		setTimeout(() => {
			state = { ...state, isLoading: false }
			emit()
		}, 300)
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
		state = { ...createDefaultResumeState(), isLoading: false }
		emit()
		scheduleAutosave()
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

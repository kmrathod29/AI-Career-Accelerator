import { useEffect, useMemo, useState } from 'react'
import { THEME_STORAGE_KEY, THEMES, REDUCED_MOTION_KEY } from '@constants/theme.js'
import { getLocalStorageValue, setLocalStorageValue } from '@utils/storage.js'
import { ThemeContext } from './themeContext.js'

function getSystemTheme() {
	if (typeof window === 'undefined') return THEMES.LIGHT
	return window.matchMedia('(prefers-color-scheme: dark)').matches
		? THEMES.DARK
		: THEMES.LIGHT
}

function applyTheme(resolvedTheme) {
	if (typeof document === 'undefined') return
	document.documentElement.dataset.theme = resolvedTheme
}

function applyReducedMotion(enabled) {
	if (typeof document === 'undefined') return
	document.documentElement.dataset.reducedMotion = enabled ? 'true' : 'false'
}

export function ThemeProvider({ children }) {
	const [theme, setTheme] = useState(() =>
		getLocalStorageValue(THEME_STORAGE_KEY, THEMES.LIGHT),
	)
	const [systemTheme, setSystemTheme] = useState(getSystemTheme)

	const resolvedTheme = theme === THEMES.SYSTEM ? systemTheme : theme

	useEffect(() => {
		applyTheme(resolvedTheme)
		setLocalStorageValue(THEME_STORAGE_KEY, theme)
	}, [theme, resolvedTheme])

	useEffect(() => {
		if (theme !== THEMES.SYSTEM) return undefined

		const media = window.matchMedia('(prefers-color-scheme: dark)')
		const handler = (e) => setSystemTheme(e.matches ? THEMES.DARK : THEMES.LIGHT)

		setSystemTheme(getSystemTheme())
		media.addEventListener('change', handler)
		return () => media.removeEventListener('change', handler)
	}, [theme])

	useEffect(() => {
		const stored = getLocalStorageValue(REDUCED_MOTION_KEY, false)
		const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
		applyReducedMotion(stored || prefersReduced)
	}, [])

	const value = useMemo(
		() => ({
			theme,
			resolvedTheme,
			isDark: resolvedTheme === THEMES.DARK,
			setTheme,
			toggleTheme: () => {
				setTheme((current) =>
					current === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK,
				)
			},
			setReducedMotion: (enabled) => {
				setLocalStorageValue(REDUCED_MOTION_KEY, enabled)
				applyReducedMotion(enabled)
			},
		}),
		[theme, resolvedTheme],
	)

	return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

import { useEffect, useMemo, useState } from 'react'
import { THEME_STORAGE_KEY, THEMES } from '@constants/theme.js'
import { getLocalStorageValue, setLocalStorageValue } from '@utils/storage.js'
import { ThemeContext } from './themeContext.js'

function applyTheme(theme) {
  if (typeof document === 'undefined') {
    return
  }

  document.documentElement.dataset.theme = theme
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() =>
    getLocalStorageValue(THEME_STORAGE_KEY, THEMES.LIGHT),
  )

  useEffect(() => {
    applyTheme(theme)
    setLocalStorageValue(THEME_STORAGE_KEY, theme)
  }, [theme])

  const value = useMemo(
    () => ({
      theme,
      isDark: theme === THEMES.DARK,
      setTheme,
      toggleTheme: () => {
        setTheme((currentTheme) =>
          currentTheme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK,
        )
      },
    }),
    [theme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
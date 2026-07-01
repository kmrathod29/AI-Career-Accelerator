import { Button } from './Button.jsx'
import { useTheme } from '@providers/useTheme.js'

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <Button variant="secondary" onClick={toggleTheme} aria-label="Toggle theme">
      {isDark ? 'Light mode' : 'Dark mode'}
    </Button>
  )
}
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@providers/useTheme.js'
import { motion } from 'framer-motion'

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/70 text-[var(--color-text)] shadow-sm backdrop-blur-md transition-colors hover:bg-[var(--color-surface-2)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="h-[1.1rem] w-[1.1rem] text-amber-400" />
      ) : (
        <Moon className="h-[1.1rem] w-[1.1rem] text-slate-700" />
      )}
    </motion.button>
  )
}
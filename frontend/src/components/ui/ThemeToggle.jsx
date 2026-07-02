import { Sun, Moon } from 'lucide-react'
import { motion } from 'framer-motion'
import { useTheme } from '@providers/useTheme.js'

/**
 * ThemeToggle — premium Day/Night capsule switch.
 *
 * A rounded pill with Sun (left) and Moon (right) icons.
 * An animated thumb slides between them. Glass effect, soft shadow,
 * subtle border — feels like a premium OS toggle.
 */
export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="relative flex h-[30px] w-[58px] cursor-pointer items-center rounded-full border border-[var(--color-border)] p-[3px] transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
      style={{
        background: isDark
          ? 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)'
          : 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
        boxShadow: isDark
          ? 'inset 0 1px 3px rgba(0,0,0,0.4), 0 0 8px rgba(59,130,246,0.08)'
          : 'inset 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
      }}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      role="switch"
      aria-checked={isDark}
    >
      {/* Sun icon — left side */}
      <Sun
        className="absolute left-[7px] h-3.5 w-3.5 transition-opacity duration-300"
        style={{
          color: isDark ? '#475569' : '#F59E0B',
          opacity: isDark ? 0.4 : 0.9,
        }}
        aria-hidden="true"
      />

      {/* Moon icon — right side */}
      <Moon
        className="absolute right-[7px] h-3.5 w-3.5 transition-opacity duration-300"
        style={{
          color: isDark ? '#93C5FD' : '#94A3B8',
          opacity: isDark ? 0.9 : 0.4,
        }}
        aria-hidden="true"
      />

      {/* Sliding thumb */}
      <motion.div
        layout
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30,
        }}
        className="relative z-10 h-[24px] w-[24px] rounded-full shadow-md"
        style={{
          background: isDark
            ? 'linear-gradient(135deg, #334155 0%, #1E293B 100%)'
            : 'linear-gradient(135deg, #FFFFFF 0%, #F1F5F9 100%)',
          boxShadow: isDark
            ? '0 2px 8px rgba(0,0,0,0.4), 0 0 4px rgba(59,130,246,0.15)'
            : '0 2px 8px rgba(0,0,0,0.10), 0 1px 2px rgba(0,0,0,0.06)',
          marginLeft: isDark ? 'auto' : '0px',
        }}
      />
    </button>
  )
}
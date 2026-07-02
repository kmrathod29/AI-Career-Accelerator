import { memo } from 'react'
import { useTheme } from '@providers/useTheme.js'
import { cn } from '@utils/classNames.js'

/**
 * AuthCard — glass-effect card for authentication forms.
 *
 * - Rounded 32px
 * - Backdrop blur + semi-transparent surface
 * - Thin border + soft shadow
 * - Large padding
 */
export const AuthCard = memo(function AuthCard({ children, className }) {
  const { isDark } = useTheme()

  return (
    <div
      className={cn(
        'w-full max-w-full rounded-[32px] border border-[var(--color-border)] p-8 shadow-[var(--shadow-elevated)] backdrop-blur-xl sm:p-10',
        className,
      )}
      style={{
        backgroundColor: isDark
          ? 'rgba(17,24,39,0.80)'
          : 'rgba(255,255,255,0.85)',
      }}
    >
      {children}
    </div>
  )
})

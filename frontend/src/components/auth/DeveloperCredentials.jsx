import { memo } from 'react'
import { Info } from 'lucide-react'

/**
 * DeveloperCredentials — demo login card.
 * Renders ONLY in development mode (import.meta.env.DEV).
 */

const DEV_EMAIL = 'demo@careeraccelerator.ai'
const DEV_PASSWORD = 'Demo@123'

export const DeveloperCredentials = memo(function DeveloperCredentials({
  onFill,
}) {
  // Gate: only visible in development
  if (!import.meta.env.DEV) return null

  return (
    <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3.5">
      <div className="mb-2 flex items-center gap-2">
        <Info className="h-3.5 w-3.5 text-amber-500" aria-hidden="true" />
        <span className="text-xs font-semibold text-amber-600">
          Dev Credentials
        </span>
      </div>
      <div className="space-y-1 text-xs text-[var(--color-muted)]">
        <p>
          Email:{' '}
          <code className="rounded bg-[var(--color-surface-2)] px-1.5 py-0.5 font-mono text-[var(--color-text)]">
            {DEV_EMAIL}
          </code>
        </p>
        <p>
          Password:{' '}
          <code className="rounded bg-[var(--color-surface-2)] px-1.5 py-0.5 font-mono text-[var(--color-text)]">
            {DEV_PASSWORD}
          </code>
        </p>
      </div>
      {onFill && (
        <button
          type="button"
          onClick={() => onFill(DEV_EMAIL, DEV_PASSWORD)}
          className="mt-2.5 cursor-pointer text-xs font-medium text-amber-600 transition-colors hover:text-amber-500"
        >
          Auto-fill credentials →
        </button>
      )}
    </div>
  )
})

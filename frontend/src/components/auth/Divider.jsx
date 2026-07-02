import { memo } from 'react'

/**
 * Divider — horizontal "or" separator.
 */
export const Divider = memo(function Divider({ text = 'or' }) {
  return (
    <div className="my-5 flex items-center gap-3" role="separator">
      <span className="h-px flex-1 bg-[var(--color-border)]" />
      <span className="text-xs font-medium text-[var(--color-muted)]">
        {text}
      </span>
      <span className="h-px flex-1 bg-[var(--color-border)]" />
    </div>
  )
})

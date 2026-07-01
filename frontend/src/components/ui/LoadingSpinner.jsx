export function LoadingSpinner({ label = 'Loading' }) {
  return (
    <div className="inline-flex items-center gap-3 text-sm text-[var(--color-muted)]" aria-live="polite" aria-busy="true">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--color-primary)] border-t-transparent" />
      <span>{label}</span>
    </div>
  )
}
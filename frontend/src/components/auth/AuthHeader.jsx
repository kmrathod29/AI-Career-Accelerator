import { memo } from 'react'

/**
 * AuthHeader — reusable form heading block.
 *
 * Props:
 *   icon        — Lucide icon component (optional)
 *   imageSrc    — logo image URL (optional, used instead of icon)
 *   title       — heading text
 *   subtitle    — description text
 */
export const AuthHeader = memo(function AuthHeader({
  icon: Icon,
  imageSrc,
  title,
  subtitle,
}) {
  return (
    <div className="mb-7 text-center">
      {imageSrc ? (
        <img
          src={imageSrc}
          alt=""
          aria-hidden="true"
          draggable={false}
          className="mx-auto mb-4 h-12 w-12 object-contain"
        />
      ) : Icon ? (
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-primary)]/10">
          <Icon
            className="h-6 w-6 text-[var(--color-primary)]"
            strokeWidth={1.8}
            aria-hidden="true"
          />
        </div>
      ) : null}
      <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text)]">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
          {subtitle}
        </p>
      )}
    </div>
  )
})

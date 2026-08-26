import { memo } from 'react'

/**
 * AuthHeader — reusable form heading block.
 *
 * Props:
 *   icon        — Lucide icon component (optional)
 *   imageSrc    — logo image URL (optional, used instead of icon)
 *   eyebrow     — small uppercase label above title (optional)
 *   title       — heading text
 *   subtitle    — description text
 */
export const AuthHeader = memo(function AuthHeader({
  icon: Icon,
  imageSrc,
  eyebrow,
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
      {eyebrow && (
        <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--color-primary)]">
          {eyebrow}
        </p>
      )}
      <h1 className="text-4xl font-black tracking-[-0.055em] leading-[1.05] text-[var(--color-text)]">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-3 text-base leading-[1.6] text-[var(--color-muted)]">
          {subtitle}
        </p>
      )}
    </div>
  )
})

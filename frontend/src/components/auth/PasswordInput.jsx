import { memo, useState, forwardRef } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { cn } from '@utils/classNames.js'

/**
 * PasswordInput — text input with show/hide toggle.
 *
 * Props: standard input props + label, error, id
 */
export const PasswordInput = memo(
  forwardRef(function PasswordInput(
    { label, error, id, className, ...props },
    ref,
  ) {
    const [visible, setVisible] = useState(false)

    return (
      <div>
        {label && (
          <label
            htmlFor={id}
            className="mb-1.5 block text-sm font-medium text-[var(--color-text)]"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={id}
            type={visible ? 'text' : 'password'}
            className={cn(
              'w-full rounded-xl border bg-[var(--color-surface)] px-4 py-3 pr-11 text-sm text-[var(--color-text)] outline-none transition-colors duration-200',
              'placeholder:text-[var(--color-muted)]',
              'focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20',
              error
                ? 'border-red-400'
                : 'border-[var(--color-border)]',
              className,
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            {...props}
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[var(--color-muted)] transition-colors hover:text-[var(--color-text)]"
            aria-label={visible ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {visible ? (
              <EyeOff className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Eye className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>
        {error && (
          <p
            id={`${id}-error`}
            role="alert"
            className="mt-1.5 text-xs text-red-500"
          >
            {error}
          </p>
        )}
      </div>
    )
  }),
)

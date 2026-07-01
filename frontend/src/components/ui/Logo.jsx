import { Link } from 'react-router-dom'
import { APP_ROUTES } from '@routes/appRoutes.js'
import logoSrc from '@assets/logo/AI-Career-Accelerator-only-logo.png'

export function Logo() {
  return (
    <Link
      to={APP_ROUTES.HOME}
      className="inline-flex items-center gap-2.5 rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
      aria-label="AI Career Accelerator — go to home"
    >
      <img
        src={logoSrc}
        alt=""
        aria-hidden="true"
        draggable={false}
        className="h-7 w-7 shrink-0 object-contain"
      />
      <span className="text-sm font-semibold tracking-tight text-[var(--color-text)]">
        AI Career Accelerator
      </span>
    </Link>
  )
}
import { Link } from 'react-router-dom'
import { APP_ROUTES } from '@routes/appRoutes.js'

export function Logo() {
  return (
    <Link to={APP_ROUTES.HOME} className="inline-flex items-center gap-3 font-semibold tracking-tight">
      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--color-primary)] text-sm font-bold text-[var(--color-primary-foreground)]">
        ACA
      </span>
      <span>AI Career Accelerator</span>
    </Link>
  )
}
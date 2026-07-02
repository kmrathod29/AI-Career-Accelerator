import { memo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { forgotPasswordSchema } from '@constants/authSchemas.js'
import { APP_ROUTES } from '@constants/routes.js'
import { AuthHeader } from './AuthHeader.jsx'
import { PrimaryButton } from '@components/ui/PrimaryButton.jsx'
import { cn } from '@utils/classNames.js'
import logoSrc from '@assets/logo/AI-Career-Accelerator-only-logo.png'

export const ForgotPasswordForm = memo(function ForgotPasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onChange',
    defaultValues: { email: '' },
  })

  const onSubmit = () => {
    toast.info('Coming Soon', {
      description: 'Password recovery is currently under development.',
    })
  }

  return (
    <div className="w-full">
      <AuthHeader
        imageSrc={logoSrc}
        title="Forgot Password"
        subtitle="Enter your email and we'll send you a reset link."
      />

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full space-y-4">
        {/* Email */}
        <div>
          <label htmlFor="fp-email" className="mb-1.5 block text-sm font-medium text-[var(--color-text)]">
            Email
          </label>
          <input
            id="fp-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className={cn(
              'w-full rounded-xl border bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] outline-none transition-colors duration-200',
              'placeholder:text-[var(--color-muted)]',
              'focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20',
              errors.email ? 'border-red-400' : 'border-[var(--color-border)]',
            )}
            aria-invalid={!!errors.email}
            {...register('email')}
          />
          {errors.email && (
            <p role="alert" className="mt-1.5 text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        <div className="pt-2">
          <PrimaryButton
            type="submit"
            disabled={!isValid}
            className="w-full justify-center py-3 text-sm"
          >
            Send Reset Link
          </PrimaryButton>
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--color-muted)]">
        Remember your password?{' '}
        <Link
          to={APP_ROUTES.LOGIN}
          className="font-semibold text-[var(--color-primary)] transition-colors hover:text-[var(--color-secondary)]"
        >
          Log in
        </Link>
      </p>
    </div>
  )
})

import { memo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'sonner'
import { registerSchema, getPasswordStrength } from '@constants/authSchemas.js'
import { APP_ROUTES } from '@constants/routes.js'
import { useAuth } from '@providers/useAuth.js'
import { authService } from '@/services/authService.js'
import { AuthHeader } from './AuthHeader.jsx'
import { AuthTabs } from './AuthTabs.jsx'
import { PasswordInput } from './PasswordInput.jsx'
import { PrimaryButton } from '@components/ui/PrimaryButton.jsx'
import { cn } from '@utils/classNames.js'

export const RegisterForm = memo(function RegisterForm() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
    defaultValues: { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' },
  })

  const passwordValue = watch('password')
  const strength = getPasswordStrength(passwordValue)

  const onSubmit = async (data) => {
    const loadingId = toast.loading('Creating your account…')

    try {
      const response = await authService.register({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      })

      if (response?.data?.user) {
        login(response.data.user)
        toast.success('Account created!', {
          id: loadingId,
          description: 'Welcome to AI Career Accelerator.',
        })
        navigate(APP_ROUTES.DASHBOARD, { replace: true })
      }
    } catch (error) {
      const message =
        error.response?.data?.message || 'Something went wrong. Please try again.'
      toast.error(message, { id: loadingId })
    }
  }

  return (
    <div className="w-full">
      <AuthHeader
        eyebrow="CREATE ACCOUNT"
        title="Register"
        subtitle="Start your AI-powered career journey."
      />

      <AuthTabs />

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full space-y-4">
        {/* First Name + Last Name — side by side */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="reg-first-name" className="mb-1.5 block text-sm font-medium text-[var(--color-text)]">
              First Name
            </label>
            <input
              id="reg-first-name"
              type="text"
              autoComplete="given-name"
              placeholder="Alex"
              className={cn(
                'w-full rounded-xl border bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] outline-none transition-colors duration-200',
                'placeholder:text-[var(--color-muted)]',
                'focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20',
                errors.firstName ? 'border-red-400' : 'border-[var(--color-border)]',
              )}
              aria-invalid={!!errors.firstName}
              {...register('firstName')}
            />
            {errors.firstName && <p role="alert" className="mt-1.5 text-xs text-red-500">{errors.firstName.message}</p>}
          </div>

          <div>
            <label htmlFor="reg-last-name" className="mb-1.5 block text-sm font-medium text-[var(--color-text)]">
              Last Name
            </label>
            <input
              id="reg-last-name"
              type="text"
              autoComplete="family-name"
              placeholder="Johnson"
              className={cn(
                'w-full rounded-xl border bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] outline-none transition-colors duration-200',
                'placeholder:text-[var(--color-muted)]',
                'focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20',
                errors.lastName ? 'border-red-400' : 'border-[var(--color-border)]',
              )}
              aria-invalid={!!errors.lastName}
              {...register('lastName')}
            />
            {errors.lastName && <p role="alert" className="mt-1.5 text-xs text-red-500">{errors.lastName.message}</p>}
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="reg-email" className="mb-1.5 block text-sm font-medium text-[var(--color-text)]">
            Email
          </label>
          <input
            id="reg-email"
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
          {errors.email && <p role="alert" className="mt-1.5 text-xs text-red-500">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <PasswordInput
            id="reg-password"
            label="Password"
            placeholder="Create a strong password"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register('password')}
          />
        </div>

        {/* Password strength */}
        {passwordValue && (
          <div>
            <div className="flex gap-1 animate-fadeIn">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={cn(
                    'h-1 flex-1 rounded-full transition-colors duration-300',
                    i <= strength.score ? strength.color : 'bg-[var(--color-surface-3)]',
                  )}
                />
              ))}
            </div>
            <p className="mt-1 text-xs text-[var(--color-muted)]">
              {strength.label}
            </p>
          </div>
        )}

        {/* Confirm Password */}
        <div>
          <PasswordInput
            id="reg-confirm"
            label="Confirm Password"
            placeholder="Re-enter your password"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
        </div>

        {/* Submit */}
        <div className="pt-2">
          <PrimaryButton
            type="submit"
            disabled={!isValid || isSubmitting}
            className="w-full justify-center py-3 text-sm"
          >
            {isSubmitting ? 'Creating account…' : 'Create Account'}
          </PrimaryButton>
        </div>
      </form>

      {/* Login link */}
      <p className="mt-6 text-center text-sm text-[var(--color-muted)]">
        Already have an account?{' '}
        <Link
          to={APP_ROUTES.LOGIN}
          className="font-semibold text-[var(--color-primary)] transition-colors hover:text-[var(--color-secondary)]"
        >
          Login
        </Link>
      </p>
    </div>
  )
})

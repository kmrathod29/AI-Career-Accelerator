import { memo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'sonner'
import { registerSchema, getPasswordStrength } from '@constants/authSchemas.js'
import { APP_ROUTES } from '@constants/routes.js'
import { AuthHeader } from './AuthHeader.jsx'
import { AuthTabs } from './AuthTabs.jsx'
import { PasswordInput } from './PasswordInput.jsx'
import { PrimaryButton } from '@components/ui/PrimaryButton.jsx'
import { cn } from '@utils/classNames.js'

export const RegisterForm = memo(function RegisterForm() {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  })

  const passwordValue = watch('password')
  const strength = getPasswordStrength(passwordValue)

  const onSubmit = async () => {
    const loadingId = toast.loading('Creating your account…')
    await new Promise((r) => setTimeout(r, 800))
    toast.success('Account created!', {
      id: loadingId,
      description: 'Please sign in with your new credentials.',
    })
    setTimeout(() => navigate(APP_ROUTES.LOGIN), 600)
  }

  return (
    <div className="w-full">
      <AuthHeader
        title="Create Your Account"
        subtitle="Start your AI-powered career journey."
      />

      <AuthTabs />

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full space-y-4">
        {/* Full Name */}
        <div>
          <label htmlFor="reg-name" className="mb-1.5 block text-sm font-medium text-[var(--color-text)]">
            Full Name
          </label>
          <input
            id="reg-name"
            type="text"
            autoComplete="name"
            placeholder="Alex Johnson"
            className={cn(
              'w-full rounded-xl border bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] outline-none transition-colors duration-200',
              'placeholder:text-[var(--color-muted)]',
              'focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20',
              errors.name ? 'border-red-400' : 'border-[var(--color-border)]',
            )}
            aria-invalid={!!errors.name}
            {...register('name')}
          />
          {errors.name && <p role="alert" className="mt-1.5 text-xs text-red-500">{errors.name.message}</p>}
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

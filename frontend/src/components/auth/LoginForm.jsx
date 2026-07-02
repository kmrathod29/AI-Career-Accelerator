import { memo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'sonner'
import { loginSchema } from '@constants/authSchemas.js'
import { APP_ROUTES } from '@constants/routes.js'
import { AuthHeader } from './AuthHeader.jsx'
import { AuthTabs } from './AuthTabs.jsx'
import { PasswordInput } from './PasswordInput.jsx'
import { Divider } from './Divider.jsx'
import { GoogleButton } from './GoogleButton.jsx'
import { DeveloperCredentials } from './DeveloperCredentials.jsx'
import { PrimaryButton } from '@components/ui/PrimaryButton.jsx'
import { cn } from '@utils/classNames.js'

const DEMO_EMAIL = 'demo@careeraccelerator.ai'
const DEMO_PASS = 'Demo@123'

export const LoginForm = memo(function LoginForm() {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, isValid },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data) => {
    const loadingId = toast.loading('Signing you in...')

    // Simulate network delay
    await new Promise((r) => setTimeout(r, 800))

    // Temporary frontend-only demo auth
    if (data.email === DEMO_EMAIL && data.password === DEMO_PASS) {
      toast.success('Welcome back!', { id: loadingId })
      setTimeout(() => navigate(APP_ROUTES.DASHBOARD), 600)
    } else {
      toast.error('Invalid email or password.', { id: loadingId })
    }
  }

  const handleAutoFill = (email, password) => {
    setValue('email', email, { shouldValidate: true })
    setValue('password', password, { shouldValidate: true })
  }

  return (
    <div className="w-full">
      <AuthHeader
        title="Welcome Back"
        subtitle="Continue your AI-powered career journey."
      />

      <AuthTabs />

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full space-y-4">
        {/* Email */}
        <div>
          <label htmlFor="login-email" className="mb-1.5 block text-sm font-medium text-[var(--color-text)]">
            Email
          </label>
          <input
            id="login-email"
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
            aria-describedby={errors.email ? 'login-email-error' : undefined}
            {...register('email')}
          />
          {errors.email && (
            <p id="login-email-error" role="alert" className="mt-1.5 text-xs text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <PasswordInput
            id="login-password"
            label="Password"
            placeholder="Enter your password"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register('password')}
          />
        </div>

        {/* Forgot password */}
        <div className="text-right">
          <Link
            to={APP_ROUTES.FORGOT_PASSWORD}
            className="text-xs font-medium text-[var(--color-primary)] transition-colors hover:text-[var(--color-secondary)]"
          >
            Forgot password?
          </Link>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <PrimaryButton
            type="submit"
            disabled={!isValid || isSubmitting}
            className="w-full justify-center py-3 text-sm"
          >
            {isSubmitting ? 'Signing you in...' : 'Continue'}
          </PrimaryButton>
        </div>
      </form>

      <Divider />
      <GoogleButton />

      {/* Register link */}
      <p className="mt-6 text-center text-sm text-[var(--color-muted)]">
        Don&apos;t have an account?{' '}
        <Link
          to={APP_ROUTES.REGISTER}
          className="font-semibold text-[var(--color-primary)] transition-colors hover:text-[var(--color-secondary)]"
        >
          Create account
        </Link>
      </p>

      <DeveloperCredentials onFill={handleAutoFill} />
    </div>
  )
})

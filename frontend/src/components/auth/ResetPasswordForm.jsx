import { memo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { resetPasswordSchema } from '@constants/authSchemas.js'
import { APP_ROUTES } from '@constants/routes.js'
import { AuthHeader } from './AuthHeader.jsx'
import { PasswordInput } from './PasswordInput.jsx'
import { PrimaryButton } from '@components/ui/PrimaryButton.jsx'

export const ResetPasswordForm = memo(function ResetPasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange',
    defaultValues: { password: '', confirmPassword: '' },
  })

  const onSubmit = () => {
    toast.info('Coming Soon', {
      description: 'Password reset is currently under development.',
    })
  }

  return (
    <div className="w-full">
      <AuthHeader
        title="Reset Password"
        subtitle="This feature is currently under development."
      />

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="w-full space-y-4">
        {/* New Password */}
        <div>
          <PasswordInput
            id="rp-password"
            label="New Password"
            placeholder="Create a strong password"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register('password')}
          />
        </div>

        {/* Confirm Password */}
        <div>
          <PasswordInput
            id="rp-confirm"
            label="Confirm Password"
            placeholder="Re-enter your password"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
        </div>

        <div className="pt-2">
          <PrimaryButton
            type="submit"
            disabled={!isValid}
            className="w-full justify-center py-3 text-sm"
          >
            Reset Password
          </PrimaryButton>
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--color-muted)]">
        Remember your password?{' '}
        <Link
          to={APP_ROUTES.LOGIN}
          className="font-semibold text-[var(--color-primary)] transition-colors hover:text-[var(--color-secondary)]"
        >
          Sign in
        </Link>
      </p>
    </div>
  )
})

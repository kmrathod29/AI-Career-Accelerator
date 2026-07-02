import { motion } from 'framer-motion'
import { ResetPasswordForm } from '@components/auth/ResetPasswordForm.jsx'

export function ResetPasswordPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="w-full"
    >
      <ResetPasswordForm />
    </motion.div>
  )
}

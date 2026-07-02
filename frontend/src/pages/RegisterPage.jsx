import { motion } from 'framer-motion'
import { RegisterForm } from '@components/auth/RegisterForm.jsx'

export function RegisterPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="w-full"
    >
      <RegisterForm />
    </motion.div>
  )
}
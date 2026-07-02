import { memo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

/**
 * FooterColumn — reusable footer link column.
 *
 * Props:
 *   title — column heading
 *   links — array of { label, to (internal) | href (external) }
 */

const FADE_UP = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
  },
}

export const FooterColumn = memo(function FooterColumn({ title, links }) {
  return (
    <motion.div
      variants={FADE_UP}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
    >
      <h3 className="mb-4 text-sm font-semibold tracking-wide text-[var(--color-text)]">
        {title}
      </h3>
      <ul className="space-y-2.5">
        {links.map(({ label, to, href }) => (
          <li key={label}>
            {to ? (
              <Link
                to={to}
                className="group inline-flex text-sm text-[var(--color-muted)] transition-colors duration-200 hover:text-[var(--color-text)]"
              >
                <span className="relative">
                  {label}
                  <span className="absolute -bottom-px left-0 h-px w-0 bg-[var(--color-primary)] transition-all duration-300 group-hover:w-full" />
                </span>
              </Link>
            ) : (
              <a
                href={href || '#'}
                className="group inline-flex text-sm text-[var(--color-muted)] transition-colors duration-200 hover:text-[var(--color-text)]"
              >
                <span className="relative">
                  {label}
                  <span className="absolute -bottom-px left-0 h-px w-0 bg-[var(--color-primary)] transition-all duration-300 group-hover:w-full" />
                </span>
              </a>
            )}
          </li>
        ))}
      </ul>
    </motion.div>
  )
})

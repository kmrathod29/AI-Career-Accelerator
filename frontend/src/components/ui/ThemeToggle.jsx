import { useState, useEffect } from 'react'
import { Sun, Moon, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@providers/useTheme.js'

/**
 * ThemeToggle — Premium Day/Night capsule switch.
 *
 * Props:
 *   variant: 'auth' (custom sizes for auth page header: desktop 120x42, tablet 110x40, mobile 92x36)
 *   size: 'sm' (for mobile drawer toggle: 105x40)
 */
export function ThemeToggle({ variant, size }) {
  const { isDark, toggleTheme } = useTheme()
  const isSm = size === 'sm'
  const isAuth = variant === 'auth'

  /* ── Responsive track width & height ────────────────────── */
  const [windowW, setWindowW] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200)

  useEffect(() => {
    if (isSm) return
    const update = () => setWindowW(window.innerWidth)
    window.addEventListener('resize', update, { passive: true })
    return () => window.removeEventListener('resize', update)
  }, [isSm])

  let trackW = 124
  let H = 44

  if (isSm) {
    trackW = 105
    H = 40
  } else if (isAuth) {
    if (windowW < 768) {
      trackW = 92
      H = 36
    } else if (windowW < 1024) {
      trackW = 110
      H = 40
    } else {
      trackW = 120
      H = 42
    }
  } else {
    if (windowW < 768) {
      trackW = 105
      H = 40
    } else if (windowW < 1024) {
      trackW = 115
      H = 44
    } else {
      trackW = 124
      H = 44
    }
  }

  /* ── Layout constants (px) ─────────────────────────────── */
  const PAD = isSm || (isAuth && windowW < 768) || windowW < 768 ? 3 : 4
  const THUMB = H - PAD * 2
  const TRAVEL = trackW - PAD * 2 - THUMB

  const fontSz = isSm || (isAuth && windowW < 768) || windowW < 768 ? 10.5 : 12.5
  const iconSz = isSm || (isAuth && windowW < 768) || windowW < 768 ? 12 : 14.5
  const sparkleSz = isSm || (isAuth && windowW < 768) || windowW < 768 ? 8 : 9.5

  return (
    <motion.button
      onClick={toggleTheme}
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}

      /* ── Track: colour + border + shadow all animate on theme change ── */
      animate={{
        backgroundColor: isDark ? '#111827' : '#F3F4F6',
        borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
        boxShadow: isDark
          ? '0 2px 12px rgba(0,0,0,0.40), inset 0 1px 2px rgba(255,255,255,0.04)'
          : '0 2px 12px rgba(0,0,0,0.08), inset 0 1px 2px rgba(255,255,255,0.90)',
      }}
      transition={{
        backgroundColor: { duration: 0.30 },
        borderColor: { duration: 0.30 },
        boxShadow: { duration: 0.30 },
        scale: { duration: 0.15 },
      }}

      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}

      className="focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"

      style={{
        width: trackW,
        height: H,
        borderRadius: 9999,
        border: '1px solid',
        padding: PAD,
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        display: 'inline-flex',
        alignItems: 'center',
        flexShrink: 0,
        outline: 'none',
      }}
    >

      {/* ── "Light" label ────────────────────────────────────── */}
      <motion.span
        aria-hidden="true"
        animate={{ opacity: isDark ? 0 : 1 }}
        transition={{ duration: 0.15 }}
        style={{
          position: 'absolute',
          left: PAD + THUMB + 4,
          right: PAD + 2,
          textAlign: 'center',
          fontSize: fontSz,
          fontWeight: 600,
          color: '#111827',
          letterSpacing: '0.015em',
          userSelect: 'none',
          pointerEvents: 'none',
          lineHeight: 1,
        }}
      >
        Light
      </motion.span>

      {/* ── "Dark" label + optional Sparkles ─────────────────── */}
      <motion.div
        aria-hidden="true"
        animate={{ opacity: isDark ? 1 : 0 }}
        transition={{ duration: 0.15 }}
        style={{
          position: 'absolute',
          left: PAD + 2,
          right: PAD + THUMB + 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3,
          pointerEvents: 'none',
        }}
      >
        <Sparkles
          style={{ width: sparkleSz, height: sparkleSz, color: '#93C5FD', flexShrink: 0 }}
          aria-hidden="true"
        />
        <span
          style={{
            fontSize: fontSz,
            fontWeight: 600,
            color: '#FFFFFF',
            letterSpacing: '0.015em',
            userSelect: 'none',
            lineHeight: 1,
          }}
        >
          Dark
        </span>
      </motion.div>

      {/* ── Sliding thumb ─────────────────────────────────────── */}
      <motion.div
        animate={{ x: isDark ? TRAVEL : 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 28 }}
        style={{
          position: 'relative',
          zIndex: 2,
          width: THUMB,
          height: THUMB,
          borderRadius: 9999,
          backgroundColor: '#FFFFFF',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 10px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.08)',
          border: '1px solid rgba(0,0,0,0.06)',
        }}
      >

        {/* Icon inside thumb — Sun ↔ Moon with spin-fade swap */}
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.div
              key="moon"
              initial={{ rotate: -45, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 45, opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.20, ease: 'easeOut' }}
              aria-hidden="true"
            >
              <Moon
                style={{ width: iconSz, height: iconSz, color: '#1E293B', strokeWidth: 2.5 }}
              />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              initial={{ rotate: 45, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: -45, opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.20, ease: 'easeOut' }}
              aria-hidden="true"
            >
              <Sun
                style={{ width: iconSz, height: iconSz, color: '#111827', strokeWidth: 2.5 }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.button>
  )
}
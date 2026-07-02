import { useState, useEffect } from 'react'
import { Sun, Moon, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@providers/useTheme.js'

/**
 * ThemeToggle — Premium Day/Night capsule switch.
 *
 * A large rounded pill (128×44px desktop, 115px tablet, 105px mobile)
 * inspired by Apple hardware controls. The circular thumb slides
 * between left (☀ Light) and right (🌙 Dark) via Framer Motion spring.
 *
 * Props: none — reads from existing ThemeContext via useTheme().
 * Drop-in replacement for the old ThemeToggle — same export name & file path.
 */
export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()

  /* ── Responsive track width ────────────────────────────── */
  const [trackW, setTrackW] = useState(128)

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth
      setTrackW(w < 768 ? 105 : w < 1024 ? 115 : 128)
    }
    update()
    window.addEventListener('resize', update, { passive: true })
    return () => window.removeEventListener('resize', update)
  }, [])

  /* ── Layout constants (px) ─────────────────────────────── */
  const H = 44             // track height
  const PAD = 4              // inner padding
  const THUMB = H - PAD * 2   // 36px thumb diameter
  const TRAVEL = trackW - PAD * 2 - THUMB  // how far the thumb slides

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
        scale: { duration: 0.15 },  // snap hover/tap faster
      }}

      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}

      /* Focus ring via Tailwind (ring uses box-shadow, not outline) */
      className="focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"

      style={{
        width: trackW,
        height: H,
        borderRadius: 9999,
        border: '1px solid',   /* borderColor is driven by animate above */
        padding: PAD,
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        display: 'inline-flex',
        alignItems: 'center',
        flexShrink: 0,
        outline: 'none',        /* replaced by focus-visible ring above  */
      }}
    >

      {/* ── "Light" label ────────────────────────────────────── */}
      {/* Right-side of track; fades away when switching to dark */}
      <motion.span
        aria-hidden="true"
        animate={{ opacity: isDark ? 0 : 1 }}
        transition={{ duration: 0.15 }}
        style={{
          position: 'absolute',
          left: PAD + THUMB + 4,  /* starts just after thumb */
          right: PAD + 2,
          textAlign: 'center',
          fontSize: 13,
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
      {/* Left-side of track; fades away when switching to light */}
      <motion.div
        aria-hidden="true"
        animate={{ opacity: isDark ? 1 : 0 }}
        transition={{ duration: 0.15 }}
        style={{
          position: 'absolute',
          left: PAD + 2,
          right: PAD + THUMB + 4,  /* ends just before thumb */
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3,
          pointerEvents: 'none',
        }}
      >
        <Sparkles
          style={{ width: 10, height: 10, color: '#93C5FD', flexShrink: 0 }}
          aria-hidden="true"
        />
        <span
          style={{
            fontSize: 13,
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
          /* Consistent white-thumb shadow looks good on both tracks */
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
                style={{ width: 15, height: 15, color: '#1E293B', strokeWidth: 2.5 }}
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
                style={{ width: 15, height: 15, color: '#111827', strokeWidth: 2.5 }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.button>
  )
} 
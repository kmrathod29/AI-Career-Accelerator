import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { HeroSection } from '@components/landing/HeroSection.jsx'
import { LandingSkeleton } from '@components/skeleton/LandingSkeleton.jsx'

/**
 * HomePage — slim orchestrator.
 * All section logic lives in src/components/landing/.
 * Future sections (Features, Pricing, FAQ, Footer) slot in below HeroSection.
 */
export function HomePage() {
  const [isLoading, setIsLoading] = useState(true)

  // Showcase the skeleton shimmer for ~900 ms then reveal content
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 900)
    return () => clearTimeout(t)
  }, [])

  if (isLoading) return <LandingSkeleton />

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="landing"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        <HeroSection />

        {/* ── Future sections slot in here ─────────────── */}
        {/* <FeaturesSection />   */}
        {/* <PricingSection />    */}
        {/* <FAQSection />        */}
        {/* <FooterSection />     */}

        {/* Scroll anchors — keep Navbar scroll-spy working */}
        <div id="features"     className="pointer-events-none h-px" aria-hidden="true" />
        <div id="how-it-works" className="pointer-events-none h-px" aria-hidden="true" />
        <div id="pricing"      className="pointer-events-none h-px" aria-hidden="true" />
        <div id="faq"          className="pointer-events-none h-px" aria-hidden="true" />
      </motion.div>
    </AnimatePresence>
  )
}
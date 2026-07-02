import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { HeroSection } from '@components/landing/HeroSection.jsx'
import { FeaturesSection } from '@components/landing/features/FeaturesSection.jsx'
import { HowItWorksSection } from '@components/landing/how-it-works/HowItWorksSection.jsx'
import { LandingSkeleton } from '@components/skeleton/LandingSkeleton.jsx'

/**
 * HomePage — slim orchestrator.
 * All section logic lives in src/components/landing/.
 * Future sections (Pricing, FAQ, Footer) slot in below HowItWorksSection.
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
        <FeaturesSection />
        <HowItWorksSection />

        {/* ── Future sections slot in here ─────────────── */}
        {/* <PricingSection />    */}
        {/* <FAQSection />        */}
        {/* <FooterSection />     */}

        {/* Scroll anchors — keep Navbar scroll-spy working */}
        <div id="pricing"      className="pointer-events-none h-px" aria-hidden="true" />
        <div id="faq"          className="pointer-events-none h-px" aria-hidden="true" />
      </motion.div>
    </AnimatePresence>
  )
}
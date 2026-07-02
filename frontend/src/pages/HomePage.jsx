import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { HeroSection } from '@components/landing/HeroSection.jsx'
import { FeaturesSection } from '@components/landing/features/FeaturesSection.jsx'
import { HowItWorksSection } from '@components/landing/how-it-works/HowItWorksSection.jsx'
import { ProductShowcaseSection } from '@components/landing/showcase/ProductShowcaseSection.jsx'
import { TestimonialsSection } from '@components/landing/testimonials/TestimonialsSection.jsx'
import { FAQSection } from '@components/landing/faq/FAQSection.jsx'
import { CTASection } from '@components/landing/cta/CTASection.jsx'
import { Footer } from '@components/landing/footer/Footer.jsx'
import { LandingSkeleton } from '@components/skeleton/LandingSkeleton.jsx'

/**
 * HomePage — slim orchestrator.
 * All section logic lives in src/components/landing/.
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
        <ProductShowcaseSection />
        <TestimonialsSection />
        <FAQSection />
        <CTASection />
        <Footer />
      </motion.div>
    </AnimatePresence>
  )
}
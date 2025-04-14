'use client'

import { BootcampHero } from '@/components/bootcamp/bootcamp-hero'
import { BootcampProjectShowcase } from '@/components/bootcamp/project-showcase/bootcamp-project-showcase'
import { BootcampSpeciality } from '@/components/bootcamp/bootcamp-speciality'
import { PromoVideos } from '@/components/bootcamp/promo-videos'
import { BatchSchedule } from '@/components/bootcamp/next-batch-schedule'
import { BootcampOverview } from '@/components/bootcamp/bootcamp-overview'
import FAQBootcamp from '@/components/bootcamp/faq/faq-bootcamp'
import TestimonialBootcamp from '@/components/bootcamp/testimonial-bootcamp'
import { BootcampLogoSlider } from '@/components/bootcamp/bootcamp-logo-slider'
import CallToAction from '@/components/shapexui/cta'
import BootcampSteps from '@/components/shapexui/steps'
import { BootcampPricing } from '@/components/bootcamp/bootcamp-pricing'
import { BootcampCurriculum } from '@/components/bootcamp/bootcamp-curriculum'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { fadeInUp, revealSection, scrollFadeIn } from '@/lib/micro-animations'

// Define the animation type options based on the available variants
type AnimationType = 'fadeInUp' | 'revealSection' | 'scrollFadeIn'

// Interface for AnimatedSection props
interface AnimatedSectionProps {
  children: React.ReactNode
  animation?: AnimationType
  delay?: number
  className?: string
}

// Animation wrapper component to handle scroll-triggered animations
const AnimatedSection = ({
  children,
  animation = 'fadeInUp',
  delay = 0,
  className = '',
}: AnimatedSectionProps) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const getAnimationVariant = () => {
    switch (animation) {
      case 'revealSection':
        return revealSection
      case 'scrollFadeIn':
        return scrollFadeIn
      case 'fadeInUp':
      default:
        return fadeInUp
    }
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={getAnimationVariant()}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function BootcampDetails() {
  return (
    <>
      <BootcampHero />

      <AnimatedSection>
        <BootcampOverview />
      </AnimatedSection>

      <AnimatedSection animation="scrollFadeIn" delay={0.1}>
        <BatchSchedule />
      </AnimatedSection>

      <AnimatedSection animation="revealSection" delay={0.2}>
        <BootcampSteps />
      </AnimatedSection>

      <AnimatedSection animation="fadeInUp" delay={0.2}>
        <BootcampSpeciality />
      </AnimatedSection>

      <AnimatedSection animation="scrollFadeIn">
        <BootcampLogoSlider />
      </AnimatedSection>

      <AnimatedSection animation="revealSection" delay={0.2}>
        <BootcampProjectShowcase />
      </AnimatedSection>

      <AnimatedSection animation="fadeInUp" delay={0.1}>
        <BootcampPricing />
      </AnimatedSection>

      <AnimatedSection animation="revealSection" delay={0.2}>
        <BootcampCurriculum />
      </AnimatedSection>

      <AnimatedSection animation="scrollFadeIn" delay={0.2}>
        <PromoVideos />
      </AnimatedSection>

      <AnimatedSection animation="revealSection">
        <TestimonialBootcamp />
      </AnimatedSection>

      <AnimatedSection animation="fadeInUp" delay={0.1}>
        <FAQBootcamp />
      </AnimatedSection>

      <AnimatedSection animation="scrollFadeIn" delay={0.2}>
        <CallToAction />
      </AnimatedSection>
    </>
  )
}

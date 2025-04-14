'use client'

import { CourseList } from '@/components/home/course-list'
import { DemoVideos } from '@/components/home/demo-videos'
import { FeatureSection } from '@/components/home/feature-section'
import { HeroSection } from '@/components/home/hero-section'
import { TestimonialSection } from '@/components/home/testimonial-section'
import { StatsSection } from '@/components/home/stats-section'
import { BootcampList } from '@/components/home/bootcamp-list'

import HomeTechLogos from '@/components/home/home-tech-logos'
import HomeBlogList from '@/components/home/home-blog-list'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { fadeInUp, revealSection, scrollFadeIn } from '@/lib/micro-animations'
import { ReactNode } from 'react'

type AnimationType = 'fadeInUp' | 'revealSection' | 'scrollFadeIn'
interface AnimatedSectionProps {
  children: ReactNode
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

export default function Home() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      suppressHydrationWarning
    >
      <AnimatedSection>
        <HeroSection />
      </AnimatedSection>

      <AnimatedSection animation="revealSection" delay={0.1}>
        <FeatureSection />
      </AnimatedSection>

      <AnimatedSection animation="scrollFadeIn" delay={0.2}>
        <HomeTechLogos />
      </AnimatedSection>

      <AnimatedSection animation="fadeInUp" delay={0.1}>
        <CourseList />
      </AnimatedSection>

      <AnimatedSection animation="revealSection" delay={0.2}>
        <TestimonialSection />
      </AnimatedSection>

      <AnimatedSection animation="scrollFadeIn">
        <StatsSection />
      </AnimatedSection>

      <AnimatedSection animation="fadeInUp" delay={0.2}>
        <BootcampList />
      </AnimatedSection>

      <AnimatedSection animation="revealSection" delay={0.1}>
        <HomeBlogList />
      </AnimatedSection>

      <AnimatedSection animation="scrollFadeIn" delay={0.2}>
        <DemoVideos />
      </AnimatedSection>
    </div>
  )
}

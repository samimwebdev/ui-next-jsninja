'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ReactNode } from 'react'

type AnimationType = 'fadeInUp' | 'revealSection' | 'scrollFadeIn'

interface AnimatedSectionProps {
  children: ReactNode
  animation?: AnimationType
  delay?: number
  className?: string
}

// Animation variants
const fadeInUp = {
  hidden: {
    opacity: 0,
    y: 60,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
}

const revealSection = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: 'easeOut',
    },
  },
}

const scrollFadeIn = {
  hidden: {
    opacity: 0,
    x: -50,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: 'easeOut',
    },
  },
}

export const AnimatedSection = ({
  children,
  animation = 'fadeInUp',
  delay = 0,
  className = '',
}: AnimatedSectionProps) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '-50px 0px',
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

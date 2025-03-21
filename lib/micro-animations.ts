'use client'

import { Variants } from 'framer-motion'

// Entrance animations
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.5 },
  },
}

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5 },
  },
}

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5 },
  },
}

// Staggered animations for lists and grids
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

// Card animations
export const cardHover: Variants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.03,
    boxShadow:
      '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    transition: { duration: 0.2 },
  },
  tap: { scale: 0.98 },
}

// Button animations
export const buttonHover: Variants = {
  initial: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
}

// Icon animations
export const iconSpin: Variants = {
  initial: { rotate: 0 },
  animate: {
    rotate: 360,
    transition: { duration: 1, repeat: Infinity, ease: 'linear' },
  },
}

export const iconPulse: Variants = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.1, 1],
    transition: { duration: 1.5, repeat: Infinity },
  },
}

// Scroll-triggered animations
export const scrollFadeIn: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut' },
  },
}

export const scrollScale: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6 },
  },
}

// Section reveal animations
export const revealSection: Variants = {
  hidden: { opacity: 0, y: 75 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.165, 0.84, 0.44, 1], // cubic-bezier easing for a more natural feel
    },
  },
}

// Tab switching animations
export const tabTransition: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3 },
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: { duration: 0.3 },
  },
}

// List item animations
export const listItemAnimation: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
    },
  }),
}

// Attention-grabbing animations
export const pulseAttention: Variants = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.05, 1],
    boxShadow: [
      '0 0 0 0 rgba(var(--primary-rgb), 0)',
      '0 0 0 8px rgba(var(--primary-rgb), 0.2)',
      '0 0 0 0 rgba(var(--primary-rgb), 0)',
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatDelay: 3,
    },
  },
}

// Utility function to create staggered children animations
export const createStaggeredChildren = (
  childVariants: Variants,
  staggerDelay: number = 0.1
): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerDelay,
      delayChildren: 0.2,
    },
  },
  // Note: childVariants should be used in the component that uses this container
  // by applying them to the child elements
})

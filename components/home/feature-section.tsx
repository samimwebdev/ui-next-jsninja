'use client'
import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { cardVariants, iconVariants } from '@/lib/animation'
import DynamicIcon from '@/components/shared/DynamicIcon'

interface FeatureSectionProps {
  data: {
    title: string
    description: string
    feature: Array<{
      title: string
      icon: {
        iconName: string
        iconData: string
        width: number
        height: number
      }
      features: Array<{
        feature: string
      }>
    }>
  }
}

export const FeatureSection: React.FC<FeatureSectionProps> = ({ data }) => {
  const [isInView, setIsInView] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div className="flex items-center justify-center py-12" ref={sectionRef}>
      <div>
        <motion.h2
          className="text-4xl md:text-4xl font-black tracking-tight text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          {data.title}
        </motion.h2>
        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-screen-xl mx-auto px-6">
          {data.feature.map((feature, index) => (
            <motion.div
              key={feature.title}
              custom={index}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              variants={cardVariants}
              className="flex flex-col border rounded-xl py-6 px-5 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-accent/50"
              whileHover={{ y: -5 }}
            >
              <motion.div
                className="mb-3 h-10 w-10 flex items-center justify-center bg-muted rounded-full"
                variants={iconVariants}
              >
                <DynamicIcon icon={feature.icon} width={40} height={40} />
              </motion.div>
              <span className="text-lg font-bold tracking-tight">
                {feature.title}
              </span>
              <p className="mt-1 text-foreground/80 text-[15px]">
                {feature.features[0]?.feature || ''}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

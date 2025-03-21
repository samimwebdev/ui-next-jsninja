'use client'
import {
  Blocks,
  Bot,
  ChartPie,
  Film,
  MessageCircle,
  Settings2,
} from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { cardVariants, iconVariants } from '@/lib/animation'

const features = [
  {
    icon: Settings2,
    title: 'Customizable Layouts',
    description:
      'Design your space with drag-and-drop simplicity—create grids, lists, or galleries in seconds.',
  },
  {
    icon: Blocks,
    title: 'Interactive Widgets',
    description:
      'Embed polls, quizzes, or forms to keep your audience engaged.',
  },
  {
    icon: Bot,
    title: 'AI-Powered Tools',
    description:
      'Generate summaries, auto-format content, or translate into multiple languages seamlessly.',
  },
  {
    icon: Film,
    title: 'Media Integrations',
    description:
      'Connect with Spotify, Instagram, or your own media library for dynamic visuals and sound.',
  },
  {
    icon: ChartPie,
    title: 'Advanced Analytics',
    description:
      'Track engagement, clicks, and user activity with intuitive charts and reports.',
  },
  {
    icon: MessageCircle,
    title: 'Seamless Collaboration',
    description:
      'Comment, tag, and assign tasks directly within your documents.',
  },
]

export const FeatureSection = () => {
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
          Feature of Our Courses
        </motion.h2>
        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-screen-xl mx-auto px-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              custom={index}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={cardVariants}
              className="flex flex-col border rounded-xl py-6 px-5 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-accent/50"
              whileHover={{ y: -5 }}
            >
              <motion.div 
                className="mb-3 h-10 w-10 flex items-center justify-center bg-muted rounded-full"
                variants={iconVariants}
              >
                <feature.icon className="h-6 w-6" />
              </motion.div>
              <span className="text-lg font-bold tracking-tight">
                {feature.title}
              </span>
              <p className="mt-1 text-foreground/80 text-[15px]">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

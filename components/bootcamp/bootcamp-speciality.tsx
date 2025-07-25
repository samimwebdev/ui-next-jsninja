// thanks to oliver: https://www.youtube.com/@olivierlarose1
'use client'

import { ReactLenis } from 'lenis/react'
import { useTransform, motion, useScroll, MotionValue } from 'framer-motion'
import { useRef } from 'react'
import {
  BookOpen,
  ClipboardCheck,
  HeadphonesIcon,
  GraduationCap,
  Briefcase,
  LucideIcon,
} from 'lucide-react'
import {
  BootcampSpecialityContentSection,
  StrapiIcon,
} from '@/types/bootcamp-page-types'
import DynamicIcon from '@/components/shared/DynamicIcon'

// Default icons mapping for fallback
const getDefaultIcon = (index: number) => {
  const defaultIcons = [
    BookOpen,
    ClipboardCheck,
    HeadphonesIcon,
    GraduationCap,
    Briefcase,
    BookOpen,
  ]
  return defaultIcons[index % defaultIcons.length]
}

// Default colors for visual variety
const getDefaultColor = (index: number) => {
  const colors = ['#16357F', '#53CD99', '#6A177D', '#02a95c', '#5428B8']
  return colors[index % colors.length]
}

export const BootcampSpeciality: React.FC<{
  data: BootcampSpecialityContentSection
}> = ({ data }) => {
  const container = useRef(null)
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  })

  // Transform Strapi data to match component structure
  const sections = data.specialitySection.map((section, index) => ({
    id: section.id,
    title: section.title,
    description: section.details.replace(/<[^>]*>/g, ''), // Strip HTML tags for description
    icon: section.icon ? section.icon : null, // Use default if no icon/ Store custom icon name
    defaultIcon: getDefaultIcon(index),
    color: getDefaultColor(index),
  }))

  return (
    <ReactLenis root>
      <main ref={container} className="text-foreground bg-background">
        <section className="w-full py-12 md:py-16 lg:py-20 grid place-content-center text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl px-8 mb-6 font-semibold text-center tracking-tight leading-[120%]">
            {data.title}
          </h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto px-4">
            {data.description}
          </p>
        </section>

        <section className="w-full">
          {sections.map((section, i) => {
            const targetScale = 1 - (sections.length - i) * 0.05
            return (
              <Card
                key={`p_${i}`}
                i={i}
                icon={section.icon}
                defaultIcon={section.defaultIcon}
                title={section.title}
                color={section.color}
                description={section.description}
                progress={scrollYProgress}
                range={[i * 0.25, 1]}
                targetScale={targetScale}
              />
            )
          })}
        </section>
      </main>
    </ReactLenis>
  )
}

interface CardProps {
  i: number
  title: string
  description: string
  icon: StrapiIcon | null
  defaultIcon: LucideIcon
  color: string
  progress: MotionValue<number>
  range: [number, number]
  targetScale: number
}

export const Card: React.FC<CardProps> = ({
  i,
  title,
  description,
  icon,
  color,
  progress,
  defaultIcon: DefaultIcon,
  range,
  targetScale,
}) => {
  const container = useRef(null)
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'start start'],
  })

  // Enhanced animations
  const iconScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1.2, 1])
  const iconRotate = useTransform(scrollYProgress, [0, 1], [0, 360])
  const scale = useTransform(progress, range, [1, targetScale])
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1])

  return (
    <div
      ref={container}
      className="min-h-[600px] flex items-center justify-center sticky top-0"
    >
      <motion.div
        style={{
          backgroundColor: color,
          scale,
          top: `calc(-5vh + ${i * 25}px)`,
        }}
        className="flex flex-col relative -top-[25%] h-[450px] w-[90%] md:w-[80%] lg:w-[70%] rounded-xl p-6 md:p-8 lg:p-10 origin-top shadow-lg"
      >
        <motion.h3
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-2xl md:text-3xl text-left font-semibold text-white"
        >
          {title}
        </motion.h3>

        <div className="flex flex-col md:flex-row h-full mt-5 gap-6 md:gap-10">
          <div className="w-full md:w-[40%] relative">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-white/90 text-sm md:text-base"
            >
              {description}
            </motion.p>

            {/* <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{
                scale: 1.05,
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
              }}
              whileTap={{ scale: 0.95 }}
              className="mt-6 px-4 py-2 rounded-md text-sm font-medium bg-white/20 text-white transition-all duration-300"
            >
              Learn More
            </motion.button> */}
          </div>

          <motion.div
            className="relative w-full md:w-[60%] h-[250px] md:h-full flex items-start justify-center"
            style={{ opacity }}
          >
            <motion.div
              className="w-full h-[80%] flex items-center justify-center"
              style={{ scale: iconScale }}
            >
              <motion.div
                className="relative w-[300px] h-[300px] flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                {/* Animated background elements */}
                <motion.div
                  className="absolute w-full h-full rounded-full"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    rotate: iconRotate,
                  }}
                />
                <motion.div
                  className="absolute w-[80%] h-[80%] rounded-full"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    rotate: useTransform(iconRotate, (r) => r * -1),
                  }}
                />
                <motion.div
                  className="absolute w-[60%] h-[60%] rounded-full"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.07)',
                    rotate: iconRotate,
                  }}
                />

                {/* Floating icon animation */}
                <motion.div
                  className="relative z-10 flex items-center justify-center"
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  {icon ? (
                    <DynamicIcon
                      icon={icon}
                      className="text-white/90 drop-shadow-2xl filter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                      width={150}
                      height={150}
                    />
                  ) : (
                    <DefaultIcon
                      className="text-white/90 drop-shadow-2xl filter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                      width={150}
                      height={150}
                    />
                  )}
                </motion.div>

                {/* Particle effects */}
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.1, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  {[...Array(3)].map((_, index) => (
                    <motion.div
                      key={index}
                      className="absolute w-2 h-2 rounded-full bg-white/30"
                      animate={{
                        y: [0, -100, 0],
                        x: [0, index * 20 - 20, 0],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.5,
                        ease: 'easeInOut',
                      }}
                      style={{
                        left: `${50 + index * 10}%`,
                        top: '60%',
                      }}
                    />
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

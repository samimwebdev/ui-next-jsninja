'use client'

import { CourseTabs } from '@/components/course/course-tabs'
import { CourseContent } from '@/components/course/course-content'
import { Overview } from '@/components/course/course-overview'
import { ProjectShowcase } from '@/components/course/project-showcase'
import { ReviewSlider } from '@/components/course/review-slider'
import { CourseAuthor } from '@/components/course/course-author'
import { FAQ } from '@/components/course/faq'
import { CourseBundle } from '@/components/course/course-bundle'
import { CourseHero } from '@/components/course/course-hero'
import { CircleCheckBig } from 'lucide-react'
import { motion } from 'framer-motion'
import { fadeInUp, cardVariants, iconVariants } from '@/lib/animation'
import { useInView } from 'react-intersection-observer'
import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

export default function CourseDetailsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const slug = searchParams.get('slug')
  const [loaded, setLoaded] = useState(false)

  const handleEnrollClick = () => {
    router.push(`/checkout?courseId=${slug}`) // Navigate to checkout page with courseId parameter
  }

  // Animation refs for scroll-triggered animations
  const [overviewRef, overviewInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })
  const [contentRef, contentInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })
  const [authorRef, authorInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })
  const [reviewsRef, reviewsInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })
  const [faqRef, faqInView] = useInView({ triggerOnce: true, threshold: 0.1 })
  const [projectRef, projectInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })
  const [bundleRef, bundleInView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  // Set loaded state after initial render for entrance animations
  useEffect(() => {
    setLoaded(true)
  }, [])

  return (
    <div className="bg-background text-foreground">
      <main className="container mx-auto px-4 max-w-screen-xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 20 }}
          transition={{ duration: 0.5 }}
        >
          <CourseHero />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 order-2 md:order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: loaded ? 1 : 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <CourseTabs />
            </motion.div>

            <motion.div
              ref={overviewRef}
              initial="hidden"
              animate={overviewInView ? 'visible' : 'hidden'}
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
            >
              <Overview />
            </motion.div>

            <motion.div
              ref={contentRef}
              initial="hidden"
              animate={contentInView ? 'visible' : 'hidden'}
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
            >
              <CourseContent />
            </motion.div>

            <motion.div
              ref={authorRef}
              initial="hidden"
              animate={authorInView ? 'visible' : 'hidden'}
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
            >
              <CourseAuthor />
            </motion.div>

            <motion.div
              ref={reviewsRef}
              initial="hidden"
              animate={reviewsInView ? 'visible' : 'hidden'}
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
              id="reviews"
              className="scroll-mt-20"
            >
              <ReviewSlider />
            </motion.div>

            <motion.div
              ref={faqRef}
              initial="hidden"
              animate={faqInView ? 'visible' : 'hidden'}
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
            >
              <FAQ />
            </motion.div>

            <motion.div
              ref={projectRef}
              initial="hidden"
              animate={projectInView ? 'visible' : 'hidden'}
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
            >
              <ProjectShowcase />
            </motion.div>

            <motion.div
              ref={bundleRef}
              initial="hidden"
              animate={bundleInView ? 'visible' : 'hidden'}
              variants={fadeInUp}
              transition={{ duration: 0.5 }}
            >
              <CourseBundle />
            </motion.div>
          </div>

          <div className="lg:col-span-1 space-y-6 order-1 md:order-1 lg:order-2">
            <motion.div
              className="sticky top-4 bg-card rounded-lg p-6 shadow-lg"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: loaded ? 1 : 0, scale: loaded ? 1 : 0.95 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{
                boxShadow:
                  '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              }}
            >
              <h2 className="text-2xl font-bold mb-4">Course Features</h2>
              <ul className="space-y-3">
                {[
                  '150+ Hours of Content',
                  'Project-Based Learning',
                  'Lifetime Access',
                  '3 Months of 1:1 Support',
                ].map((feature, index) => (
                  <motion.li
                    key={index}
                    className="flex items-center"
                    initial="hidden"
                    animate="visible"
                    custom={index}
                    variants={cardVariants}
                  >
                    <motion.span className="mr-2" variants={iconVariants}>
                      <CircleCheckBig className="w-5 h-5 text-green-500" />
                    </motion.span>
                    {feature}
                  </motion.li>
                ))}
              </ul>
              <div className="mt-6">
                <motion.div
                  className="text-3xl font-bold mb-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.3 }}
                >
                  $99.99
                </motion.div>

                <motion.div
                  className="block w-full"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ delay: 0.8, duration: 0.3 }}
                >
                  <button
                    className="w-full bg-[#E91E63] text-white py-3 px-6 rounded-lg hover:bg-[#D81B60] transition-colors"
                    onClick={handleEnrollClick}
                  >
                    Enroll Now
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}

'use client'

import { CourseList } from '@/components/home/course-list'
import { DemoVideos } from '@/components/home/demo-videos'
import { FeatureSection } from '@/components/home/feature-section'
import { HeroSection } from '@/components/home/hero-section'
import { TestimonialSection } from '@/components/home/testimonial-section'
import { StatsSection } from '@/components/home/stats-section'
import { BootcampList } from '@/components/home/bootcamp-list'
import HomeTechLogos from '@/components/home/home-technology-list'
import HomeBlogList from '@/components/home/home-blog-list'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { fadeInUp, revealSection, scrollFadeIn } from '@/lib/micro-animations'
import { ReactNode, useEffect, useState } from 'react'
import qs from 'qs'
import {
  HomePageData,
  StrapiResponse,
  HeroSectionData,
  FeatureSectionData,
  TechSectionData,
  CourseSectionData,
  ReviewSectionData,
  StatsSectionData,
  BlogSectionData,
  VideoSectionData,
} from '@/types/strapi'

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

// Define a union type for all possible component types
type ComponentType =
  | 'hero-layout.hero-layout'
  | 'home-layout.platform-feature'
  | 'technology-layout.technology-layout'
  | 'home-layout.feature-course'
  | 'review-layout.review-layout'
  | 'home-layout.home-stats'
  | 'home-layout.feature-post'
  | 'demo-videos-layout.demo-videos'

// Type mapping for component types to their data types
type ComponentDataMap = {
  'hero-layout.hero-layout': HeroSectionData
  'home-layout.platform-feature': FeatureSectionData
  'technology-layout.technology-layout': TechSectionData
  'home-layout.feature-course': CourseSectionData
  'review-layout.review-layout': ReviewSectionData
  'home-layout.home-stats': StatsSectionData
  'home-layout.feature-post': BlogSectionData
  'demo-videos-layout.demo-videos': VideoSectionData
}

export default function Home() {
  const [homeData, setHomeData] = useState<HomePageData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const query = qs.stringify(
          {
            populate: {
              homeSection: {
                populate: {
                  courses: {
                    populate: ['featureImage'],
                  },
                  feature: {
                    populate: ['icon', 'features'],
                  },
                  techIconContent: {
                    populate: ['icon'],
                  },
                  reviews: {
                    populate: ['profile', 'course'],
                  },
                  blogs: {
                    populate: ['thumbnail'],
                  },
                  statsCounter: {
                    populate: ['icon'],
                  },
                  video: true,
                  browseVideosBtn: {
                    populate: ['btnIcon'],
                  },
                },
              },
            },
          },
          {
            encodeValuesOnly: true,
          }
        )

        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
          }/api/home?${query}`
        )

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const result: StrapiResponse<HomePageData> = await response.json()

        if (result.data) {
          setHomeData(result.data)
        } else {
          setError('No home page data found')
        }
      } catch (error) {
        console.error('Error fetching home data:', error)
        setError(
          error instanceof Error ? error.message : 'Failed to fetch data'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchHomeData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (error || !homeData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Error: {error || 'No data found'}</div>
      </div>
    )
  }

  // Simplified helper function with proper typing
  const getSectionData = <T extends ComponentType>(
    componentType: T
  ): ComponentDataMap[T] | undefined => {
    return homeData.homeSection.find(
      (section): section is ComponentDataMap[T] =>
        section.__component === componentType
    ) as ComponentDataMap[T] | undefined
  }

  const heroData = getSectionData('hero-layout.hero-layout')
  const featureData = getSectionData('home-layout.platform-feature')
  const techData = getSectionData('technology-layout.technology-layout')
  const courseData = getSectionData('home-layout.feature-course')
  const reviewData = getSectionData('review-layout.review-layout')
  const statsData = getSectionData('home-layout.home-stats')
  const blogData = getSectionData('home-layout.feature-post')
  const videoData = getSectionData('demo-videos-layout.demo-videos')

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      suppressHydrationWarning
    >
      {heroData && (
        <AnimatedSection>
          <HeroSection data={heroData} />
        </AnimatedSection>
      )}

      {featureData && (
        <AnimatedSection animation="revealSection" delay={0.1}>
          <FeatureSection data={featureData} />
        </AnimatedSection>
      )}

      {techData && (
        <AnimatedSection animation="scrollFadeIn" delay={0.2}>
          <HomeTechLogos data={techData} />
        </AnimatedSection>
      )}

      {courseData && (
        <AnimatedSection animation="fadeInUp" delay={0.1}>
          <CourseList data={courseData.courses} />
        </AnimatedSection>
      )}

      {reviewData && (
        <AnimatedSection animation="revealSection" delay={0.2}>
          <TestimonialSection data={reviewData.reviews} />
        </AnimatedSection>
      )}

      {statsData && (
        <AnimatedSection animation="scrollFadeIn">
          <StatsSection data={statsData} />
        </AnimatedSection>
      )}

      <AnimatedSection animation="fadeInUp" delay={0.2}>
        <BootcampList />
      </AnimatedSection>

      {blogData && (
        <AnimatedSection animation="revealSection" delay={0.1}>
          <HomeBlogList data={blogData} />
        </AnimatedSection>
      )}

      {videoData && (
        <AnimatedSection animation="scrollFadeIn" delay={0.2}>
          <DemoVideos data={videoData} />
        </AnimatedSection>
      )}
    </div>
  )
}

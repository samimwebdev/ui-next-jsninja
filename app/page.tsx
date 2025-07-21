export const dynamic = 'force-static'

import { CourseList } from '@/components/home/course-list'
import { DemoVideos } from '@/components/home/demo-videos'
import { FeatureSection } from '@/components/home/feature-section'
import { HeroSection } from '@/components/home/hero-section'
import { TestimonialSection } from '@/components/home/testimonial-section'
import { StatsSection } from '@/components/home/stats-section'
import { BootcampList } from '@/components/home/bootcamp-list'
import HomeTechLogos from '@/components/home/home-technology-list'
import HomeBlogList from '@/components/home/home-blog-list'
import { AnimatedSection } from '@/components/shared/animated-section'

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
  BootcampSectionData,
} from '@/types/homePage'

import { notFound } from 'next/navigation'

// Define component types and mapping (same as before)
type ComponentType =
  | 'hero-layout.hero-layout'
  | 'home-layout.platform-feature'
  | 'technology-layout.technology-layout'
  | 'home-layout.feature-course'
  | 'home-layout.feature-bootcamp'
  | 'review-layout.review-layout'
  | 'home-layout.home-stats'
  | 'home-layout.feature-post'
  | 'demo-videos-layout.demo-videos'

type ComponentDataMap = {
  'hero-layout.hero-layout': HeroSectionData
  'home-layout.platform-feature': FeatureSectionData
  'technology-layout.technology-layout': TechSectionData
  'home-layout.feature-course': CourseSectionData
  'home-layout.feature-bootcamp': BootcampSectionData
  'review-layout.review-layout': ReviewSectionData
  'home-layout.home-stats': StatsSectionData
  'home-layout.feature-post': BlogSectionData
  'demo-videos-layout.demo-videos': VideoSectionData
}

// Server-side data fetching function
async function getHomeData(): Promise<HomePageData> {
  const baseUrl = process.env.STRAPI_URL

  try {
    const response = await fetch(`${baseUrl}/api/home`, {
      // Enable ISR (Incremental Static Regeneration)
      next: {
        revalidate: 3600, // Revalidate every hour
      },
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result: StrapiResponse<HomePageData> = await response.json()

    if (!result.data) {
      throw new Error('No home page data found')
    }

    return result.data
  } catch (error) {
    console.error('Error fetching home data:', error)
    throw error
  }
}

// Helper function to extract section data
function getSectionData<T extends ComponentType>(
  homeData: HomePageData,
  componentType: T
): ComponentDataMap[T] | undefined {
  const sections = Array.isArray(homeData.homeSection)
    ? homeData.homeSection
    : homeData.homeSection
    ? [homeData.homeSection]
    : []

  return sections.find(
    (section): section is ComponentDataMap[T] =>
      section.__component === componentType
  ) as ComponentDataMap[T] | undefined
}

// Main Server Component
export default async function Home() {
  let homeData: HomePageData

  try {
    homeData = await getHomeData()
  } catch (error) {
    console.error('Failed to fetch home data:', error)
    notFound() // This will show your 404 page
  }

  // Extract section data
  const heroData = getSectionData(homeData, 'hero-layout.hero-layout')
  const featureData = getSectionData(homeData, 'home-layout.platform-feature')
  const techData = getSectionData(
    homeData,
    'technology-layout.technology-layout'
  )
  const courseData = getSectionData(homeData, 'home-layout.feature-course')
  const bootcampData = getSectionData(homeData, 'home-layout.feature-bootcamp')
  const reviewData = getSectionData(homeData, 'review-layout.review-layout')
  const statsData = getSectionData(homeData, 'home-layout.home-stats')
  const blogData = getSectionData(homeData, 'home-layout.feature-post')
  const videoData = getSectionData(homeData, 'demo-videos-layout.demo-videos')

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          <CourseList data={courseData} />
        </AnimatedSection>
      )}

      {reviewData && (
        <AnimatedSection animation="revealSection" delay={0.2}>
          <TestimonialSection data={reviewData} />
        </AnimatedSection>
      )}

      {statsData && (
        <AnimatedSection animation="scrollFadeIn">
          <StatsSection data={statsData} />
        </AnimatedSection>
      )}

      {bootcampData && (
        <AnimatedSection animation="fadeInUp" delay={0.1}>
          <BootcampList data={bootcampData} />
        </AnimatedSection>
      )}

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

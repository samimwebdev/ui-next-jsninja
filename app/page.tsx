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
import { generateSEOMetadata } from '@/lib/seo'
import { StructuredData } from '@/components/seo/structured-data'

import { HomePageData } from '@/types/home-page-types'

import { notFound } from 'next/navigation'
import { strapiFetch } from '@/lib/strapi'

import { ComponentType, ComponentDataMap } from '@/types/home-page-types'

// Server-side data fetching function
async function getHomeData(): Promise<HomePageData> {
  try {
    const response = await strapiFetch<{ data: HomePageData }>(`/api/home`, {
      // Enable ISR (Incremental Static Regeneration)
      next: {
        revalidate: 3600, // Revalidate every hour
        tags: ['home-page'], // Optional: cache tags for better cache management
      },
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'force-cache',
    })

    if (!response) {
      throw new Error('No home page data found')
    }

    return response.data
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

// Generate metadata for SEO
export async function generateMetadata() {
  try {
    const homeData = await getHomeData()

    return generateSEOMetadata(
      homeData?.seo,
      {
        title: 'Home - JavaScript Ninja',
      },
      {
        path: '/',
        type: 'website',
      }
    )
  } catch (error) {
    console.error('Error generating metadata:', error)
    return generateSEOMetadata() // Returns default metadata
  }
}

// Main Server Component
export default async function Home() {
  let homeData: HomePageData

  try {
    homeData = await getHomeData()
  } catch (error) {
    console.error('Failed to fetch home data:', error)
    notFound()
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
    <>
      <StructuredData seoData={homeData.seo} />

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
    </>
  )
}

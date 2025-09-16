import { Suspense } from 'react'
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
import {
  SectionSkeleton,
  CarouselSkeleton,
} from '@/components/ui/home-section-skeleton'

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

// Main Server Component with Suspense boundaries
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
        {/* Hero Section - Critical above the fold, no suspense needed */}
        {heroData && (
          <AnimatedSection>
            <HeroSection data={heroData} />
          </AnimatedSection>
        )}

        {/* Feature Section - Wrapped in Suspense */}
        {featureData && (
          <Suspense
            fallback={<SectionSkeleton height="h-64" showCards={false} />}
          >
            <AnimatedSection animation="revealSection" delay={0.1}>
              <FeatureSection data={featureData} />
            </AnimatedSection>
          </Suspense>
        )}

        {/* Tech Logos - Wrapped in Suspense */}
        {techData && (
          <Suspense
            fallback={
              <SectionSkeleton
                height="h-32"
                showTitle={true}
                showCards={false}
              />
            }
          >
            <AnimatedSection animation="scrollFadeIn" delay={0.2}>
              <HomeTechLogos data={techData} />
            </AnimatedSection>
          </Suspense>
        )}

        {/* Course List - Wrapped in Suspense */}
        {courseData && (
          <Suspense fallback={<CarouselSkeleton />}>
            <AnimatedSection animation="fadeInUp" delay={0.1}>
              <CourseList data={courseData} />
            </AnimatedSection>
          </Suspense>
        )}

        {/* Bootcamp List - Wrapped in Suspense */}
        {bootcampData && (
          <Suspense fallback={<SectionSkeleton height="h-96" cardsCount={3} />}>
            <AnimatedSection animation="fadeInUp" delay={0.1}>
              <BootcampList data={bootcampData} />
            </AnimatedSection>
          </Suspense>
        )}

        {/* Testimonial Section - Wrapped in Suspense */}
        {reviewData && (
          <Suspense
            fallback={<SectionSkeleton height="h-80" showCards={false} />}
          >
            <AnimatedSection animation="revealSection" delay={0.2}>
              <TestimonialSection data={reviewData} />
            </AnimatedSection>
          </Suspense>
        )}

        {/* Stats Section - Wrapped in Suspense */}
        {statsData && (
          <Suspense
            fallback={<SectionSkeleton height="h-64" showCards={false} />}
          >
            <AnimatedSection animation="scrollFadeIn">
              <StatsSection data={statsData} />
            </AnimatedSection>
          </Suspense>
        )}

        {/* Blog List - Wrapped in Suspense */}
        {blogData && (
          <Suspense fallback={<SectionSkeleton height="h-96" cardsCount={3} />}>
            <AnimatedSection animation="revealSection" delay={0.1}>
              <HomeBlogList data={blogData} />
            </AnimatedSection>
          </Suspense>
        )}

        {/* Demo Videos - Wrapped in Suspense */}
        {videoData && (
          <Suspense
            fallback={<SectionSkeleton height="h-96" showCards={false} />}
          >
            <AnimatedSection animation="scrollFadeIn" delay={0.2}>
              <DemoVideos data={videoData} />
            </AnimatedSection>
          </Suspense>
        )}
      </div>
    </>
  )
}

import { getCourseData } from '@/lib/course'
import {
  getCourseContentSection,
  getHighlightFeatures,
} from '@/lib/course-utils'
import { generateSEOMetadata } from '@/lib/seo'
import { StructuredData } from '@/components/seo/structured-data'
import { CourseHero } from '@/components/course/course-hero'
import { CourseTabs } from '@/components/course/course-tabs'
import { Overview } from '@/components/course/course-overview'
import { CourseCurriculum } from '@/components/course/course-curriculum'
import { CourseAuthor } from '@/components/course/course-author'
import { ReviewSlider } from '@/components/course/review-slider'
import { FAQ } from '@/components/course/faq'
import { ProjectShowcase } from '@/components/course/project-showcase'
import { CourseBundle } from '@/components/course/course-bundle'
import { CourseSidebar } from '@/components/course/course-sidebar'
import { AnimatedSection } from '@/components/shared/animated-section'
import { notFound } from 'next/navigation'
import { CoursePageData } from '@/types/course-page-types'

interface CoursePageProps {
  params: Promise<{
    slug: string
  }>
}

// Generate metadata for SEO
export async function generateMetadata({ params }: CoursePageProps) {
  const { slug } = await params
  try {
    const courseData = await getCourseData(slug)

    return generateSEOMetadata(
      courseData.baseContent?.seo,
      {
        title: courseData.baseContent?.title || courseData.courseName,
      },
      {
        path: `/courses/${slug}`,
        type: 'article',
      }
    )
  } catch (error) {
    console.error('Error generating course metadata:', error)
    return generateSEOMetadata(
      undefined,
      { title: 'Course Not Found' },
      { path: `/courses/${slug}` }
    )
  }
}

// Server Component
export default async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params
  let courseData: CoursePageData

  try {
    courseData = await getCourseData(slug)
  } catch (error) {
    console.error('Failed to fetch course data:', error)
    notFound()
  }

  // Extract section data
  const heroData = getCourseContentSection(
    courseData,
    'hero-layout.hero-layout'
  )
  const projectData = getCourseContentSection(
    courseData,
    'project-layout.project-layout'
  )
  const reviewData = getCourseContentSection(
    courseData,
    'review-layout.review-layout'
  )
  const authorData = getCourseContentSection(
    courseData,
    'author-layout.author-layout'
  )
  const courseBundleData = getCourseContentSection(
    courseData,
    'course-layout.course-bundle-layout'
  )
  const faqData = getCourseContentSection(courseData, 'faq-layout.faq-section')

  // Format data for components
  const courseInfo = {
    title: courseData.baseContent?.title || courseData.courseName,
    price: courseData.baseContent?.price || 0,
    features: getHighlightFeatures(courseData),
    slug: slug,
  }

  return (
    <>
      <StructuredData seoData={courseData.baseContent?.seo} />

      <div className="bg-background text-foreground">
        <main className="container mx-auto px-4 max-w-screen-xl">
          {/* Hero Section - Server Component with Animation Wrapper */}
          <AnimatedSection animation="fadeInUp" delay={0.1} className="mb-8">
            {heroData && <CourseHero data={heroData} />}
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 order-2 md:order-2 lg:order-1">
              {/* Course Tabs - Server Component with Animation */}
              <AnimatedSection
                animation="fadeInUp"
                delay={0.2}
                className="mb-8"
              >
                <CourseTabs data={courseData} />
              </AnimatedSection>

              {/* Overview Section */}
              <AnimatedSection animation="fadeInUp" delay={0.3}>
                <Overview data={courseData.overviewFeatures} />
              </AnimatedSection>

              {/* Curriculum Section */}
              <AnimatedSection animation="fadeInUp" delay={0.4}>
                <CourseCurriculum data={courseData.baseContent?.curriculum} />
              </AnimatedSection>

              {/* Author Section */}
              {authorData && (
                <AnimatedSection animation="fadeInUp" delay={0.5}>
                  <CourseAuthor data={authorData} />
                </AnimatedSection>
              )}

              {/* Review Section */}
              {reviewData && (
                <AnimatedSection animation="revealSection" delay={0.6}>
                  <ReviewSlider data={reviewData} />
                </AnimatedSection>
              )}

              {/* FAQ Section */}
              {faqData && (
                <AnimatedSection animation="fadeInUp" delay={0.7}>
                  <FAQ data={faqData} />
                </AnimatedSection>
              )}

              {/* Project Section */}
              {projectData && (
                <AnimatedSection animation="scrollFadeIn" delay={0.8}>
                  <ProjectShowcase data={projectData} />
                </AnimatedSection>
              )}

              {/* Course Bundle Section */}
              {courseData.baseContent?.courseBundles && (
                <AnimatedSection animation="fadeInUp" delay={0.9}>
                  <CourseBundle data={courseBundleData} />
                </AnimatedSection>
              )}
            </div>

            {/* Sidebar - Client Component for Interactivity */}
            <div className="lg:col-span-1 space-y-6 order-1 md:order-1 lg:order-2">
              <AnimatedSection
                animation="fadeInUp"
                delay={0.3}
                className="sticky top-4"
              >
                <CourseSidebar courseInfo={courseInfo} slug={slug} />
              </AnimatedSection>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

// Generate static params for SSG (optional)
export async function generateStaticParams() {
  // You can fetch course slugs here for SSG
  // For now, we'll use ISR
  return []
}

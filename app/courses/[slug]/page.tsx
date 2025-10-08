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
import { CourseAuthor } from '@/components/shared/course-author'
import { ReviewSlider } from '@/components/course/review-slider'
import { CourseFAQ } from '@/components/course/course-faq'
import { ProjectShowcase } from '@/components/course/project-showcase'
import { CourseBundle } from '@/components/course/course-bundle'
import { CoursePriceSidebar } from '@/components/course/course-price-sidebar'
import { AnimatedSection } from '@/components/shared/animated-section'

import { Curriculum } from '@/types/shared-types'
import { CoursePageData } from '@/types/course-page-types'
import { strapiFetch } from '@/lib/strapi'
import { CourseTracking } from '@/components/course/course-tracking'
import CourseNotFound from '@/components/shared/not-found'

interface CoursePageProps {
  params: Promise<{
    slug: string
  }>
}

// export const dynamic = 'force-static' // Ensure the page is server-side rendered on each request
// export const revalidate = 3600 // Revalidate every hour
// Generate static params for all course pages
export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
  try {
    // Fetch all course slugs - data structure is different than expected
    const response = await strapiFetch<{
      data: {
        course: Array<{
          slug: string
          title: string
          isRegistrationEnabled?: boolean
          courseType?: string
        }>
        bootcamp: Array<{
          slug: string
          title: string
          isRegistrationEnabled?: boolean
          courseType?: string
        }>
        courseBundle: Array<{
          slug: string
          title: string
        }>
      }
    }>('/api/courses', {
      next: {
        revalidate: 3600, // Revalidate every hour
      },
    })

    if (!response?.data?.course) {
      console.warn('No course data found for static generation')
      return []
    }

    // Filter and extract slugs from course array
    const validCourses = response.data.course.filter((course) => {
      const hasSlug = course.slug

      if (!hasSlug) {
        console.warn(`Course "${course.title || 'Unknown'}" missing slug`)
        return false
      }

      return hasSlug
    })

    console.log(
      `✅ Generating ${validCourses.length} course pages out of ${response.data.course.length} total`
    )

    return validCourses.map((course) => {
      return {
        slug: course.slug, // Direct access to slug property
      }
    })
  } catch (error) {
    console.error(
      '❌ Error fetching course slugs for static generation:',
      error
    )
    return []
  }
}

// Helper function to sanitize curriculum data
const sanitizeCurriculumData = (curriculum: Curriculum): Curriculum => {
  if (!curriculum?.modules) return curriculum

  const sanitizedModules = curriculum.modules.map((module) => ({
    ...module,
    lessons: module.lessons?.map((lesson) => ({
      ...lesson,
      // Remove videoUrl for non-free lessons
      videoUrl: lesson.isFree ? lesson.videoUrl : undefined,
    })),
  }))

  return {
    ...curriculum,
    modules: sanitizedModules,
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: CoursePageProps) {
  const { slug } = await params
  try {
    const courseData = await getCourseData(slug)
    if (!courseData) {
      console.error('❌ No course data found for metadata')
      //fall seo data
      return generateSEOMetadata(
        undefined,
        { title: 'Course Not Found' },
        { path: `/courses/${slug}` }
      )
    }

    return generateSEOMetadata(
      courseData.baseContent?.seo,
      {
        title: courseData.baseContent?.title,
      },
      {
        path: `/courses/${slug}`,
        type: 'article',
      }
    )
  } catch (error) {
    console.error('❌ Error generating course metadata:', error)
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
  console.log('🔥 Statically generating course page for:', slug)

  let courseData: CoursePageData | null = null

  try {
    courseData = await getCourseData(slug)

    if (!courseData) {
      console.error('❌ No course data found, rendering 404')
      return <CourseNotFound courseType="course" />
    }
  } catch (error) {
    console.error('❌ Failed to fetch course data:', error)
    // 🔑 Do not swallow notFound error
    throw error // ✅ crash → error.tsx (not stuck nav)
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

  // Sanitize curriculum data to remove video URLs for non-free lessons
  const sanitizedCurriculum = courseData.baseContent?.curriculum
    ? sanitizeCurriculumData(courseData.baseContent.curriculum)
    : undefined

  // Format data for components
  const courseInfo = {
    title: courseData.baseContent?.title || courseData.courseName,
    slug: slug,
    price: courseData.baseContent?.price || 0,
    features: getHighlightFeatures(courseData),
    courseType: courseData.baseContent?.courseType,
    isRegistrationOpen: courseData.baseContent?.isRegistrationEnabled || false,
    endDate: courseData.baseContent?.endDate || null,
    actualPrice: courseData.baseContent?.actualPrice || null,
  }

  return (
    <>
      <StructuredData seoData={courseData.baseContent?.seo} />
      <CourseTracking {...courseInfo} />

      <div className="bg-background text-foreground">
        <main className="container mx-auto px-4 max-w-screen-xl">
          {/* Hero Section - Server Component with Animation Wrapper */}
          {heroData && (
            <AnimatedSection animation="fadeInUp" delay={0.1} className="mb-8">
              <CourseHero data={heroData} courseInfo={courseInfo} />
            </AnimatedSection>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            {courseData && (
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
                {courseData.overviewFeatures && (
                  <AnimatedSection animation="fadeInUp" delay={0.3}>
                    <Overview data={courseData.overviewFeatures} />
                  </AnimatedSection>
                )}

                {/* Curriculum Section - Using sanitized data */}
                {sanitizedCurriculum && (
                  <AnimatedSection animation="fadeInUp" delay={0.4}>
                    <CourseCurriculum
                      data={sanitizedCurriculum}
                      courseType={courseInfo.courseType}
                    />
                  </AnimatedSection>
                )}

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
                    <CourseFAQ data={faqData} />
                  </AnimatedSection>
                )}

                {/* Project Section */}
                {projectData && (
                  <AnimatedSection animation="scrollFadeIn" delay={0.8}>
                    <ProjectShowcase data={projectData} />
                  </AnimatedSection>
                )}

                {/* Course Bundle Section */}
                {courseBundleData && (
                  <AnimatedSection animation="fadeInUp" delay={0.9}>
                    <CourseBundle
                      data={courseBundleData}
                      courseInfo={courseInfo}
                    />
                  </AnimatedSection>
                )}
              </div>
            )}

            {/* Sidebar - Client Component for Interactivity */}
            <div className="lg:col-span-1 space-y-6 order-1 md:order-1 lg:order-2">
              <AnimatedSection
                animation="fadeInUp"
                delay={0.3}
                className="sticky top-4"
              >
                <CoursePriceSidebar courseInfo={courseInfo} />
              </AnimatedSection>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

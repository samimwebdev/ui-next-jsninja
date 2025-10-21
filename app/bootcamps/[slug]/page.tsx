import { BootcampHero } from '@/components/bootcamp/bootcamp-hero'
import { BootcampProjectShowcase } from '@/components/bootcamp/project-showcase/bootcamp-project-showcase'
import { BootcampSpeciality } from '@/components/bootcamp/bootcamp-speciality'
import { PromoVideosLazy } from '@/components/bootcamp/promo-videos/promo-videos-lazy'
import { BatchSchedule } from '@/components/bootcamp/next-batch-schedule'
import { BootcampOverview } from '@/components/bootcamp/bootcamp-overview'
import FAQBootcamp from '@/components/bootcamp/faq-bootcamp'
import TestimonialBootcamp from '@/components/bootcamp/testimonial-bootcamp'
import { BootcampLogoSlider } from '@/components/bootcamp/bootcamp-logo-slider'
import CallToAction from '@/components/shapexui/cta'
import BootcampSteps from '@/components/shapexui/steps'
import { BootcampPricing } from '@/components/bootcamp/bootcamp-pricing'
import { BootcampCurriculum } from '@/components/bootcamp/bootcamp-curriculum'
import { AnimatedSection } from '@/components/shared/animated-section'
import { getBootcampContentSection } from '@/lib/bootcamp-utils'
import { getBootcampData } from '@/lib/bootcamp'
import { BootcampAuthor } from '@/components/bootcamp/bootcamp-author'
import { generateSEOMetadata } from '@/lib/seo'
import { BootcampPageData } from '@/types/bootcamp-page-types'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { PromoVideosSkeleton } from '@/components/bootcamp/promo-videos/promo-videos-lazy'
// import { strapiFetch } from '@/lib/strapi'
import { CourseTracking } from '@/components/course/course-tracking'
import CourseNotFound from '@/components/shared/not-found'
import { getEnrolledUsers } from '@/lib/actions/enrolled-users'
import { EnrolledUsersResponse } from '@/types/enrolled-users'

interface BootcampPageProps {
  params: Promise<{
    slug: string
  }>
}

// Generate static params for all bootcamp pages
// export async function generateStaticParams(): Promise<Array<{ slug: string }>> {
//   try {
//     // Fetch all bootcamp slugs from baseContent
//     const response = await strapiFetch<{
//       data: Array<{
//         baseContent: {
//           slug: string
//         }
//       }>
//     }>(
//       '/api/bootcamps?populate[baseContent][fields][0]=slug&pagination[limit]=100',
//       {
//         next: {
//           revalidate: 3600, // Revalidate every hour
//         },
//       }
//     )

//     if (!response?.data) {
//       console.warn('No bootcamp data found for static generation')
//       return []
//     }

//     // Extract slug from baseContent
//     return response.data
//       .filter((bootcamp) => bootcamp.baseContent?.slug) // Filter out any without slugs
//       .map((bootcamp) => ({
//         slug: bootcamp.baseContent.slug,
//       }))
//   } catch (error) {
//     console.error('Error fetching bootcamp slugs for static generation:', error)
//     return []
//   }
// }

// Generate metadata for SEO
export async function generateMetadata({ params }: BootcampPageProps) {
  const { slug } = await params
  try {
    let bootcampData: BootcampPageData
    try {
      bootcampData = await getBootcampData(slug)
    } catch (error) {
      console.error('Error fetching bootcamp data for metadata:', error)
      notFound()
    }

    return generateSEOMetadata(
      bootcampData.baseContent?.seo,
      {
        title: bootcampData.baseContent?.title,
      },
      {
        path: `/bootcamps/${slug}`,
        type: 'article',
      }
    )
  } catch (error) {
    console.error('Error generating bootcamp metadata:', error)
    return generateSEOMetadata(
      undefined,
      { title: 'Bootcamp Not Found' },
      { path: `/bootcamps/${slug}` }
    )
  }
}

export default async function BootcampPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  // Await params before using its properties
  const { slug } = await params
  let bootcampData: BootcampPageData
  let enrolledUsersData: EnrolledUsersResponse
  try {
    bootcampData = await getBootcampData(slug)

    if (!bootcampData) {
      console.error('❌ No bootcamp data found, rendering 404')
      return <CourseNotFound courseType="bootcamp" />
    }
    enrolledUsersData = await getEnrolledUsers(
      bootcampData?.baseContent?.documentId
    )
  } catch (error) {
    console.error('Error fetching bootcamp data:', error)
    return <CourseNotFound courseType="bootcamp" />
  }
  // Extract content sections from contentBlock
  const overviewData = getBootcampContentSection(
    bootcampData,
    'bootcamp-layout.overview'
  )
  const pricingData = getBootcampContentSection(
    bootcampData,
    'bootcamp-layout.pricing-package'
  )
  const scheduleData = getBootcampContentSection(
    bootcampData,
    'bootcamp-layout.batch-schedule'
  )
  const stepsData = getBootcampContentSection(
    bootcampData,
    'bootcamp-layout.bootcamp-steps'
  )
  const specialityData = getBootcampContentSection(
    bootcampData,
    'bootcamp-layout.bootcamp-speciality'
  )
  const logoSliderData = getBootcampContentSection(
    bootcampData,
    'technology-layout.technology-layout'
  )
  const callToActionData = getBootcampContentSection(
    bootcampData,
    'bootcamp-layout.call-to-action'
  )

  const assessmentData = bootcampData.assessmentQuiz || []

  // Extract data from baseContent.contentSection (project showcase and FAQ)
  const projectShowcaseData = bootcampData.baseContent.contentSection?.find(
    (section) => section.__component === 'project-layout.project-layout'
  )
  const faqData = bootcampData.baseContent.contentSection?.find(
    (section) => section.__component === 'faq-layout.faq-section'
  )
  const heroData = bootcampData.baseContent.contentSection?.find(
    (section) => section.__component === 'hero-layout.hero-layout'
  )
  const authorData = bootcampData.baseContent.contentSection?.find(
    (section) => section.__component === 'author-layout.author-layout'
  )
  const demoVideosData = bootcampData.baseContent.contentSection?.find(
    (section) => section.__component === 'demo-videos-layout.demo-videos'
  )
  const reviewData = bootcampData.baseContent.contentSection?.find(
    (section) => section.__component === 'review-layout.review-layout'
  )

  const totalStudents = bootcampData.baseContent?.totalStudents || 0

  const courseInfo = {
    title: bootcampData.baseContent?.title,
    slug: bootcampData.baseContent?.slug,
    price: bootcampData.baseContent?.price,
    courseType: bootcampData.baseContent?.courseType,
    isRegistrationOpen: bootcampData.baseContent?.isRegistrationEnabled ?? true,
    isLiveRegistrationAvailable:
      bootcampData.baseContent?.isLiveRegistrationAvailable,
    isRecordedRegistrationAvailable:
      bootcampData.baseContent?.isRecordedRegistrationAvailable,
    liveBootcampPrice: bootcampData.baseContent?.liveBootcampPrice,
    endDate: bootcampData.baseContent?.endDate,
    actualPrice: bootcampData.baseContent?.actualPrice || null,
  }

  return (
    <>
      <CourseTracking {...courseInfo} />
      {heroData && (
        <BootcampHero
          data={heroData}
          assessmentData={assessmentData}
          courseInfo={courseInfo}
          enrolledUsersData={enrolledUsersData || []}
          totalStudents={totalStudents}
        />
      )}

      {overviewData && (
        <AnimatedSection animation="fadeInUp" delay={0.1}>
          <BootcampOverview data={overviewData} />
        </AnimatedSection>
      )}

      {scheduleData && (
        <AnimatedSection animation="scrollFadeIn" delay={0.1}>
          <BatchSchedule data={scheduleData} />
        </AnimatedSection>
      )}

      {stepsData && (
        <AnimatedSection animation="revealSection" delay={0.2}>
          <BootcampSteps data={stepsData} />
        </AnimatedSection>
      )}

      {specialityData && (
        <AnimatedSection animation="fadeInUp" delay={0.2}>
          <BootcampSpeciality data={specialityData} />
        </AnimatedSection>
      )}

      {logoSliderData && (
        <AnimatedSection animation="scrollFadeIn">
          <BootcampLogoSlider data={logoSliderData} />
        </AnimatedSection>
      )}

      {projectShowcaseData && (
        <AnimatedSection animation="revealSection" delay={0.2}>
          <BootcampProjectShowcase data={projectShowcaseData} />
        </AnimatedSection>
      )}

      {pricingData && (
        <AnimatedSection animation="fadeInUp" delay={0.1}>
          <BootcampPricing data={pricingData} courseInfo={courseInfo} />
        </AnimatedSection>
      )}

      {bootcampData?.baseContent?.curriculum && (
        <AnimatedSection animation="revealSection" delay={0.2}>
          <BootcampCurriculum data={bootcampData.baseContent.curriculum} />
        </AnimatedSection>
      )}

      {demoVideosData && (
        <AnimatedSection animation="scrollFadeIn" delay={0.2}>
          <Suspense fallback={<PromoVideosSkeleton />}>
            <PromoVideosLazy data={demoVideosData} />
          </Suspense>
        </AnimatedSection>
      )}

      {authorData && (
        <AnimatedSection animation="fadeInUp" delay={0.1}>
          <BootcampAuthor data={authorData} />
        </AnimatedSection>
      )}

      {reviewData && (
        <AnimatedSection animation="revealSection" delay={0.2}>
          <TestimonialBootcamp data={reviewData} />
        </AnimatedSection>
      )}

      {faqData && (
        <AnimatedSection animation="fadeInUp" delay={0.1}>
          <FAQBootcamp data={faqData} />
        </AnimatedSection>
      )}

      {callToActionData && (
        <AnimatedSection animation="scrollFadeIn" delay={0.2}>
          <CallToAction data={callToActionData} courseInfo={courseInfo} />
        </AnimatedSection>
      )}
    </>
  )
}

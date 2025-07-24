import { BootcampHero } from '@/components/bootcamp/bootcamp-hero'
import { BootcampProjectShowcase } from '@/components/bootcamp/project-showcase/bootcamp-project-showcase'
import { BootcampSpeciality } from '@/components/bootcamp/bootcamp-speciality'
import { PromoVideos } from '@/components/bootcamp/promo-videos'
import { BatchSchedule } from '@/components/bootcamp/next-batch-schedule'
import { BootcampOverview } from '@/components/bootcamp/bootcamp-overview'
import FAQBootcamp from '@/components/bootcamp/faq/faq-bootcamp'
import TestimonialBootcamp from '@/components/bootcamp/testimonial-bootcamp'
import { BootcampLogoSlider } from '@/components/bootcamp/bootcamp-logo-slider'
import CallToAction from '@/components/shapexui/cta'
import BootcampSteps from '@/components/shapexui/steps'
import { BootcampPricing } from '@/components/bootcamp/bootcamp-pricing'
import { BootcampCurriculum } from '@/components/bootcamp/bootcamp-curriculum'
import { AnimatedSection } from '@/components/shared/animated-section'
import { BootcampPageData } from '@/types/bootcamp-page-types'
import { getBootcampContentSection } from '@/lib/bootcamp-utils'
import { getBootcampData } from '@/lib/bootcamp'
import { CourseAuthor } from '@/components/shared/course-author'

export default async function BootcampPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  // Await params before using its properties
  const { slug } = await params

  const bootcampData: BootcampPageData = await getBootcampData(slug)

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

  return (
    <>
      {heroData && (
        <BootcampHero
          data={heroData}
          assessmentData={assessmentData}
          slug={slug}
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
          <BootcampPricing data={pricingData} />
        </AnimatedSection>
      )}

      {bootcampData?.baseContent?.curriculum && (
        <AnimatedSection animation="revealSection" delay={0.2}>
          <BootcampCurriculum data={bootcampData.baseContent.curriculum} />
        </AnimatedSection>
      )}

      {demoVideosData && (
        <AnimatedSection animation="scrollFadeIn" delay={0.2}>
          <PromoVideos data={demoVideosData} />
        </AnimatedSection>
      )}

      {authorData && (
        <AnimatedSection animation="fadeInUp" delay={0.1}>
          <CourseAuthor data={authorData} />
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
          <CallToAction data={callToActionData} />
        </AnimatedSection>
      )}
    </>
  )
}

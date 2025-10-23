import { Badge } from '@/components/ui/badge'
import BootcampAssessment from './bootcamp-assessment'
import BootcampShortFeature from './bootcamp-short-feature'
import { HeroButtonClient } from './bootcamp-hero-client'
import {
  AssessmentQuiz,
  HeroLayoutContentSection,
} from '@/types/bootcamp-page-types'
import { VideoPlayerLazy } from '../shared/video-player-lazy'
import { AnimatedSection } from '../shared/animated-section'
import { AnimatedAvatars } from '../shared/animated-avatars'
import { CourseType } from '@/types/checkout-types'
import { Suspense } from 'react'
import { VideoPlayerSkeleton } from '../shared/video-player-lazy'
import { EnrolledUsersResponse } from '@/types/enrolled-users'

interface BootcampHeroProps {
  data: HeroLayoutContentSection
  enrolledUsersData: EnrolledUsersResponse
  assessmentData: AssessmentQuiz | null
  totalStudents: number
  courseInfo: {
    title: string
    isRegistrationOpen: boolean
    slug: string
    price: number
    courseType: CourseType
  }
}

export const BootcampHero = ({
  data,
  assessmentData,
  courseInfo,
  enrolledUsersData,
  totalStudents,
}: BootcampHeroProps) => {
  const title = data?.title || 'Javascript Bootcamp'
  const description = data?.shortDescription || 'Learn to code from scratch'
  const shortLabel = data?.shortLabel || 'Short Label'
  const videoUrl =
    data?.promoVideo || 'https://youtu.be/RGaW82k4dK4?feature=shared'
  const highlightedFeatures = data?.highlightedFeature || []

  const buttons = data?.btn || []

  // Generate enroll link from buttons data
  const enrollButton = buttons[0]
  // Assessment Button
  const assessmentButton = buttons[1]

  return (
    <div className="flex items-center justify-center w-full">
      <div className="max-w-screen-xl w-full mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12 px-4 sm:px-6 py-8 sm:py-12">
        {/* Text Content - Centered on mobile */}
        <div className="text-center lg:text-left">
          <AnimatedSection animation="fadeInUp">
            <Badge className="bg-gradient-ninja-primary rounded-full py-1 border-none">
              {shortLabel}
            </Badge>
          </AnimatedSection>

          <AnimatedSection animation="fadeInUp">
            <h1 className="mt-4 sm:mt-6 mx-auto lg:mx-0 max-w-[20ch] md:max-w-[30ch] lg:max-w-[40ch] text-5xl lg:text-[2.75rem] xl:text-5xl font-black leading-[1.1] tracking-tight">
              {title}
            </h1>
          </AnimatedSection>

          <AnimatedSection animation="fadeInUp">
            <p className="mt-4 sm:mt-6 mx-auto lg:mx-0 max-w-[60ch] text-base sm:text-lg">
              {description}
            </p>
          </AnimatedSection>

          <AnimatedSection
            animation="fadeInUp"
            className="mt-6 sm:mt-12 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4"
          >
            <HeroButtonClient
              enrollButton={enrollButton}
              courseInfo={courseInfo}
            />

            <BootcampAssessment
              btn={assessmentButton}
              data={assessmentData}
              bootcampSlug={courseInfo?.slug}
            />
          </AnimatedSection>

          <AnimatedSection className="pt-6 sm:pt-8 flex justify-center lg:justify-start">
            <AnimatedAvatars
              users={enrolledUsersData?.data || []}
              totalUsers={totalStudents || enrolledUsersData?.data.length || 0}
              avatarSize="sm"
              message="who enrolled in this bootcamp"
            />
          </AnimatedSection>
        </div>

        {/* Video */}
        <div>
          <AnimatedSection animation="fadeInUp">
            <Suspense fallback={<VideoPlayerSkeleton aspectRatio="video" />}>
              <VideoPlayerLazy
                videoUrl={videoUrl}
                aspectRatio="video"
                dataAttribute="bootcamp-hero-video"
              />
            </Suspense>
          </AnimatedSection>
          <AnimatedSection animation="fadeInUp" delay={0.5}>
            <BootcampShortFeature highlightedFeatures={highlightedFeatures} />
          </AnimatedSection>
        </div>
      </div>
    </div>
  )
}

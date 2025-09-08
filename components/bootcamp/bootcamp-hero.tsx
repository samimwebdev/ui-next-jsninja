import { Badge } from '@/components/ui/badge'
import BootcampAssessment from './bootcamp-assessment'
import BootcampShortFeature from './bootcamp-short-feature'
import { HeroButtonClient } from './bootcamp-hero-client'
import {
  AssessmentQuiz,
  HeroLayoutContentSection,
} from '@/types/bootcamp-page-types'
import { VideoPlayer } from '../shared/video-player'
import { AnimatedSection } from '../shared/animated-section'
import { AnimatedAvatars } from '../shared/animated-avatars'
import { CourseType } from '@/types/checkout-types'

interface BootcampHeroProps {
  data: HeroLayoutContentSection
  assessmentData: AssessmentQuiz | null
  courseInfo: {
    title: string
    isRegistrationOpen: boolean
    slug: string
    price: number
    courseType: CourseType
    isEnrolled: boolean
  }
}

export const BootcampHero = ({
  data,
  assessmentData,
  courseInfo,
}: BootcampHeroProps) => {
  // Extract data with fallbacks - processed on server
  const title = data?.title || 'Javascript Bootcamp'
  const description =
    data?.shortDescription ||
    'Explore a collection of Shadcn UI blocks and components, ready to preview and copy. Streamline your development workflow with easy-to-implement examples.'
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
    <div className="flex items-center justify-center">
      <div className="max-w-screen-xl w-full mx-auto grid lg:grid-cols-2 gap-12 px-6 py-12">
        <div>
          <AnimatedSection animation="fadeInUp">
            <Badge className="bg-gradient-ninja-primary rounded-full py-1 border-none">
              {shortLabel}
            </Badge>
          </AnimatedSection>

          <AnimatedSection animation="fadeInUp">
            <h1 className="mt-6 max-w-[15ch] text-5xl lg:text-[2.75rem] xl:text-5xl font-black leading-[1.1] tracking-tight">
              {title}
            </h1>
          </AnimatedSection>
          <AnimatedSection animation="fadeInUp">
            <p className="mt-6 max-w-[60ch] text-lg">{description}</p>
          </AnimatedSection>

          <AnimatedSection
            animation="fadeInUp"
            className="mt-12 flex items-center gap-4"
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

          <AnimatedSection className="pt-8 border-white/10">
            <div className="flex items-center gap-4">
              <AnimatedAvatars
                avatarCount={4}
                totalUsers={400}
                avatarSize="sm"
                message="who enrolled in this bootcamp"
              />
            </div>
          </AnimatedSection>
        </div>

        {/* Video */}
        <div>
          <AnimatedSection animation="fadeInUp">
            <VideoPlayer
              videoUrl={videoUrl}
              aspectRatio="video"
              dataAttribute="bootcamp-hero-video"
            />
          </AnimatedSection>
          <AnimatedSection animation="fadeInUp" delay={0.5}>
            <BootcampShortFeature highlightedFeatures={highlightedFeatures} />
          </AnimatedSection>
        </div>
      </div>
    </div>
  )
}

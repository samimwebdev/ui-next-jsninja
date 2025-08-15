import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import BootcampAssessment from './bootcamp-assessment'
import BootcampShortFeature from './bootcamp-short-feature'

import {
  AssessmentQuiz,
  HeroLayoutContentSection,
} from '@/types/bootcamp-page-types'
import { VideoPlayer } from '../shared/video-player'
import { AnimatedSection } from '../shared/animated-section'
import DynamicIcon from '../shared/DynamicIcon'
import { AnimatedAvatars } from '../shared/animated-avatars'

interface BootcampHeroProps {
  data: HeroLayoutContentSection
  assessmentData: AssessmentQuiz | null
  slug: string
}

export const BootcampHero = ({
  data,
  assessmentData,
  slug,
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

  const enrollLabel = enrollButton?.btnLabel || 'Enroll Now'

  return (
    <div className="flex items-center justify-center">
      <div className="max-w-screen-xl w-full mx-auto grid lg:grid-cols-2 gap-12 px-6 py-12">
        <div>
          <AnimatedSection animation="fadeInUp">
            <Badge className="bg-gradient-to-br via-70% from-primary via-muted/30 to-primary rounded-full py-1 border-none">
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
            <Button size="lg" className="rounded-full text-base">
              <DynamicIcon
                icon={
                  enrollButton?.btnIcon || {
                    iconName: 'mdi:wallet',
                    width: 24,
                    height: 24,
                    iconData: '',
                  }
                }
                className="!h-5 !w-5 transition-transform group-hover:translate-x-1"
                width={24}
                height={24}
              />
              {enrollLabel}
            </Button>

            <BootcampAssessment
              btn={assessmentButton}
              data={assessmentData}
              bootcampSlug={slug}
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

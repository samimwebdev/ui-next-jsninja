import { Badge } from '@/components/ui/badge'
import { HeroContentSection } from '@/types/course-page-types'
import { HeroCTA } from '../shared/hero-cta'
import { VideoPlayer } from '../shared/video-player'
import { CourseType } from '@/types/checkout-types'

interface CourseHeroProps {
  data: HeroContentSection
  courseInfo: {
    title: string
    slug: string
    price: number
    courseType: CourseType
    isRegistrationOpen: boolean
  }
}

export function CourseHero({ data, courseInfo }: CourseHeroProps) {
  // Extract data with fallbacks - processed on server
  const title =
    data?.title || 'Frontend Ninja: Master React & Next.js Development'
  const description =
    data?.shortDescription ||
    'Become a frontend development expert with our comprehensive course. Learn modern React, Next.js, and UI frameworks to build stunning, responsive web applications from scratch.'
  const shortLabel = data?.shortLabel || 'Updated On 15/06/2024'
  const videoUrl =
    data?.promoVideo || 'https://youtu.be/e74rB-14-m8?feature=shared'
  const posterImage = data?.promoImage?.url

  return (
    <div className="flex items-center justify-center w-full">
      <div className="max-w-screen-xl w-full mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12 px-4 sm:px-6 py-8 sm:py-12">
        {/* Text Content - Centered on mobile */}
        <div className="text-center lg:text-left">
          <Badge className="bg-gradient-ninja-primary rounded-full py-1 border-none">
            {shortLabel}
          </Badge>

          <h1 className="mt-4 sm:mt-6 mx-auto lg:mx-0 max-w-[20ch] md:max-w-[30ch] text-5xl xl:text-5xl font-black leading-[1.1] tracking-tight">
            {title}
          </h1>

          <p className="mt-4 sm:mt-6 mx-auto lg:mx-0 max-w-[60ch] text-base sm:text-lg">
            {description}
          </p>

          {/* Client component for interactive buttons only */}
          <div className="mt-6 sm:mt-8 flex justify-center lg:justify-start">
            <HeroCTA
              courseInfo={courseInfo}
              videoUrl={videoUrl}
              checkOnMount={true}
            />
          </div>
        </div>

        {/* Client component for video player */}
        <VideoPlayer
          videoUrl={videoUrl}
          posterImage={posterImage}
          aspectRatio="video"
          dataAttribute="course-hero-video"
        />
      </div>
    </div>
  )
}

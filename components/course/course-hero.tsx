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
    <div className="flex items-center justify-center">
      <div className="max-w-screen-xl w-full mx-auto grid lg:grid-cols-2 gap-12 px-6 py-12">
        {/* Server-rendered content */}
        <div>
          <Badge className="bg-gradient-ninja-primary rounded-full py-1 border-none">
            {shortLabel}
          </Badge>

          <h1 className="mt-6 max-w-[500px] text-5xl lg:text-[2.75rem] xl:text-5xl font-black leading-[1.1] tracking-tight bg-">
            {title}
          </h1>

          <p className="mt-6 max-w-[60ch] text-lg">{description}</p>

          {/* Client component for interactive buttons only */}
          <HeroCTA
            courseInfo={courseInfo}
            videoUrl={videoUrl}
            checkOnMount={true}
          />
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

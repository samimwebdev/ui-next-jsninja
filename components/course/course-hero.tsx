'use client'

import { Badge } from '@/components/ui/badge'
import { HeroContentSection } from '@/types/course-page-types'
import { HeroCTA } from '../shared/hero-cta'
import { VideoPlayer } from '../shared/video-player'

interface CourseHeroProps {
  data: HeroContentSection
}

export function CourseHero({ data }: CourseHeroProps) {
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

  // Generate enroll link from buttons data
  const enrollButton = data?.btn?.find(
    (button) =>
      button.btnLabel.toLowerCase().includes('enroll') ||
      button.btnLabel.toLowerCase().includes('start')
  )
  const enrollLink = enrollButton?.btnLink || '/enroll'

  return (
    <div className="flex items-center justify-center">
      <div className="max-w-screen-xl w-full mx-auto grid lg:grid-cols-2 gap-12 px-6 py-12">
        {/* Server-rendered content */}
        <div>
          <Badge className="bg-gradient-to-br via-70% from-primary via-muted/30 to-primary rounded-full py-1 border-none">
            {shortLabel}
          </Badge>

          <h1 className="mt-6 max-w-[15ch] text-5xl lg:text-[2.75rem] xl:text-5xl font-black leading-[1.1] tracking-tight">
            {title}
          </h1>

          <p className="mt-6 max-w-[60ch] text-lg">{description}</p>

          {/* Client component for interactive buttons only */}
          <HeroCTA primaryBtnLink={enrollLink} videoUrl={videoUrl} />
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

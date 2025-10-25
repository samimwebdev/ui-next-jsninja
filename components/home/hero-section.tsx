'use client'
import { Badge } from '@/components/ui/badge'
import React from 'react'
import { HeroMarquee } from './hero-marquee'
import { HeroSectionData } from '@/types/home-page-types'
import { AnimatedAvatars } from '../shared/animated-avatars'
import { CTAButtons } from '../shared/cta-buttons'
import { useRouter } from 'next/navigation'
import { useVideo } from '../context/video-provider'
import { EnrolledUser } from '@/types/enrolled-users'

interface HeroSectionProps {
  data: HeroSectionData
  enrolledUsers: EnrolledUser[]
}

export function HeroSection({
  data: heroSectionData,
  enrolledUsers,
}: HeroSectionProps) {
  const router = useRouter()
  const { openVideo } = useVideo()

  const courses =
    Array.isArray(heroSectionData.courses) || heroSectionData.courses === null
      ? heroSectionData.courses
      : [heroSectionData.courses]

  const totalStudents = courses?.reduce(
    (total, course) => total + (course.totalStudents || 0),
    0
  )

  return (
    <div className="flex items-center justify-center w-full">
      <div className="max-w-screen-xl w-full mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12 px-4 sm:px-6 py-8 sm:py-12">
        {/* Text Content - Centered on mobile */}
        <div className="text-center lg:text-left">
          <Badge className="bg-gradient-to-br via-70% from-primary via-muted/30 to-primary rounded-full py-1 border-none">
            {heroSectionData.shortLabel}
          </Badge>

          <h1 className="mt-4 sm:mt-6 mx-auto lg:mx-0 max-w-[20ch] text-4xl md:text-5xl font-black leading-[1.1] tracking-tight text-gradient-ninja">
            {heroSectionData.title}
          </h1>

          <p className="mt-4 sm:mt-6 mx-auto lg:mx-0 max-w-[60ch] text-sm sm:text-lg">
            {heroSectionData.shortDescription}
          </p>

          <div className="mt-6 sm:mt-8 flex justify-center lg:justify-start">
            <CTAButtons
              handleClick={() => {
                router.push('/courses')
              }}
              primaryLabel="Browse Courses"
              isSecondaryBtn={true}
              secondaryLabel="Watch Preview"
              onPreviewClick={() => {
                openVideo(heroSectionData.promoVideo)
              }}
            />
          </div>

          <div className="pt-4 flex justify-center lg:justify-start">
            <AnimatedAvatars
              users={enrolledUsers}
              totalUsers={totalStudents}
              maxAvatars={4}
              avatarSize="sm"
            />
          </div>
        </div>

        {/* Marquee - Hidden on mobile, visible on md+ */}
        <div className="hidden lg:block">
          <HeroMarquee data={courses} />
        </div>
      </div>
    </div>
  )
}

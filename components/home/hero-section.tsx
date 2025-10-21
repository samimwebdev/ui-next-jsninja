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
  enrolledUsers: EnrolledUser[] // Add enrolled users prop
}

export function HeroSection({
  data: heroSectionData,
  enrolledUsers,
}: HeroSectionProps) {
  const router = useRouter()
  const { openVideo } = useVideo()

  // Ensure courses is always an array
  const courses =
    Array.isArray(heroSectionData.courses) || heroSectionData.courses === null
      ? heroSectionData.courses
      : [heroSectionData.courses]

  // Calculate total students from course Data or fallback to Enrolled Users data
  const totalStudents = courses?.reduce(
    (total, course) => total + (course.totalStudents || 0),
    0
  )

  return (
    <div className="flex items-center justify-center">
      <div className="max-w-screen-xl w-full mx-auto grid lg:grid-cols-2 gap-12 px-6 py-12">
        <div>
          <Badge className="bg-gradient-to-br via-70% from-primary via-muted/30 to-primary rounded-full py-1 border-none">
            {heroSectionData.shortLabel}
          </Badge>

          <h1 className="mt-6 max-w-[15ch] text-5xl lg:text-[2.75rem] xl:text-5xl font-black leading-[1.1] tracking-tight text-gradient-ninja">
            {heroSectionData.title}
          </h1>

          <p className="mt-6 max-w-[60ch] text-lg">
            {heroSectionData.shortDescription}
          </p>

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
            className="mt-8"
          />

          {/* Pass enrolled users to AnimatedAvatars */}
          <div className="pt-4">
            <AnimatedAvatars
              users={enrolledUsers}
              totalUsers={totalStudents}
              maxAvatars={4}
              avatarSize="sm"
            />
          </div>
        </div>

        <HeroMarquee data={courses} />
      </div>
    </div>
  )
}

'use client'

import { CTAButtons } from './cta-buttons'
import { useVideo } from '../context/video-provider'
import { useRouter } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'

interface HeroCTAProps {
  courseInfo: {
    slug: string
    courseType: string
    isRegistrationOpen: boolean
    isEnrolled: boolean
  }
  videoUrl: string
}

export function HeroCTA({ courseInfo, videoUrl }: HeroCTAProps) {
  const { openVideo } = useVideo()
  const router = useRouter()

  const { isEnrolled, isRegistrationOpen, slug, courseType } = courseInfo

  const enrollLink = `/checkout?courseSlug=${slug}&courseType=${courseType}`
  const courseViewLink = `/course-view/${slug}`
  const handleEnrollClick = async () => {
    // If user is already enrolled, go to course view
    if (isEnrolled) {
      router.push(courseViewLink)
      return
    }

    // If registration is closed, do nothing
    if (!isRegistrationOpen) return

    // Check auth for enrollment
    const isAuth = await isAuthenticated()
    if (isAuth) {
      router.push(enrollLink)
    } else {
      router.push(`/login?redirect=${encodeURIComponent(enrollLink)}`)
    }
  }

  return (
    <CTAButtons
      handleClick={handleEnrollClick}
      className="mt-8"
      isSecondaryBtn={true}
      onPreviewClick={() => {
        openVideo(videoUrl)
      }}
      isPrimaryBtnDisabled={!isRegistrationOpen && !isEnrolled}
      primaryLabel={
        isEnrolled
          ? 'Access Course'
          : isRegistrationOpen
          ? 'Enroll Now'
          : 'Registration Closed'
      }
      secondaryLabel="Watch Preview"
      primaryButtonVariant="default"
      secondaryButtonVariant="outline"
    />
  )
}

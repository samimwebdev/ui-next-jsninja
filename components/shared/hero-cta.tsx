'use client'

import { CTAButtons } from './cta-buttons'
import { useVideo } from '../context/video-provider'
import { useRouter } from 'next/navigation'
import { useEnrollmentCheck } from '@/hooks/use-enrollment-check'
import { useEffect } from 'react'

interface HeroCTAProps {
  courseInfo: {
    slug: string
    courseType: string
    isRegistrationOpen: boolean
  }
  videoUrl: string
  checkOnMount?: boolean
}

export function HeroCTA({ courseInfo, videoUrl, checkOnMount }: HeroCTAProps) {
  const { openVideo } = useVideo()
  const router = useRouter()

  const {
    isLoading,
    isEnrolled,
    checkEnrollment,
    checkAuthOnly,
    isAuth: isAuthenticated,
  } = useEnrollmentCheck()
  useEffect(() => {
    if (checkOnMount) {
      checkEnrollment(courseInfo.slug)
      checkAuthOnly()
    }
  }, [checkOnMount, courseInfo.slug, checkEnrollment, checkAuthOnly])

  const handleEnrollClick = async () => {
    const enrollLink = `/checkout?courseSlug=${courseInfo.slug}&courseType=${courseInfo.courseType}`
    if (!isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(enrollLink)}`)
      return
    }
    if (isEnrolled) {
      // User is enrolled, go to course
      router.push(`/course-view/${courseInfo.slug}`)
    } else {
      // User not enrolled, go to checkout
      router.push(enrollLink)
    }
  }

  const getButtonText = () => {
    if (isLoading) return 'Checking...'
    if (isEnrolled === true) return 'Access Course'
    if (!courseInfo.isRegistrationOpen) return 'Registration Closed'
    return 'Enroll Now'
  }
  const isDisabled =
    isLoading || (!courseInfo.isRegistrationOpen && isEnrolled !== true)

  // const enrollLink = `/checkout?courseSlug=${slug}&courseType=${courseType}`
  // const courseViewLink = `/course-view/${slug}`
  // const handleEnrollClick = async () => {
  //   // If user is already enrolled, go to course view
  //   if (isEnrolled) {
  //     router.push(courseViewLink)
  //     return
  //   }

  //   // If registration is closed, do nothing
  //   if (!isRegistrationOpen) return

  //   // Check auth for enrollment
  //   const isAuth = await isAuthenticated()
  //   if (isAuth) {
  //     router.push(enrollLink)
  //   } else {
  //     router.push(`/login?redirect=${encodeURIComponent(enrollLink)}`)
  //   }
  // }

  return (
    <CTAButtons
      handleClick={handleEnrollClick}
      className="mt-8"
      isSecondaryBtn={true}
      onPreviewClick={() => {
        openVideo(videoUrl)
      }}
      isPrimaryBtnDisabled={isDisabled}
      primaryLabel={getButtonText()}
      secondaryLabel="Watch Preview"
      primaryButtonVariant="default"
      secondaryButtonVariant="outline"
    />
  )
}

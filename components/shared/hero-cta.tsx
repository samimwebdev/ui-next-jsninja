'use client'

import { CTAButtons } from './cta-buttons'
import { useVideo } from '../context/video-provider'
import { useRouter } from 'next/navigation'
import { useEnrollmentCheck } from '@/hooks/use-enrollment-check'
import { useEffect } from 'react'
import { useScrollToSection } from '@/hooks/use-scroll-to-section'

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
  const { scrollToSection } = useScrollToSection()

  const { isLoading, isEnrolled, checkEnrollment, checkAuthOnly } =
    useEnrollmentCheck()
  useEffect(() => {
    if (checkOnMount) {
      checkEnrollment(courseInfo.slug)
      checkAuthOnly()
    }
  }, [checkOnMount, courseInfo.slug, checkEnrollment, checkAuthOnly])

  const handleEnrollClick = async () => {
    // Check enrollment and auth status first
    const enrolled = await checkEnrollment(courseInfo.slug)
    const auth = await checkAuthOnly()

    // If user is enrolled, go to course view
    if (enrolled) {
      router.push(`/course-view/${courseInfo.slug}`)
      return
    }

    // If registration is closed, do nothing (button should be disabled)
    if (!courseInfo) {
      return
    }

    // ✅ If user is authenticated and registration is open, scroll to pricing
    if (auth) {
      scrollToSection('course-pricing', 80)
      return
    }

    // ✅ If user is not authenticated, redirect to login with return to pricing
    const currentUrl = window.location.href
    const loginUrl = `/login?redirect=${encodeURIComponent(
      currentUrl
    )}#course-pricing`
    router.push(loginUrl)
  }

  // const handleEnrollClick = async () => {
  //   const enrollLink = `/checkout?courseSlug=${courseInfo.slug}&courseType=${courseInfo.courseType}`
  //   if (!isAuthenticated) {
  //     router.push(`/login?redirect=${encodeURIComponent(enrollLink)}`)
  //     return
  //   }
  //   if (isEnrolled) {
  //     // User is enrolled, go to course
  //     router.push(`/course-view/${courseInfo.slug}`)
  //   } else {
  //     // User not enrolled, go to checkout
  //     router.push(enrollLink)
  //   }
  // }

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

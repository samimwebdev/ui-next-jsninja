'use client'

import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useEnrollmentCheck } from '@/hooks/use-enrollment-check'
import { CourseType } from '@/types/checkout-types'

interface EnrollButtonProps {
  courseInfo: {
    slug: string
    courseType: CourseType
    isRegistrationOpen: boolean
  }
  label?: string
  className?: string
  checkOnMount?: boolean
}

export default function GenericButton({
  courseInfo,
  label = 'Enroll Now',
  className = '',
  checkOnMount = false,
}: EnrollButtonProps) {
  const router = useRouter()
  const { isLoading, isEnrolled, checkEnrollment, checkAuthOnly } =
    useEnrollmentCheck()

  // Check enrollment on mount if requested
  useEffect(() => {
    if (checkOnMount) {
      checkEnrollment(courseInfo.slug)
      checkAuthOnly()
    }
  }, [checkOnMount, courseInfo.slug, checkEnrollment, checkAuthOnly])

  const handleClick = async () => {
    // Check enrollment status first
    const enrollLink = `/checkout?courseSlug=${courseInfo.slug}&courseType=${courseInfo.courseType}`
    const enrolled = await checkEnrollment(courseInfo.slug)
    const auth = await checkAuthOnly()
    if (!auth) {
      router.push(`/login?redirect=${encodeURIComponent(enrollLink)}`)
      return
    }

    if (enrolled) {
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
    return label
  }

  const isDisabled =
    isLoading || (!courseInfo.isRegistrationOpen && isEnrolled !== true)

  return (
    <motion.button
      className={`w-full btn-ninja-primary text-white py-3 px-6 rounded-lg hover:bg-[#D81B60] transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      onClick={handleClick}
      disabled={isDisabled}
      whileHover={{ scale: isDisabled ? 1 : 1.02 }}
      whileTap={{ scale: isDisabled ? 1 : 0.98 }}
    >
      {getButtonText()}
    </motion.button>
  )
}

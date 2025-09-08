'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

import { CourseType } from '@/types/checkout-types'
import { isAuthenticated } from '@/lib/auth'

interface EnrollButtonProps {
  courseInfo: {
    slug: string
    courseType: CourseType
    isRegistrationOpen: boolean
    isEnrolled: boolean
  }

  label?: string
  className?: string
}

export default function GenericButton({
  courseInfo,
  label = 'Enroll Now',
  className = '',
}: EnrollButtonProps) {
  const router = useRouter()
  const { isEnrolled, isRegistrationOpen } = courseInfo

  const enrollLink = `/checkout?courseSlug=${courseInfo.slug}&courseType=${courseInfo.courseType}`
  const courseViewLink = `/course-view/${courseInfo.slug}`

  const handleClick = async () => {
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

  // // Create fallback icons with proper iconData
  // const createFallbackIcon = (iconName: string) => ({
  //   iconName,
  //   width: 24,
  //   height: 24,
  //   iconData:
  //     iconName === 'mdi:play-circle'
  //       ? '<path fill="currentColor" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M10,16.5V7.5L16,12">'
  //       : iconName === 'mdi:lock'
  //       ? '<path fill="currentColor" d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z">'
  //       : '<path fill="currentColor" d="M19,7H18V6A6,6 0 0,0 6,6V7H5A3,3 0 0,0 2,10V20A3,3 0 0,0 5,23H19A3,3 0 0,0 22,20V10A3,3 0 0,0 19,7M8,6A4,4 0 0,1 16,6V7H8V6M20,20A1,1 0 0,1 19,21H5A1,1 0 0,1 4,20V10A1,1 0 0,1 5,9H19A1,1 0 0,1 20,10V20M10,16V14A2,2 0 0,1 14,14V16A1,1 0 0,1 13,17H11A1,1 0 0,1 10,16Z">',
  // })

  // // Determine button label and state
  // const getButtonContent = () => {
  //   if (isEnrolled) {
  //     return {
  //       label: 'Access Course',
  //       icon: createFallbackIcon('mdi:play-circle'),
  //       disabled: false,
  //     }
  //   }

  //   if (!isRegistrationOpen) {
  //     return {
  //       label: 'Registration Closed',
  //       icon: createFallbackIcon('mdi:lock'),
  //       disabled: true,
  //     }
  //   }

  //   return {
  //     label: .btn?.btnLabel || 'Enroll Now',
  //     icon: .btn?.btnIcon || createFallbackIcon('mdi:wallet'),
  //     disabled: false,
  //   }
  // }

  // const buttonContent = getButtonContent()

  return (
    <motion.button
      className={`w-full btn-ninja-primary text-white py-3 px-6 rounded-lg hover:bg-[#D81B60] transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      onClick={handleClick}
      disabled={!isRegistrationOpen && !isEnrolled}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {isRegistrationOpen
        ? label
        : isEnrolled
        ? 'Access Course'
        : 'Registration Closed'}
    </motion.button>
  )
}

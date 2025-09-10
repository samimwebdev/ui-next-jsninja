'use client'

import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { CallToActionContentSection } from '@/types/bootcamp-page-types'
import DynamicIcon from '../shared/DynamicIcon'
import { getCleanText } from '@/lib/utils'
import { CourseInfoType } from './cta'
import { useRouter } from 'next/navigation'
import { useEnrollmentCheck } from '@/hooks/use-enrollment-check'

interface CTAClientWrapperProps {
  data: CallToActionContentSection
  courseInfo: CourseInfoType
  isRegistrationOpen: boolean
}

export const CTAClientWrapper: React.FC<CTAClientWrapperProps> = ({
  data,
  courseInfo,
  isRegistrationOpen,
}) => {
  const router = useRouter()
  const { isEnrolled, checkEnrollment, checkAuthOnly } = useEnrollmentCheck()

  useEffect(() => {
    checkEnrollment(courseInfo.slug)
    checkAuthOnly()
  }, [courseInfo.slug, checkEnrollment, checkAuthOnly])

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

  // Create fallback icons with proper iconData
  const createFallbackIcon = (iconName: string) => ({
    iconName,
    width: 24,
    height: 24,
    iconData:
      iconName === 'mdi:play-circle'
        ? '<path fill="currentColor" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M10,16.5V7.5L16,12">'
        : iconName === 'mdi:lock'
        ? '<path fill="currentColor" d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z">'
        : '<path fill="currentColor" d="M19,7H18V6A6,6 0 0,0 6,6V7H5A3,3 0 0,0 2,10V20A3,3 0 0,0 5,23H19A3,3 0 0,0 22,20V10A3,3 0 0,0 19,7M8,6A4,4 0 0,1 16,6V7H8V6M20,20A1,1 0 0,1 19,21H5A1,1 0 0,1 4,20V10A1,1 0 0,1 5,9H19A1,1 0 0,1 20,10V20M10,16V14A2,2 0 0,1 14,14V16A1,1 0 0,1 13,17H11A1,1 0 0,1 10,16Z">',
  })

  // Determine button label and state
  const getButtonContent = () => {
    if (isEnrolled) {
      return {
        label: 'Access Course',
        icon: createFallbackIcon('mdi:play-circle'),
        disabled: false,
      }
    }

    if (!isRegistrationOpen) {
      return {
        label: 'Registration Closed',
        icon: createFallbackIcon('mdi:lock'),
        disabled: true,
      }
    }

    return {
      label: data.btn?.btnLabel || 'Enroll Now',
      icon: data.btn?.btnIcon || createFallbackIcon('mdi:wallet'),
      disabled: false,
    }
  }

  const buttonContent = getButtonContent()

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="max-w-3xl mx-auto text-center"
      >
        <h2 className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl text-foreground">
          {data.title}
        </h2>
        <p className="max-w-xl mx-auto mt-6 text-lg leading-relaxed text-muted-foreground">
          {data.description}
        </p>
      </motion.div>

      <div className="mt-16 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {data.callToActionContent.map((feature) => (
          <motion.div
            key={feature.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="flex items-start rounded-xl p-6 backdrop-blur-sm bg-background/90 border border-border/50 hover:border-primary/30 hover:bg-background hover:shadow-lg transition-all duration-300 shadow-sm"
          >
            <div className="p-3 rounded-lg bg-primary/10 text-primary dark:bg-primary/20">
              {feature.icon ? (
                <DynamicIcon
                  icon={feature.icon}
                  className="h-8 w-8"
                  width={32}
                  height={32}
                />
              ) : (
                <div className="h-8 w-8" />
              )}
            </div>
            <div className="ml-4">
              <h3 className="text-xl font-bold text-foreground">
                {feature.title}
              </h3>
              <div className="mt-1.5 text-sm text-muted-foreground">
                {getCleanText(feature.details)}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="max-w-xl mx-auto mt-12"
      >
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <motion.div
            whileHover={{ scale: buttonContent.disabled ? 1 : 1.05 }}
            whileTap={{ scale: buttonContent.disabled ? 1 : 0.98 }}
            className="w-full sm:w-auto"
          >
            <Button
              size="lg"
              className={`w-full sm:w-auto px-12 py-7 ${'bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80'} text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background transition duration-300 shadow-lg shadow-primary/25 relative overflow-hidden group rounded-full font-bold`}
              onClick={handleClick}
              disabled={buttonContent.disabled}
            >
              <span className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></span>
              <span className="relative flex items-center justify-center gap-2">
                {buttonContent.label}
                <DynamicIcon
                  icon={buttonContent.icon}
                  className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                  width={20}
                  height={20}
                />
              </span>
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </>
  )
}

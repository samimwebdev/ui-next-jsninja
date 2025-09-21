'use client'

import { Button } from '@/components/ui/button'
import DynamicIcon from '../shared/DynamicIcon'
import { useRouter } from 'next/navigation'
import { StrapiIcon } from '@/types/shared-types'
import { useEnrollmentCheck } from '@/hooks/use-enrollment-check'
import { useEffect } from 'react'
import { useScrollToSection } from '@/hooks/use-scroll-to-section'

interface HeroButtonClientProps {
  enrollButton?: {
    btnIcon?: StrapiIcon
    btnLabel?: string
  }
  courseInfo: {
    slug: string
    courseType: string
    isRegistrationOpen: boolean
    isLiveRegistrationAvailable?: boolean
    isRecordedRegistrationAvailable?: boolean
  }
}

export const HeroButtonClient: React.FC<HeroButtonClientProps> = ({
  enrollButton,
  courseInfo,
}) => {
  const router = useRouter()
  const { scrollToSection } = useScrollToSection()
  const { isEnrolled, checkEnrollment, checkAuthOnly } = useEnrollmentCheck()
  const { isRegistrationOpen } = courseInfo

  useEffect(() => {
    checkEnrollment(courseInfo.slug)
    checkAuthOnly()
  }, [courseInfo.slug, checkEnrollment, checkAuthOnly])

  const handleClick = async () => {
    // Check enrollment and auth status first
    const enrolled = await checkEnrollment(courseInfo.slug)
    const auth = await checkAuthOnly()

    // If user is enrolled, go to course view
    if (enrolled) {
      router.push(`/course-view/${courseInfo.slug}`)
      return
    }

    // If registration is closed, do nothing (button should be disabled)
    if (!isRegistrationOpen) {
      return
    }

    // ✅ If user is authenticated and registration is open, scroll to pricing
    if (auth) {
      scrollToSection('bootcamp-pricing', 80)
      return
    }

    // ✅ If user is not authenticated, redirect to login with return to pricing
    const currentUrl = window.location.href
    const loginUrl = `/login?redirect=${encodeURIComponent(
      currentUrl
    )}#bootcamp-pricing`
    router.push(loginUrl)
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
        : iconName === 'mdi:arrow-down'
        ? '<path fill="currentColor" d="M11,4H13V16L18.5,10.5L19.92,11.92L12,19.84L4.08,11.92L5.5,10.5L11,16V4Z">'
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

    // ✅ For enrollment, show different label and icon
    return {
      label: enrollButton?.btnLabel || 'View Pricing',
      icon: enrollButton?.btnIcon || createFallbackIcon('mdi:arrow-down'),
      disabled: false,
    }
  }

  const buttonContent = getButtonContent()

  return (
    <Button
      size="lg"
      className={`btn-ninja-primary  text-white py-3 px-6 hover:bg-[#D81B60] transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
        buttonContent.disabled
          ? 'opacity-60 cursor-not-allowed'
          : 'hover:shadow-lg'
      }`}
      onClick={handleClick}
      disabled={buttonContent.disabled}
    >
      <DynamicIcon
        icon={
          enrollButton?.btnIcon || {
            iconName: buttonContent.icon?.iconName || 'mdi:arrow-down',
            width: 24,
            height: 24,
            iconData: buttonContent.icon?.iconData || '',
          }
        }
        className="!h-5 !w-5 transition-transform group-hover:translate-y-1"
        width={20}
        height={20}
      />
      {buttonContent.label}
    </Button>
  )
}

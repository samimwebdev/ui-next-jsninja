'use client'

import { Button } from '@/components/ui/button'
import DynamicIcon from '@/components/shared/DynamicIcon'
import { StrapiIcon } from '@/types/shared-types'
import { useRouter } from 'next/navigation'
import { useEnrollmentCheck } from '@/hooks/use-enrollment-check'
import { useEffect } from 'react'
import { trackEnrollmentStart } from '../analytics/vercel-analytics'

interface PricingPackageData {
  id: number
  name: string
  isPreferred?: boolean | null
  packageType: 'live' | 'record'
  btn?: {
    id: number
    btnIcon?: StrapiIcon
    btnLabel?: string
    btnLink?: string | null
  }
}

interface PricingClientWrapperProps {
  packageData: PricingPackageData
  courseInfo: {
    title: string
    slug: string
    courseType: string
    isRegistrationOpen: boolean
    price: number
    isLiveRegistrationAvailable: boolean
    liveBootcampPrice?: number
    isRecordedRegistrationAvailable: boolean
    // Add other course info fields as needed
  }
}

export const PricingClientWrapper: React.FC<PricingClientWrapperProps> = ({
  packageData,
  courseInfo,
}) => {
  const router = useRouter()
  const packageType = packageData.packageType

  const { isRegistrationOpen, slug } = courseInfo
  const { isEnrolled, checkEnrollment, checkAuthOnly } = useEnrollmentCheck()

  useEffect(() => {
    checkEnrollment(slug)
    checkAuthOnly()
  }, [slug, checkEnrollment, checkAuthOnly])

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
      trackEnrollmentStart({
        slug: courseInfo.slug,
        title: courseInfo.title,
        price: courseInfo.price,
        courseType: courseInfo.courseType,
        packageType: packageData.packageType,
      })

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
        : iconName === 'mdi:wallet'
        ? '<path fill="currentColor" d="M21,18V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5A2,2 0 0,1 5,3H19A2,2 0 0,1 21,5V6H12C10.89,6 10,6.9 10,8V16A2,2 0 0,0 12,18H21M12,16H22V8H12V16M16,13.5A1.5,1.5 0 0,1 14.5,12A1.5,1.5 0 0,1 16,10.5A1.5,1.5 0 0,1 17.5,12A1.5,1.5 0 0,1 16,13.5Z">'
        : '<path fill="currentColor" d="M19,7H18V6A6,6 0 0,0 6,6V7H5A3,3 0 0,0 2,10V20A3,3 0 0,0 5,23H19A3,3 0 0,0 22,20V10A3,3 0 0,0 19,7M8,6A4,4 0 0,1 16,6V7H8V6M20,20A1,1 0 0,1 19,21H5A1,1 0 0,1 4,20V10A1,1 0 0,1 5,9H19A1,1 0 0,1 20,10V20M10,16V14A2,2 0 0,1 14,14V16A1,1 0 0,1 13,17H11A1,1 0 0,1 10,16Z">',
  })

  // ✅ Fixed button logic
  const getButtonContent = () => {
    // If user is already enrolled, show access button
    if (isEnrolled) {
      return {
        label: 'Access Course',
        icon: createFallbackIcon('mdi:play-circle'),
        disabled: false,
      }
    }

    // If general registration is closed, disable all packages
    if (!isRegistrationOpen) {
      return {
        label: 'Registration Closed',
        icon: createFallbackIcon('mdi:lock'),
        disabled: true,
      }
    }

    // ✅ Handle Live Package
    if (packageData.packageType === 'live') {
      if (!courseInfo.isLiveRegistrationAvailable) {
        return {
          label: 'Live Registration Unavailable',
          icon: createFallbackIcon('mdi:lock'),
          disabled: true,
        }
      } else {
        return {
          label: packageData.btn?.btnLabel || 'Enroll in Live Package',
          icon: packageData.btn?.btnIcon || createFallbackIcon('mdi:wallet'),
          disabled: false,
        }
      }
    }

    // ✅ Handle Recorded Package
    if (packageData.packageType === 'record') {
      if (!courseInfo.isRecordedRegistrationAvailable) {
        return {
          label: 'Recorded Registration Unavailable',
          icon: createFallbackIcon('mdi:lock'),
          disabled: true,
        }
      } else {
        return {
          label: packageData.btn?.btnLabel || 'Enroll in Recorded Package',
          icon: packageData.btn?.btnIcon || createFallbackIcon('mdi:wallet'),
          disabled: false,
        }
      }
    }

    // ✅ Fallback for any other package types
    return {
      label: packageData.btn?.btnLabel || 'Enroll Now',
      icon: packageData.btn?.btnIcon || createFallbackIcon('mdi:wallet'),
      disabled: false,
    }
  }

  const buttonContent = getButtonContent()
  console.log({ packageType })

  return (
    <Button
      size="lg"
      className={`${
        packageType === 'live' &&
        'btn-ninja-primary hover:btn-ninja-primary-hover'
      } w-full py-3 px-6 transition-colors disabled:cursor-not-allowed ${
        buttonContent.disabled
          ? 'opacity-60 cursor-not-allowed'
          : 'hover:scale-[1.02] hover:shadow-lg'
      }`}
      variant={packageData.isPreferred ? 'default' : 'outline'}
      onClick={handleClick}
      disabled={buttonContent.disabled}
    >
      {buttonContent.icon && (
        <DynamicIcon
          icon={buttonContent.icon}
          className="mr-2 h-4 w-4"
          width={16}
          height={16}
        />
      )}
      {buttonContent.label || `Enroll Now - ${packageData.name}`}
    </Button>
  )
}

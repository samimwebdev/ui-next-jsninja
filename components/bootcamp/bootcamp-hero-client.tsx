'use client'

import { Button } from '@/components/ui/button'
import DynamicIcon from '../shared/DynamicIcon'
import { useRouter } from 'next/navigation'
// import { checkAuthAction } from '@/lib/actions/auth'
import { StrapiIcon } from '@/types/shared-types'

import { useEnrollmentCheck } from '@/hooks/use-enrollment-check'
import { useEffect } from 'react'

interface HeroButtonClientProps {
  enrollButton?: {
    btnIcon?: StrapiIcon
    btnLabel?: string
  }
  courseInfo: {
    slug: string
    courseType: string
    isRegistrationOpen: boolean
  }
}

export const HeroButtonClient: React.FC<HeroButtonClientProps> = ({
  enrollButton,
  courseInfo,
}) => {
  const router = useRouter()
  // const [checkOnMount, setCheckOnMount] = useState(false)

  const { isEnrolled, checkEnrollment, checkAuthOnly } = useEnrollmentCheck()

  const { isRegistrationOpen } = courseInfo

  // useEffect(() => {
  //   setCheckOnMount(true)
  // }, [])

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
      label: enrollButton?.btnLabel || 'Enroll Now',
      icon: enrollButton?.btnIcon || createFallbackIcon('mdi:wallet'),
      disabled: false,
    }
  }

  const buttonContent = getButtonContent()
  return (
    <Button
      size="lg"
      className="rounded-full text-base"
      onClick={handleClick}
      disabled={buttonContent.disabled}
    >
      <DynamicIcon
        icon={
          enrollButton?.btnIcon || {
            iconName: getButtonContent().icon?.iconName || '',
            width: 24,
            height: 24,
            iconData: '',
          }
        }
        className="!h-5 !w-5 transition-transform group-hover:translate-x-1"
        width={24}
        height={24}
      />
      {buttonContent.label}
    </Button>
  )
}

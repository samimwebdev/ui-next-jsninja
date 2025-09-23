import { BaseContent } from '@/types/checkout-types'

export function isCourseBundle(
  baseContent: BaseContent | BaseContent[]
): baseContent is BaseContent[] {
  return Array.isArray(baseContent)
}

export function getTotalPrice(
  baseContent: BaseContent | BaseContent[],
  bundlePrice?: number
): number {
  if (isCourseBundle(baseContent)) {
    // For bundles, use the bundle price if provided, otherwise sum individual prices
    return (
      bundlePrice ||
      baseContent.reduce((total, course) => total + course.price, 0)
    )
  }

  //also check if baseContent is bootcamp and isLIveRegistrationAvailable then get liveBootcampPrice otherwise get regular price
  if (baseContent.courseType !== 'course') {
    if (baseContent.isLiveRegistrationAvailable) {
      return baseContent?.liveBootcampPrice || baseContent.price
    } else if (baseContent.isRecordedRegistrationAvailable) {
      return baseContent.price
    }
  }
  return baseContent.price
}
export function getCourseCount(
  baseContent: BaseContent | BaseContent[]
): number {
  if (isCourseBundle(baseContent)) {
    return baseContent.length
  }
  return 1
}

export function getMainTitle(
  baseContent: BaseContent | BaseContent[],
  fallbackTitle: string
): string {
  if (isCourseBundle(baseContent)) {
    return `${fallbackTitle} (${baseContent.length} Courses)`
  }
  return baseContent.title
}

export function formatCourseType(courseType: string): string {
  switch (courseType) {
    case 'course':
      return 'Course'
    case 'bootcamp':
      return 'Bootcamp'
    case 'workshop':
      return 'Workshop'
    case 'course-bundle':
      return 'Course Bundle'
    default:
      return courseType
  }
}

// New helper to get the base content ID for payment
export function getCourseBaseId(
  baseContent: BaseContent | BaseContent[]
): string {
  if (isCourseBundle(baseContent)) {
    // For bundles, we might need to send a bundle ID or handle differently
    // This depends on your backend implementation
    throw new Error('Bundle payment not implemented yet')
  }
  return baseContent.documentId
}

//New helper to get content ID for payment for course-bundle
export function getCourseBundleId(course: { documentId: string }) {
  return course.documentId
}

// Calculate bundle savings
export function calculateBundleSavings(
  bundlePrice: number,
  individualPrices: number[]
) {
  const totalIndividualPrice = individualPrices.reduce(
    (sum, price) => sum + price,
    0
  )
  const savings = totalIndividualPrice - bundlePrice
  const savingsPercentage = Math.round((savings / totalIndividualPrice) * 100)

  return {
    totalIndividualPrice,
    bundlePrice,
    savings,
    savingsPercentage,
  }
}

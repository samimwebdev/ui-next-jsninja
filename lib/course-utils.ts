import {
  CourseComponentType,
  CourseComponentDataMap,
  CoursePageData,
} from '@/types/course-page-types'

export function getCourseContentSection<T extends CourseComponentType>(
  courseData: CoursePageData,
  componentType: T
): CourseComponentDataMap[T] | undefined {
  const contentSections = courseData.baseContent?.contentSection || []

  return contentSections.find(
    (section): section is CourseComponentDataMap[T] =>
      section.__component === componentType
  ) as CourseComponentDataMap[T] | undefined
}

// Helper to format price
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price / 100) // Assuming price is in cents
}

// Helper to get highlight features
export function getHighlightFeatures(courseData: CoursePageData): string[] {
  return (
    courseData.highlightFeature?.features?.map((f) => f.feature) || [
      '150+ Hours of Content',
      'Project-Based Learning',
      'Lifetime Access',
      '3 Months of 1:1 Support',
    ]
  )
}

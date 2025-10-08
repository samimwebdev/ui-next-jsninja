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
export function formatPrice(price: number | undefined): string {
  if (price === undefined) return '৳0.00'

  return new Intl.NumberFormat('BDT', {
    style: 'currency',
    currency: 'BDT',
  }).format(price) // Assuming price is in cents
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

// Get badge variant by level
export function getLevelBadgeVariant(
  level: 'Beginner' | 'Intermediate' | 'Advanced'
) {
  switch (level) {
    case 'Beginner':
      return 'secondary' as const
    case 'Intermediate':
      return 'default' as const
    case 'Advanced':
      return 'destructive' as const
    default:
      return 'secondary' as const
  }
}

// Format course URL
export function formatCourseUrl(
  slug: string,
  isExpired: boolean,
  lastAccessedLesson?: {
    module: { id: number }
    lesson: { documentId: string }
  } | null
): string {
  if (isExpired) {
    return '#'
  }

  if (lastAccessedLesson?.module && lastAccessedLesson?.lesson) {
    return `/course-view/${slug}/modules/${lastAccessedLesson.module.id}/lectures/${lastAccessedLesson.lesson.documentId}`
  }

  return `/course-view/${slug}`
}

// Get next lesson title
export function getNextLessonTitle(
  lastAccessedLesson?: { lesson: { title: string } } | null
): string {
  return lastAccessedLesson?.lesson?.title || 'Start learning'
}

// lib/date-utils.ts
export const isModuleReleased = (releaseDate: string | null): boolean => {
  if (!releaseDate) return false

  try {
    const release = new Date(releaseDate)
    const now = new Date()
    return release <= now
  } catch (error) {
    console.log('Error checking release date:', error)
    console.warn('Invalid release date:', releaseDate)
    return false
  }
}

export const formatReleaseDate = (releaseDate: Date | null): string => {
  if (!releaseDate) return ''

  const date = new Date(releaseDate)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

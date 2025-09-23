import { StrapiImage } from './shared-types'

export interface CheckoutCourseResponse {
  data: CheckoutCourse
  meta: Record<string, unknown>
}

export interface CheckoutCourse {
  id: number
  documentId: string
  title: string
  slug: string
  description: string
  features: Feature[]
  baseContent: BaseContent | BaseContent[] // Can be single or array for bundles
  price?: number // Add this for course bundles
}

export interface Feature {
  id: number
  feature?: string
  title?: string
}

export interface BaseContent {
  id: number
  documentId: string
  title: string
  slug: string
  price: number
  level: string
  featured: boolean
  totalStudents: number
  averageRating: number
  locale: string | null
  courseType: CourseType
  isRegistrationEnabled: boolean
  totalLessons: number
  shortDescription: string
  longDescription: string
  duration: string
  startingFrom: string
  totalModules: number
  featureImage: StrapiImage
  isLiveRegistrationAvailable: boolean
  isRecordedRegistrationAvailable: boolean
  liveBootcampPrice?: number
}

export type CourseType = 'course' | 'bootcamp' | 'workshop' | 'course-bundle'

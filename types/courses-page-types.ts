import { CourseType } from './checkout-types'
import { StrapiImage, SEOData, Category } from './shared-types'

export interface CourseItem {
  id: number
  documentId: string
  title: string
  slug: string
  price: number
  level: string
  featured?: boolean
  totalStudents: number
  averageRating: number
  courseType: CourseType
  totalLessons: number
  shortDescription: string
  longDescription: string
  duration: string | number
  startingFrom?: string
  totalModules: number | null
  featureImage?: StrapiImage
  seo?: SEOData
  categories: Category[]
}

export interface CourseBundleItem {
  id: number
  documentId: string
  title: string
  slug: string
  shortDescription: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale: string | null
  price: number
  helperText: string
  featureImage: StrapiImage | null
  courseBases: CourseItem[]
}

export interface CoursesApiResponse {
  data: {
    course: CourseItem[]
    bootcamp: CourseItem[]
    workshop?: CourseItem[]
    courseBundle: CourseBundleItem[]
  }
  meta: Record<string, unknown>
}

export type FilterType =
  | 'all'
  | 'course'
  | 'bootcamp'
  | 'workshop'
  | 'courseBundle'

export interface FilterOption {
  value: FilterType
  label: string
  count: number
}

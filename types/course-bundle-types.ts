import { CourseType } from './checkout-types'
import { StrapiImage, SEOData, Category, CourseBase } from './shared-types'

export interface CourseBundlePageData {
  id: number
  documentId: string
  slug: string
  title: string
  shortDescription: string
  price: number
  helperText?: string | null
  featureImage: StrapiImage | null
  courseBases: CourseBase[]
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale: string | null
  seo?: SEOData
}

export interface BundleCourseItem {
  id: number
  documentId: string
  title: string
  slug: string
  price: number
  level: string
  featured: boolean
  totalStudents: number
  averageRating: number
  courseType: CourseType
  totalLessons: number
  shortDescription: string
  longDescription: string
  duration: string
  startingFrom: string | null
  totalModules: number | null
  featureImage: StrapiImage
  categories: Category[]
  seo: SEOData
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale: string | null
}

export interface CourseBundleApiResponse {
  data: CourseBundlePageData
  meta: Record<string, unknown>
}

export interface CourseBundleStats {
  totalCourses: number
  totalBootcamps: number
  totalLessons: number
  totalStudents: number
  averageRating: number
  totalDuration: string
  individualPrice: number
  bundlePrice: number
  savings: number
  savingsPercentage: number
}

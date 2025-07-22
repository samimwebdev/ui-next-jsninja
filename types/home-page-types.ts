import {
  StrapiImage,
  StrapiIcon,
  Category,
  ButtonType,
  Profile,
  Review,
  SEOData,
  StrapiResponse,
} from './shared-types'

// Extend CourseBase for home page specific needs
export interface Course {
  id: number
  documentId: string
  title: string
  shortDescription?: string
  longDescription?: string
  startingFrom?: string
  slug: string
  price: number
  level: string
  totalStudents: number
  averageRating: number
  duration: number | string
  totalLessons: number
  courseType?: 'course' | 'bootcamp' | 'workshop'
  featureImage?: StrapiImage
  categories: Category[]
  browseCoursesBtn?: ButtonType
}

export interface HeroSectionData {
  id: number
  __component: 'hero-layout.hero-layout'
  shortLabel: string
  title: string
  shortDescription: string
  promoVideo: string
  courses: Course
}

export interface FeatureSectionData {
  id: number
  __component: 'home-layout.platform-feature'
  title: string
  description: string
  feature: Array<{
    id: number
    title: string
    icon: StrapiIcon
    features: Array<{
      id: number
      feature: string
    }>
  }>
}

export interface TechSectionData {
  id: number
  documentId: string
  __component: 'technology-layout.technology-layout'
  title: string
  techIconContent: Array<{
    id: number
    name: string
    alt: string
    icon: StrapiIcon
  }>
}

export interface CourseSectionData {
  id: number
  __component: 'home-layout.feature-course'
  title: string
  description: string
  courseBases: Course[]
}

export interface BootcampSectionData {
  id: number
  __component: 'home-layout.feature-bootcamp'
  title: string
  description: string
  browseCoursesBtn: ButtonType
  courseBases: Course[]
}

export interface ReviewSectionData {
  id: number
  __component: 'review-layout.review-layout'
  title: string
  description: string
  reviews: Review[]
}

export interface StatsCounter {
  id: number
  statsLabel: string
  statsCount: number
  icon: StrapiIcon
}

export interface StatsSectionData {
  id: number
  __component: 'home-layout.home-stats'
  title: string
  description: string
  statsCounter: StatsCounter[]
}

export interface Blog {
  id: number
  documentId: string
  timeToRead: number
  title: string
  publishedDate: string
  tags: string
  slug: string
  details: string
  categories: Category[]
  thumbnail: StrapiImage
}

export interface BlogSectionData {
  id: number
  __component: 'home-layout.feature-post'
  title: string
  description: string
  blogs: Blog[]
}

export interface Video {
  id: number
  title: string
  shortDescription: string
  videoURL: string
}

export interface VideoSectionData {
  id: number
  __component: 'demo-videos-layout.demo-videos'
  title: string
  description: string
  videos: Video[]
  browseVideosBtn: ButtonType
}

export interface HomePageData {
  id: number
  seo?: SEOData
  homeSection: HomeSectionData[]
}

export type HomeSectionData =
  | HeroSectionData
  | FeatureSectionData
  | TechSectionData
  | CourseSectionData
  | ReviewSectionData
  | StatsSectionData
  | BlogSectionData
  | VideoSectionData
  | BootcampSectionData

// Re-export shared types for convenience
export type {
  StrapiImage,
  StrapiIcon,
  Category,
  ButtonType,
  Profile,
  Review,
  SEOData,
  StrapiResponse,
}

export interface ComponentDataMap {
  'hero-layout.hero-layout': HeroSectionData
  'home-layout.platform-feature': FeatureSectionData
  'technology-layout.technology-layout': TechSectionData
  'home-layout.feature-course': CourseSectionData
  'home-layout.feature-bootcamp': BootcampSectionData
  'review-layout.review-layout': ReviewSectionData
  'home-layout.home-stats': StatsSectionData
  'home-layout.feature-post': BlogSectionData
  'demo-videos-layout.demo-videos': VideoSectionData
}

export type ComponentType = keyof ComponentDataMap

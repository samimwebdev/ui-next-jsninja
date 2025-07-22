import {
  StrapiImage,
  StrapiIcon,
  Category,
  ButtonType,
  Profile,
  Review,
  SEOData,
  CourseBase,
  StrapiResponse,
} from './shared-types'

// Course-specific feature types
export interface CourseFeature {
  id: number
  feature: string
}

export interface OverviewFeature {
  id: number
  title: string
  icon: StrapiIcon
  features: CourseFeature[]
}

export interface HighlightFeature {
  id: number
  title: string
  icon: StrapiIcon
  features: CourseFeature[]
}

// Curriculum types
export interface Lesson {
  id: number
  documentId: string
  title: string
  order: number
  duration: number
  type: 'Video' | 'Text' | 'Quiz' | 'Assignment'
  content?: string | null
  videoUrl?: string
  isFree: boolean
  icon?: StrapiIcon | null
  createdAt: string
  updatedAt: string
  publishedAt: string | null
  locale: string | null
}

export interface Module {
  id: number
  documentId: string
  title: string
  description?: string | null
  order: number
  duration: number
  lessons: Lesson[]
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale: string | null
}

export interface Curriculum {
  id: number
  title: string
  description: string
  modules: Module[]
}

// Course bundle types
export interface CourseBundle {
  id: number
  documentId: string
  title: string
  shortDescription: string
  price: number
  helperText?: string | null
  courses: CourseBase[]
  createdAt: string
  updatedAt: string
  publishedAt: string | null
  locale: string | null
}

// Project types
export interface Project {
  id: number
  documentId: string
  title: string
  description: string
  technology: string
  image: StrapiImage
  createdAt: string
  updatedAt: string
  publishedAt: string | null
  locale: string | null
}

// Instructor types
export interface Instructor {
  id: number
  documentId: string
  name: string
  title: string
  bio: string
  profile: Profile
  createdAt: string
  updatedAt: string
  publishedAt: string | null
  locale: string | null
}

// FAQ types
export interface QuestionAnswer {
  id: number
  question: string
  answer: string
}

export interface FAQ {
  id: number
  documentId: string
  title: string
  questionAnswer: QuestionAnswer[]
  createdAt: string
  updatedAt: string
  publishedAt: string | null
  locale: string | null
}

// Course content section types
export interface HeroContentSection {
  __component: 'hero-layout.hero-layout'
  id: number
  shortLabel: string
  title: string
  shortDescription: string
  promoVideo?: string
  highlightedFeature?: string[] // Define based on your needs
  promoImage?: StrapiImage
  btn: ButtonType[]
}

export interface ProjectContentSection {
  __component: 'project-layout.project-layout'
  id: number
  title: string
  description: string
  projects: Project[]
}

export interface CourseBundleContentSection {
  __component: 'course-layout.course-bundle-layout'
  id: number
  title: string
  description: string
  courseBundles: CourseBundle[]
}

export interface ReviewContentSection {
  __component: 'review-layout.review-layout'
  id: number
  title: string
  description: string
  reviews: Review[]
}

export interface AuthorContentSection {
  __component: 'author-layout.author-layout'
  id: number
  title: string
  description: string
  instructor: Instructor
}

export interface FAQContentSection {
  __component: 'faq-layout.faq-section'
  id: number
  title: string
  faq: FAQ
}

// Union type for all content sections
export type CourseContentSection =
  | HeroContentSection
  | ProjectContentSection
  | ReviewContentSection
  | AuthorContentSection
  | FAQContentSection
  | CourseBundleContentSection // Add this line

// Main course page data type
export interface CoursePageData {
  id: number
  documentId: string
  courseName: string
  overviewFeatures: OverviewFeature[]
  highlightFeature: HighlightFeature
  baseContent: CourseBase & {
    courseBundles: CourseBundle[]
    curriculum: Curriculum
    contentSection: CourseContentSection[]
  }
  createdAt: string
  updatedAt: string
  publishedAt: string | null
  locale: string | null
}

// Component type mapping for type safety
export type CourseComponentType =
  | 'hero-layout.hero-layout'
  | 'project-layout.project-layout'
  | 'review-layout.review-layout'
  | 'author-layout.author-layout'
  | 'faq-layout.faq-section'
  | 'course-layout.course-bundle-layout' // Add this line

export type CourseComponentDataMap = {
  'hero-layout.hero-layout': HeroContentSection
  'project-layout.project-layout': ProjectContentSection
  'review-layout.review-layout': ReviewContentSection
  'author-layout.author-layout': AuthorContentSection
  'faq-layout.faq-section': FAQContentSection
  'course-layout.course-bundle-layout': CourseBundleContentSection // Add this line
}

// Re-export shared types for convenience
export type {
  StrapiImage,
  StrapiIcon,
  Category,
  ButtonType,
  Profile,
  Review,
  SEOData,
  CourseBase,
  StrapiResponse,
}

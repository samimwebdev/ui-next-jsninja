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
  Project,
  HighlightFeature,
  Feature,
  Instructor,
  Curriculum,
  FAQ,
  Lesson,
} from './shared-types'

// Course bundle types
export interface CourseBundle {
  id: number
  documentId: string
  title: string
  shortDescription: string
  price: number
  helperText?: string | null
  features?: Feature[]
  courseBases: CourseBase[]
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
  courseBundle: CourseBundle
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

interface OverviewFeature {
  id: number
  title: string
  icon: StrapiIcon | null
  features: Feature[]
}
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
  Project,
  ButtonType,
  Profile,
  Review,
  SEOData,
  CourseBase,
  StrapiResponse,
  Curriculum,
  Lesson,
}

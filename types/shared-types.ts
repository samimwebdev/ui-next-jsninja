import { CourseType } from './checkout-types'

// Shared Image types
export interface StrapiImage {
  id: number
  documentId: string
  name: string
  url: string
  alternativeText?: string | null
  caption?: string | null
  width: number
  height: number
  formats?: {
    thumbnail?: ImageFormat
    small?: ImageFormat
    medium?: ImageFormat
    large?: ImageFormat
  }
  hash: string
  ext: string
  mime: string
  size: number
  previewUrl?: string | null
  provider: string
  provider_metadata?: {
    public_id: string
    resource_type: string
  }
  folderPath: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale?: string | null
}

export interface ImageFormat {
  name: string
  hash: string
  ext: string
  mime: string
  path: string | null
  width: number
  height: number
  size: number
  sizeInBytes: number
  url: string
  provider_metadata?: {
    public_id: string
    resource_type: string
  }
}

// Shared Icon type
export interface StrapiIcon {
  iconName: string
  iconData: string
  width: number
  height: number
}

// Shared Category type
export interface Category {
  id: number
  documentId: string
  name: string
  description: string
  slug: string
  createdAt: string
  updatedAt: string
  publishedAt: string | null
  locale: string | null
}

// Shared Button type
export interface ButtonType {
  id: number
  btnLabel: string
  btnLink: string | null
  btnIcon?: StrapiIcon
}

// Shared Profile type
export interface Profile {
  id: number
  documentId: string
  firstName: string
  lastName: string
  address: string
  bio: string
  discordUsername: string
  phoneNumber: string
  email: string
  imageUrl: string
  image: StrapiImage
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale: string | null
}

// Shared Review type
export interface Review {
  id: number
  documentId: string
  rating: number
  reviewApproved: boolean
  reviewDetails: string
  reviewerName: string
  profile?: Profile
  designation?: string
  course?: CourseBase
}

export interface Video {
  id: number
  title: string
  shortDescription: string
  videoURL: string
}
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

export interface Lesson {
  id: number
  documentId: string
  title: string
  order: number
  duration: number
  type: 'video' | 'text'
  content?: string | null
  videoUrl?: string
  isFree: boolean
  icon?: StrapiIcon | null
}

export interface Module {
  id: number
  documentId: string
  title: string
  description?: string | null
  order: number
  duration: number
  lessons: Lesson[]
}

export interface Curriculum {
  id: number
  title: string
  description: string
  modules: Module[]
}

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

// Shared SEO types
export interface MetaSocial {
  id: number
  socialNetwork: string
  title: string
  description: string
  image?: StrapiImage
}

type StructuredData = {
  '@context': 'https://schema.org'
  '@type': 'website'
  name: string
  url: string
  description: string
  provider: {
    '@type': 'Organization'
    name: string
    logo: {
      '@type': 'ImageObject'
      url: string
    }
    sameAs: string[]
  }
}

export interface SEOData {
  id: number
  metaTitle?: string
  metaDescription?: string
  keywords?: string
  metaRobots?: string
  structuredData?: StructuredData
  metaViewport?: string
  canonicalURL?: string
  metaSocial?: MetaSocial[]
  metaImage?: StrapiImage
}

// Shared Course Base type
export interface CourseBase {
  id: number
  documentId: string
  title: string
  slug: string
  price: number
  level: string
  featured?: boolean
  totalStudents: number
  averageRating: number
  isRegistrationEnabled: boolean
  totalLessons: number
  totalModules: number | null
  shortDescription: string
  longDescription: string
  duration: number | string
  startingFrom?: string
  courseType: CourseType
  categories: Category[]
  featureImage?: StrapiImage
  seo?: SEOData
}

export interface Project {
  id: number
  documentId: string
  title: string
  description: string
  technology: string
  image: StrapiImage
}

export interface Feature {
  id: number
  feature: string
}

export interface HighlightFeature {
  id: number
  title: string
  icon: StrapiIcon | null
  features: Feature[]
}

export interface NestedMenu {
  id: number
  title: string
  url: string
  target?: string
  isProtected?: boolean
  children?: NestedMenu[]
  shortDescription?: string
  icon?: string
}
export interface MenuItem {
  id: number
  title: string
  url: string
  target?: string
  isProtected?: boolean
  children?: NestedMenu[]
}

export interface Menu {
  id: string
  documentId: string
  title: string
  slug: string
  items: MenuItem[]
}

// Define the user type
export type User = {
  id: number
  documentId: string // Assuming this is the user ID in your Strapi setup
  email: string
  username: string
  confirmed?: boolean
  blocked?: boolean
  profile?: Profile
} | null

export interface UserWithProfile {
  id: number
  email: string
  documentId: string
  username: string
  confirmed?: boolean
  blocked?: boolean
  profile?: Profile
}

// Shared Strapi Response type
export interface StrapiResponse<T> {
  data: T
  meta: {
    pagination?: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

// Assignment related types
export interface AssignmentRequirement {
  id: number
  order: number
  instruction: string
}

export interface Assignment {
  id: number
  documentId: string
  title: string
  description: string
  dueDate: string
  score: number
  submissionType: string
  requirements: AssignmentRequirement[]
}

// Resource related types
export interface LessonResource {
  id: number
  documentId: string
  title: string
  description: string
  type: string
  url: string
  resourceIcon: StrapiIcon | null
}

// Quiz related types
export interface QuizOption {
  id: string
  text: string
}

export interface QuizQuestion {
  id: number
  documentId: string
  title: string
  options: QuizOption[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  questionType: 'multipleChoice' | 'singleChoice' | 'trueFalse' | 'essay'
  text: string
  tags: string
  points: number
  timeLimit: number
}

export interface Quiz {
  id: number
  documentId: string
  title: string
  passingScore: number
  instructions: string
  questions: QuizQuestion[]
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale: string | null
}

// Video link types
export interface VideoLink {
  id: number
  documentId: string
  title: string
  piracyNotice: string
  videoNotPlayed: string
  community: string
}

// Enhanced Lesson type (extending the existing one)
export interface LessonDetailed extends Lesson {
  assignment?: Assignment
  resources?: LessonResource[]
  quiz?: Quiz
  videoLink?: VideoLink
}

// Enhanced Module type
export interface ModuleDetailed extends Omit<Module, 'lessons'> {
  lessons: LessonDetailed[]
}

// Enhanced Curriculum type
export interface CurriculumDetailed extends Omit<Curriculum, 'modules'> {
  modules: ModuleDetailed[]
}

// User progress types
export interface CompletedLesson extends Lesson {
  completed: boolean
}

export interface UserProgress {
  id: number
  documentId: string
  certificateIssued: boolean
  certificateIssuedAt: string | null
  certificateUrl: string | null
  isCourseCompleted: boolean
  courseType: 'course' | 'bootcamp' | 'workshop'
  startDate: string
  lastAccessDate: string
  progress: number
  totalLessons: number
  completedLessons: CompletedLesson[]
}

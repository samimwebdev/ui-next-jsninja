import { StrapiIcon } from './shared-types'

export interface CourseViewData {
  id: number
  documentId: string
  title: string
  description: string
  slug: string
  duration: number // Total course duration in seconds
  level: string
  curriculum: {
    totalDuration: number
    totalLessons: number
    modules: Module[]
  }
  userProgress: UserProgress
  userAccess: UserAccess
}

export interface Course {
  id: number
  documentId: string
  title: string
  description: string
  slug: string
  instructor: Instructor
  price: number
  discount?: Discount
  rating: number
  reviewsCount: number
  studentsCount: number
  duration: number
  level: string
  language: string
  thumbnail: Media
  preview?: Media
  categories: Category[]
  tags: Tag[]
  features: string[]
  requirements: string[]
  whatYouWillLearn: string[]
  createdAt: string
  updatedAt: string
}

export interface UserProgress {
  completedLessons: Array<{
    id: number
    documentId: string
    completedAt: string
    timeSpent: number
  }>
  currentLesson?: {
    id: number
    documentId: string
    moduleId: number
    progress: number
    lastWatchedAt: string
  }
  completionPercentage: number
  totalTimeSpent: number
  enrollmentDate: string
  lastAccessedAt: string
}

export interface UserAccess {
  hasAccess: boolean
  accessType: 'free' | 'paid' | 'subscription'
  expiresAt?: string
  purchaseDate?: string
}

export interface Instructor {
  id: number
  name: string
  bio?: string
  avatar?: Media
  socialLinks?: SocialLink[]
}

export interface Media {
  id: number
  url: string
  alternativeText?: string
  caption?: string
  width?: number
  height?: number
}

export interface Category {
  id: number
  name: string
  slug: string
}

export interface Tag {
  id: number
  name: string
  slug: string
}

export interface Resource {
  id: number
  documentId: string
  title: string
  type: 'video' | 'github' | 'link' | 'docs'
  url: string
  resourceIcon: StrapiIcon | null
  description?: string
}

export interface Requirement {
  id: number
  order: number
  instruction?: string
}
interface VideoLink {
  id: number
  documentId: string
  piracyNotice?: string
  videoNotPlayed: string
  community: string
  title: string
  description?: string
}

export interface Assignment {
  id: number
  documentId: string
  title: string
  description: string
  instructions: string
  dueDate?: string
  score: number
  // status: 'pending' | 'submitted' | 'graded'
  status?: 'pending' | 'submitted' | 'graded'
  submission?: {
    id?: number
    githubRepo?: string
    githubLive?: string
    code?: string
    submittedAt?: string
  }
  submissionType: string
  requirements: Requirement[]
  videoLink?: VideoLink
}

export interface Quiz {
  id: number
  documentId: string
  instructions: string
  title: string
  description?: string
  questions: QuizQuestion[]
  timeLimit?: number
  passingScore: number
}

export interface QuizQuestion {
  id: number
  documentId: string
  title: string
  questionType: 'multipleChoice' | 'trueFalse' | 'singleChoice'
  options: Array<{
    id: string
    text: string
  }>
  correctAnswer?: string | number
  explanation?: string
  points: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  timeLimit: number
  tags: string
  text: string
}

export interface Discount {
  id: number
  percentage: number
  validUntil: string
  code?: string
}

export interface SocialLink {
  platform: string
  url: string
}

// Additional types for component compatibility
export interface CurrentContent {
  courseId: string
  moduleId: number // Changed from string to number to match your data
  lessonId: string // Changed from string to number to match your data
  title: string
  type: 'video' | 'text'
  duration: string | number // Changed to string for formatted duration
  content: string // Changed to string for text content
  icon: StrapiIcon | null // Optional icon for the lesson
  videoUrl?: string // Optional video URL for video lessons
  resources?: Resource[] // Optional resources for the lesson
  assignment?: Assignment // Optional assignment for the lesson
  quiz?: Quiz // Optional quiz for the lesson
  videoLink?: VideoLink // Optional video link for the lesson
}

export interface ComponentLesson {
  id: number
  title: string
  duration: string
  type: 'video' | 'text'
  completed: boolean
  isFree: boolean
}

export interface ComponentModule {
  id: string
  title: string
  completed: boolean
  lessons: ComponentLesson[]
}

// Raw lesson data from Strapi API
export interface StrapiLesson {
  id: number
  documentId: string
  title: string
  description?: string
  content?: string
  type: 'Video' | 'Text' | 'Quiz'
  duration: number // Raw duration in seconds
  order: number
  isFree: boolean
  icon?: StrapiIcon | null
  videoUrl?: string
  resources?: Resource[]
  assignment?: Assignment
  completed: boolean
  quiz?: Quiz
}

// Transformed lesson data for components
export interface Lesson {
  id: number
  documentId: string
  title: string
  content: string
  duration: string // Formatted duration like "5:30"
  type: string
  completed: boolean
  isFree: boolean
  order: number
  icon: StrapiIcon | null
  videoUrl?: string
  resources?: Resource[]
  videoLink?: VideoLink // Optional video link for the lesson
  assignment?: Assignment
  quiz?: Quiz
}

export interface Module {
  id: number
  documentId: string
  order: number
  duration: number // Keep as number for modules
  title: string
  completed: boolean
  lessons: Lesson[]
}

// Add interfaces for the raw Strapi data (what comes from API)
export interface StrapiModule {
  id: number
  documentId: string
  title: string
  description?: string
  order: number
  duration: number
  lessons: StrapiLesson[]
}

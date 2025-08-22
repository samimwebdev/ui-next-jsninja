import { Lesson, Module, StrapiIcon } from './shared-types'

export interface CompletedLesson {
  id: number
  documentId: string
  title: string
  order: number
  duration: number
  type: 'video' | 'text'
  content: string | null
  videoUrl: string
  icon: StrapiIcon | null
}

export interface LastAccessedLesson {
  id: number
  documentId: string
  startedAt: string
  completedAt: string | null
  timeSpent: number
  notes: string
  lessonStatus: 'completed' | 'inProgress' | 'notStarted'
  lastPosition: number
  module: Module
  lesson: Lesson
}

export interface Progress {
  completedLessons: CompletedLesson[]
  totalLessons: number
  completedCount: number
  percentage: number
  lastAccessDate: string
  lastAccessedLesson: LastAccessedLesson | null
}

export interface EnrolledCourse {
  documentId: string
  id: number
  title: string
  slug: string
  goal: string
  totalStudents: number
  duration: string
  enrolledDate: string
  startDate: string
  expiryDate: string
  isExpired: boolean
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  progress: Progress
}

export interface EnrolledBootcamp {
  documentId: string
  id: number
  title: string
  slug: string
  goal: string
  totalStudents: number
  duration: string
  enrolledDate: string
  startDate: string
  expiryDate: string
  isExpired: boolean
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  progress: Progress
}

export interface EnrolledCoursesResponse {
  data: {
    courses: EnrolledCourse[]
    bootcamps: EnrolledBootcamp[]
  }
}

export interface OrderCourse {
  id: number
  documentId: string
  title: string
  slug: string
  courseType: 'course' | 'bootcamp'
}

export interface Order {
  id: number
  documentId: string
  date: string
  paymentInfo: 'string'
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale: string | null
  amount: number
  transactionId: string
  courseType: 'course' | 'bootcamp'
  paymentMethod: string
  orderStatus: 'Paid' | 'Pending' | 'Failed' | 'Cancelled' | 'Refunded'
  course: OrderCourse
}

export interface OrdersResponse {
  data: Order[]
}

export interface LocationData {
  country: string
  countryCode: string
  region: string
  city: string
  latitude: number
  longitude: number
  timezone: string
  isp: string
}

export interface BrowserData {
  userAgent: string
  language: string
  platform: string
  screenResolution: string
  timezone: string
  plugins: string[]
}

export interface LoginHistoryItem {
  id: number
  location: LocationData
  ipAddress: string
  accessDate: string
  accessType:
    | 'first_access'
    | 'same_ip_different_browser'
    | 'different_ip_same_browser'
  browserData: BrowserData
  requiresApproval: boolean
  isApproved: boolean
  fingerprintId: string
}

export interface LoginHistoryData {
  publishedAt: string
  locale: string | null
  isBlocked: boolean
  loginHistory: LoginHistoryItem[]
}

export interface LoginHistoryResponse {
  data: LoginHistoryData
}

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
  courseType: 'course' | 'bootcamp' | 'workshop'
}

export interface OrderCourseBundle {
  id: number
  documentId: string
  title: string
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
  courseType: 'course' | 'bootcamp' | 'workshop' | 'course-bundle'
  paymentMethod: string
  orderStatus: 'Paid' | 'Pending' | 'Failed' | 'Cancelled' | 'Refunded'
  course?: OrderCourse
  courseBundle?: OrderCourseBundle
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
  data: LoginHistoryData | null
  error?: {
    status: number
    name: string
    message: string
  }
}

export interface StatsModule {
  id: number
  documentId: string
  title: string
  order: number
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale: string | null
  description: string
  duration: number
}

export interface StatsLesson {
  id: number
  documentId: string
  title: string
  order: number
  duration: number
  type: 'video' | 'text'
  content: string | null
  videoUrl: string
  completed: boolean
  isFree: boolean
  icon: StrapiIcon | null
}

export interface StatsAssignment {
  documentId: string
  title: string
  submittedAt: string
  deadline: string
  status: 'graded' | 'pending' | 'submitted' | 'overdue'
  score: number
  totalScore: number
}

export interface StatsQuiz {
  documentId: string
  title: string
  completedAt: string
  score: number
  totalScore: number
  passed: boolean
}

export interface WeeklyStats {
  totalTimeSpent: number
  totalLessons: number
  completedLessons: number
  inProgressLessons: number
  cumulativeTimeSpent: number
}

export interface WeeklyCourseProgress {
  week: number
  weekStart: string
  weekEnd: string
  weeklyStats: WeeklyStats
}

export interface CourseStatsData {
  totalLessons: number
  completedModules: StatsModule[]
  totalModules: number
  completedLessons: StatsLesson[]
  progress: number
  assignments: StatsAssignment[]
  quizzes: StatsQuiz[]
  dailyStrength: Record<string, 'no' | 'weak' | 'medium' | 'strong'>
  weeklyCourseProgress: WeeklyCourseProgress[]
  totalLessonsWatchingTimeSpent: number
}

export interface CourseStatsResponse {
  data: CourseStatsData
}

export interface LeaderboardEntry {
  userId: string
  fullName: string
  email: string
  course: string
  totalScore: number
  totalAssignmentScore: number
  progress: number | null
  rank: number
  isCurrentUser: boolean
}

export interface UserScoreboard {
  userId: string
  fullName: string
  email: string
  course: string
  totalScore: number
  totalAssignmentScore: number
  progress: number | null
  rank: number
  isInTop10: boolean
}

export interface LeaderboardData {
  leaderboard: LeaderboardEntry[]
  userScoreboard: UserScoreboard
}

export interface LeaderboardResponse {
  data: LeaderboardData | null
  error?: {
    status: number
    name: string
    message: string
  }
}

export interface Certificate {
  courseName: string
  issuedOn: string
  certificateId: string
  recipientName?: string
  duration: string
  skillsAchieved: string
  totalQuizMarks: number
  totalAssignmentMarks: number
  receivedQuizMarks: number
  receivedAssignmentMarks: number
  certificateUrl: string
  isTopPerformer: boolean
  grade: string
  percentage: number
  totalMarks: number
}

export interface CertificatesResponse {
  data: Certificate[]
}

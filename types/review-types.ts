// types/review-types.ts
export interface Review {
  id: number
  documentId: string
  createdAt: string
  updatedAt: string
  publishedAt: string | null
  rating: number
  reviewApproved: boolean
  reviewDetails: string
  reviewerName: string
  designation: string
  submittedDate: string | null
  course: {
    id: number
    documentId: string
    title: string
  }
}

export interface EnrolledCourse {
  courseId: string
  courseName: string
}

export interface ReviewsResponse {
  data: {
    reviews: Review[]
    enrolledCourses: EnrolledCourse[]
  }
}

export interface CreateReviewData {
  content: string
  rating: number
  courseId: string
  designation: string // Added designation
}

export interface UpdateReviewData {
  documentId: string
  content: string
  rating: number // Added rating for update
  designation: string // Added designation
}

export interface CreateReviewResponse {
  message: string
  data: {
    id: number
    documentId: string
    createdAt: string
    updatedAt: string
    publishedAt: string | null
    rating: number
    reviewApproved: boolean
    reviewDetails: string
    reviewerName: string
    designation: string
    submittedDate: string
  }
}

export interface ApiError {
  data: null
  error: {
    status: number
    name: string
    message: string
    details: Record<string, string>
  }
}

import { Profile } from './shared-types'

export interface TaskSubmission {
  id: number
  documentId: string
  feedback: string | null
  submissionStatus: 'pending' | 'submitted' | 'graded' | 'rejected'
  createdAt: string
  updatedAt: string
  publishedAt: string
  submittedDate: string
  resultScore: number | null
  repoLink: string | null
  liveLink: string | null
  code: string | null
  reviewedDate: string | null
  user: {
    id: number
    documentId: string
    username: string
    email: string
    provider: string
    confirmed: boolean
    blocked: boolean
    createdAt: string
    updatedAt: string
    publishedAt: string
    enableTotp: boolean | null
    profile: Profile | null
  }
  assignment: {
    id: number
    documentId: string
    title: string
    description: string
    dueDate: string
    score: number
    createdAt: string
    updatedAt: string
    publishedAt: string | null
    submissionType: string
  }
}

export interface TaskSubmissionsResponse {
  data: TaskSubmission[]
  meta: {
    pagination?: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

export interface UpdateTaskReviewRequest {
  score: number
  feedback: string
}

export interface UpdateTaskReviewResponse {
  data: TaskSubmission
}

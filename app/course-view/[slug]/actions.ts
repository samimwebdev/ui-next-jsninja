'use server'

import { getAuthToken } from '@/lib/auth'
import { strapiFetch } from '@/lib/strapi'
import { revalidateTag } from 'next/cache'
import type {
  ExistingQuizSubmission,
  CourseQuizSubmissionResponse,
} from '@/types/course-quiz-types'

// Define and export types properly
export interface QuizSubmissionData {
  answers: Array<{
    questionId: string
    selectedAnswers: string[]
  }>
}

export interface ExistingAssignmentSubmission {
  id: number
  documentId: string
  feedback: string | null
  submissionStatus: 'submitted' | 'pending' | 'graded'
  submittedDate: string
  resultScore: number | null
  repoLink: string | null
  liveLink: string | null
  code: string | null
}

export interface AssignmentSubmissionRequest {
  courseId: string
  assignmentId: string
  repoLink?: string
  liveLink?: string
  code?: string
}

export interface AssignmentSubmissionResponse {
  data: ExistingAssignmentSubmission
}

// Quiz Actions
export async function getQuizSubmission(
  courseSlug: string,
  moduleDocumentId: string,
  lessonDocumentId: string,
  quizId: string
): Promise<ExistingQuizSubmission | null> {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Authentication required')
    }

    const apiUrl = `/api/course-view/${courseSlug}/${moduleDocumentId}/${lessonDocumentId}/${quizId}/assessment-quiz`

    const response = await strapiFetch<ExistingQuizSubmission>(apiUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: { tags: [`quiz-submission-${quizId}`] },
    })

    return response
  } catch (error) {
    console.log('No existing quiz submission found', error)
    return null
  }
}

export async function submitQuiz(
  courseSlug: string,
  moduleDocumentId: string,
  lessonDocumentId: string,
  quizId: string,
  submissionData: QuizSubmissionData
): Promise<CourseQuizSubmissionResponse> {
  const token = await getAuthToken()
  if (!token) {
    throw new Error('Authentication required')
  }

  const apiUrl = `/api/course-view/${courseSlug}/${moduleDocumentId}/${lessonDocumentId}/${quizId}/assessment-quiz`

  const response = await strapiFetch<CourseQuizSubmissionResponse>(apiUrl, {
    method: 'POST',
    body: JSON.stringify(submissionData),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  // Revalidate the cache for this quiz submission
  revalidateTag(`quiz-submission-${quizId}`)

  return response
}

// Assignment Actions
export async function getAssignmentSubmission(
  courseId: string,
  assignmentId: string
): Promise<ExistingAssignmentSubmission | null> {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Authentication required')
    }

    const queryParams = new URLSearchParams({
      courseId: courseId || '',
      assignmentId: assignmentId,
    }).toString()

    const response = await strapiFetch<{
      data: ExistingAssignmentSubmission
    }>(`/api/assignment-submissions?${queryParams}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: { tags: [`assignment-submission-${assignmentId}`] },
    })

    return response.data
  } catch (error) {
    console.log('No existing assignment submission found', error)
    return null
  }
}

export async function submitAssignment(
  submissionData: AssignmentSubmissionRequest
): Promise<AssignmentSubmissionResponse> {
  const token = await getAuthToken()
  if (!token) {
    throw new Error('Authentication required')
  }

  const response = await strapiFetch<AssignmentSubmissionResponse>(
    '/api/assignment-submissions',
    {
      method: 'POST',
      body: JSON.stringify({ data: submissionData }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  )

  // Revalidate the cache for this assignment submission
  revalidateTag(`assignment-submission-${submissionData.assignmentId}`)

  return response
}

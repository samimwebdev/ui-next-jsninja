'use server'

import { getAuthToken } from '@/lib/auth'
import { strapiFetch } from '@/lib/strapi'
import { revalidateTag } from 'next/cache'
import type {
  ExistingQuizSubmission,
  CourseQuizSubmissionResponse,
} from '@/types/course-quiz-types'

interface SecurityData {
  accessType: string
  ipAddress: string
  locationData: {
    country: string
    countryCode: string
    region: string
    city: string
    latitude: number
    longitude: number
    timezone: string
    isp: string
  }
  fingerprintId: string
  isTracked: boolean
}

interface SecurityResponse {
  error: boolean
  data: SecurityData | null
  response?: string
}

interface SecurityError {
  data: null
  response: string
}

interface BrowserData {
  userAgent: string
  language: string
  platform: string
  screenResolution: string
  timezone: string
  plugins: string[]
}

export interface SecurityTrackingResult {
  success: boolean
  error?: boolean
  message?: string
  shouldRedirect?: boolean
}

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
export interface ExistingQuizSubmissionErrorResponse {
  data: null
  error: {
    status: number
    message: string
  }
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

    const response = await strapiFetch<
      ExistingQuizSubmission | ExistingQuizSubmissionErrorResponse
    >(apiUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: {
        tags: [`quiz-submission-${quizId}`],
      },
      allowNotFound: true,
    })

    // Type guard to check if response is an error
    if (
      'error' in response &&
      response.error &&
      response.error.status === 404
    ) {
      console.log('No existing quiz submission found', response.error)
      return null
    }

    // Type guard to check if response is ExistingQuizSubmission
    if ('data' in response && response.data) {
      return response.data as ExistingQuizSubmission
    }

    // Fallback - should not reach here normally
    return null
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
      data: ExistingAssignmentSubmission | ExistingQuizSubmissionErrorResponse
    }>(`/api/assignment-submissions?${queryParams}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      next: { tags: [`assignment-submission-${assignmentId}`] },
      allowNotFound: true,
    })

    if ('error' in response && response.error) {
      console.log('No existing assignment submission found', response.error)
      return null
    }

    return response.data as ExistingAssignmentSubmission
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

export async function trackCourseViewSecurity(
  courseSlug: string,
  fingerprintId: string,
  browserData: BrowserData,
  testOverrideIP?: string
): Promise<SecurityTrackingResult> {
  try {
    // Get auth token from server-side cookies
    const token = await getAuthToken()

    if (!token) {
      return {
        success: false,
        error: true,
        message: 'Authentication required',
        shouldRedirect: true,
      }
    }

    console.log('Server: Tracking course view security for:', courseSlug)

    const trackingResponse = await strapiFetch<
      SecurityResponse | SecurityError
    >(`/api/course-view/${courseSlug}/security`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        fingerprintId,
        browserData,
        // Only include testOverrideIP in development
        ...(process.env.NODE_ENV === 'development' &&
          testOverrideIP && {
            testOverrideIP,
          }),
      }),
      returnErrorResponse: true,
    })

    // Check the response from POST request
    if ('error' in trackingResponse && trackingResponse.error) {
      // User is blocked - POST request returned error
      console.log(
        'Server: Access restricted for user:',
        trackingResponse.response
      )

      return {
        success: false,
        error: true,
        message: trackingResponse.response || 'Access restricted',
        shouldRedirect: true,
      }
    } else if ('data' in trackingResponse && trackingResponse.data) {
      // User is allowed - POST request was successful
      console.log('Server: Access allowed for user')

      return {
        success: true,
        error: false,
        message: 'Access granted',
      }
    }

    // Unexpected response format
    return {
      success: false,
      error: true,
      message: 'Unexpected response from security service',
      shouldRedirect: false,
    }
  } catch (error) {
    console.error('Server: Failed to track course view security:', error)

    // If tracking fails due to network/server issues, allow access
    // Don't block the user completely
    return {
      success: true,
      error: false,
      message: 'Security check failed, access granted with warning',
    }
  }
}

// Optional: Additional server action for just checking security status
export async function checkCourseViewSecurity(
  courseSlug: string
): Promise<SecurityTrackingResult> {
  try {
    const token = await getAuthToken()

    if (!token) {
      return {
        success: false,
        error: true,
        message: 'Authentication required',
        shouldRedirect: true,
      }
    }

    const securityResponse = await strapiFetch<
      SecurityResponse | SecurityError
    >(`/api/course-view/${courseSlug}/security`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      returnErrorResponse: true,
    })

    if ('error' in securityResponse && securityResponse.error) {
      return {
        success: false,
        error: true,
        message: securityResponse.response || 'Access restricted',
        shouldRedirect: true,
      }
    }

    return {
      success: true,
      error: false,
      message: 'Access verified',
    }
  } catch (error) {
    console.error('Server: Failed to check course view security:', error)

    return {
      success: true,
      error: false,
      message: 'Security check failed, access granted with warning',
    }
  }
}

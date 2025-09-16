'use server'

import { getAuthToken } from '@/lib/auth'
import { strapiFetch } from '@/lib/strapi'
import { QuizSubmissionResponse } from '@/types/bootcamp-page-types'

interface AssessmentAnswer {
  questionId: string
  selectedAnswers: string[]
}

interface AssessmentSubmissionData {
  answers: AssessmentAnswer[]
}

export interface AssessmentSubmissionResult {
  success: boolean
  data?: QuizSubmissionResponse
  error?: string
}

export async function submitBootcampAssessment(
  bootcampSlug: string,
  submissionData: AssessmentSubmissionData
): Promise<AssessmentSubmissionResult> {
  try {
    const token = await getAuthToken()

    if (!token) {
      return {
        success: false,
        error: 'Authentication required',
      }
    }

    const results = await strapiFetch<QuizSubmissionResponse>(
      `/api/bootcamps/${bootcampSlug}/assessment-quiz`,
      {
        method: 'POST',
        body: JSON.stringify(submissionData),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    )

    return {
      success: true,
      data: results,
    }
  } catch (error) {
    console.error('Server: Failed to submit bootcamp assessment:', error)

    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to submit assessment',
    }
  }
}

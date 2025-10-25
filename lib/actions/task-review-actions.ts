'use server'

import { strapiFetch } from '@/lib/strapi'
import { getAuthToken, getUser } from '@/lib/auth'
import {
  TaskSubmissionsResponse,
  UpdateTaskReviewRequest,
  UpdateTaskReviewResponse,
} from '@/types/task-submission-types'
import { redirect } from 'next/navigation'

/**
 * Check if user has permission to review tasks
 */
export async function canReviewTasks(): Promise<boolean> {
  try {
    const user = await getUser()

    if (!user?.role) {
      return false
    }

    // Check if user is Admin or Moderator
    const allowedRoles = ['admin', 'moderator']
    return allowedRoles.includes(user.role.type.toLowerCase())
  } catch (error) {
    console.error('Error checking review permission:', error)
    return false
  }
}

/**
 * Fetch all task submissions for review
 */
export async function getTasksToReview(): Promise<TaskSubmissionsResponse> {
  try {
    const token = await getAuthToken()

    if (!token) {
      redirect('/login?redirect=/dashboard/review-tasks')
    }

    // Check permissions
    const hasPermission = await canReviewTasks()
    if (!hasPermission) {
      throw new Error('You do not have permission to review tasks')
    }

    const response = await strapiFetch<TaskSubmissionsResponse>(
      '/api/tasks-to-review',
      {
        method: 'GET',
        token,
        next: {
          tags: ['task-to-review'],
        },
        cache: 'no-store',
      }
    )

    return response
  } catch (error) {
    console.error('Failed to fetch tasks to review:', error)
    throw new Error(
      error instanceof Error ? error.message : 'Failed to fetch tasks'
    )
  }
}

/**
 * Update task review with score and feedback
 */
export async function updateTaskReview(
  reviewId: string,
  data: UpdateTaskReviewRequest
): Promise<UpdateTaskReviewResponse> {
  try {
    const token = await getAuthToken()

    if (!token) {
      throw new Error('Authentication required')
    }

    // Check permissions
    const hasPermission = await canReviewTasks()
    if (!hasPermission) {
      throw new Error('You do not have permission to review tasks')
    }

    // Validate data
    if (typeof data.score !== 'number' || data.score < 0 || data.score > 100) {
      throw new Error('Score must be a number between 0 and 100')
    }

    if (!data.feedback || data.feedback.trim().length === 0) {
      throw new Error('Feedback is required')
    }

    const response = await strapiFetch<UpdateTaskReviewResponse>(
      `/api/assignment-submissions/${reviewId}`,
      {
        method: 'PUT',
        token,
        body: JSON.stringify({
          data: {
            resultScore: data.score,
            feedback: data.feedback,
            submissionStatus: 'graded',
            reviewedDate: new Date().toISOString(),
          },
        }),
        cache: 'no-store',
      }
    )
    // revalidateTag('task-to-review')
    // revalidatePath('/dashboard/review-tasks')
    return response
  } catch (error) {
    console.error('Failed to update task review:', error)
    throw new Error(
      error instanceof Error ? error.message : 'Failed to update review'
    )
  }
}

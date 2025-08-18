'use server'

import { strapiFetch } from '@/lib/strapi'
import { getAuthToken } from './auth'

export interface LessonProgressPayload {
  startedAt: string
  lastPosition: number
  timeSpent: number
  lessonStatus: 'completed' | 'inProgress'
  isModuleCompleted: boolean
}

export interface UserProgressResponse {
  id: number
  documentId: string
  certificateIssued: boolean
  certificateIssuedAt: string | null
  certificateUrl: string | null
  isCourseCompleted: boolean
  courseType: string
  startDate: string
  lastAccessDate: string
  progress: number
  totalLessons: number
  lastAccessedLesson: {
    id: number
    documentId: string
    startedAt: string
    completedAt: string | null
    lastPosition: number | null
    timeSpent: number
    notes: string
    lessonStatus: 'completed' | 'inProgress'
  }
  completedLessons: Array<{
    id: number
    documentId: string
    title: string
    order: number
    duration: number
    type: string
    content: string
    videoUrl: string
    isFree: boolean
    icon: {
      iconName: string
      iconData: string
      width: number
      height: number
    }
  }>

  user?: {
    id: number
    documentId: string
    email: string
  }
}

export async function initializeCourseProgress(
  courseDocumentId: string
): Promise<UserProgressResponse> {
  const token = await getAuthToken()

  if (!token) {
    throw new Error('you are not authenticated')
  }

  const response = await strapiFetch<UserProgressResponse>(
    `/api/user-progress/${courseDocumentId}`,
    {
      method: 'GET',
      token,
    }
  )

  return response
}

export async function updateLessonProgress(
  courseDocumentId: string,
  moduleDocumentId: string,
  lessonDocumentId: string,
  payload: LessonProgressPayload
): Promise<void> {
  const token = await getAuthToken()

  if (!token) {
    throw new Error('you are  not authenticated')
  }

  await strapiFetch(
    `/api/user-progress/${courseDocumentId}/${moduleDocumentId}/${lessonDocumentId}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  )
}

'use server'

import { cache } from 'react'
import { strapiFetch } from '@/lib/strapi'
import { EnrolledUsersResponse } from '@/types/enrolled-users'

export const getEnrolledUsers = cache(
  async (courseId?: string): Promise<EnrolledUsersResponse> => {
    try {
      const path = courseId
        ? `/api/enrolled-users?courseId=${courseId}`
        : '/api/enrolled-users'

      const response = await strapiFetch<EnrolledUsersResponse>(path, {
        next: {
          revalidate: 3600, // Cache for 1 hour
          tags: ['enrolled-users', `course-${courseId}`],
        },
        cache: 'force-cache',
      })

      return response
    } catch (error) {
      console.error('Error fetching enrolled users:', error)
      // Return empty data on error
      return {
        data: [],
        meta: {},
      }
    }
  }
)

'use server'

import { CourseStatsResponse } from '@/types/dashboard-types'
import { getAuthToken } from '../auth'
import { strapiFetch } from '../strapi'
import { cache } from 'react'

export const fetchCourseStats = cache(
  async (courseDocumentId: string): Promise<CourseStatsResponse> => {
    const token = await getAuthToken()

    if (!token) {
      throw new Error('Authentication required to fetch course stats')
    }

    try {
      const data = await strapiFetch<CourseStatsResponse>(
        `/api/user-progress/${courseDocumentId}/stats`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )

      return data
    } catch (err) {
      console.error('Error fetching course stats:', err)
      throw err instanceof Error
        ? err
        : new Error('Failed to fetch course stats')
    }
  }
)

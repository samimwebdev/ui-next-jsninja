'use server'

import { EnrolledCoursesResponse } from '@/types/dashboard-types'
import { getAuthToken } from '../auth'
import { strapiFetch } from '../strapi'
import { cache } from 'react'

export const fetchEnrolledCourses = cache(
  async (): Promise<EnrolledCoursesResponse | null> => {
    const token = await getAuthToken()

    if (!token) {
      throw new Error('Authentication required to fetch orders')
    }

    try {
      const data = await strapiFetch<EnrolledCoursesResponse>(
        '/api/course-access/enrolled-course',
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
      console.error('Error fetching user orders:', err)
      throw err instanceof Error ? err : new Error('Failed to fetch orders')
    }
  }
)

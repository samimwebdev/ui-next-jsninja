'use server'

import { EnrolledCoursesResponse } from '@/types/dashboard-types'
import { getAuthToken } from '../auth'
import { strapiFetch } from '../strapi'
import { cache } from 'react'

export const fetchEnrolledCourses = cache(
  async ({
    isPublicPage,
  }: {
    isPublicPage: boolean
  }): Promise<EnrolledCoursesResponse | null> => {
    const token = await getAuthToken()

    // If no token and it's a public page, return null instead of throwing
    if (!token) {
      if (isPublicPage) {
        return null
      }
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
      console.error('Error fetching Enrolled Courses:', err)

      // On public pages, return null on error instead of throwing
      if (isPublicPage) {
        return null
      }

      throw err instanceof Error
        ? err
        : new Error('Failed to fetch Enrolled Courses')
    }
  }
)

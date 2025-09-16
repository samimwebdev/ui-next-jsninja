'use server'

import { strapiFetch } from '@/lib/strapi'
import { CheckoutCourseResponse, CourseType } from '@/types/checkout-types'
import { getAuthToken } from '@/lib/auth'
import { notFound } from 'next/navigation'

export async function fetchCourseOrderInfo(
  courseSlug: string,
  courseType: CourseType
): Promise<CheckoutCourseResponse> {
  try {
    const token = await getAuthToken()

    if (!token) {
      throw new Error('Authentication required')
    }

    const response = await strapiFetch<CheckoutCourseResponse>(
      `/api/courses/${courseType}/${courseSlug}/order-info`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store', // Always fetch fresh data for checkout
      }
    )

    if (!response?.data) {
      notFound()
    }

    return response
  } catch (error) {
    console.error('Failed to fetch course order info:', error)
    throw new Error('Failed to load course information')
  }
}

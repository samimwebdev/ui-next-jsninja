'use server'

import {
  ReviewsResponse,
  CreateReviewData,
  UpdateReviewData,
  CreateReviewResponse,
  ApiError,
} from '@/types/review-types'
import { getAuthToken } from '../auth'
import { strapiFetch } from '../strapi'
import { cache } from 'react'

export const fetchReviews = cache(async (): Promise<ReviewsResponse> => {
  const token = await getAuthToken()

  if (!token) {
    throw new Error('Authentication required to fetch reviews')
  }

  try {
    const data = await strapiFetch<ReviewsResponse>('/api/reviews', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })

    return data
  } catch (err) {
    console.error('Error fetching reviews:', err)
    throw err instanceof Error ? err : new Error('Failed to fetch reviews')
  }
})

export const createReview = async (
  reviewData: CreateReviewData
): Promise<CreateReviewResponse> => {
  const token = await getAuthToken()

  if (!token) {
    throw new Error('Authentication required to create review')
  }

  try {
    const response = await strapiFetch<CreateReviewResponse | ApiError>(
      '/api/reviews',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          data: {
            content: reviewData.content,
            rating: reviewData.rating,
            courseId: reviewData.courseId,
            designation: reviewData.designation, // Added designation
          },
        }),
      }
    )

    // Check if response is an error
    if ('error' in response) {
      throw new Error(response.error.message || 'Failed to create review')
    }

    return response
  } catch (err) {
    console.error('Error creating review:', err)
    if (err instanceof Error) {
      throw err
    }
    throw new Error('Failed to create review')
  }
}

export const updateReview = async (
  reviewData: UpdateReviewData
): Promise<CreateReviewResponse> => {
  const token = await getAuthToken()

  if (!token) {
    throw new Error('Authentication required to update review')
  }

  try {
    const response = await strapiFetch<CreateReviewResponse | ApiError>(
      `/api/reviews/${reviewData.documentId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          data: {
            content: reviewData.content,
            rating: reviewData.rating, // Added rating for update
            designation: reviewData.designation, // Added designation
          },
        }),
      }
    )

    // Check if response is an error
    if ('error' in response) {
      throw new Error(response.error.message || 'Failed to update review')
    }

    return response
  } catch (err) {
    console.error('Error updating review:', err)
    if (err instanceof Error) {
      throw err
    }
    throw new Error('Failed to update review')
  }
}

export const deleteReview = async (
  reviewDocumentId: string
): Promise<{ message: string }> => {
  const token = await getAuthToken()

  if (!token) {
    throw new Error('Authentication required to delete review')
  }

  try {
    const response = await strapiFetch<{ message: string } | ApiError>(
      `/api/reviews/${reviewDocumentId}`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    )

    // Check if response is an error
    if ('error' in response) {
      throw new Error(response.error.message || 'Failed to delete review')
    }

    return response
  } catch (err) {
    console.error('Error deleting review:', err)
    if (err instanceof Error) {
      throw err
    }
    throw new Error('Failed to delete review')
  }
}

'use server'

import {
  NotificationsResponse,
  MarkReadResponse,
  MarkAllReadResponse,
  NotificationApiError,
} from '@/types/notification-types'
import { getAuthToken } from '../auth'
import { strapiFetch } from '../strapi'
import { cache } from 'react'

export const fetchNotifications = cache(
  async (): Promise<NotificationsResponse> => {
    const token = await getAuthToken()

    if (!token) {
      throw new Error('Authentication required to fetch notifications')
    }

    try {
      const data = await strapiFetch<NotificationsResponse>(
        '/api/user-notifications/all',
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
      console.error('Error fetching notifications:', err)
      throw err instanceof Error
        ? err
        : new Error('Failed to fetch notifications')
    }
  }
)

export const markNotificationAsRead = async (
  notificationDocumentId: string
): Promise<MarkReadResponse> => {
  const token = await getAuthToken()

  if (!token) {
    throw new Error('Authentication required to mark notification as read')
  }

  try {
    const response = await strapiFetch<MarkReadResponse | NotificationApiError>(
      `/api/user-notifications/${notificationDocumentId}/mark-read`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    )

    // Check if response is an error
    if ('error' in response) {
      throw new Error(
        response.error.message || 'Failed to mark notification as read'
      )
    }

    return response
  } catch (err) {
    console.error('Error marking notification as read:', err)
    if (err instanceof Error) {
      throw err
    }
    throw new Error('Failed to mark notification as read')
  }
}

export const markAllNotificationsAsRead =
  async (): Promise<MarkAllReadResponse> => {
    const token = await getAuthToken()

    if (!token) {
      throw new Error(
        'Authentication required to mark all notifications as read'
      )
    }

    try {
      const response = await strapiFetch<
        MarkAllReadResponse | NotificationApiError
      >('/api/user-notifications/mark-all-read', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      // Check if response is an error
      if ('error' in response) {
        throw new Error(
          response.error.message || 'Failed to mark all notifications as read'
        )
      }

      return response
    } catch (err) {
      console.error('Error marking all notifications as read:', err)
      if (err instanceof Error) {
        throw err
      }
      throw new Error('Failed to mark all notifications as read')
    }
  }

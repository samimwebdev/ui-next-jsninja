'use server'
import { cache } from 'react'
import { getAuthToken } from '../auth'
import { strapiFetch } from '../strapi'
import QueryString from 'qs'

interface CurrentUserResponse {
  id: number
  documentId: string // Assuming this is the user ID in your Strapi setup
  email: string
  username: string
  enableTotp?: boolean
  confirmed?: boolean
  blocked?: boolean
}

export const fetchCurrentUser = cache(
  async (): Promise<CurrentUserResponse> => {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Authentication required to fetch current user')
    }
    const query = QueryString.stringify({
      populate: {
        profile: {
          populate: {
            image: true,
          },
        },
      },
    })

    try {
      const data = await strapiFetch<CurrentUserResponse>(
        `/api/users/me?${query}`,
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
      console.error('Error fetching current user:', err)
      throw err instanceof Error
        ? err
        : new Error('Failed to fetch current user')
    }
  }
)

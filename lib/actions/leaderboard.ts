'use server'

import { LeaderboardResponse } from '@/types/dashboard-types'
import { getAuthToken } from '../auth'
import { strapiFetch } from '../strapi'
import { cache } from 'react'

export const fetchLeaderboard = cache(
  async (courseDocumentId: string): Promise<LeaderboardResponse> => {
    const token = await getAuthToken()

    if (!token) {
      throw new Error('Authentication required to fetch leaderboard')
    }

    try {
      const data = await strapiFetch<LeaderboardResponse>(
        `/api/user-progress/${courseDocumentId}/leaderboard`,
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
      console.error('Error fetching leaderboard:', err)
      throw err instanceof Error
        ? err
        : new Error('Failed to fetch leaderboard')
    }
  }
)

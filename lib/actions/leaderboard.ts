'use server'

import { LeaderboardResponse } from '@/types/dashboard-types'
import { getAuthToken } from '../auth'
import { strapiFetch } from '../strapi'
import { cache } from 'react'

export const fetchLeaderboard = cache(
  async (
    courseDocumentId: string
  ): Promise<LeaderboardResponse | { data: null; error: string }> => {
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

      // Handle specific "not available" errors gracefully
      if (
        err instanceof Error &&
        err.message.includes('only available for bootcamps')
      ) {
        return {
          data: null,
          error: 'Leaderboard is only available for bootcamps or workshops',
        }
      }

      throw err instanceof Error
        ? err
        : new Error('Failed to fetch leaderboard')
    }
  }
)

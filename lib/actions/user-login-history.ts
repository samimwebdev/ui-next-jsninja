// lib/actions/user-login-history.ts
import { strapiFetch } from '@/lib/strapi'
import { LoginHistoryResponse } from '@/types/dashboard-types'
import { getAuthToken } from '@/lib/auth'

export async function fetchLoginHistory(): Promise<LoginHistoryResponse> {
  try {
    const token = await getAuthToken()

    if (!token) {
      throw new Error('Authentication required to fetch login history')
    }

    const response = await strapiFetch<LoginHistoryResponse>(
      `/api/course-access/security`,
      {
        method: 'GET',
        token,
      }
    )

    return response
  } catch (error) {
    console.error('Error fetching login history:', error)
    throw error instanceof Error
      ? error
      : new Error('Failed to fetch login history')
  }
}

export async function reportSuspiciousLogin(
  fingerprintId: string,
  report: string
): Promise<{ success: boolean; message: string }> {
  try {
    const token = await getAuthToken()

    if (!token) {
      throw new Error('Authentication required')
    }

    const data = {
      fingerprintId,
      report,
    }

    await strapiFetch(`/api/course-access/security/reports`, {
      method: 'POST',
      token,
      body: JSON.stringify(data),
    })

    return { success: true, message: 'Login reported successfully' }
  } catch (error) {
    console.error('Error reporting login:', error)
    throw error instanceof Error ? error : new Error('Failed to report login')
  }
}

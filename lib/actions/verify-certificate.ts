'use server'

import { Certificate } from '@/types/dashboard-types'
import { strapiFetch } from '../strapi'
import { cache } from 'react'

export interface VerificationResponse {
  data: Certificate | null
  error?: {
    status: number
    name: string
    message: string
    details: Record<string, string>
  }
}

export const verifyCertificate = cache(
  async (certificateId: string): Promise<VerificationResponse> => {
    try {
      const data = await strapiFetch<VerificationResponse>(
        `/api/certificate/verify/${encodeURIComponent(certificateId)}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      return data
    } catch (err) {
      console.error('Error verifying certificate:', err)
      throw err instanceof Error
        ? err
        : new Error('Failed to verify certificate')
    }
  }
)

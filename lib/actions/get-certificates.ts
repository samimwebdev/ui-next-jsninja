'use server'

import { CertificatesResponse } from '@/types/dashboard-types'
import { getAuthToken } from '../auth'
import { strapiFetch } from '../strapi'
import { cache } from 'react'

export const fetchCertificates = cache(
  async (): Promise<CertificatesResponse> => {
    const token = await getAuthToken()

    if (!token) {
      throw new Error('Authentication required to fetch certificates')
    }

    try {
      const data = await strapiFetch<CertificatesResponse>(
        '/api/certificate/userCertificates',
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
      console.error('Error fetching certificates:', err)
      throw err instanceof Error
        ? err
        : new Error('Failed to fetch certificates')
    }
  }
)

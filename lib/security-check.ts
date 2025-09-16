'use server'
import { strapiFetch } from '@/lib/strapi'
import { getAuthToken } from '@/lib/auth'

interface SecurityCheckResponse {
  error: false
  data: {
    accessType: string
    ipAddress: string
    locationData: {
      country: string
      countryCode: string
      region: string
      city: string
      latitude: number
      longitude: number
      timezone: string
      isp: string
    }
    fingerprintId: string
    isTracked: boolean
  }
}

interface SecurityErrorResponse {
  data: null
  error: {
    status: number
    name: string
    message: string
    details: object
  }
}

export async function checkUserSecurity(courseSlug: string): Promise<{
  allowed: boolean
  message?: string
}> {
  try {
    const token = await getAuthToken()

    if (!token) {
      return {
        allowed: false,
        message:
          'Authentication required. Please log in to access this course.',
      }
    }

    // Use returnErrorResponse=true to get structured error responses
    const securityResponse = await strapiFetch<
      SecurityCheckResponse | SecurityErrorResponse
    >(`/api/course-view/${courseSlug}/security`, {
      method: 'GET',
      token,
      returnErrorResponse: true, // Return error responses instead of throwing
    })

    // Check if response has error property (this will now include 403, 404, etc.)
    if ('error' in securityResponse && securityResponse.error) {
      // Check for 404 (user not found - first time access)
      if (securityResponse.error.status === 404) {
        return {
          allowed: true,
          message: 'First time accessing this course. Welcome!',
        }
      }

      // Check for 403 (user blocked) - NOW WORKS IN TRY BLOCK
      if (securityResponse.error.status === 403) {
        console.log('User access blocked:', securityResponse.error.message)
        return {
          allowed: false,
          message: securityResponse.error.message,
        }
      }

      // Check for 401 (unauthorized)
      if (securityResponse.error.status === 401) {
        return {
          allowed: false,
          message: 'Authentication expired. Please log in again.',
        }
      }

      // Other error statuses
      return {
        allowed: false,
        message: securityResponse.error.message,
      }
    }

    // Success response - user is allowed
    if ('data' in securityResponse && securityResponse.data) {
      console.log(
        'User security check passed:',
        securityResponse.data.accessType
      )
      return {
        allowed: true,
        message: `Access granted. Type: ${securityResponse.data.accessType}`,
      }
    }

    // Unexpected response format
    return {
      allowed: false,
      message: 'Invalid security response format.',
    }
  } catch (error) {
    console.error('Security check failed with exception:', error)

    // This catch block now only handles network errors, not HTTP error statuses
    return {
      allowed: false,
      message: 'Network error. Unable to verify access permissions.',
    }
  }
}

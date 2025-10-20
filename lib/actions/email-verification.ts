'use server'

import { strapiFetch } from '@/lib/strapi'
import { getAuthToken } from '@/lib/auth'

// interface EmailConfirmationResponse {
//   jwt: string
//   user: {
//     id: number
//     username: string
//     email: string
//     confirmed: boolean
//     blocked: boolean
//     createdAt: string
//     updatedAt: string
//   }
// }

interface EmailConfirmationErrorResponse {
  data: null
  error: {
    status: number
    name: string
    message: string
    details: Record<string, string>
  }
}

// ✅ Server action to resend email confirmation
export async function resendEmailConfirmation(email: string) {
  try {
    // Get current user's token for security
    const token = await getAuthToken()
    if (!token) {
      return {
        success: false,
        error: 'Authentication required',
      }
    }

    // ✅ Use strapiFetch to send confirmation email
    const response = await strapiFetch<
      { ok?: boolean } | EmailConfirmationErrorResponse
    >('/api/auth/send-email-confirmation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      token,
      body: JSON.stringify({
        email: email,
      }),
      returnErrorResponse: true, // Return error responses instead of throwing
    })

    // Check if there's an error in the response
    if ('error' in response) {
      console.error('❌ Email confirmation error:', response.error)
      return {
        success: false,
        error: 'Failed to send confirmation email',
        details: response?.error.details,
      }
    }

    return {
      success: true,
      message: 'Confirmation email sent successfully',
    }
  } catch (error) {
    console.error('❌ Resend email confirmation error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}

// ✅ Server action to confirm email with token - using direct fetch
export async function confirmEmailWithToken(confirmationToken: string) {
  try {
    if (!confirmationToken) {
      return {
        success: false,
        error: 'Confirmation token is required',
      }
    }

    // ✅ Use direct fetch instead of strapiFetch
    const strapiUrl = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/email-confirmation?confirmation=${confirmationToken}`

    const response = await fetch(strapiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })

    // ✅ Success case - status 200 with HTML response
    if (response.status === 200) {
      return {
        success: true,
        message: 'Email confirmed successfully',
      }
    }

    // ✅ Error case - should be JSON with error details
    if (response.status >= 400) {
      try {
        const errorData: EmailConfirmationErrorResponse = await response.json()
        console.error('❌ Email confirmation error:', errorData.error)

        return {
          success: false,
          error: errorData.error.message || 'Email confirmation failed',
          details: errorData.error.details,
        }
      } catch (parseError) {
        console.error('❌ Failed to parse error response:', parseError)
        return {
          success: false,
          error: `Server error: ${response.status} ${response.statusText}`,
          details: 'Unable to parse error response',
        }
      }
    }

    // ✅ Unexpected status code
    return {
      success: false,
      error: `Unexpected response: ${response.status} ${response.statusText}`,
      details: 'Server returned unexpected status code',
    }
  } catch (error) {
    console.error('❌ Email confirmation error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error occurred',
    }
  }
}

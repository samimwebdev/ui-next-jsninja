'use server'

import { strapiFetch } from '@/lib/strapi'
import {
  CreatePaymentRequest,
  CreatePaymentResponse,
  VerifyPaymentRequest,
  VerifyPaymentRawResponse,
  VerifyPaymentResponse,
  PaymentMetadata,
  isRawPaymentVerificationError,
} from '@/types/payment-types'
import { getAuthToken } from '@/lib/auth'

export async function createPayment(
  paymentData: CreatePaymentRequest
): Promise<CreatePaymentResponse> {
  try {
    const token = await getAuthToken()

    if (!token) {
      throw new Error('Authentication required')
    }

    const response = await strapiFetch<CreatePaymentResponse>(
      `/api/create-payment/${paymentData.courseBaseId}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    )

    console.log(response.data)

    if (!response?.data || !response.data.status) {
      throw new Error('Failed to create payment')
    }

    return response
  } catch (error) {
    console.error('Failed to create payment:', error)
    throw new Error(
      error instanceof Error ? error.message : 'Failed to create payment'
    )
  }
}

export async function verifyPayment(
  verificationData: VerifyPaymentRequest
): Promise<VerifyPaymentResponse> {
  try {
    const token = await getAuthToken()

    if (!token) {
      throw new Error('Authentication required')
    }

    const rawResponse = await strapiFetch<VerifyPaymentRawResponse>(
      '/api/verify-payment',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(verificationData),
        cache: 'no-store',
      }
    )

    if (!rawResponse) {
      throw new Error('Invalid payment verification response')
    }

    console.log({ rawResponse })

    // Check if response contains an error
    if (isRawPaymentVerificationError(rawResponse)) {
      // Return the error response as-is
      return rawResponse
    }

    // Handle success response
    if (!rawResponse.data) {
      throw new Error('Invalid payment verification response')
    }

    // Parse the metadata JSON string
    let parsedMetadata: PaymentMetadata
    try {
      parsedMetadata = JSON.parse(rawResponse.data.metadata)
    } catch (error) {
      console.error('Failed to parse payment metadata:', error)
      throw new Error('Invalid payment metadata')
    }

    // Return response with parsed metadata
    return {
      data: {
        ...rawResponse.data,
        metadata: parsedMetadata,
      },
    }
  } catch (error) {
    console.error('Failed to verify payment:', error)
    throw new Error(
      error instanceof Error ? error.message : 'Failed to verify payment'
    )
  }
}

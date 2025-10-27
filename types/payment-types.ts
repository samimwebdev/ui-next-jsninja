// types/payment-types.ts
export interface CreatePaymentRequest {
  courseBaseId: string
}

export interface CreatePaymentResponse {
  data: {
    status: boolean
    pp_id: number
    pp_url: string
  }
}

export interface VerifyPaymentRequest {
  transactionId: string | number | null
}

export interface PaymentMetadata {
  phoneNumber: string
  courseId: string
  userId: string
  courseType: string
  courseSlug: string
  courseTitle: string
}

// Raw API response (before processing)
export interface VerifyPaymentRawSuccessResponse {
  data: {
    customer_name: string
    customer_email_mobile: string
    transaction_id: string
    sender_name: string
    pp_id: string
    currency: string
    amount: string
    metadata: string // JSON string that needs to be parsed
    payment_method: string
    status: 'completed' | 'failed' | 'pending'
  }
  error?: never
}

// Error response (same for raw and processed)
export interface VerifyPaymentErrorResponse {
  data: null
  error: {
    status: number
    name: string
    message: string
    details: Record<string, unknown>
  }
}

// Union type for raw API response
export type VerifyPaymentRawResponse =
  | VerifyPaymentRawSuccessResponse
  | VerifyPaymentErrorResponse

// Processed success response (after parsing metadata)
export interface VerifyPaymentSuccessResponse {
  data: {
    customer_name: string
    customer_email_mobile: string
    amount: string
    transaction_id: string
    sender_name: string
    pp_id: string
    currency: string
    metadata: PaymentMetadata // Parsed object
    payment_method: string
    status: 'completed' | 'failed' | 'pending'
  }
  error?: never
}

// Union type for processed response
export type VerifyPaymentResponse =
  | VerifyPaymentSuccessResponse
  | VerifyPaymentErrorResponse

// Type guard to check if response has error
export function isPaymentVerificationError(
  response: VerifyPaymentResponse
): response is VerifyPaymentErrorResponse {
  return response.data === null && !!response.error
}

// Type guard for raw response
export function isRawPaymentVerificationError(
  response: VerifyPaymentRawResponse
): response is VerifyPaymentErrorResponse {
  return response.data === null && !!response.error
}

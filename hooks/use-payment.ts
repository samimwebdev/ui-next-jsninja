// hooks/use-payment.ts
import { useMutation, useQuery } from '@tanstack/react-query'
import { createPayment, verifyPayment } from '@/lib/actions/payment-actions'
import {
  CreatePaymentRequest,
  CreatePaymentResponse,
  VerifyPaymentRequest,
  VerifyPaymentResponse,
} from '@/types/payment-types'

export function useCreatePayment() {
  return useMutation<CreatePaymentResponse, Error, CreatePaymentRequest>({
    mutationFn: createPayment,
    onError: (error) => {
      console.error('Payment creation failed:', error)
    },
  })
}

export function useVerifyPayment() {
  return useMutation<VerifyPaymentResponse, Error, VerifyPaymentRequest>({
    mutationFn: verifyPayment,
    onError: (error) => {
      console.error(':', error)
    },
  })
}

// For auto-verification on success page
export function useAutoVerifyPayment(transactionId: string | number | null) {
  return useQuery<VerifyPaymentResponse, Error>({
    queryKey: ['verify-payment', transactionId],
    queryFn: () => {
      if (!transactionId) {
        throw new Error('Transaction ID is required')
      }
      return verifyPayment({ transactionId })
    },
    enabled: !!transactionId,
    retry: false,
    retryDelay: 1000,
    staleTime: 0,
    gcTime: 0,
  })
}

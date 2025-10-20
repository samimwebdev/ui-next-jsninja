'use client'

import { useEffect } from 'react'
import {
  trackPaymentVerificationSuccess,
  trackPaymentVerificationError,
} from '@/lib/analytics'

interface PaymentVerificationTrackingProps {
  transactionId: string
  status: 'success' | 'error' | 'already_exists'
  courseSlug?: string
  courseTitle?: string
  amount?: string
  errorMessage?: string
}

export function PaymentVerificationTracking({
  transactionId,
  status,
  courseSlug,
  courseTitle,
  amount,
  errorMessage,
}: PaymentVerificationTrackingProps) {
  useEffect(() => {
    const trackVerificationResult = async () => {
      try {
        const coursePrice = amount ? parseFloat(amount) : 0

        if (status === 'success' || status === 'already_exists') {
          // Track success
          trackPaymentVerificationSuccess(
            transactionId,
            courseSlug,
            courseTitle,
            coursePrice
          )

          // Server-side tracking
          await fetch('/api/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              event_name: 'payment_verification_success',
              event_type: 'both',
              ga_parameters: {
                transaction_id: transactionId,
                course_slug: courseSlug,
                course_title: courseTitle,
                value: coursePrice,
                currency: 'BDT',
                verification_status: status,
              },
              fb_custom_data: {
                content_type: 'course',
                content_ids: courseSlug ? [courseSlug] : [],
                content_name: courseTitle || 'Course',
                value: coursePrice,
                currency: 'BDT',
                custom_data: {
                  transaction_id: transactionId,
                  verification_status: status,
                },
              },
            }),
          })
        } else if (status === 'error') {
          // Track error
          trackPaymentVerificationError(
            transactionId,
            errorMessage,
            courseSlug,
            courseTitle
          )

          // Server-side tracking
          await fetch('/api/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              event_name: 'payment_verification_error',
              event_type: 'both',
              ga_parameters: {
                transaction_id: transactionId,
                error_message: errorMessage,
                course_slug: courseSlug,
                course_title: courseTitle,
              },
              fb_custom_data: {
                content_type: 'payment_verification',
                custom_data: {
                  transaction_id: transactionId,
                  error_message: errorMessage,
                  course_slug: courseSlug,
                  course_title: courseTitle,
                },
              },
            }),
          })
        }
      } catch (trackingError) {
        console.error('Payment verification tracking failed:', trackingError)
      }
    }

    trackVerificationResult()
  }, [transactionId, status, courseSlug, courseTitle, amount, errorMessage])

  return null
}

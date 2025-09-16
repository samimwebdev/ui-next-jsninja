'use client'

import { useEffect } from 'react'
import { trackPaymentCancellation, trackPaymentFailure } from '@/lib/analytics'

interface PaymentCancelTrackingProps {
  transactionId: string
  courseSlug?: string
  courseTitle?: string
  paymentAmount?: string
  paymentMethod?: string
  status: 'cancelled' | 'failed'
  errorMessage?: string
  errorCode?: string
}

export function PaymentCancelTracking({
  transactionId,
  courseSlug = 'unknown',
  courseTitle = 'Unknown Course',
  paymentAmount,
  paymentMethod,
  status,
  errorMessage,
  errorCode,
}: PaymentCancelTrackingProps) {
  useEffect(() => {
    const trackCancelOrFailure = async () => {
      try {
        const coursePrice = paymentAmount ? parseFloat(paymentAmount) : 0

        if (status === 'failed') {
          // Track payment failure
          trackPaymentFailure(
            transactionId,
            courseSlug,
            courseTitle,
            coursePrice,
            paymentMethod,
            errorMessage,
            errorCode
          )
        } else {
          // Track payment cancellation
          trackPaymentCancellation(
            transactionId,
            courseSlug,
            courseTitle,
            coursePrice,
            paymentMethod,
            'user_cancelled',
            'payment_gateway'
          )
        }

        // Server-side tracking
        await fetch('/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event_name:
              status === 'failed' ? 'payment_failed' : 'payment_cancelled',
            event_type: 'both',
            ga_parameters: {
              transaction_id: transactionId,
              currency: 'BDT',
              value: coursePrice,
              payment_method: paymentMethod,
              course_slug: courseSlug,
              course_title: courseTitle,
              error_message: errorMessage,
              error_code: errorCode,
              status: status,
              items: [
                {
                  item_id: courseSlug,
                  item_name: courseTitle,
                  item_category: 'course',
                  quantity: 1,
                  price: coursePrice,
                },
              ],
            },
            fb_custom_data: {
              content_type: 'course',
              content_ids: [courseSlug],
              content_name: courseTitle,
              value: coursePrice,
              currency: 'BDT',
              custom_data: {
                transaction_id: transactionId,
                payment_method: paymentMethod,
                error_message: errorMessage,
                error_code: errorCode,
                status: status,
                failure_reason:
                  status === 'failed'
                    ? 'payment_processing_failed'
                    : 'user_cancelled',
              },
            },
          }),
        })
      } catch (error) {
        console.error(`Payment ${status} tracking error:`, error)
      }
    }

    trackCancelOrFailure()
  }, [
    transactionId,
    courseSlug,
    courseTitle,
    paymentAmount,
    paymentMethod,
    status,
    errorMessage,
    errorCode,
  ])

  return null
}

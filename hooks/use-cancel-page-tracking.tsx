'use client'

import { trackCancelPageInteraction, trackPaymentRetry } from '@/lib/analytics'

interface CancelPageTrackingProps {
  transactionId: string
  courseSlug?: string
}

export function useCancelPageTracking() {
  const trackInteraction = async (
    action: 'try_again' | 'browse_courses' | 'go_home' | 'contact_support',
    { transactionId, courseSlug }: CancelPageTrackingProps
  ) => {
    try {
      // Client-side tracking
      trackCancelPageInteraction(action, transactionId, courseSlug)

      // Server-side tracking
      await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_name: 'cancel_page_interaction',
          event_type: 'both',
          ga_parameters: {
            transaction_id: transactionId,
            interaction_type: action,
            course_slug: courseSlug,
            page_type: 'payment_cancel',
          },
          fb_custom_data: {
            content_type: 'cancel_page',
            content_name: action,
            custom_data: {
              transaction_id: transactionId,
              course_slug: courseSlug,
              interaction_type: action,
              page_type: 'payment_cancel',
            },
          },
        }),
      })
    } catch (error) {
      console.error('Cancel page interaction tracking error:', error)
    }
  }

  const trackRetry = async (
    originalTransactionId: string,
    courseSlug: string,
    courseTitle: string,
    coursePrice?: number,
    retryMethod?: string
  ) => {
    try {
      // Client-side tracking
      trackPaymentRetry(
        originalTransactionId,
        courseSlug,
        courseTitle,
        coursePrice,
        retryMethod,
        1
      )

      // Server-side tracking
      await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_name: 'payment_retry',
          event_type: 'both',
          ga_parameters: {
            original_transaction_id: originalTransactionId,
            currency: 'BDT',
            value: coursePrice || 0,
            retry_method: retryMethod,
            retry_count: 1,
            course_slug: courseSlug,
            course_title: courseTitle,
          },
          fb_custom_data: {
            content_type: 'course',
            content_ids: [courseSlug],
            content_name: courseTitle,
            value: coursePrice || 0,
            currency: 'BDT',
            custom_data: {
              original_transaction_id: originalTransactionId,
              retry_method: retryMethod,
              retry_count: 1,
              event_source: 'payment_retry',
            },
          },
        }),
      })
    } catch (error) {
      console.error('Payment retry tracking error:', error)
    }
  }

  return { trackInteraction, trackRetry }
}

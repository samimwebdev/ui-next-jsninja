'use client'

import { trackEnrollmentSuccess } from '@/lib/analytics' // ✅ Using enhanced utility

interface EnrollmentTrackingProps {
  courseSlug: string
  courseTitle: string
  coursePrice?: number
  courseType?: string
  paymentMethod?: string
  transactionId?: string
}

export function useEnrollmentTracking() {
  const trackEnrollment = async ({
    courseSlug,
    courseTitle,
    coursePrice,
    courseType,
    paymentMethod,
    transactionId,
  }: EnrollmentTrackingProps) => {
    try {
      // ✅ Using enhanced enrollment success tracking
      trackEnrollmentSuccess(
        courseSlug,
        courseTitle,
        coursePrice,
        courseType,
        paymentMethod,
        transactionId
      )

      // Enhanced server-side tracking for enrollment
      await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_name: 'purchase',
          event_type: 'both',
          ga_parameters: {
            transaction_id:
              transactionId || `course_${courseSlug}_${Date.now()}`,
            currency: 'BDT',
            value: coursePrice || 0,
            items: [
              {
                item_id: courseSlug,
                item_name: courseTitle,
                item_category: courseType || 'course',
                quantity: 1,
                price: coursePrice || 0,
              },
            ],
          },
          fb_custom_data: {
            content_type: courseType || 'course',
            content_ids: [courseSlug],
            content_name: courseTitle,
            value: coursePrice || 0,
            currency: 'BDT',
            custom_data: {
              payment_method: paymentMethod,
              transaction_id: transactionId,
            },
          },
        }),
      })
    } catch (error) {
      console.error('Enrollment tracking error:', error)
    }
  }

  return { trackEnrollment }
}

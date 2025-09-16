'use client'

import { useEffect } from 'react'
import { useEnrollmentTracking } from '@/components/course/enrollment-tracking'
// import { trackEnrollmentSuccess } from '@/lib/analytics' // ✅ Using enhanced utility

interface PaymentSuccessTrackingProps {
  transactionId: string
  courseTitle?: string
  courseSlug?: string
  amount?: string
  paymentMethod?: string
  courseType?: string
  customerEmail?: string
  isVerified?: boolean
}

export function PaymentSuccessTracking({
  transactionId,
  courseTitle,
  courseSlug,
  amount,
  paymentMethod,
  courseType,
  customerEmail,
  isVerified = false,
}: PaymentSuccessTrackingProps) {
  const { trackEnrollment } = useEnrollmentTracking()

  useEffect(() => {
    if (isVerified && courseSlug && courseTitle) {
      const trackPaymentSuccess = async () => {
        try {
          const coursePrice = amount ? parseFloat(amount) : 0

          // Track the enrollment using your utility
          await trackEnrollment({
            courseSlug,
            courseTitle,
            coursePrice,
            courseType: courseType || 'course',
            paymentMethod: paymentMethod || 'unknown',
            transactionId,
          })

          // Additional success page tracking
          if (typeof window !== 'undefined' && window.gtag) {
            // Track page view with conversion data
            window.gtag('event', 'conversion', {
              send_to: 'AW-CONVERSION_ID/CONVERSION_LABEL', // Replace with your conversion ID
              value: coursePrice,
              currency: 'BDT',
              transaction_id: transactionId,
            })

            // Custom event for payment success page view
            window.gtag('event', 'payment_success_page_view', {
              course_slug: courseSlug,
              course_title: courseTitle,
              transaction_id: transactionId,
              payment_method: paymentMethod,
              amount: coursePrice,
            })
          }

          // Facebook Pixel - Purchase confirmation
          if (typeof window !== 'undefined' && window.fbq) {
            window.fbq('track', 'Purchase', {
              content_type: courseType || 'course',
              content_ids: [courseSlug],
              content_name: courseTitle,
              value: coursePrice,
              currency: 'BDT',
              custom_data: {
                transaction_id: transactionId,
                payment_method: paymentMethod,
                customer_email: customerEmail,
                success_page_view: true,
              },
            })
          }

          // Server-side tracking for success page
          await fetch('/api/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              event_name: 'payment_success_page_view',
              event_type: 'both',
              ga_parameters: {
                transaction_id: transactionId,
                currency: 'BDT',
                value: coursePrice,
                course_slug: courseSlug,
                course_title: courseTitle,
                payment_method: paymentMethod,
                success_page: true,
              },
              fb_custom_data: {
                content_type: courseType || 'course',
                content_ids: [courseSlug],
                content_name: courseTitle,
                value: coursePrice,
                currency: 'BDT',
                custom_data: {
                  transaction_id: transactionId,
                  payment_method: paymentMethod,
                  customer_email: customerEmail,
                  success_page_view: true,
                },
              },
              email: customerEmail, // For hashed email tracking
            }),
          })
        } catch (error) {
          console.error('Payment success tracking error:', error)
        }
      }

      trackPaymentSuccess()
    }
  }, [
    isVerified,
    transactionId,
    courseTitle,
    courseSlug,
    amount,
    paymentMethod,
    courseType,
    customerEmail,
    trackEnrollment,
  ])

  return null
}

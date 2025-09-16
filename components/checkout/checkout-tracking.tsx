'use client'

import { useEffect } from 'react'

import { trackBeginCheckout } from '@/lib/analytics'

interface CheckoutTrackingProps {
  courseSlug: string
  courseTitle: string
  coursePrice?: number
  courseType?: string
  currentStep?: 'course_info' | 'user_info' | 'payment_info' | 'review'
  stepNumber?: number
}

export function CheckoutTracking({
  courseSlug,
  courseTitle,
  coursePrice,
  courseType,
  currentStep = 'course_info',
  stepNumber = 1,
}: CheckoutTrackingProps) {
  useEffect(() => {
    const trackCheckoutPageView = async () => {
      try {
        // Track begin checkout when user lands on checkout page
        trackBeginCheckout(courseSlug, courseTitle, coursePrice, courseType)

        // Enhanced server-side tracking
        await fetch('/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event_name: 'begin_checkout',
            event_type: 'both',
            ga_parameters: {
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
              checkout_step: stepNumber,
              checkout_option: currentStep,
            },
            fb_custom_data: {
              content_type: courseType || 'course',
              content_ids: [courseSlug],
              content_name: courseTitle,
              value: coursePrice || 0,
              currency: 'BDT',
              custom_data: {
                checkout_step: stepNumber,
                checkout_option: currentStep,
              },
            },
          }),
        })
      } catch (error) {
        console.error('Checkout tracking error:', error)
      }
    }

    trackCheckoutPageView()
  }, [
    courseSlug,
    courseTitle,
    coursePrice,
    courseType,
    currentStep,
    stepNumber,
  ])

  return null
}

'use client'

import { trackAddToCart } from '@/lib/analytics'

interface AddToCartTrackingProps {
  courseSlug: string
  courseTitle: string
  coursePrice?: number
  courseType?: string
}

export function useAddToCartTracking() {
  const trackAddToCartAction = async ({
    courseSlug,
    courseTitle,
    coursePrice,
    courseType,
  }: AddToCartTrackingProps) => {
    try {
      // Client-side tracking using your utility function
      trackAddToCart(courseSlug, courseTitle, coursePrice, courseType)

      // Enhanced server-side tracking
      await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_name: 'add_to_cart',
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
          },
          fb_custom_data: {
            content_type: courseType || 'course',
            content_ids: [courseSlug],
            content_name: courseTitle,
            value: coursePrice || 0,
            currency: 'BDT',
          },
        }),
      })
    } catch (error) {
      console.error('Add to cart tracking error:', error)
    }
  }

  return { trackAddToCartAction }
}

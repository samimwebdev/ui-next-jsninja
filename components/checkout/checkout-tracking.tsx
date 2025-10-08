'use client'

import { useEffect } from 'react'
import { trackBeginCheckout } from '@/lib/analytics'
import { trackVercelEvent } from '@/components/analytics/vercel-analytics'

interface CheckoutTrackingProps {
  courseSlug: string
  courseTitle: string
  coursePrice?: number
  courseType?: string
  packageType?: string
}

export function CheckoutTracking({
  courseSlug,
  courseTitle,
  coursePrice,
  courseType = 'course',
  packageType = 'standard',
}: CheckoutTrackingProps) {
  useEffect(() => {
    const trackCheckoutPageView = async () => {
      try {
        // // ✅ Track with Vercel Analytics - Begin Checkout
        // trackEnrollmentStart({
        //   slug: courseSlug,
        //   title: courseTitle,
        //   price: coursePrice,
        //   courseType: courseType,
        //   packageType,
        // })

        // ✅ Track single page checkout initiation
        trackVercelEvent('begin_checkout', {
          course_slug: courseSlug,
          course_title: courseTitle,
          course_price: coursePrice || 0,
          course_type: courseType,
          package_type: packageType,
          value: coursePrice || 0,
          currency: 'BDT',
          checkout_type: 'single_page',
        })

        // ✅ Track view item (course being purchased)
        trackVercelEvent('view_item', {
          item_id: courseSlug,
          item_name: courseTitle,
          item_category: courseType,
          item_brand: 'Javascript Ninja',
          price: coursePrice || 0,
          currency: 'BDT',
          value: coursePrice || 0,
          package_type: packageType,
        })

        // Legacy analytics (existing)
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
                  item_category: courseType,
                  item_brand: 'Javascript Ninja',
                  quantity: 1,
                  price: coursePrice || 0,
                },
              ],
              custom_parameters: {
                package_type: packageType,
                checkout_type: 'single_page',
              },
            },
            fb_custom_data: {
              content_type: courseType,
              content_ids: [courseSlug],
              content_name: courseTitle,
              value: coursePrice || 0,
              currency: 'BDT',
              custom_data: {
                package_type: packageType,
                checkout_type: 'single_page',
                page_type: 'checkout',
              },
            },
            // ✅ Vercel Analytics data for server-side backup
            vercel_data: {
              event_name: 'begin_checkout',
              properties: {
                course_slug: courseSlug,
                course_title: courseTitle,
                course_price: coursePrice || 0,
                course_type: courseType,
                package_type: packageType,
                value: coursePrice || 0,
                currency: 'BDT',
                checkout_type: 'single_page',
              },
            },
          }),
        })
      } catch (error) {
        console.error('Checkout tracking error:', error)

        // ✅ Track error event
        trackVercelEvent('tracking_error', {
          error_type: 'checkout_tracking',
          course_slug: courseSlug,
          error_message:
            error instanceof Error ? error.message : 'Unknown error',
          page_type: 'checkout',
        })
      }
    }

    trackCheckoutPageView()
  }, [courseSlug, courseTitle, coursePrice, courseType, packageType])

  return null
}

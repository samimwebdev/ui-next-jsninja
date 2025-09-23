'use client'

import { Analytics } from '@vercel/analytics/react'
import { track } from '@vercel/analytics'

// Custom tracking functions
export const trackVercelEvent = (
  eventName: string,
  properties?: Record<string, string | number | boolean | null>
) => {
  if (typeof window !== 'undefined') {
    track(eventName, properties)
  }
}

// Specific event tracking functions
export const trackCourseView = (courseData: {
  slug: string
  title: string
  price?: number
  courseType?: string
  isRegistrationOpen?: boolean
}) => {
  trackVercelEvent('course_view', {
    course_slug: courseData.slug,
    course_title: courseData.title,
    course_price: courseData.price || 0,
    course_type: courseData.courseType || 'course',
    registration_open: courseData.isRegistrationOpen || false,
    page_type: 'course',
  })
}

export const trackBootcampView = (bootcampData: {
  slug: string
  title: string
  price?: number
  courseType?: string
  isRegistrationOpen?: boolean
}) => {
  trackVercelEvent('bootcamp_view', {
    bootcamp_slug: bootcampData.slug,
    bootcamp_title: bootcampData.title,
    bootcamp_price: bootcampData.price || 0,
    course_type: bootcampData.courseType || 'bootcamp',
    registration_open: bootcampData.isRegistrationOpen || false,
    page_type: 'bootcamp',
  })
}

export const trackEnrollmentStart = (courseData: {
  slug: string
  title: string
  price?: number
  courseType?: string
  packageType?: string
}) => {
  trackVercelEvent('enrollment_start', {
    course_slug: courseData.slug,
    course_title: courseData.title,
    course_price: courseData.price || 0,
    course_type: courseData.courseType || 'course',
    package_type: courseData.packageType || 'standard',
    value: courseData.price || 0,
    currency: 'BDT',
  })
}

// export const trackVideoPlay = (videoData: {
//   courseSlug?: string
//   videoTitle?: string
//   videoId?: string
//   duration?: number
//   position?: 'hero' | 'curriculum' | 'preview'
// }) => {
//   trackVercelEvent('video_play', {
//     course_slug: videoData.courseSlug,
//     video_title: videoData.videoTitle,
//     video_id: videoData.videoId,
//     video_duration: videoData.duration || 0,
//     video_position: videoData.position || 'unknown',
//   })
// }

export const trackScrollDepth = (depth: number, page: string) => {
  trackVercelEvent('scroll_depth', {
    depth_percentage: depth,
    page_type: page,
    page_url: typeof window !== 'undefined' ? window.location.pathname : '',
  })
}

export const trackCTAClick = (ctaData: {
  button_text: string
  button_position: string
  course_slug: string
  destination: string
}) => {
  trackVercelEvent('cta_click', {
    button_text: ctaData.button_text,
    button_position: ctaData.button_position,
    course_slug: ctaData.course_slug,
    destination: ctaData.destination,
  })
}

// ✅ Add these functions to your existing vercel-analytics.tsx

export const trackPaymentMethodSelect = (paymentData: {
  courseSlug: string
  paymentMethod: 'bkash' | 'nagad' | 'rocket' | 'card' | 'bank_transfer'
  coursePrice?: number
}) => {
  trackVercelEvent('add_payment_info', {
    course_slug: paymentData.courseSlug,
    payment_method: paymentData.paymentMethod,
    value: paymentData.coursePrice || 0,
    currency: 'BDT',
  })
}

export const trackPurchaseComplete = (purchaseData: {
  courseSlug: string
  courseTitle: string
  coursePrice?: number
  courseType?: string
  packageType?: string
  transactionId: string
  paymentMethod: string
}) => {
  trackVercelEvent('purchase', {
    transaction_id: purchaseData.transactionId,
    course_slug: purchaseData.courseSlug,
    course_title: purchaseData.courseTitle,
    course_price: purchaseData.coursePrice || 0,
    course_type: purchaseData.courseType || 'course',
    package_type: purchaseData.packageType || 'standard',
    payment_method: purchaseData.paymentMethod,
    value: purchaseData.coursePrice || 0,
    currency: 'BDT',
  })
}

// Main Analytics component
export function VercelAnalytics() {
  return (
    <Analytics
      beforeSend={(event) => {
        // Example: Filter out certain events if needed
        if (
          event.url.startsWith('/dashboard') ||
          event.url.startsWith('/admin') ||
          event.url.startsWith('/api')
        ) {
          return null
        }
        return event
      }}
    />
  )
}

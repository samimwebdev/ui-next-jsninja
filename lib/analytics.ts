import CryptoJS from 'crypto-js'

// Dynamic tracking IDs - will be set from Strapi settings
let dynamicGAId: string | null = null
let dynamicFBPixelId: string | null = null

// Fallback to environment variables
export const GA_TRACKING_ID =
  dynamicGAId || process.env.NEXT_PUBLIC_GA_TRACKING_ID || ''

export const FB_PIXEL_ID =
  dynamicFBPixelId || process.env.NEXT_PUBLIC_FB_PIXEL_ID || ''

// Functions to set dynamic IDs (call these from your layout after fetching settings)
export const setGATrackingId = (id: string) => {
  dynamicGAId = id
}

export const setFBPixelId = (id: string) => {
  dynamicFBPixelId = id
}

// export const pageview = (url: string) => {
//   if (typeof window !== 'undefined' && GA_TRACKING_ID) {
//     window.gtag('config', GA_TRACKING_ID, {
//       page_path: url,
//     })
//   }
// }

export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string
  category: string
  label?: string
  value?: number
}) => {
  if (
    typeof window !== 'undefined' &&
    typeof window.gtag !== 'undefined' &&
    GA_TRACKING_ID
  ) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

// export const fbPageView = () => {
//   if (typeof window !== 'undefined' && window.fbq) {
//     window.fbq('track', 'PageView')
//   }

export const fbEvent = (eventName: string, parameters?: object) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', eventName, parameters)
  }
}

// Custom events for your app
export const trackCourseView = (
  courseSlug: string,
  courseTitle: string,
  coursePrice?: number
) => {
  // Enhanced ecommerce event
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'view_item', {
      currency: 'BDT',
      value: coursePrice || 0,
      items: [
        {
          item_id: courseSlug,
          item_name: courseTitle,
          category: 'course',
          price: coursePrice || 0,
        },
      ],
    })
  }

  // Facebook Pixel
  fbEvent('ViewContent', {
    content_type: 'course',
    content_ids: [courseSlug],
    content_name: courseTitle,
    value: coursePrice || 0,
    currency: 'BDT',
  })
}

export const trackCourseEnrollment = (
  courseSlug: string,
  courseTitle: string,
  price?: number
) => {
  // Google Analytics Purchase Event
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: `course_${courseSlug}_${Date.now()}`,
      currency: 'BDT',
      value: price || 0,
      items: [
        {
          item_id: courseSlug,
          item_name: courseTitle,
          category: 'course',
          quantity: 1,
          price: price || 0,
        },
      ],
    })
  }

  // Facebook Pixel Purchase
  fbEvent('Purchase', {
    content_type: 'course',
    content_ids: [courseSlug],
    content_name: courseTitle,
    value: price || 0,
    currency: 'BDT',
  })
}

export const trackBlogView = (blogSlug: string, blogTitle: string) => {
  // Google Analytics
  event({
    action: 'view_content',
    category: 'engagement',
    label: blogSlug,
  })

  // Facebook Pixel
  fbEvent('ViewContent', {
    content_type: 'blog',
    content_ids: [blogSlug],
    content_name: blogTitle,
  })
}

export const trackNewsletterSignup = (email: string) => {
  console.log('Tracking newsletter signup for:', email)
  // Hash email for privacy
  //   const hashedEmail = CryptoJS.SHA256(email).toString()

  // Google Analytics
  event({
    action: 'sign_up',
    category: 'engagement',
    label: 'newsletter',
  })

  // Facebook Pixel
  fbEvent('Subscribe', {
    content_name: 'newsletter',
  })
}

export const trackVideoPlay = (videoId: string, videoTitle: string) => {
  // Google Analytics
  event({
    action: 'video_play',
    category: 'engagement',
    label: videoId,
  })

  // Facebook Pixel
  fbEvent('ViewContent', {
    content_type: 'video',
    content_ids: [videoId],
    content_name: videoTitle,
  })
}

// Enhanced video tracking with course context
export const trackCourseVideoPlay = (
  courseSlug: string,
  videoId: string,
  videoTitle: string,
  lessonTitle?: string
) => {
  // Google Analytics
  event({
    action: 'video_start',
    category: 'engagement',
    label: `${courseSlug}_${videoId}`,
  })

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'video_start', {
      video_current_time: '0',
      video_duration: '0',
      video_percent: '0',
      video_provider: 'custom',
      video_title: videoTitle,
      video_url: videoId,
      course_slug: courseSlug,
      lesson_title: lessonTitle,
    })
  }

  // Facebook Pixel
  fbEvent('ViewContent', {
    content_type: 'video',
    content_ids: [videoId],
    content_name: videoTitle,
    custom_data: {
      course_slug: courseSlug,
      lesson_title: lessonTitle,
    },
  })
}

export const trackCurriculumExpand = (
  courseSlug: string,
  moduleTitle: string
) => {
  // Google Analytics
  event({
    action: 'curriculum_expand',
    category: 'engagement',
    label: `${courseSlug}_${moduleTitle}`,
  })

  // Facebook Pixel
  fbEvent('ViewContent', {
    content_type: 'curriculum',
    content_name: moduleTitle,
    custom_data: {
      course_slug: courseSlug,
    },
  })
}

export const trackFAQExpand = (courseSlug: string, faqQuestion: string) => {
  // Google Analytics
  event({
    action: 'faq_expand',
    category: 'engagement',
    label: courseSlug,
  })

  // Facebook Pixel
  fbEvent('ViewContent', {
    content_type: 'faq',
    content_name: faqQuestion,
    custom_data: {
      course_slug: courseSlug,
    },
  })
}

export const trackCourseTabSwitch = (courseSlug: string, tabName: string) => {
  // Google Analytics
  event({
    action: 'tab_switch',
    category: 'engagement',
    label: `${courseSlug}_${tabName}`,
  })
}

// Server-side tracking utilities
export const getClientIP = (req: Request): string => {
  const forwarded = req.headers.get('x-forwarded-for')
  const real = req.headers.get('x-real-ip')
  const cfConnectingIp = req.headers.get('cf-connecting-ip') // Cloudflare
  const ip = forwarded ? forwarded.split(',')[0].trim() : real || cfConnectingIp
  return ip || '127.0.0.1'
}

export const getUserAgent = (req: Request): string => {
  return req.headers.get('user-agent') || ''
}

// Generate client ID
export const generateClientId = (): string => {
  return `${Date.now()}.${Math.random().toString(36).substring(2)}`
}

// Hash email for server-side tracking (privacy compliant)
export const hashEmail = (email: string): string => {
  return CryptoJS.SHA256(email.toLowerCase().trim()).toString()
}

// Server-side GA event
export const serverSideGAEvent = async (
  event_name: string,
  client_id: string,
  parameters?: object,
  user_ip?: string,
  user_agent?: string
) => {
  if (!GA_TRACKING_ID) return

  const measurement_id = GA_TRACKING_ID
  const api_secret = process.env.GA_MEASUREMENT_API_SECRET

  if (!api_secret) {
    console.warn(
      'GA_MEASUREMENT_API_SECRET is not set for server-side tracking'
    )
    return
  }

  const url = `https://www.google-analytics.com/mp/collect?measurement_id=${measurement_id}&api_secret=${api_secret}`

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        client_id,
        events: [
          {
            name: event_name,
            params: {
              ...parameters,
              engagement_time_msec: '1000',
            },
          },
        ],
        ...(user_ip && {
          user_properties: {
            user_ip: { value: user_ip },
            user_agent: { value: user_agent },
          },
        }),
      }),
    })

    if (!response.ok) {
      throw new Error(`GA API error: ${response.status}`)
    }
  } catch (error) {
    console.error('Server-side GA tracking error:', error)
  }
}

// Server-side Facebook Pixel event
export const serverSideFBEvent = async (
  event_name: string,
  event_id: string,
  user_data: object,
  custom_data?: object,
  user_ip?: string,
  user_agent?: string
) => {
  if (!FB_PIXEL_ID) return

  const access_token = process.env.FB_ACCESS_TOKEN

  if (!access_token) {
    console.warn('FB_ACCESS_TOKEN is not set for server-side tracking')
    return
  }

  const url = `https://graph.facebook.com/v19.0/${FB_PIXEL_ID}/events?access_token=${access_token}`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: [
          {
            event_name,
            event_time: Math.floor(Date.now() / 1000),
            event_id,
            user_data: {
              ...user_data,
              ...(user_ip && { client_ip_address: user_ip }),
              ...(user_agent && { client_user_agent: user_agent }),
            },
            custom_data,
          },
        ],
      }),
    })

    if (!response.ok) {
      throw new Error(`Facebook API error: ${response.status}`)
    }
  } catch (error) {
    console.error('Server-side Facebook tracking error:', error)
  }
}

// Custom analytics for self-hosted solutions
export const trackCustomEvent = async (
  eventName: string,
  properties: Record<string, unknown> = {}
) => {
  try {
    await fetch('/api/analytics/custom', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event: eventName,
        properties: {
          ...properties,
          timestamp: new Date().toISOString(),
          url: typeof window !== 'undefined' ? window.location.href : '',
          userAgent:
            typeof window !== 'undefined' ? window.navigator.userAgent : '',
        },
      }),
    })
  } catch (error) {
    console.error('Custom analytics tracking error:', error)
  }
}

// Add to Cart tracking
export const trackAddToCart = (
  courseSlug: string,
  courseTitle: string,
  coursePrice?: number,
  courseType?: string
) => {
  // Google Analytics
  event({
    action: 'add_to_cart',
    category: 'ecommerce',
    label: courseSlug,
    value: coursePrice,
  })

  // Enhanced GA ecommerce event
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'add_to_cart', {
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
    })
  }

  // Facebook Pixel
  fbEvent('AddToCart', {
    content_type: courseType || 'course',
    content_ids: [courseSlug],
    content_name: courseTitle,
    value: coursePrice || 0,
    currency: 'BDT',
  })
}

// Begin Checkout tracking
export const trackBeginCheckout = (
  courseSlug: string,
  courseTitle: string,
  coursePrice?: number,
  courseType?: string
) => {
  // Enhanced GA ecommerce event
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'begin_checkout', {
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
    })
  }

  // Facebook Pixel
  fbEvent('InitiateCheckout', {
    content_type: courseType || 'course',
    content_ids: [courseSlug],
    content_name: courseTitle,
    value: coursePrice || 0,
    currency: 'BDT',
  })
}

// Payment Method Selection tracking
export const trackPaymentMethodSelect = (
  paymentMethod: string,
  courseSlug: string,
  courseTitle: string,
  coursePrice?: number
) => {
  // Google Analytics
  event({
    action: 'add_payment_info',
    category: 'ecommerce',
    label: `${paymentMethod}_${courseSlug}`,
    value: coursePrice,
  })

  // Enhanced GA tracking
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'add_payment_info', {
      currency: 'BDT',
      value: coursePrice || 0,
      payment_type: paymentMethod,
      items: [
        {
          item_id: courseSlug,
          item_name: courseTitle,
          quantity: 1,
          price: coursePrice || 0,
        },
      ],
    })
  }

  // Facebook Pixel
  fbEvent('AddPaymentInfo', {
    content_type: 'course',
    content_ids: [courseSlug],
    content_name: courseTitle,
    value: coursePrice || 0,
    currency: 'BDT',
    custom_data: {
      payment_method: paymentMethod,
    },
  })
}

// Checkout Error tracking
export const trackCheckoutError = (
  errorType: string,
  errorMessage: string,
  courseSlug?: string,
  step?: string
) => {
  // Google Analytics
  event({
    action: 'checkout_error',
    category: 'error',
    label: `${errorType}_${step}_${courseSlug}`,
  })

  // Facebook Pixel
  fbEvent('CustomEvent', {
    event_name: 'checkout_error',
    custom_data: {
      error_type: errorType,
      error_message: errorMessage,
      course_slug: courseSlug,
      checkout_step: step,
    },
  })
}

// Enrollment Success tracking (enhanced version)
export const trackEnrollmentSuccess = (
  courseSlug: string,
  courseTitle: string,
  coursePrice?: number,
  courseType?: string,
  paymentMethod?: string,
  transactionId?: string
) => {
  // Use existing trackCourseEnrollment function
  trackCourseEnrollment(courseSlug, courseTitle, coursePrice)

  // Additional success tracking
  event({
    action: 'enrollment_complete',
    category: 'conversion',
    label: courseSlug,
    value: coursePrice,
  })

  // Facebook Pixel - Purchase event
  fbEvent('Purchase', {
    content_type: courseType || 'course',
    content_ids: [courseSlug],
    content_name: courseTitle,
    value: coursePrice || 0,
    currency: 'BDT',
    custom_data: {
      payment_method: paymentMethod,
      transaction_id: transactionId,
    },
  })
}

// Payment Failure tracking
export const trackPaymentFailure = (
  transactionId: string,
  courseSlug: string,
  courseTitle: string,
  coursePrice?: number,
  paymentMethod?: string,
  errorMessage?: string,
  errorCode?: string
) => {
  // Google Analytics
  event({
    action: 'payment_failed',
    category: 'ecommerce_error',
    label: `${courseSlug}_${paymentMethod}`,
    value: coursePrice,
  })

  // Enhanced GA tracking
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'payment_failed', {
      transaction_id: transactionId,
      currency: 'BDT',
      value: coursePrice || 0,
      payment_method: paymentMethod,
      error_message: errorMessage,
      error_code: errorCode,
      course_slug: courseSlug,
      course_title: courseTitle,
      items: [
        {
          item_id: courseSlug,
          item_name: courseTitle,
          item_category: 'course',
          quantity: 1,
          price: coursePrice || 0,
        },
      ],
    })
  }

  // Facebook Pixel
  fbEvent('PaymentInfoDeclined', {
    content_type: 'course',
    content_ids: [courseSlug],
    content_name: courseTitle,
    value: coursePrice || 0,
    currency: 'BDT',
    custom_data: {
      transaction_id: transactionId,
      payment_method: paymentMethod,
      error_message: errorMessage,
      error_code: errorCode,
      failure_reason: 'payment_processing_failed',
    },
  })
}

// Payment Cancellation tracking
export const trackPaymentCancellation = (
  transactionId: string,
  courseSlug: string,
  courseTitle: string,
  coursePrice?: number,
  paymentMethod?: string,
  cancellationReason?: string,
  checkoutStep?: string
) => {
  // Google Analytics
  event({
    action: 'payment_cancelled',
    category: 'ecommerce_abandonment',
    label: `${courseSlug}_${paymentMethod}`,
    value: coursePrice,
  })

  // Enhanced GA tracking
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'payment_cancelled', {
      transaction_id: transactionId,
      currency: 'BDT',
      value: coursePrice || 0,
      payment_method: paymentMethod,
      cancellation_reason: cancellationReason,
      checkout_step: checkoutStep,
      course_slug: courseSlug,
      course_title: courseTitle,
      items: [
        {
          item_id: courseSlug,
          item_name: courseTitle,
          item_category: 'course',
          quantity: 1,
          price: coursePrice || 0,
        },
      ],
    })
  }

  // Facebook Pixel - Custom event for cancellation
  fbEvent('CheckoutCancelled', {
    content_type: 'course',
    content_ids: [courseSlug],
    content_name: courseTitle,
    value: coursePrice || 0,
    currency: 'BDT',
    custom_data: {
      transaction_id: transactionId,
      payment_method: paymentMethod,
      cancellation_reason: cancellationReason,
      checkout_step: checkoutStep,
    },
  })
}

// Track cancel page interactions
export const trackCancelPageInteraction = (
  action: 'try_again' | 'browse_courses' | 'go_home' | 'contact_support',
  transactionId: string,
  courseSlug?: string
) => {
  // Google Analytics
  event({
    action: 'cancel_page_interaction',
    category: 'engagement',
    label: `${action}_${courseSlug || 'unknown'}`,
  })

  // Facebook Pixel
  fbEvent('ViewContent', {
    content_type: 'cancel_page',
    content_name: action,
    custom_data: {
      transaction_id: transactionId,
      course_slug: courseSlug,
      interaction_type: action,
      page_type: 'payment_cancel',
    },
  })
}

// Track payment retry attempts
export const trackPaymentRetry = (
  originalTransactionId: string,
  courseSlug: string,
  courseTitle: string,
  coursePrice?: number,
  retryMethod?: string,
  retryCount?: number
) => {
  // Google Analytics
  event({
    action: 'payment_retry',
    category: 'ecommerce_recovery',
    label: `${courseSlug}_${retryMethod}`,
    value: coursePrice,
  })

  // Enhanced GA tracking
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'payment_retry', {
      original_transaction_id: originalTransactionId,
      currency: 'BDT',
      value: coursePrice || 0,
      retry_method: retryMethod,
      retry_count: retryCount || 1,
      course_slug: courseSlug,
      course_title: courseTitle,
    })
  }

  // Facebook Pixel
  fbEvent('InitiateCheckout', {
    content_type: 'course',
    content_ids: [courseSlug],
    content_name: courseTitle,
    value: coursePrice || 0,
    currency: 'BDT',
    custom_data: {
      original_transaction_id: originalTransactionId,
      retry_method: retryMethod,
      retry_count: retryCount || 1,
      event_source: 'payment_retry',
    },
  })
}

// Payment Verification Failure tracking
export const trackPaymentVerificationFailure = (
  transactionId: string,
  errorType:
    | 'network_error'
    | 'invalid_transaction'
    | 'verification_timeout'
    | 'server_error'
    | 'unknown_error',
  errorMessage?: string,
  errorCode?: string,
  courseSlug?: string,
  courseTitle?: string,
  amount?: number
) => {
  // Google Analytics
  event({
    action: 'payment_verification_failed',
    category: 'ecommerce_error',
    label: `${errorType}_${transactionId}`,
    value: amount,
  })

  // Enhanced GA tracking
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'payment_verification_failed', {
      transaction_id: transactionId,
      error_type: errorType,
      error_message: errorMessage,
      error_code: errorCode,
      course_slug: courseSlug,
      course_title: courseTitle,
      value: amount || 0,
      currency: 'BDT',
      verification_status: 'failed',
    })
  }

  // Facebook Pixel
  fbEvent('PaymentVerificationFailed', {
    content_type: 'payment_verification',
    custom_data: {
      transaction_id: transactionId,
      error_type: errorType,
      error_message: errorMessage,
      error_code: errorCode,
      course_slug: courseSlug,
      course_title: courseTitle,
      amount: amount || 0,
      verification_status: 'failed',
    },
  })
}

// Enhanced payment verification tracking with more details
export const trackPaymentVerificationDetailed = (
  transactionId: string,
  status:
    | 'success'
    | 'failed'
    | 'already_exists'
    | 'verification_error'
    | 'timeout',
  courseSlug?: string,
  courseTitle?: string,
  amount?: number,
  errorDetails?: {
    errorType?: string
    errorMessage?: string
    errorCode?: string
    httpStatus?: number
  }
) => {
  // Google Analytics
  event({
    action: 'payment_verification_detailed',
    category: 'ecommerce',
    label: `${status}_${transactionId}`,
    value: amount,
  })

  // Enhanced GA tracking
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'payment_verification_detailed', {
      transaction_id: transactionId,
      verification_status: status,
      course_slug: courseSlug,
      course_title: courseTitle,
      value: amount || 0,
      currency: 'BDT',
      error_type: errorDetails?.errorType,
      error_message: errorDetails?.errorMessage,
      error_code: errorDetails?.errorCode,
      http_status: errorDetails?.httpStatus,
    })
  }

  // Facebook Pixel - Different events based on status
  const fbEventName =
    status === 'success' ? 'Purchase' : 'PaymentVerificationFailed'
  fbEvent(fbEventName, {
    content_type: 'payment_verification',
    content_ids: courseSlug ? [courseSlug] : [],
    content_name: courseTitle || 'Unknown Course',
    value: amount || 0,
    currency: 'BDT',
    custom_data: {
      transaction_id: transactionId,
      verification_status: status,
      course_slug: courseSlug,
      error_details: errorDetails,
    },
  })
}

// Track verification errors that lead to support requests
export const trackVerificationErrorSupport = (
  transactionId: string,
  errorType: string,
  supportAction: 'contact_initiated' | 'retry_attempted' | 'abandoned',
  courseSlug?: string
) => {
  // Google Analytics
  event({
    action: 'verification_error_support',
    category: 'customer_support',
    label: `${errorType}_${supportAction}`,
  })

  // Facebook Pixel
  fbEvent('VerificationErrorSupport', {
    content_type: 'support_request',
    custom_data: {
      transaction_id: transactionId,
      error_type: errorType,
      support_action: supportAction,
      course_slug: courseSlug,
    },
  })
}

// Simple Payment Verification Success tracking
export const trackPaymentVerificationSuccess = (
  transactionId: string,
  courseSlug?: string,
  courseTitle?: string,
  amount?: number
) => {
  // Google Analytics
  event({
    action: 'payment_verification_success',
    category: 'ecommerce',
    label: courseSlug || transactionId,
    value: amount,
  })

  // Enhanced GA tracking
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'payment_verification_success', {
      transaction_id: transactionId,
      course_slug: courseSlug,
      course_title: courseTitle,
      value: amount || 0,
      currency: 'BDT',
    })
  }

  // Facebook Pixel
  fbEvent('Purchase', {
    content_type: 'course',
    content_ids: courseSlug ? [courseSlug] : [],
    content_name: courseTitle || 'Course',
    value: amount || 0,
    currency: 'BDT',
    custom_data: {
      transaction_id: transactionId,
    },
  })
}

// Simple Payment Verification Error tracking
export const trackPaymentVerificationError = (
  transactionId: string,
  errorMessage?: string,
  courseSlug?: string,
  courseTitle?: string
) => {
  // Google Analytics
  event({
    action: 'payment_verification_error',
    category: 'ecommerce_error',
    label: courseSlug || transactionId,
  })

  // Enhanced GA tracking
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'payment_verification_error', {
      transaction_id: transactionId,
      error_message: errorMessage,
      course_slug: courseSlug,
      course_title: courseTitle,
    })
  }

  // Facebook Pixel
  fbEvent('PaymentVerificationFailed', {
    content_type: 'payment_verification',
    custom_data: {
      transaction_id: transactionId,
      error_message: errorMessage,
      course_slug: courseSlug,
      course_title: courseTitle,
    },
  })
}

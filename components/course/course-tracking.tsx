'use client'

import { useEffect, useState } from 'react'
import { trackCourseView } from '@/lib/analytics'

interface CourseTrackingProps {
  title?: string
  slug?: string
  price?: number
  courseType?: string
  isRegistrationOpen?: boolean
}

export function CourseTracking({
  title = 'Unknown Course',
  slug = 'unknown',
  price,
  courseType = 'course',
  isRegistrationOpen = true,
}: CourseTrackingProps) {
  const [scriptsLoaded, setScriptsLoaded] = useState(false)

  useEffect(() => {
    // Function to check if analytics scripts are ready
    const checkScriptsReady = () => {
      const gtagReady =
        typeof window !== 'undefined' && typeof window.gtag === 'function'
      const fbqReady =
        typeof window !== 'undefined' && typeof window.fbq === 'function'
      return { gtagReady, fbqReady, anyReady: gtagReady || fbqReady }
    }

    const handleScriptsLoaded = () => {
      const { anyReady } = checkScriptsReady()
      if (anyReady) {
        setScriptsLoaded(true)
        return true
      }
      return false
    }

    // Check immediately (for navigation case)
    if (handleScriptsLoaded()) {
      return
    }

    // Wait for DOM to be ready first
    if (document.readyState !== 'complete') {
      const onLoad = () => {
        // Small delay to ensure scripts are processed
        setTimeout(() => {
          handleScriptsLoaded()
        }, 100)
      }

      window.addEventListener('load', onLoad)

      // Cleanup
      return () => window.removeEventListener('load', onLoad)
    }

    // Poll for script availability with exponential backoff
    let attempts = 0
    let delay = 100 // Start with 100ms
    const maxAttempts = 20 // Maximum 20 attempts
    const maxDelay = 2000 // Maximum 2 seconds delay

    const pollForScripts = () => {
      attempts++
      console.log(`Polling for analytics scripts, attempt ${attempts}`)

      if (handleScriptsLoaded()) {
        return // Scripts loaded successfully
      }

      if (attempts >= maxAttempts) {
        console.warn('Analytics scripts not loaded after maximum attempts')
        setScriptsLoaded(true) // Set to true anyway to prevent blocking
        return
      }

      // Schedule next attempt with exponential backoff
      delay = Math.min(delay * 1.2, maxDelay)
      setTimeout(pollForScripts, delay)
    }

    // Start polling
    const initialTimeout = setTimeout(pollForScripts, delay)

    return () => clearTimeout(initialTimeout)
  }, [])

  useEffect(() => {
    if (!scriptsLoaded) {
      return
    }

    const trackCourseData = async () => {
      try {
        // Track course view with enhanced data
        trackCourseView(slug, title, price)

        // Server-side tracking as fallback
        try {
          await fetch('/api/track', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'User-Agent': navigator.userAgent,
            },
            body: JSON.stringify({
              event_name: 'bootcamp_page_view',
              event_type: 'both',
              ga_parameters: {
                course_slug: slug,
                course_title: title,
                course_price: price || 0,
                course_type: courseType,
                registration_open: isRegistrationOpen,
                page_type: 'bootcamp',
                currency: 'BDT',
                value: price || 0,
                page_location: window.location.href,
                page_referrer: document.referrer,
                items: [
                  {
                    item_id: slug,
                    item_name: title,
                    item_category: courseType,
                    quantity: 1,
                    price: price || 0,
                  },
                ],
              },
              fb_custom_data: {
                content_type: 'bootcamp',
                content_ids: [slug],
                content_name: title,
                value: price || 0,
                currency: 'BDT',
                custom_data: {
                  registration_open: isRegistrationOpen,
                  course_type: courseType,
                  page_type: 'bootcamp',
                  page_location: window.location.href,
                },
              },
            }),
          })
        } catch (serverTrackingError) {
          console.warn('Server-side tracking failed:', serverTrackingError)
          // Don't throw - client-side tracking might still work
        }
      } catch (error) {
        console.error('Course tracking error:', error)
      }
    }

    // Add a small delay to ensure DOM is fully ready
    const trackingTimer = setTimeout(trackCourseData, 100)

    return () => clearTimeout(trackingTimer)
  }, [scriptsLoaded, title, slug, price, courseType, isRegistrationOpen])

  // This component doesn't render anything
  return null
}

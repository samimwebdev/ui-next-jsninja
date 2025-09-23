'use client'

import { useEffect, useState } from 'react'
import { trackCourseView } from '@/lib/analytics'
import {
  trackVercelEvent,
  trackCourseView as trackVercelCourseView,
  trackBootcampView,
  trackScrollDepth,
} from '@/components/analytics/vercel-analytics'

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
  const [scrollTracked, setScrollTracked] = useState<Set<number>>(new Set())

  // ✅ Scroll depth tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = Math.round((scrollTop / docHeight) * 100)

      // Track at 25%, 50%, 75%, 90% milestones
      const milestones = [25, 50, 75, 90]
      milestones.forEach((milestone) => {
        if (scrollPercent >= milestone && !scrollTracked.has(milestone)) {
          setScrollTracked((prev) => new Set([...prev, milestone]))
          trackScrollDepth(
            milestone,
            courseType === 'bootcamp' ? 'bootcamp' : 'course'
          )
        }
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [courseType, scrollTracked])

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
        setTimeout(() => {
          handleScriptsLoaded()
        }, 100)
      }

      window.addEventListener('load', onLoad)
      return () => window.removeEventListener('load', onLoad)
    }

    // Poll for script availability with exponential backoff
    let attempts = 0
    let delay = 100
    const maxAttempts = 20
    const maxDelay = 2000

    const pollForScripts = () => {
      attempts++

      if (handleScriptsLoaded()) {
        return
      }

      if (attempts >= maxAttempts) {
        console.warn('Analytics scripts not loaded after maximum attempts')
        setScriptsLoaded(true)
        return
      }

      delay = Math.min(delay * 1.2, maxDelay)
      setTimeout(pollForScripts, delay)
    }

    const initialTimeout = setTimeout(pollForScripts, delay)
    return () => clearTimeout(initialTimeout)
  }, [])

  useEffect(() => {
    if (!scriptsLoaded) {
      return
    }

    const trackCourseData = async () => {
      try {
        // ✅ Track with Vercel Analytics
        const courseData = {
          slug,
          title,
          price,
          courseType,
          isRegistrationOpen,
        }

        if (courseType === 'bootcamp') {
          trackBootcampView(courseData)
        } else {
          trackVercelCourseView(courseData)
        }

        // ✅ Track page view with enhanced data
        trackVercelEvent('page_view', {
          page_type: courseType,
          course_slug: slug,
          course_title: title,
          course_price: price || 0,
          registration_open: isRegistrationOpen,
          page_location: window.location.href,
          page_referrer: document.referrer,
          user_agent: navigator.userAgent,
          viewport_width: window.innerWidth,
          viewport_height: window.innerHeight,
        })

        // Existing analytics
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
              event_name: `${courseType}_page_view`,
              event_type: 'both',
              ga_parameters: {
                course_slug: slug,
                course_title: title,
                course_price: price || 0,
                course_type: courseType,
                registration_open: isRegistrationOpen,
                page_type: courseType,
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
                content_type: courseType,
                content_ids: [slug],
                content_name: title,
                value: price || 0,
                currency: 'BDT',
                custom_data: {
                  registration_open: isRegistrationOpen,
                  course_type: courseType,
                  page_type: courseType,
                  page_location: window.location.href,
                },
              },
              // ✅ Add Vercel Analytics data
              vercel_data: {
                event_name: `${courseType}_view`,
                properties: courseData,
              },
            }),
          })
        } catch (serverTrackingError) {
          console.warn('Server-side tracking failed:', serverTrackingError)
        }
      } catch (error) {
        console.error('Course tracking error:', error)
      }
    }

    const trackingTimer = setTimeout(trackCourseData, 100)
    return () => clearTimeout(trackingTimer)
  }, [scriptsLoaded, title, slug, price, courseType, isRegistrationOpen])

  return null
}

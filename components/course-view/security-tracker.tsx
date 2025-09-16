'use client'

import { useEffect, useRef, useState } from 'react'
import FingerprintJS from '@fingerprintjs/fingerprintjs'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  trackCourseViewSecurity,
  type SecurityTrackingResult,
} from '@/app/course-view/[slug]/actions'

interface SecurityTrackerProps {
  courseSlug: string
}

export function SecurityTracker({ courseSlug }: SecurityTrackerProps) {
  const [securityStatus, setSecurityStatus] = useState<
    'checking' | 'allowed' | 'redirecting'
  >('checking')
  const hasInitialized = useRef(false)
  const hasTrackedSession = useRef(false)
  const router = useRouter()

  const sendSecurityDataAndCheck = async (fingerprintId: string) => {
    try {
      // Get browser data
      const browserData = {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        screenResolution: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        plugins: Array.from(navigator.plugins).map((plugin) => plugin.name),
      }

      // Call server action instead of direct API call
      const result: SecurityTrackingResult = await trackCourseViewSecurity(
        courseSlug,
        fingerprintId,
        browserData,
        // Only for development testing
        process.env.NODE_ENV === 'development' ? '45.248.151.40' : undefined
      )

      hasTrackedSession.current = true

      if (result.error && result.shouldRedirect) {
        // User is blocked
        toast.error('Access Restricted', {
          description: result.message || 'Access to this course is restricted',
          duration: 3000,
        })

        setSecurityStatus('redirecting')

        // Redirect to dashboard after a short delay to show the toast
        setTimeout(() => {
          router.push('/dashboard')
        }, 1000)

        return false
      } else if (result.success) {
        // User is allowed
        if (result.message?.includes('warning')) {
          toast.warning('Security Check Warning', {
            description: result.message,
            duration: 4000,
          })
        }

        setSecurityStatus('allowed')
        return true
      }

      // Handle unexpected cases
      toast.warning('Security Status Unknown', {
        description:
          'Unable to determine security status. Proceeding with caution.',
        duration: 4000,
      })

      setSecurityStatus('allowed')
      return true
    } catch (error) {
      console.error('Client: Failed to send security data:', error)

      // If server action fails, show warning but allow access
      toast.warning('Security Check Failed', {
        description:
          'Unable to verify security status. You can continue for now.',
        duration: 4000,
      })

      setSecurityStatus('allowed')
      return true
    }
  }

  const initializeSecurity = async () => {
    if (hasInitialized.current) return
    hasInitialized.current = true

    try {
      // Initialize FingerprintJS
      const fp = await FingerprintJS.load()
      const result = await fp.get()
      const fingerprintId = `fp_${result.visitorId}`

      // Send tracking data and check security status
      await sendSecurityDataAndCheck(fingerprintId)
    } catch (error) {
      console.error('Client: Failed to initialize security tracking:', error)

      // Don't block user if fingerprinting fails
      toast.warning('Security Initialization Failed', {
        description:
          'Unable to initialize security tracking. You can continue for now.',
        duration: 4000,
      })
      setSecurityStatus('allowed')
    }
  }

  // Initialize on component mount (page load/reload)
  useEffect(() => {
    initializeSecurity()
  }, [courseSlug])

  // Handle page visibility change to track when user returns to tab
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (
        document.visibilityState === 'visible' &&
        !hasTrackedSession.current
      ) {
        // User returned to tab, reinitialize if not already tracked in this session

        initializeSecurity()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  // Show redirecting indicator
  if (securityStatus === 'redirecting') {
    return (
      <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4 p-6 bg-card border rounded-lg shadow-lg">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-orange-600 animate-spin"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-orange-600">
                Redirecting to Dashboard
              </h2>
              <p className="text-sm text-muted-foreground">
                Please wait while we redirect you...
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Don't render anything for normal operation
  if (securityStatus === 'checking' || securityStatus === 'allowed') {
    return null
  }

  return null
}

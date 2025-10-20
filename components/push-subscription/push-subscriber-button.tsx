// components/PushSubscribeButton.jsx (client component)
'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Bell,
  BellOff,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Award,
  BookOpen,
  Clock,
  Lightbulb,
} from 'lucide-react'
import { toast } from 'sonner'

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

interface PushSubscribeButtonProps {
  vapidPublicKey: string
}

export default function PushSubscribeButton({
  vapidPublicKey,
}: PushSubscribeButtonProps) {
  const [status, setStatus] = useState<
    'idle' | 'loading' | 'subscribed' | 'error'
  >('idle')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [permission, setPermission] =
    useState<NotificationPermission>('default')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [isSupported, setIsSupported] = useState(true)
  const [isChecking, setIsChecking] = useState(true) // ✅ Start as true

  useEffect(() => {
    const checkSupport = () => {
      const supported =
        'serviceWorker' in navigator &&
        'PushManager' in window &&
        'Notification' in window

      setIsSupported(supported)

      if (supported && typeof Notification !== 'undefined') {
        setPermission(Notification.permission)
      }

      // ✅ If not supported, stop checking immediately
      if (!supported) {
        setIsChecking(false)
      }
    }

    checkSupport()
  }, [])

  useEffect(() => {
    // ✅ Only run subscription check if browser is supported
    if (!isSupported) return

    const checkSubscription = async () => {
      try {
        setIsChecking(true)

        // Wait for service worker to be ready
        const registration = await navigator.serviceWorker.ready
        const subscription = await registration.pushManager.getSubscription()

        setIsSubscribed(!!subscription)
      } catch (error) {
        console.error('[Push] Error checking subscription:', error)
      } finally {
        // ✅ Always set checking to false after check completes
        setIsChecking(false)
      }
    }

    checkSubscription()
  }, [isSupported])

  const subscribe = async () => {
    if (!isSupported) {
      toast.error('Push notifications are not supported in this browser')
      return
    }

    setStatus('loading')
    setErrorMessage('')

    try {
      let currentPermission = Notification.permission

      if (currentPermission === 'default') {
        currentPermission = await Notification.requestPermission()
        setPermission(currentPermission)
      }

      if (currentPermission === 'denied') {
        const msg =
          'Notification permission denied. Please enable notifications in your browser settings.'
        setErrorMessage(msg)
        toast.error(msg)
        setStatus('error')
        return
      }

      if (currentPermission !== 'granted') {
        throw new Error('Notification permission not granted')
      }

      let registration: ServiceWorkerRegistration

      try {
        registration = await navigator.serviceWorker.ready
      } catch (swError) {
        console.error('[Push] Service worker not ready:', swError)
        throw new Error(
          'Service Worker is not ready. Please refresh the page and try again.'
        )
      }

      if (!registration.pushManager) {
        throw new Error('Push Manager is not available')
      }

      let subscription = await registration.pushManager.getSubscription()

      if (!subscription) {
        try {
          const applicationServerKey = urlBase64ToUint8Array(vapidPublicKey)

          subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: applicationServerKey as BufferSource,
          })
        } catch (subError: unknown) {
          if (subError instanceof Error) {
            if (subError.name === 'NotAllowedError') {
              throw new Error(
                'Permission denied. Please allow notifications and try again.'
              )
            } else if (subError.name === 'NotSupportedError') {
              throw new Error('Push notifications are not supported.')
            }
          }
          throw subError
        }
      }

      const response = await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription: subscription.toJSON(),
          userAgent: navigator.userAgent,
        }),
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to save subscription')
      }

      setStatus('subscribed')
      setIsSubscribed(true)
      toast.success(
        "🎉 Push notifications enabled! You'll stay updated on everything."
      )
    } catch (err) {
      console.error('[Push] Subscription error:', err)

      let errorMsg = 'Failed to enable push notifications'

      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          errorMsg =
            'Permission denied. Please allow notifications in your browser.'
        } else if (err.name === 'NotSupportedError') {
          errorMsg = 'Push notifications are not supported in this browser.'
        } else {
          errorMsg = err.message
        }
      }

      setErrorMessage(errorMsg)
      toast.error(errorMsg)
      setStatus('error')
    } finally {
      setStatus('idle')
    }
  }

  const unsubscribe = async () => {
    setStatus('loading')
    setErrorMessage('')

    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()

      if (subscription) {
        const response = await fetch('/api/push/unsubscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            endpoint: subscription.endpoint,
          }),
        })

        if (!response.ok) {
          console.warn('[Push] Failed to remove from backend, continuing...')
        }

        await subscription.unsubscribe()
        setIsSubscribed(false)
        toast.success('Push notifications disabled')
      }

      setStatus('idle')
    } catch (err) {
      console.error('[Push] Unsubscribe error:', err)
      const errorMsg =
        err instanceof Error ? err.message : 'Failed to unsubscribe'
      setErrorMessage(errorMsg)
      toast.error(errorMsg)
      setStatus('error')
    } finally {
      setStatus('idle')
    }
  }

  // ✅ Show skeleton while checking OR if browser not supported but still checking
  if (isChecking) {
    return (
      <div className="flex flex-col gap-4 animate-in fade-in duration-300">
        {/* Benefits Section Skeleton */}
        <div className="relative overflow-hidden border border-blue-200/60 dark:border-blue-800/30 rounded-lg p-6 bg-gradient-to-br from-blue-50/80 via-indigo-50/50 to-purple-50/30 dark:from-blue-950/40 dark:via-indigo-950/30 dark:to-purple-950/20">
          <div className="space-y-4">
            {/* Header Skeleton */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5 rounded-full bg-blue-200/50 dark:bg-blue-800/50" />
              <Skeleton className="h-6 w-3/4 bg-blue-200/50 dark:bg-blue-800/50" />
            </div>

            {/* Description Skeleton */}
            <div className="space-y-2.5">
              <Skeleton className="h-4 w-2/3 bg-blue-200/40 dark:bg-blue-800/40" />
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Skeleton className="h-4 w-4 mt-0.5 rounded-sm bg-blue-200/40 dark:bg-blue-800/40" />
                    <Skeleton
                      className="h-4 bg-blue-200/40 dark:bg-blue-800/40"
                      style={{ width: `${85 - i * 5}%` }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Skeleton */}
            <Skeleton className="h-10 w-full rounded-lg bg-blue-200/40 dark:bg-blue-800/40" />
          </div>

          {/* Animated shimmer effect */}
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-blue-100/20 dark:via-blue-900/20 to-transparent" />
        </div>

        {/* Button Skeleton */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-11 w-full sm:w-56 rounded-lg bg-blue-200/50 dark:bg-blue-800/50" />
        </div>

        {/* Loading Text */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Checking notification status...</span>
        </div>
      </div>
    )
  }

  // ✅ Browser not supported - only show after checking is done
  if (!isSupported) {
    return (
      <Alert className="border-amber-200 bg-amber-50/50 dark:border-amber-800/50 dark:bg-amber-950/20 animate-in fade-in duration-300">
        <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500" />
        <AlertTitle className="text-amber-900 dark:text-amber-200">
          Browser Not Supported
        </AlertTitle>
        <AlertDescription className="text-amber-800 dark:text-amber-300 text-sm">
          Push notifications are not supported in your current browser. Please
          use Chrome, Edge, Firefox, or Safari for the best experience.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="flex flex-col gap-4 animate-in fade-in duration-300">
      {/* Main Benefits Section */}
      {!isSubscribed && permission !== 'denied' && (
        <Alert className="relative overflow-hidden border-blue-200/60 bg-gradient-to-br from-blue-50/80 via-indigo-50/50 to-purple-50/30 dark:border-blue-800/30 dark:from-blue-950/40 dark:via-indigo-950/30 dark:to-purple-950/20 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 dark:from-blue-400/10 dark:to-purple-400/10" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
              <AlertTitle className="text-blue-900 dark:text-blue-200 text-lg font-semibold">
                Stay Ahead in Your Learning Journey
              </AlertTitle>
            </div>
            <AlertDescription className="text-blue-900 dark:text-blue-200 text-sm space-y-3">
              <p className="font-medium text-blue-900 dark:text-blue-100">
                Enable notifications and never miss out on:
              </p>
              <ul className="space-y-2.5">
                <li className="flex items-start gap-2.5 group">
                  <BookOpen className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                  <span className="text-blue-800 dark:text-blue-200">
                    <strong className="font-semibold text-blue-900 dark:text-blue-100">
                      New Course Releases:
                    </strong>{' '}
                    Be the first to know when we launch new courses and content
                  </span>
                </li>
                <li className="flex items-start gap-2.5 group">
                  <Award className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                  <span className="text-blue-800 dark:text-blue-200">
                    <strong className="font-semibold text-blue-900 dark:text-blue-100">
                      Achievement Milestones:
                    </strong>{' '}
                    Celebrate your progress with instant completion
                    notifications
                  </span>
                </li>
                <li className="flex items-start gap-2.5 group">
                  <Clock className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                  <span className="text-blue-800 dark:text-blue-200">
                    <strong className="font-semibold text-blue-900 dark:text-blue-100">
                      Live Session Reminders:
                    </strong>{' '}
                    Get timely alerts for upcoming webinars and Q&A sessions
                  </span>
                </li>
                <li className="flex items-start gap-2.5 group">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 mr-2 flex-shrink-0 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                  <span className="text-blue-800 dark:text-blue-200">
                    <strong className="font-semibold text-blue-900 dark:text-blue-100">
                      Important Updates:
                    </strong>{' '}
                    Stay informed about course updates, assignments, and
                    deadlines
                  </span>
                </li>
              </ul>
              <div className="flex items-start gap-2 pt-2 text-xs text-blue-800 dark:text-blue-200 bg-blue-100/50 dark:bg-blue-900/20 rounded-lg px-3 py-2">
                <Lightbulb className="h-4 w-4 mt-0.5 mr-1 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                <span>
                  You can disable notifications anytime. We respect your inbox!
                </span>
              </div>
            </AlertDescription>
          </div>
        </Alert>
      )}

      {/* Main Button */}
      <div className="flex flex-col gap-2">
        <Button
          onClick={isSubscribed ? unsubscribe : subscribe}
          disabled={status === 'loading' || permission === 'denied'}
          variant={isSubscribed ? 'outline' : 'default'}
          size="lg"
          className="w-full sm:w-auto transition-all hover:scale-105 active:scale-100"
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {isSubscribed ? 'Disabling...' : 'Enabling...'}
            </>
          ) : isSubscribed ? (
            <>
              <BellOff className="h-4 w-4 mr-2" />
              Disable Notifications
            </>
          ) : (
            <>
              <Bell className="h-4 w-4 mr-2" />
              Enable Push Notifications
            </>
          )}
        </Button>

        {/* Success Message */}
        {isSubscribed && status !== 'loading' && (
          <Alert className="border-green-200/60 bg-green-50/80 dark:border-green-800/30 dark:bg-green-950/30 backdrop-blur-sm">
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertTitle className="text-green-800 dark:text-green-200 text-sm font-semibold">
              Notifications Enabled
            </AlertTitle>
            <AlertDescription className="text-green-700 dark:text-green-300 text-xs">
              You&apos;ll receive real-time updates about your courses,
              achievements, and important announcements. Stay connected!
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Permission Denied Alert with Solutions */}
      {permission === 'denied' && (
        <Alert className="border-red-200/60 bg-red-50/80 dark:border-red-800/30 dark:bg-red-950/30 backdrop-blur-sm">
          <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
          <AlertTitle className="text-red-900 dark:text-red-200">
            Notifications Are Blocked
          </AlertTitle>
          <AlertDescription className="text-red-800 dark:text-red-300">
            <p className="mb-3 font-medium">
              Notifications are currently blocked in your browser. Here&apos;s
              how to fix it:
            </p>

            <div className="space-y-4">
              <div className="bg-red-100/50 dark:bg-red-900/20 rounded-lg p-3">
                <p className="font-semibold text-sm mb-2 text-red-900 dark:text-red-200">
                  For Chrome/Edge:
                </p>
                <ol className="list-decimal list-inside space-y-1.5 text-sm text-red-800 dark:text-red-300">
                  <li>
                    Click the lock icon (🔒) or info icon (ⓘ) in the address bar
                  </li>
                  <li>
                    Click &quot;Site settings&quot; or &quot;Permissions for
                    this site&quot;
                  </li>
                  <li>
                    Find &quot;Notifications&quot; and change to
                    &quot;Allow&quot;
                  </li>
                  <li>Refresh this page (F5) and try again</li>
                </ol>
              </div>

              <div className="bg-red-100/50 dark:bg-red-900/20 rounded-lg p-3">
                <p className="font-semibold text-sm mb-2 text-red-900 dark:text-red-200">
                  Alternative Method:
                </p>
                <ol className="list-decimal list-inside space-y-1.5 text-sm text-red-800 dark:text-red-300">
                  <li>
                    Go to browser Settings → Privacy & Security → Site Settings
                  </li>
                  <li>Click on &quot;Notifications&quot;</li>
                  <li>Remove this site from the &quot;Blocked&quot; list</li>
                  <li>Refresh and enable notifications</li>
                </ol>
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Error Alert with Troubleshooting */}
      {errorMessage && status === 'error' && permission !== 'denied' && (
        <Alert className="border-red-200/60 bg-red-50/80 dark:border-red-800/30 dark:bg-red-950/30 backdrop-blur-sm">
          <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
          <AlertTitle className="text-red-900 dark:text-red-200">
            Oops! Something Went Wrong
          </AlertTitle>
          <AlertDescription className="text-red-800 dark:text-red-300">
            <div className="space-y-3">
              <p className="font-semibold bg-red-100/50 dark:bg-red-900/20 rounded px-2 py-1">
                {errorMessage}
              </p>

              <div className="bg-red-100/50 dark:bg-red-900/20 rounded-lg p-3">
                <p className="font-semibold text-sm mb-2 text-red-900 dark:text-red-200">
                  Quick Fixes:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li className="text-red-800 dark:text-red-300">
                    <strong className="text-red-900 dark:text-red-200">
                      Refresh the page
                    </strong>{' '}
                    (Press F5) and try again
                  </li>
                  <li className="text-red-800 dark:text-red-300">
                    <strong className="text-red-900 dark:text-red-200">
                      Check browser permissions:
                    </strong>{' '}
                    Make sure notifications are allowed in your browser settings
                  </li>
                  <li className="text-red-800 dark:text-red-300">
                    <strong className="text-red-900 dark:text-red-200">
                      Clear cache:
                    </strong>{' '}
                    Clear your browser cache and cookies, then try again
                  </li>
                  <li className="text-red-800 dark:text-red-300">
                    <strong className="text-red-900 dark:text-red-200">
                      Try another browser:
                    </strong>{' '}
                    Chrome, Edge, and Firefox work best with push notifications
                  </li>
                  <li className="text-red-800 dark:text-red-300">
                    <strong className="text-red-900 dark:text-red-200">
                      Check system settings:
                    </strong>{' '}
                    Ensure notifications are enabled in your Windows/Mac
                    notification settings
                  </li>
                </ol>
              </div>

              <div className="pt-2 border-t border-red-200 dark:border-red-800/50 text-xs text-red-700 dark:text-red-400 italic">
                Still having issues? Contact support or try again later. Your
                learning experience won&apos;t be affected!
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

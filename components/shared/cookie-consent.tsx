'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { X, Cookie } from 'lucide-react'

const COOKIE_CONSENT_KEY = 'cookie-consent-accepted'

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Check if user has already given consent
    const hasConsented = localStorage.getItem(COOKIE_CONSENT_KEY)

    if (!hasConsented) {
      // Show after a small delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true)
        setIsLoaded(true)
      }, 1000)

      return () => clearTimeout(timer)
    } else {
      setIsLoaded(true)
    }
  }, [])

  const handleAccept = () => {
    // Store consent in localStorage
    localStorage.setItem(COOKIE_CONSENT_KEY, 'true')
    localStorage.setItem('cookie-consent-timestamp', new Date().toISOString())

    setIsVisible(false)
  }

  const handleClose = () => {
    // Even if they close, we'll consider it as acceptance
    handleAccept()
  }

  // Don't render anything until we've checked localStorage
  if (!isLoaded || !isVisible) {
    return null
  }

  return (
    <>
      {/* Backdrop overlay for mobile */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden" />

      {/* Cookie consent popup */}
      <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full mx-4 md:mx-0">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-4 animate-in slide-in-from-bottom-2 duration-300">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Cookie className="h-5 w-5 text-orange-500" />
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                Cookie Policy
              </h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 -mt-1 -mr-1"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Content */}
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
            We use cookies to enhance your browsing experience, provide
            analytics, and show personalized content. By continuing to use our
            site, you agree to our use of cookies.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={handleAccept}
              className="flex-1 hover:bg-primary/90"
              size="sm"
            >
              Accept All Cookies
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => window.open('/pages/privacy-policy', '_blank')}
              className="text-xs px-2 whitespace-nowrap"
            >
              Privacy Policy
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

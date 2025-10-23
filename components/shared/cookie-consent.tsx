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
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
        onClick={handleClose}
      />

      {/* Cookie consent popup */}
      <div className="fixed bottom-0 left-0 right-0 sm:bottom-4 sm:left-auto sm:right-4 z-50 sm:max-w-sm w-full px-4 sm:px-0 pb-4 sm:pb-0">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-t-2xl sm:rounded-lg shadow-2xl sm:shadow-xl p-4 sm:p-5 animate-in slide-in-from-bottom-2 duration-300">
          {/* Header */}
          <div className="flex items-start justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-2">
              <Cookie className="h-5 w-5 sm:h-6 sm:w-6 text-orange-500 flex-shrink-0" />
              <h3 className="font-semibold text-base sm:text-lg text-gray-900 dark:text-gray-100">
                Cookie Policy
              </h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-7 w-7 sm:h-8 sm:w-8 p-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 -mt-1 -mr-1 flex-shrink-0"
              aria-label="Close cookie consent"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>

          {/* Content */}
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
            We use cookies to enhance your browsing experience, provide
            analytics, and show personalized content. By continuing to use our
            site, you agree to our use of cookies.
          </p>

          {/* Actions */}
          <div className="flex flex-col gap-2 sm:gap-3">
            <Button
              onClick={handleAccept}
              className="w-full hover:bg-primary/90 py-2.5 sm:py-3 text-sm sm:text-base font-semibold"
              size="sm"
            >
              Accept All Cookies
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => window.open('/pages/privacy-policy', '_blank')}
              className="w-full text-xs sm:text-sm py-2 sm:py-2.5"
            >
              Privacy Policy
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

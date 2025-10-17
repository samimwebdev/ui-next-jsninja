'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Shield, X, ArrowRight, Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface TwoFactorPromptBannerProps {
  onDismiss?: () => void
}

export function TwoFactorPromptBanner({
  onDismiss,
}: TwoFactorPromptBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    // Check if user has dismissed this before (within 7 days)
    const dismissedAt = localStorage.getItem('2fa-banner-dismissed')
    if (dismissedAt) {
      const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
      if (parseInt(dismissedAt) > sevenDaysAgo) {
        setIsDismissed(true)
      }
    }
  }, [])

  const handleEnableTwoFactor = () => {
    router.push('/dashboard/security')
  }

  const handleDismiss = () => {
    setIsDismissed(true)
    localStorage.setItem('2fa-banner-dismissed', Date.now().toString())
    onDismiss?.()
  }

  if (!mounted || isDismissed) {
    return null
  }

  return (
    <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 dark:from-amber-950/30 dark:via-orange-950/30 dark:to-amber-950/30 border-b border-amber-200 dark:border-amber-800/50 backdrop-blur-sm">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <Alert className="border-0 bg-transparent py-4 px-0">
          <div className="flex items-center gap-3">
            {/* Icon with gradient background */}
            {/* <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 dark:from-amber-600 dark:to-orange-600 flex items-center justify-center shadow-lg">
              <Shield className="h-5 w-5 text-white" />
            </div> */}

            {/* Content */}
            <AlertDescription className="flex items-center justify-between flex-1 gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 flex-1 min-w-0">
                {/* Text content */}
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Lock className="h-4 w-4 text-amber-700 dark:text-amber-400 flex-shrink-0" />
                  <span className="text-sm text-amber-900 dark:text-amber-100">
                    <strong className="font-semibold">
                      Protect Your Account
                    </strong>
                    <span className="hidden sm:inline">
                      {' '}
                      — Enable Two-Factor Authentication for enhanced security
                    </span>
                    <span className="sm:hidden block text-xs text-amber-700 dark:text-amber-300 mt-0.5">
                      Enable 2FA for better security
                    </span>
                  </span>
                </div>

                {/* CTA Button */}
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleEnableTwoFactor}
                  className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 dark:from-amber-500 dark:to-orange-500 dark:hover:from-amber-600 dark:hover:to-orange-600 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 flex-shrink-0 font-semibold"
                >
                  <Shield className="h-3.5 w-3.5 mr-1.5" />
                  <span className="hidden sm:inline">Enable 2FA</span>
                  <span className="sm:hidden">Enable</span>
                  <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
                </Button>
              </div>

              {/* Dismiss button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="text-amber-700 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/30 flex-shrink-0 h-8 w-8 p-0"
                aria-label="Dismiss 2FA security notice"
                title="Remind me later (7 days)"
              >
                <X className="h-4 w-4" />
              </Button>
            </AlertDescription>
          </div>
        </Alert>
      </div>
    </div>
  )
}

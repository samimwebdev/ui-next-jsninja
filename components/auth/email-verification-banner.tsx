'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Mail, X, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { resendEmailConfirmation } from '@/lib/actions/email-verification'

interface EmailVerificationBannerProps {
  userEmail: string
  onDismiss?: () => void
}

export function EmailVerificationBanner({
  userEmail,
  onDismiss,
}: EmailVerificationBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleResendVerification = () => {
    if (isPending) return

    startTransition(async () => {
      try {
        const result = await resendEmailConfirmation(userEmail)

        if (result.success) {
          toast.success('Verification email sent!', {
            description: 'Please check your inbox and spam folder.',
          })
        } else {
          throw new Error(result.error || 'Failed to send verification email')
        }
      } catch (error) {
        console.error('Verification email error:', error)
        toast.error('Failed to send verification email', {
          description:
            error instanceof Error
              ? error.message
              : 'Please try again later or contact support.',
        })
      }
    })
  }

  const handleDismiss = () => {
    setIsDismissed(true)
    onDismiss?.()
  }

  if (isDismissed) {
    return null
  }

  return (
    <div className="bg-yellow-50 max-w-screen-xl mx-auto px-1 py-1 border-b border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-700">
      <div className="container mx-auto px-4">
        <Alert className="border-0 bg-transparent p-4">
          <Mail className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
          <AlertDescription className="flex items-center justify-between w-full ml-2">
            <div className="flex items-center gap-4 flex-1">
              <span className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Please verify your email address</strong> to access all
                features. Check your inbox at <strong>{userEmail}</strong>
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={handleResendVerification}
                disabled={isPending}
                className="bg-yellow-100 hover:bg-yellow-800 dark:bg-yellow-800/50 dark:hover:bg-yellow-700/50 border-yellow-300 dark:border-yellow-600 text-yellow-800 dark:text-yellow-200 shrink-0"
              >
                {isPending ? (
                  <>
                    <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="h-3 w-3 mr-2" />
                    Resend Email
                  </>
                )}
              </Button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-100 ml-2 shrink-0"
              aria-label="Dismiss verification banner"
            >
              <X className="h-4 w-4" />
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}

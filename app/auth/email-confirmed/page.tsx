'use client'

import { useEffect, useState, useTransition, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react'
import { confirmEmailWithToken } from '@/lib/actions/email-verification'

export default function EmailConfirmedPage() {
  const [status, setStatus] = useState<
    'loading' | 'success' | 'error' | 'checking'
  >('loading')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [errorDetails, setErrorDetails] = useState<string>('')
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // ✅ Prevent duplicate calls
  const hasProcessedRef = useRef(false)
  const confirmationProcessedRef = useRef<string | null>(null)

  const confirmation = searchParams.get('confirmation')

  useEffect(() => {
    if (!confirmation) {
      setStatus('error')
      setErrorMessage('No confirmation token provided in the URL')
      return
    }

    // ✅ Prevent duplicate processing of same token
    if (
      hasProcessedRef.current ||
      confirmationProcessedRef.current === confirmation
    ) {
      return
    }

    // ✅ Mark as being processed
    hasProcessedRef.current = true
    confirmationProcessedRef.current = confirmation

    startTransition(async () => {
      try {
        setStatus('checking')

        // ✅ Try the confirmation process with the token
        const confirmResult = await confirmEmailWithToken(confirmation)
        console.log('📋 Confirmation result:', confirmResult)

        if (confirmResult.success) {
          setStatus('success')
        } else {
          // Confirmation failed
          setStatus('error')
          setErrorMessage(confirmResult.error || 'Email confirmation failed')
          setErrorDetails(confirmResult.message || '')
        }
      } catch (error) {
        console.error('❌ Email confirmation process error:', error)
        setStatus('error')
        setErrorMessage(
          error instanceof Error ? error.message : 'Unknown error occurred'
        )
      }
    })
  }, [confirmation]) // Only depend on confirmation token

  return (
    <div className="container mx-auto px-4 py-16 max-w-md text-center">
      {(status === 'loading' || status === 'checking') && (
        <div>
          <RefreshCw className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">
            {status === 'loading' ? 'Processing...' : 'Verifying Email...'}
          </h1>
          <p className="text-muted-foreground">
            Please wait while we verify your email address.
          </p>
        </div>
      )}

      {status === 'success' && (
        <div>
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-green-600 mb-2">
            Email Confirmed!
          </h1>
          <p className="text-muted-foreground mb-6">
            Your email has been successfully verified. You now have access to
            all features.
          </p>
          <div className="space-y-3">
            <Button
              onClick={() => router.push('/dashboard')}
              className="w-full"
              disabled={isPending}
            >
              Continue to Dashboard
            </Button>
            <Button
              onClick={() => router.push('/courses')}
              variant="outline"
              className="w-full"
              disabled={isPending}
            >
              Browse Courses
            </Button>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div>
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-red-600 mb-2">
            Confirmation Failed
          </h1>
          <p className="text-muted-foreground mb-2">
            Unable to confirm your email address.
          </p>
          {errorMessage && (
            <div className="text-sm text-red-600 mb-4 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg text-left">
              <p className="font-medium">Error: {errorMessage}</p>
              {errorDetails && (
                <p className="text-xs mt-1 opacity-75">
                  Details: {errorDetails}
                </p>
              )}
            </div>
          )}
          <div className="space-y-3">
            <Button
              onClick={() => router.push('/dashboard')}
              className="w-full"
              disabled={isPending}
            >
              Go to Dashboard to Retry
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

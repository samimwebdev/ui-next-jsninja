'use client'

import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  CheckCircle2,
  ArrowRight,
  Loader2,
  AlertCircle,
  Info,
  MessageCircle,
  RefreshCw,
  Home,
} from 'lucide-react'
import { useAutoVerifyPayment } from '@/hooks/use-payment'
import { toast } from 'sonner'
import { isPaymentVerificationError } from '@/types/payment-types'
import { PaymentVerificationTracking } from '@/components/payment/payment-verification-tracking'

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()
  const [showButtons, setShowButtons] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  const transactionId = searchParams.get('pp_id')

  const {
    data: verificationResponse,
    isLoading: isVerifying,
    isError: verificationError,
    error,
    refetch,
  } = useAutoVerifyPayment(transactionId)

  console.log({ verificationResponse })

  // ✅ Simple tracking state
  const [trackingStatus, setTrackingStatus] = useState<{
    status: 'success' | 'error' | 'already_exists' | null
    courseSlug?: string
    courseTitle?: string
    amount?: string
    errorMessage?: string
  }>({ status: null })

  useEffect(() => {
    if (verificationResponse) {
      // Refetch enrolled courses to update the dashboard
      queryClient.invalidateQueries({ queryKey: ['enrolledCourses'] })

      // Check if response contains an error
      if (isPaymentVerificationError(verificationResponse)) {
        const errorMessage = verificationResponse.error.message

        // Special handling for "already created" error - this is actually success
        if (
          errorMessage.includes('already created') ||
          errorMessage.includes('course access')
        ) {
          // ✅ Track as success (already exists)
          setTrackingStatus({
            status: 'already_exists',
            errorMessage: errorMessage,
          })

          toast.success('Course access already granted! Welcome to the course.')

          const timer = setTimeout(() => {
            router.push('/dashboard')
          }, 3000)

          const buttonTimer = setTimeout(() => {
            setShowButtons(true)
          }, 2000)

          return () => {
            clearTimeout(timer)
            clearTimeout(buttonTimer)
          }
        } else {
          // ✅ Track as error
          setTrackingStatus({
            status: 'error',
            errorMessage: errorMessage,
          })

          toast.error(errorMessage)
          setShowButtons(true)
        }
      } else if (verificationResponse.data.status === 'completed') {
        // ✅ Track as success
        setTrackingStatus({
          status: 'success',
          courseSlug: verificationResponse.data.metadata.courseSlug,
          courseTitle: verificationResponse.data.metadata.courseTitle,
          amount: verificationResponse.data.amount,
        })

        toast.success('Payment verified successfully! Welcome to the course.')

        const timer = setTimeout(() => {
          // router.push('/dashboard') // Commented out for now
        }, 3000)

        const buttonTimer = setTimeout(() => {
          setShowButtons(true)
        }, 2000)

        return () => {
          clearTimeout(timer)
          clearTimeout(buttonTimer)
        }
      } else {
        // ✅ Track as error (unexpected status)
        setTrackingStatus({
          status: 'error',
          courseSlug: verificationResponse.data.metadata?.courseSlug,
          courseTitle: verificationResponse.data.metadata?.courseTitle,
          amount: verificationResponse.data.amount,
          errorMessage: `Unexpected payment status: ${verificationResponse.data.status}`,
        })

        toast.error('Payment verification failed')
        setShowButtons(true)
      }
    }
  }, [verificationResponse, router, queryClient])

  useEffect(() => {
    if (verificationError) {
      // ✅ Track verification request error
      setTrackingStatus({
        status: 'error',
        errorMessage: error?.message || 'Failed to verify payment',
      })

      toast.error(error?.message || 'Failed to verify payment')
      setShowButtons(true)
    }
  }, [verificationError, error])

  // ✅ Handle retry verification
  const handleRetryVerification = async () => {
    try {
      setRetryCount((prev) => prev + 1)
      await refetch()
      toast.info('Retrying payment verification...')
    } catch (error) {
      console.log(error)
      toast.error('Retry failed. Please contact support.')
    }
  }

  // ✅ Handle contact support (works with or without transaction ID)
  const handleContactSupport = async () => {
    try {
      const supportMessage = `Payment Issue - ${
        transactionId
          ? `Transaction ${transactionId}`
          : 'Missing Transaction ID'
      }

Hello, I need help with a payment issue:

${
  transactionId
    ? `Transaction ID: ${transactionId}`
    : 'Transaction ID: Not found in URL'
}
Issue: ${
        trackingStatus.errorMessage ||
        'Payment verification failed or transaction ID missing'
      }
${retryCount > 0 ? `Retry Attempts: ${retryCount}` : ''}

Please help me get access to my purchased course or verify my payment.

Thank you!`

      // Open Facebook Messenger
      const facebookPageId =
        process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID || '108194384815914'
      const messengerUrl = `https://m.me/${facebookPageId}?text=${encodeURIComponent(
        supportMessage
      )}`

      // Prepare email
      const emailSubject = transactionId
        ? `Payment Verification Issue - Transaction ${transactionId}`
        : 'Payment Issue - Missing Transaction ID'
      const emailUrl = `mailto:${
        process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@javascriptninja.com'
      }?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(
        supportMessage
      )}`

      // Open both channels
      window.open(messengerUrl, '_blank')
      setTimeout(() => {
        window.location.href = emailUrl
      }, 1000)

      toast.success('Opening support channels...')
    } catch (error) {
      console.error('Error opening support channels:', error)
      toast.error('Failed to open support channels')
    }
  }

  const handleDashboardRedirect = () => {
    router.push('/dashboard')
  }

  const handleStartLearning = () => {
    if (
      verificationResponse &&
      !isPaymentVerificationError(verificationResponse) &&
      verificationResponse.data.metadata.courseId
    ) {
      router.push(`/course-view/${verificationResponse.data.metadata.courseId}`)
      return
    }
    router.push('/dashboard')
  }

  // ✅ Show error state with support option if no transaction ID
  if (!transactionId) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-2xl font-bold text-destructive">
              Payment Issue
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <p className="text-lg font-medium text-destructive">
                Transaction ID Not Found
              </p>
              <p className="text-muted-foreground">
                We couldn’t find a transaction ID in the URL. This might happen
                if:
              </p>
              <ul className="text-sm text-muted-foreground text-left space-y-2 max-w-md mx-auto">
                <li className="flex items-start gap-2">
                  <span className="text-destructive mt-1">•</span>
                  <span>The payment was cancelled or failed</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive mt-1">•</span>
                  <span>You were redirected incorrectly</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive mt-1">•</span>
                  <span>There was a technical issue during payment</span>
                </li>
              </ul>
              <p className="text-sm text-muted-foreground mt-4">
                If you completed a payment, please contact our support team
                immediately. We ll help verify your payment and grant course
                access.
              </p>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                💡 Have Payment Confirmation?
              </p>
              <p className="text-xs text-yellow-700 dark:text-yellow-300">
                If you received a payment confirmation email or SMS from your
                payment provider, please keep it handy when contacting support.
              </p>
            </div>

            <div className="space-y-3 pt-4">
              <Button
                onClick={handleContactSupport}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Contact Support (Messenger + Email)
              </Button>

              <Button
                variant="outline"
                onClick={() => router.push('/courses')}
                className="w-full"
              >
                <Home className="mr-2 h-4 w-4" />
                Browse Courses
              </Button>

              <Button
                variant="outline"
                onClick={handleDashboardRedirect}
                className="w-full"
              >
                Go to Dashboard
              </Button>
            </div>

            <p className="text-xs text-muted-foreground pt-4">
              Our support team is available to help you resolve this issue
              quickly.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isAlreadyCreatedError =
    verificationResponse &&
    isPaymentVerificationError(verificationResponse) &&
    verificationResponse.error.message.includes('already created')

  const isSuccessfulPayment =
    verificationResponse &&
    !isPaymentVerificationError(verificationResponse) &&
    verificationResponse.data.status === 'completed'

  const isSuccess = isSuccessfulPayment || isAlreadyCreatedError
  const isError = trackingStatus.status === 'error'

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      {/* ✅ Simple Payment Verification Tracking */}
      {trackingStatus.status && (
        <PaymentVerificationTracking
          transactionId={transactionId}
          status={trackingStatus.status}
          courseSlug={trackingStatus.courseSlug}
          courseTitle={trackingStatus.courseTitle}
          amount={trackingStatus.amount}
          errorMessage={trackingStatus.errorMessage}
        />
      )}

      <Card className="text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
            {isVerifying ? (
              <Loader2 className="h-8 w-8 animate-spin text-green-600 dark:text-green-400" />
            ) : isSuccess ? (
              <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
            ) : isAlreadyCreatedError ? (
              <Info className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            ) : (
              <AlertCircle className="h-8 w-8 text-destructive" />
            )}
          </div>
          <CardTitle
            className={`text-2xl font-bold ${
              isVerifying
                ? 'text-blue-600 dark:text-blue-400'
                : isSuccess
                ? 'text-green-600 dark:text-green-400'
                : 'text-destructive'
            }`}
          >
            {isVerifying
              ? 'Verifying Payment...'
              : isSuccess
              ? 'Payment Successful!'
              : 'Payment Verification Failed'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* ✅ Verification Error Content */}
          {isError && !isVerifying && (
            <>
              <div className="space-y-4">
                <p className="text-destructive">
                  {trackingStatus.errorMessage || 'Payment verification failed'}
                </p>
                <p className="text-muted-foreground text-sm">
                  Your payment was likely successful, but we could not verify it
                  automatically. Please try again or contact our support team
                  for immediate assistance.
                </p>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Transaction ID</p>
                <p className="font-mono font-medium break-all">
                  {transactionId}
                </p>
                {retryCount > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Retry attempts: {retryCount}
                  </p>
                )}
              </div>

              {showButtons && (
                <div className="space-y-3 pt-4">
                  <Button
                    onClick={handleRetryVerification}
                    className="w-full"
                    size="lg"
                    disabled={retryCount >= 3}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    {retryCount >= 3
                      ? 'Max Retries Reached'
                      : `Retry Verification${
                          retryCount > 0 ? ` (${retryCount}/3)` : ''
                        }`}
                  </Button>

                  <Button
                    onClick={handleContactSupport}
                    variant="outline"
                    className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-950"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Contact Support (Messenger + Email)
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleDashboardRedirect}
                    className="w-full"
                  >
                    Go to Dashboard
                  </Button>
                </div>
              )}
            </>
          )}

          {/* ✅ Loading Content */}
          {isVerifying && (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Please wait while we verify your payment and set up your course
                access.
              </p>
              <div className="flex items-center justify-center space-x-2">
                <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="h-2 w-2 bg-primary rounded-full animate-bounce"></div>
              </div>
            </div>
          )}

          {/* ✅ Success Content */}
          {isSuccess && !isVerifying && (
            <>
              {isAlreadyCreatedError ? (
                <p className="text-muted-foreground">
                  Great news! Your course access has already been set up. You
                  can start learning right away!
                </p>
              ) : (
                <>
                  <p className="text-muted-foreground">
                    Thank you for your purchase! Your payment has been verified
                    successfully and you have been enrolled in{' '}
                    <strong>{trackingStatus.courseTitle}</strong>.
                  </p>

                  <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Transaction ID
                      </p>
                      <p className="font-mono font-medium break-all">
                        {transactionId}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Amount Paid
                      </p>
                      <p className="font-medium">
                        ৳{' '}
                        {trackingStatus.amount
                          ? parseFloat(trackingStatus.amount).toLocaleString()
                          : '0'}
                      </p>
                    </div>
                    {trackingStatus.courseTitle && (
                      <div>
                        <p className="text-sm text-muted-foreground">Course</p>
                        <p className="font-medium">
                          {trackingStatus.courseTitle}
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}

              {showButtons && (
                <div className="space-y-3 pt-4">
                  <Button
                    onClick={handleStartLearning}
                    className="w-full"
                    size="lg"
                  >
                    Start Learning
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleDashboardRedirect}
                    className="w-full"
                  >
                    Go to Dashboard
                  </Button>
                </div>
              )}

              {!showButtons && (
                <p className="text-xs text-muted-foreground">
                  Redirecting to dashboard in a few seconds...
                </p>
              )}
            </>
          )}

          <p className="text-xs text-muted-foreground pt-4">
            {isError
              ? 'Keep your transaction ID for support reference.'
              : 'You will receive a confirmation email shortly with your course access details.'}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

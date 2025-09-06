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
} from 'lucide-react'
import { useAutoVerifyPayment } from '@/hooks/use-payment'
import { toast } from 'sonner'
import { isPaymentVerificationError } from '@/types/payment-types'

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()
  // const [verificationComplete, setVerificationComplete] = useState(false)
  const [showButtons, setShowButtons] = useState(false)

  const transactionId = searchParams.get('transactionId')

  const {
    data: verificationResponse,
    isLoading: isVerifying,
    isError: verificationError,
    error,
  } = useAutoVerifyPayment(transactionId)

  useEffect(() => {
    if (verificationResponse) {
      // setVerificationComplete(true)
      //Refetch enrolled courses to update the dashboard
      queryClient.invalidateQueries({ queryKey: ['enrolledCourses'] })
      // Check if response contains an error
      if (isPaymentVerificationError(verificationResponse)) {
        const errorMessage = verificationResponse.error.message

        // Special handling for "already created" error - this is actually success
        if (
          errorMessage.includes('already created') ||
          errorMessage.includes('course access')
        ) {
          toast.success('Course access already granted! Welcome to the course.')
          // Auto redirect to dashboard after 3 seconds
          const timer = setTimeout(() => {
            router.push('/dashboard')
          }, 3000)

          // Show buttons after 2 seconds
          const buttonTimer = setTimeout(() => {
            setShowButtons(true)
          }, 2000)

          return () => {
            clearTimeout(timer)
            clearTimeout(buttonTimer)
          }
        } else {
          toast.error(errorMessage)
          setShowButtons(true)
        }
      } else if (verificationResponse.data.status === 'COMPLETED') {
        toast.success('Payment verified successfully! Welcome to the course.')

        //refetch the enrolledCorse from react query Tag

        // Auto redirect to dashboard after 3 seconds
        const timer = setTimeout(() => {
          // router.push('/dashboard')
        }, 3000)

        // Show buttons after 2 seconds
        const buttonTimer = setTimeout(() => {
          setShowButtons(true)
        }, 2000)

        return () => {
          clearTimeout(timer)
          clearTimeout(buttonTimer)
        }
      } else {
        toast.error('Payment verification failed')
        setShowButtons(true)
      }
    }
  }, [verificationResponse, router])

  useEffect(() => {
    if (verificationError) {
      toast.error(error?.message || 'Failed to verify payment')
      setShowButtons(true)
    }
  }, [verificationError, error])

  const handleDashboardRedirect = () => {
    router.push('/dashboard')
  }

  const handleStartLearning = () => {
    // For error responses, we don't have course metadata, so just go to dashboard
    if (
      verificationResponse &&
      !isPaymentVerificationError(verificationResponse)
    ) {
      if (verificationResponse.data.metadata.courseId) {
        router.push(
          `/course-view/${verificationResponse.data.metadata.courseId}`
        )
        return
      }
    }
    router.push('/dashboard')
  }

  if (!transactionId) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <Card className="text-center">
          <CardContent className="pt-6">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Invalid Payment</h2>
            <p className="text-muted-foreground mb-4">
              No transaction ID found. Please contact support if you completed a
              payment.
            </p>
            <Button onClick={() => router.push('/')}>Go to Home</Button>
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
    verificationResponse.data.status === 'COMPLETED'

  const isSuccess = isSuccessfulPayment || isAlreadyCreatedError

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
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
          {isVerifying ? (
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
          ) : isAlreadyCreatedError ? (
            <>
              <p className="text-muted-foreground">
                Great news! Your course access has already been set up. You can
                start learning right away!
              </p>

              <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                    Course Access Confirmed
                  </p>
                </div>
                <p className="text-sm text-blue-600 dark:text-blue-300">
                  {verificationResponse.error.message}
                </p>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Transaction ID</p>
                <p className="font-mono font-medium">{transactionId}</p>
              </div>

              {showButtons && (
                <div className="space-y-3 pt-4">
                  <Button
                    onClick={handleStartLearning}
                    className="w-full"
                    size="lg"
                  >
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}

              {!showButtons && (
                <p className="text-xs text-muted-foreground">
                  Redirecting to dashboard in a few seconds...
                </p>
              )}
            </>
          ) : isSuccessfulPayment ? (
            <>
              <p className="text-muted-foreground">
                Thank you for your purchase! Your payment has been verified
                successfully and you have been enrolled in{' '}
                <strong>
                  {verificationResponse.data.metadata.courseTitle}
                </strong>
                .
              </p>

              <div className="space-y-3">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Transaction ID
                  </p>
                  <p className="font-mono font-medium">
                    {verificationResponse.data.transaction_id}
                  </p>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Amount Paid</p>
                  <p className="font-medium">
                    ৳{' '}
                    {parseFloat(
                      verificationResponse.data.amount
                    ).toLocaleString()}
                  </p>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Payment Method
                  </p>
                  <p className="font-medium capitalize">
                    {verificationResponse.data.payment_method}
                  </p>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">Customer</p>
                  <p className="font-medium">
                    {verificationResponse.data.cus_name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {verificationResponse.data.cus_email}
                  </p>
                </div>
              </div>

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
          ) : (
            <>
              <div className="space-y-4">
                <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
                <p className="text-destructive">
                  {verificationResponse &&
                  isPaymentVerificationError(verificationResponse)
                    ? verificationResponse.error.message
                    : 'Payment verification failed'}
                </p>
                <p className="text-muted-foreground text-sm">
                  Do not worry! Your payment was successful. Please contact
                  support if your course access is not available within a few
                  minutes.
                </p>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">Transaction ID</p>
                <p className="font-mono font-medium">{transactionId}</p>
              </div>

              {showButtons && (
                <div className="space-y-3 pt-4">
                  <Button
                    onClick={handleDashboardRedirect}
                    className="w-full"
                    size="lg"
                  >
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}

          <p className="text-xs text-muted-foreground pt-4">
            You will receive a confirmation email shortly with your course
            access details.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

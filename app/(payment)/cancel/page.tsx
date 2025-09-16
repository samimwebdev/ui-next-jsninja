'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  XCircle,
  ArrowLeft,
  RotateCcw,
  AlertTriangle,
  MessageCircle,
  Mail,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { PaymentCancelTracking } from '@/components/payment/payment-cancel-tracking'
// import { useCancelPageTracking } from '@/hooks/use-cancel-page-tracking'

interface CancelPageParams {
  paymentMethod: string
  transactionId: string
  paymentAmount: string
  paymentFee: string
  status: string
  courseSlug?: string
  courseTitle?: string
  errorMessage?: string
  errorCode?: string
}

//Todo-check for order cancellation tracking is title, slug available here?

export default function PaymentCancelPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [cancelDetails, setCancelDetails] = useState<CancelPageParams | null>(
    null
  )
  // const { trackInteraction, trackRetry } = useCancelPageTracking()

  useEffect(() => {
    // Extract URL parameters
    const paymentMethod = searchParams.get('paymentMethod')
    const transactionId = searchParams.get('transactionId')
    const paymentAmount = searchParams.get('paymentAmount')
    const paymentFee = searchParams.get('paymentFee')
    const status = searchParams.get('status')
    // ✅ Extract additional tracking parameters
    const courseSlug = searchParams.get('courseSlug')
    const courseTitle = searchParams.get('courseTitle')
    const errorMessage = searchParams.get('errorMessage')
    const errorCode = searchParams.get('errorCode')

    if (transactionId) {
      setCancelDetails({
        paymentMethod: paymentMethod || 'Unknown',
        transactionId,
        paymentAmount: paymentAmount || '0',
        paymentFee: paymentFee || '0',
        status: status || 'cancelled',
        courseSlug: courseSlug || undefined,
        courseTitle: courseTitle || undefined,
        errorMessage: errorMessage || undefined,
        errorCode: errorCode || undefined,
      })
    }
  }, [searchParams])

  const handleTryAgain = async () => {
    // if (cancelDetails) {
    //   // If we have course details, track the retry with course info
    //   if (cancelDetails.courseSlug && cancelDetails.courseTitle) {
    //     await trackRetry(
    //       cancelDetails.transactionId,
    //       cancelDetails.courseSlug,
    //       cancelDetails.courseTitle,
    //       parseFloat(cancelDetails.paymentAmount),
    //       'retry_from_cancel_page'
    //     )
    //   }
    // }

    router.back()
  }

  const handleGoHome = async () => {
    // if (cancelDetails) {
    //   // ✅ Track home navigation
    //   await trackInteraction('go_home', {
    //     transactionId: cancelDetails.transactionId,
    //     courseSlug: cancelDetails.courseSlug,
    //   })
    // }

    router.push('/')
  }

  const handleBrowseCourses = async () => {
    // if (cancelDetails) {
    //   // ✅ Track browse courses navigation
    //   await trackInteraction('browse_courses', {
    //     transactionId: cancelDetails.transactionId,
    //     courseSlug: cancelDetails.courseSlug,
    //   })
    // }

    router.push('/courses')
  }

  // ✅ Enhanced contact support handler with Facebook Messenger + Email
  const handleContactSupport = async () => {
    // if (cancelDetails) {
    //   await trackInteraction('contact_support', {
    //     transactionId: cancelDetails.transactionId,
    //     courseSlug: cancelDetails.courseSlug,
    //   })
    // }

    try {
      // Prepare support message content
      const supportMessage = `Payment Issue - Transaction ${
        cancelDetails?.transactionId
      }

Hello, I encountered a payment issue and need assistance:

Transaction ID: ${cancelDetails?.transactionId}
Status: ${cancelDetails?.status}
Payment Method: ${cancelDetails?.paymentMethod}
Amount: ${formatAmount(cancelDetails?.paymentAmount || '0')}
${cancelDetails?.courseTitle ? `Course: ${cancelDetails.courseTitle}` : ''}
${cancelDetails?.errorMessage ? `Error: ${cancelDetails.errorMessage}` : ''}
${cancelDetails?.errorCode ? `Error Code: ${cancelDetails.errorCode}` : ''}

Please help me resolve this issue. Thank you!`

      // 1. Open Facebook Messenger
      const facebookPageId =
        process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID || '108194384815914' // Replace with your actual Facebook Page ID
      const messengerUrl = `https://m.me/${facebookPageId}?text=${encodeURIComponent(
        supportMessage
      )}`

      const supportEmail =
        process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@javascriptninja.com'

      // 2. Prepare email
      const emailSubject = `Payment Issue - Transaction ${cancelDetails?.transactionId}`
      const emailBody = supportMessage
      const emailUrl = `mailto:${supportEmail}?subject=${encodeURIComponent(
        emailSubject
      )}&body=${encodeURIComponent(emailBody)}`

      // Open Facebook Messenger first
      window.open(messengerUrl, '_blank')

      // Small delay then open email client
      setTimeout(() => {
        window.location.href = emailUrl
      }, 1000)

      // Show success message
      toast.success('Opening Facebook Messenger and Email client...', {
        description:
          'Both support channels are being opened for your convenience.',
        duration: 4000,
      })

      // console.log('Support channels opened:', {
      //   messenger: messengerUrl,
      //   email: emailUrl,
      //   transactionId: cancelDetails?.transactionId,
      // })
    } catch (error) {
      console.error('Error opening support channels:', error)
      toast.error('Failed to open support channels', {
        description: 'Please try contacting us directly via Facebook or email.',
      })
    }
  }

  // ✅ Add individual support channel handlers
  const handleFacebookMessenger = async () => {
    // if (cancelDetails) {
    //   await trackInteraction('contact_support', {
    //     transactionId: cancelDetails.transactionId,
    //     courseSlug: cancelDetails.courseSlug,
    //   })
    // }

    try {
      const supportMessage = `Payment Issue - Transaction ${
        cancelDetails?.transactionId
      }

Hello, I need help with a payment issue:
Transaction ID: ${cancelDetails?.transactionId}
Status: ${cancelDetails?.status}
${cancelDetails?.courseTitle ? `Course: ${cancelDetails.courseTitle}` : ''}

Please assist me. Thank you!`

      const facebookPageId =
        process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID || '61559346165627'
      const messengerUrl = `https://m.me/${facebookPageId}?text=${encodeURIComponent(
        supportMessage
      )}`

      window.open(messengerUrl, '_blank')
      toast.success('Opening Facebook Messenger...')
    } catch (error) {
      console.error('Error opening Facebook Messenger:', error)
      toast.error('Failed to open Facebook Messenger')
    }
  }

  const handleEmailSupport = async () => {
    // if (cancelDetails) {
    //   await trackInteraction('contact_support', {
    //     transactionId: cancelDetails.transactionId,
    //     courseSlug: cancelDetails.courseSlug,
    //   })
    // }

    try {
      const emailSubject = `Payment Issue - Transaction ${cancelDetails?.transactionId}`
      const emailBody = `Hello, I encountered a payment issue with transaction ID: ${
        cancelDetails?.transactionId
      }

Transaction Details:
- ID: ${cancelDetails?.transactionId}
- Status: ${cancelDetails?.status}
- Payment Method: ${cancelDetails?.paymentMethod}
- Amount: ${formatAmount(cancelDetails?.paymentAmount || '0')}
${cancelDetails?.courseTitle ? `- Course: ${cancelDetails.courseTitle}` : ''}
${cancelDetails?.errorMessage ? `- Error: ${cancelDetails.errorMessage}` : ''}
${cancelDetails?.errorCode ? `- Error Code: ${cancelDetails.errorCode}` : ''}

Please help me resolve this issue.

Thank you!`

      const supportEmail =
        process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'support@javascriptninja.com'
      const emailUrl = `mailto:${supportEmail}?subject=${encodeURIComponent(
        emailSubject
      )}&body=${encodeURIComponent(emailBody)}`
      window.location.href = emailUrl
      toast.success('Opening email client...')
    } catch (error) {
      console.error('Error opening email client:', error)
      toast.error('Failed to open email client')
    }
  }

  const formatAmount = (amount: string) => {
    const numAmount = parseFloat(amount)
    return numAmount
      .toLocaleString('en-BD', {
        style: 'currency',
        currency: 'BDT',
        minimumFractionDigits: 0,
      })
      .replace('BDT', '৳')
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'failed':
        return 'text-red-600 dark:text-red-400'
      case 'cancelled':
        return 'text-yellow-600 dark:text-yellow-400'
      default:
        return 'text-muted-foreground'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'failed':
        return <AlertTriangle className="h-4 w-4" />
      case 'cancelled':
        return <XCircle className="h-4 w-4" />
      default:
        return <XCircle className="h-4 w-4" />
    }
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      {/* ✅ Add Payment Cancel/Failure Tracking */}
      {cancelDetails && (
        <PaymentCancelTracking
          transactionId={cancelDetails.transactionId}
          courseSlug={cancelDetails.courseSlug}
          courseTitle={cancelDetails.courseTitle}
          paymentAmount={cancelDetails.paymentAmount}
          paymentMethod={cancelDetails.paymentMethod}
          status={cancelDetails.status as 'cancelled' | 'failed'}
          errorMessage={cancelDetails.errorMessage}
          errorCode={cancelDetails.errorCode}
        />
      )}

      <Card className="text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
            <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-600 dark:text-red-400">
            Payment{' '}
            {cancelDetails?.status === 'failed' ? 'Failed' : 'Cancelled'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <p className="text-muted-foreground">
              {cancelDetails?.status === 'failed'
                ? 'Your payment could not be processed. No charges have been made to your account.'
                : 'Your payment was cancelled. No charges have been made to your account.'}
            </p>

            {/* ✅ Show error message if available */}
            {cancelDetails?.errorMessage && (
              <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-red-800 dark:text-red-200 mb-1">
                      Error Details
                    </p>
                    <p className="text-xs text-red-600 dark:text-red-300">
                      {cancelDetails.errorMessage}
                    </p>
                    {cancelDetails.errorCode && (
                      <p className="text-xs text-red-500 dark:text-red-400 mt-1 font-mono">
                        Code: {cancelDetails.errorCode}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <p className="text-sm text-muted-foreground">
              You can try again with a different payment method or contact our
              support team if you need assistance.
            </p>
          </div>

          {cancelDetails && (
            <div className="space-y-3 text-left">
              <h3 className="font-semibold text-center mb-4">
                Payment Details
              </h3>

              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Transaction ID</p>
                    <p className="font-mono font-medium">
                      {cancelDetails.transactionId}
                    </p>
                  </div>

                  <div>
                    <p className="text-muted-foreground">Status</p>
                    <div
                      className={`flex items-center gap-1 font-medium capitalize ${getStatusColor(
                        cancelDetails.status
                      )}`}
                    >
                      {getStatusIcon(cancelDetails.status)}
                      {cancelDetails.status}
                    </div>
                  </div>

                  <div>
                    <p className="text-muted-foreground">Payment Method</p>
                    <p className="font-medium capitalize">
                      {cancelDetails.paymentMethod === 'undetected'
                        ? 'Not Selected'
                        : cancelDetails.paymentMethod}
                    </p>
                  </div>

                  <div>
                    <p className="text-muted-foreground">Amount</p>
                    <p className="font-medium">
                      {formatAmount(cancelDetails.paymentAmount)}
                    </p>
                  </div>

                  {/* ✅ Show course details if available */}
                  {cancelDetails.courseTitle && (
                    <div className="col-span-2">
                      <p className="text-muted-foreground">Course</p>
                      <p className="font-medium">{cancelDetails.courseTitle}</p>
                      {cancelDetails.courseSlug && (
                        <p className="text-xs text-muted-foreground font-mono">
                          {cancelDetails.courseSlug}
                        </p>
                      )}
                    </div>
                  )}

                  {parseFloat(cancelDetails.paymentFee) > 0 && (
                    <>
                      <div>
                        <p className="text-muted-foreground">Payment Fee</p>
                        <p className="font-medium">
                          {formatAmount(cancelDetails.paymentFee)}
                        </p>
                      </div>

                      <div>
                        <p className="text-muted-foreground">Total Amount</p>
                        <p className="font-medium">
                          {formatAmount(
                            (
                              parseFloat(cancelDetails.paymentAmount) +
                              parseFloat(cancelDetails.paymentFee)
                            ).toString()
                          )}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-3 pt-4">
            <Button onClick={handleTryAgain} className="w-full" size="lg">
              <RotateCcw className="mr-2 h-4 w-4" />
              Try Again
            </Button>

            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={handleBrowseCourses}
                className="w-full"
              >
                Browse Courses
              </Button>

              <Button
                variant="outline"
                onClick={handleGoHome}
                className="w-full"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Home
              </Button>
            </div>

            {/* ✅ Enhanced contact support section with multiple options */}
            <div className="space-y-2">
              {/* Main contact support button - opens both */}
              <Button
                variant="outline"
                onClick={handleContactSupport}
                className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-950"
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Contact Support (Messenger + Email)
              </Button>

              {/* Individual support channel buttons */}
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleFacebookMessenger}
                  className="border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950"
                >
                  <MessageCircle className="mr-1 h-3 w-3" />
                  Facebook Chat
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleEmailSupport}
                  className="border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950"
                >
                  <Mail className="mr-1 h-3 w-3" />
                  Send Email
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <MessageCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                  Get Instant Help!
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-300">
                  For fastest support, use Facebook Messenger. We typically
                  respond within minutes during business hours. Email support is
                  also available for detailed assistance.
                </p>
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Keep the transaction ID for your records when contacting support.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

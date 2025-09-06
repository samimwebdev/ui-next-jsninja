'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { XCircle, ArrowLeft, RotateCcw, AlertTriangle } from 'lucide-react'
import { useEffect, useState } from 'react'

interface CancelPageParams {
  paymentMethod: string
  transactionId: string
  paymentAmount: string
  paymentFee: string
  status: string
}

export default function PaymentCancelPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [cancelDetails, setCancelDetails] = useState<CancelPageParams | null>(
    null
  )

  useEffect(() => {
    // Extract URL parameters
    const paymentMethod = searchParams.get('paymentMethod')
    const transactionId = searchParams.get('transactionId')
    const paymentAmount = searchParams.get('paymentAmount')
    const paymentFee = searchParams.get('paymentFee')
    const status = searchParams.get('status')

    if (transactionId) {
      setCancelDetails({
        paymentMethod: paymentMethod || 'Unknown',
        transactionId,
        paymentAmount: paymentAmount || '0',
        paymentFee: paymentFee || '0',
        status: status || 'cancelled',
      })
    }
  }, [searchParams])

  const handleTryAgain = () => {
    router.back()
  }

  const handleGoHome = () => {
    router.push('/')
  }

  const handleBrowseCourses = () => {
    router.push('/courses')
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
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <div className="text-left">
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                  Need Help?
                </p>
                <p className="text-xs text-yellow-600 dark:text-yellow-300">
                  If you are experiencing payment issues, please contact our
                  support team. We are here to help you complete your
                  enrollment.
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

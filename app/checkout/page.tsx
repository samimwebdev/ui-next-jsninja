import { Suspense } from 'react'
import { CheckoutPageSkeleton } from '@/components/checkout/checkout-skeleton'
import { CheckoutContent } from '@/components/checkout/checkout-content'

export const metadata = {
  title: 'Checkout - Complete Your Enrollment',
  description: 'Complete your course enrollment with secure payment',
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<CheckoutPageSkeleton />}>
        <CheckoutContent />
      </Suspense>
    </div>
  )
}

'use client'

import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  AlertCircle,
  CheckCircle2,
  Lock,
  ExternalLink,
  Loader2,
  Star,
  Users,
  Clock,
  BookOpen,
  Package,
} from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AuthGuard } from '@/components/auth/auth-guard'
import { useCheckoutCourse } from '@/hooks/use-checkout-course'
import { useCurrentUser } from '@/hooks/use-current-user'
import { Badge } from '@/components/ui/badge'
import { CourseType } from '@/types/checkout-types'
import { useCreatePayment } from '@/hooks/use-payment'
import { toast } from 'sonner'
import {
  isCourseBundle,
  getTotalPrice,
  getCourseCount,
  getMainTitle,
  formatCourseType,
  getCourseBaseId,
  getCourseBundleId,
  calculateBundleSavings,
} from '@/lib/checkout-utils'
import { formatDuration } from '@/lib/utils'

function formatPrice(price: number): string {
  return price
    .toLocaleString('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    })
    .replace('BDT', '৳')
}

function CheckoutContent() {
  const searchParams = useSearchParams()
  const courseSlug = searchParams.get('courseSlug')
  const courseType = searchParams.get('courseType') as CourseType | null
  const { data: user } = useCurrentUser()

  const {
    data: courseResponse,
    isLoading,
    error,
    isError,
  } = useCheckoutCourse(courseSlug, courseType)

  const createPaymentMutation = useCreatePayment()

  const course = courseResponse?.data
  const baseContent = course?.baseContent

  const handlePaymentClick = async () => {
    if (!course || !user || !baseContent || !courseType) {
      toast.error('Missing required information for payment')
      return
    }

    try {
      const courseBaseId = isCourseBundle(baseContent)
        ? getCourseBundleId(course)
        : getCourseBaseId(baseContent)

      const response = await createPaymentMutation.mutateAsync({
        courseBaseId,
      })

      if (response.data.status === 1 && response.data.payment_url) {
        // Redirect to payment gateway
        window.location.href = response.data.payment_url
      } else {
        toast.error(response.data.message || 'Failed to create payment')
      }
    } catch (error) {
      console.error('Payment initiation failed:', error)
      toast.error(
        error instanceof Error ? error.message : 'Failed to initiate payment'
      )
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <div className="text-center">
            <div className="h-6 w-48 bg-muted rounded animate-pulse mb-2" />
            <div className="h-4 w-32 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  if (isError || !course || !baseContent) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-2xl">
        <Card className="text-center">
          <CardContent className="pt-6">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Course Not Found</h2>
            <p className="text-muted-foreground mb-4">
              {error?.message ||
                'The course you are looking for could not be found or you do not have access to it.'}
            </p>
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isBundle = isCourseBundle(baseContent)

  // For bundles, use the bundle price from course data
  const bundlePrice = isBundle && course.price ? course.price : undefined
  const totalPrice = getTotalPrice(baseContent, bundlePrice)

  const courseCount = getCourseCount(baseContent)
  const mainTitle = getMainTitle(baseContent, course.title)
  const isProcessing = createPaymentMutation.isPending

  // Calculate savings for bundles
  const bundleSavings =
    isBundle && bundlePrice
      ? calculateBundleSavings(
          bundlePrice,
          baseContent.map((c) => c.price)
        )
      : null

  return (
    <div className="container mx-auto px-4 py-16 max-w-screen-xl">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Complete Your Enrollment
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Course Summary */}
        <div className="lg:col-span-2">
          <Card className="border border-border">
            <CardHeader className="bg-card">
              <CardTitle className="flex items-center gap-2">
                {isBundle ? (
                  <Package className="h-5 w-5" />
                ) : (
                  <BookOpen className="h-5 w-5" />
                )}
                {formatCourseType(courseType || '')} Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isBundle ? (
                // Bundle Layout
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">{course.title}</h2>
                    <p className="text-muted-foreground mb-4">
                      {course.description}
                    </p>
                    <Badge variant="secondary" className="text-lg px-4 py-2">
                      {courseCount} Courses Included
                    </Badge>

                    {/* Bundle Savings Display */}
                    {bundleSavings && (
                      <div className="mt-4 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                        <div className="text-sm space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-muted-foreground">
                              Individual Courses:
                            </span>
                            <span className="line-through text-muted-foreground">
                              {formatPrice(bundleSavings.totalIndividualPrice)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Bundle Price:</span>
                            <span className="text-lg font-bold text-green-600 dark:text-green-400">
                              {formatPrice(bundleSavings.bundlePrice)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-green-600 dark:text-green-400 font-medium">
                              You Save:
                            </span>
                            <span className="text-green-600 dark:text-green-400 font-bold">
                              {formatPrice(bundleSavings.savings)} (
                              {bundleSavings.savingsPercentage}%)
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {baseContent.map((courseItem) => (
                      <Card
                        key={courseItem.id}
                        className="border-2 border-muted"
                      >
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            <div className="relative h-24 w-32 rounded-lg overflow-hidden flex-shrink-0">
                              {courseItem.featureImage?.url ? (
                                <Image
                                  src={courseItem.featureImage.url}
                                  alt={
                                    courseItem.featureImage.alternativeText ||
                                    courseItem.title
                                  }
                                  fill
                                  className="object-cover"
                                  sizes="128px"
                                />
                              ) : (
                                <div className="w-full h-full bg-muted flex items-center justify-center">
                                  <BookOpen className="h-8 w-8 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold truncate">
                                {courseItem.title}
                              </h3>
                              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                                {courseItem.shortDescription}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Badge variant="outline" className="text-xs">
                                  {formatCourseType(courseItem.courseType)}
                                </Badge>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatDuration(courseItem.duration)}
                                </span>
                              </div>
                              <div className="mt-1 text-xs text-muted-foreground">
                                Individual: {formatPrice(courseItem.price)}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                // Single Course Layout
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Course Image */}
                  <div className="relative h-48 w-full md:w-64 rounded-lg overflow-hidden flex-shrink-0">
                    {baseContent.featureImage?.url ? (
                      <Image
                        src={baseContent.featureImage.url}
                        alt={
                          baseContent.featureImage.alternativeText ||
                          baseContent.title
                        }
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 256px"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <BookOpen className="h-16 w-16 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  {/* Course Details */}
                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="capitalize">
                        {formatCourseType(baseContent.courseType)}
                      </Badge>
                      <Badge variant="outline">{baseContent.level}</Badge>
                    </div>

                    <h2 className="text-2xl font-bold mb-2">
                      {baseContent.title}
                    </h2>

                    <p className="text-muted-foreground mb-4">
                      {baseContent.shortDescription}
                    </p>

                    {/* Course Stats */}
                    <div className="flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{baseContent.averageRating}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>
                          {baseContent.totalStudents.toLocaleString()} students
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatDuration(baseContent.duration)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{baseContent.totalLessons} lessons</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Features */}
              <div className="mt-6">
                <h3 className="font-semibold mb-3">What you will get:</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {course.features.map((feature) => (
                    <li key={feature.id} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                      <span>{feature.feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card className="mt-6 border border-border">
            <CardHeader className="bg-card">
              <CardTitle>Secure Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert className="bg-primary/5 border-primary/20 dark:bg-primary/10 dark:border-primary/30">
                <AlertCircle className="h-4 w-4 text-primary" />
                <AlertTitle>One-Click Payment</AlertTitle>
                <AlertDescription>
                  Click the payment button below to be redirected to our secure
                  payment gateway. You can pay using any payment method
                  available on the gateway including credit/debit cards, mobile
                  banking (bKash, Nagad, Rocket), and more.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4 border border-border">
            <CardHeader className="bg-card">
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="font-medium">{mainTitle}</span>
                  <span className="font-bold">{formatPrice(totalPrice)}</span>
                </div>

                {isBundle && (
                  <div className="text-sm text-muted-foreground space-y-1">
                    <div className="flex justify-between">
                      <span>Courses Included:</span>
                      <span>{courseCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bundle Type:</span>
                      <span className="capitalize">
                        {formatCourseType(courseType || '')}
                      </span>
                    </div>
                    {bundleSavings && (
                      <>
                        <div className="flex justify-between">
                          <span>Individual Total:</span>
                          <span className="line-through">
                            {formatPrice(bundleSavings.totalIndividualPrice)}
                          </span>
                        </div>
                        <div className="flex justify-between text-green-600 dark:text-green-400">
                          <span>You Save:</span>
                          <span>{formatPrice(bundleSavings.savings)}</span>
                        </div>
                      </>
                    )}
                  </div>
                )}

                <Separator className="bg-border" />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                onClick={handlePaymentClick}
                disabled={isProcessing}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 transition-all duration-200"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Payment Link...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Pay Now - {formatPrice(totalPrice)}
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                By completing your purchase, you agree to our Terms of Service
                and Privacy Policy
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <AuthGuard redirectTo="/login">
      <CheckoutContent />
    </AuthGuard>
  )
}

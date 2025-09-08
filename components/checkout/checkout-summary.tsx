'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
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
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { useCreatePayment } from '@/hooks/use-payment'
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
import { CheckoutCourse, CourseType, BaseContent } from '@/types/checkout-types'
import { User } from '@/types/shared-types'

// Define the bundle savings type
interface BundleSavings {
  totalIndividualPrice: number
  bundlePrice: number
  savings: number
  savingsPercentage: number
}

interface CheckoutSummaryProps {
  course: CheckoutCourse
  courseType: CourseType | null
  user: User
  isEnrolled: boolean
}

function formatPrice(price: number): string {
  return price
    .toLocaleString('en-BD', {
      style: 'currency',
      currency: 'BDT',
      minimumFractionDigits: 0,
    })
    .replace('BDT', '৳')
}

// Helper function to get course URL based on course type
function getCourseUrl(courseType: CourseType, slug: string): string {
  switch (courseType) {
    case 'bootcamp':
      return `/bootcamps/${slug}`
    case 'workshop':
      return `/workshops/${slug}`
    case 'course-bundle':
      return `/course-bundles/${slug}`
    case 'course':
    default:
      return `/courses/${slug}`
  }
}

export function CheckoutSummary({
  course,
  courseType,
  user,
  isEnrolled,
}: CheckoutSummaryProps) {
  const createPaymentMutation = useCreatePayment()
  const [isProcessing, setIsProcessing] = useState(false)

  const baseContent = course.baseContent

  // Handle registration status
  const isRegistrationOpen = (() => {
    if (!baseContent) return false

    if (Array.isArray(baseContent)) {
      console.log({ baseContent })
      return baseContent.some((content) => content.isRegistrationEnabled)
    }

    return baseContent.isRegistrationEnabled
  })()

  const handlePaymentClick = async () => {
    if (!course || !user || !baseContent || !courseType) {
      toast.error('Missing required information for payment')
      return
    }

    if (isEnrolled) {
      toast.error('You are already enrolled in this course')
      return
    }

    if (!isRegistrationOpen) {
      toast.error('Registration is closed for this course')
      return
    }

    setIsProcessing(true)

    try {
      const courseBaseId = isCourseBundle(baseContent)
        ? getCourseBundleId(course)
        : getCourseBaseId(baseContent)

      const response = await createPaymentMutation.mutateAsync({
        courseBaseId,
      })

      if (response.data.status === 1 && response.data.payment_url) {
        window.location.href = response.data.payment_url
      } else {
        toast.error(response.data.message || 'Failed to create payment')
      }
    } catch (error) {
      console.error('Payment initiation failed:', error)
      toast.error(
        error instanceof Error ? error.message : 'Failed to initiate payment'
      )
    } finally {
      setIsProcessing(false)
    }
  }

  const isBundle = isCourseBundle(baseContent)
  const bundlePrice = isBundle && course.price ? course.price : undefined
  const totalPrice = getTotalPrice(baseContent, bundlePrice)
  const courseCount = getCourseCount(baseContent)
  const mainTitle = getMainTitle(baseContent, course.title)

  const bundleSavings: BundleSavings | null =
    isBundle && bundlePrice
      ? calculateBundleSavings(
          bundlePrice,
          (baseContent as BaseContent[]).map((c) => c.price)
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
          <CourseDetailsCard
            course={course}
            baseContent={baseContent}
            courseType={courseType}
            isBundle={isBundle}
            courseCount={courseCount}
            bundleSavings={bundleSavings}
          />
          <PaymentInfoCard />
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <OrderSummaryCard
            mainTitle={mainTitle}
            totalPrice={totalPrice}
            isBundle={isBundle}
            courseCount={courseCount}
            courseType={courseType}
            bundleSavings={bundleSavings}
            isProcessing={isProcessing}
            isRegistrationOpen={isRegistrationOpen}
            onPaymentClick={handlePaymentClick}
          />
        </div>
      </div>
    </div>
  )
}

// Split into smaller components for better performance
function CourseDetailsCard({
  course,
  baseContent,
  courseType,
  isBundle,
  courseCount,
  bundleSavings,
}: {
  course: CheckoutCourse
  baseContent: BaseContent | BaseContent[]
  courseType: CourseType | null
  isBundle: boolean
  courseCount: number
  bundleSavings: BundleSavings | null
}) {
  return (
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
          <BundleLayout
            course={course}
            baseContent={baseContent as BaseContent[]}
            courseCount={courseCount}
            bundleSavings={bundleSavings}
          />
        ) : (
          <SingleCourseLayout
            baseContent={baseContent as BaseContent}
            course={course}
          />
        )}

        {/* Features */}
        <div className="mt-6">
          <h3 className="font-semibold mb-3">What you will get:</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {course.features.map((feature) => (
              <li key={feature.id} className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                <span>{feature?.feature || feature?.title}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

function BundleLayout({
  course,
  baseContent,
  courseCount,
  bundleSavings,
}: {
  course: CheckoutCourse
  baseContent: BaseContent[]
  courseCount: number
  bundleSavings: BundleSavings | null
}) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <Link
          href={getCourseUrl('course-bundle', course.slug)}
          className="group"
        >
          <h2 className="text-2xl font-bold mb-2 hover:text-primary transition-colors group-hover:underline">
            {course.title}
          </h2>
        </Link>
        <p className="text-muted-foreground mb-4">{course.description}</p>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          {courseCount} Courses Included
        </Badge>

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
          <Link
            key={courseItem.id}
            href={getCourseUrl(courseItem.courseType, courseItem.slug)}
            className="group"
          >
            <Card className="border-2 border-muted hover:border-primary/50 transition-all duration-200 hover:shadow-md">
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
                        className="object-cover group-hover:scale-105 transition-transform duration-200"
                        sizes="128px"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <BookOpen className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
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
          </Link>
        ))}
      </div>
    </div>
  )
}

function SingleCourseLayout({
  baseContent,
}: {
  baseContent: BaseContent
  course: CheckoutCourse
}) {
  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Course Image */}
      <Link
        href={getCourseUrl(baseContent.courseType, baseContent.slug)}
        className="group"
      >
        <div className="relative h-48 w-full md:w-64 rounded-lg overflow-hidden flex-shrink-0">
          {baseContent.featureImage?.url ? (
            <Image
              src={baseContent.featureImage.url}
              alt={
                baseContent.featureImage.alternativeText || baseContent.title
              }
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
              sizes="(max-width: 768px) 100vw, 256px"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <BookOpen className="h-16 w-16 text-muted-foreground" />
            </div>
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
        </div>
      </Link>

      {/* Course Details */}
      <div className="flex-grow">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary" className="capitalize">
            {formatCourseType(baseContent.courseType)}
          </Badge>
          <Badge variant="outline">{baseContent.level}</Badge>
        </div>

        <Link
          href={getCourseUrl(baseContent.courseType, baseContent.slug)}
          className="group"
        >
          <h2 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors group-hover:underline">
            {baseContent.title}
          </h2>
        </Link>
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
            <span>{baseContent.totalStudents.toLocaleString()} students</span>
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

        {/* View Course Button */}
        <Link
          href={getCourseUrl(baseContent.courseType, baseContent.slug)}
          className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
        >
          <ExternalLink className="h-4 w-4" />
          View {formatCourseType(baseContent.courseType)} Details
        </Link>
      </div>
    </div>
  )
}

function PaymentInfoCard() {
  return (
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
            payment gateway. You can pay using any payment method available on
            the gateway including credit/debit cards, mobile banking (bKash,
            Nagad, Rocket), and more.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}

function OrderSummaryCard({
  mainTitle,
  totalPrice,
  isBundle,
  courseCount,
  courseType,
  bundleSavings,
  isProcessing,
  isRegistrationOpen,
  onPaymentClick,
}: {
  mainTitle: string
  totalPrice: number
  isBundle: boolean
  courseCount: number
  courseType: CourseType | null
  bundleSavings: BundleSavings | null
  isProcessing: boolean
  isRegistrationOpen: boolean
  onPaymentClick: () => void
}) {
  return (
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
          onClick={onPaymentClick}
          disabled={isProcessing || !isRegistrationOpen}
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
              {isRegistrationOpen ? 'Pay Now' : 'Registration Closed'} -{' '}
              {formatPrice(totalPrice)}
              <ExternalLink className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
        <p className="text-xs text-center text-muted-foreground">
          By completing your purchase, you agree to our Terms of Service and
          Privacy Policy
        </p>
      </CardFooter>
    </Card>
  )
}

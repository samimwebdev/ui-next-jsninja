'use client'

import { AuthGuard } from '@/components/auth/auth-guard'
import { useCurrentUser } from '@/hooks/use-current-user'
import { useCheckoutCourse } from '@/hooks/use-checkout-course'
import { fetchEnrolledCourses } from '@/lib/actions/enrolled-courses'
import { CourseType } from '@/types/checkout-types'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { CheckoutError } from './checkout-error'
import { CheckoutPageSkeleton } from './checkout-skeleton'
import { CheckoutSummary } from './checkout-summary'
// ✅ Import the new checkout tracking component
import { CheckoutTracking } from './checkout-tracking'

export function CheckoutContent() {
  const searchParams = useSearchParams()
  const courseSlug = searchParams.get('courseSlug')
  const courseType = searchParams.get('courseType') as CourseType | null

  const { data: user, isLoading: userLoading } = useCurrentUser()

  // Only fetch course data if user is authenticated
  const {
    data: courseResponse,
    isLoading: courseLoading,
    error,
    isError,
  } = useCheckoutCourse(courseSlug, courseType, {
    enabled: !!user && !!courseSlug && !!courseType, // Only run when user is authenticated
  })

  const { data: enrolledCourseResponse } = useQuery({
    queryKey: ['enrolledCourses'],
    queryFn: () => fetchEnrolledCourses({ isPublicPage: true }),
    enabled: !!user, // Only run when user is authenticated
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })

  // Check enrollment status
  const enrolledCourses = enrolledCourseResponse?.data
    ? [
        ...enrolledCourseResponse.data.courses,
        ...enrolledCourseResponse.data.bootcamps,
      ]
    : []

  const isEnrolled = enrolledCourses.some(
    (course) => course.slug === courseSlug && course.isExpired === false
  )

  // Show loading while checking authentication or fetching course data
  if (userLoading || (user && courseLoading)) {
    return <CheckoutPageSkeleton />
  }

  // If user is authenticated but there's an error fetching course data
  if (user && (isError || !courseResponse?.data)) {
    return <CheckoutError error={error} />
  }

  // Get course data for tracking
  const courseData = courseResponse?.data
  const courseName = courseData?.title || 'Unknown Course'
  const coursePrice = courseData?.price || 0

  return (
    <AuthGuard redirectTo="/login" fallback={<CheckoutPageSkeleton />}>
      {/* ✅ Add Checkout Tracking */}
      {user && courseData && courseSlug && (
        <CheckoutTracking
          courseSlug={courseSlug}
          courseTitle={courseName}
          coursePrice={coursePrice}
          courseType={courseType || 'course'}
        />
      )}

      {user && courseResponse?.data ? (
        <CheckoutSummary
          course={courseResponse.data}
          courseType={courseType}
          user={user}
          isEnrolled={isEnrolled}
        />
      ) : (
        <CheckoutPageSkeleton />
      )}
    </AuthGuard>
  )
}

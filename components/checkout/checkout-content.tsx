'use client'

import { useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { AuthGuard } from '@/components/auth/auth-guard'
import { useCurrentUser } from '@/hooks/use-current-user'
import { useCheckoutCourse } from '@/hooks/use-checkout-course'
import { fetchEnrolledCourses } from '@/lib/actions/enrolled-courses'
import { CourseType } from '@/types/checkout-types'
import { CheckoutPageSkeleton } from './checkout-skeleton'
import { CheckoutError } from './checkout-error'
import { CheckoutSummary } from './checkout-summary'

export function CheckoutContent() {
  const searchParams = useSearchParams()
  const courseSlug = searchParams.get('courseSlug')
  const courseType = searchParams.get('courseType') as CourseType | null

  const { data: user } = useCurrentUser()

  const { data: enrolledCourseResponse } = useQuery({
    queryKey: ['enrolledCourses'],
    queryFn: () => fetchEnrolledCourses({ isPublicPage: true }),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })

  const {
    data: courseResponse,
    isLoading,
    error,
    isError,
  } = useCheckoutCourse(courseSlug, courseType)

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

  if (isLoading) {
    return <CheckoutPageSkeleton />
  }

  if (isError || !courseResponse?.data) {
    return <CheckoutError error={error} />
  }

  return (
    <AuthGuard redirectTo="/login">
      <CheckoutSummary
        course={courseResponse.data}
        courseType={courseType}
        user={user}
        isEnrolled={isEnrolled}
      />
    </AuthGuard>
  )
}

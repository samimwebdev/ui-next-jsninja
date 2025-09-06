import { useQuery } from '@tanstack/react-query'
import { fetchCourseOrderInfo } from '@/lib/actions/order-course-info'
import { CheckoutCourseResponse, CourseType } from '@/types/checkout-types'

export function useCheckoutCourse(
  courseSlug: string | null,
  courseType: CourseType | null
) {
  return useQuery<CheckoutCourseResponse, Error>({
    queryKey: ['checkout-course', courseSlug, courseType],
    queryFn: () => {
      if (!courseSlug || !courseType) {
        throw new Error('Course slug and type are required')
      }
      return fetchCourseOrderInfo(courseSlug, courseType)
    },
    enabled: !!courseSlug && !!courseType,
    staleTime: 0, // Always fetch fresh data for checkout
    gcTime: 0, // Don't cache checkout data
    retry: false, // Don't retry on auth errors
  })
}

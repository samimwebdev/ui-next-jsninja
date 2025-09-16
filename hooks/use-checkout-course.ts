import { useQuery } from '@tanstack/react-query'
import { fetchCourseOrderInfo } from '@/lib/actions/order-course-info'
import { CourseType } from '@/types/checkout-types'

interface UseCheckoutCourseOptions {
  enabled?: boolean
}

export function useCheckoutCourse(
  courseSlug: string | null,
  courseType: CourseType | null,
  options: UseCheckoutCourseOptions = {}
) {
  return useQuery({
    queryKey: ['checkoutCourse', courseSlug, courseType],
    queryFn: () => {
      if (!courseSlug || !courseType) {
        throw new Error('Course slug and type are required')
      }
      return fetchCourseOrderInfo(courseSlug, courseType)
    },
    enabled: Boolean(courseSlug && courseType && (options.enabled ?? true)),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

'use client'
import { fetchEnrolledCourses } from '@/lib/actions/enrolled-courses'
import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '@/components/ui/skeleton'

function DashboardUserTopProfileClient() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['enrolledCourses'],
    queryFn: () => fetchEnrolledCourses({ isPublicPage: false }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })

  if (isLoading) {
    return (
      <div className="flex gap-4 mt-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 w-24" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 w-28" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex gap-4 mt-2">
        <span className="text-sm text-destructive">
          Error loading enrollment data
        </span>
      </div>
    )
  }

  const courseEnrolled = data?.data?.courses?.length || 0
  const bootcampEnrolled = data?.data?.bootcamps?.length || 0

  return (
    <div className="flex gap-4 mt-2">
      <span className="text-sm text-muted-foreground">
        {courseEnrolled} {'   '} {courseEnrolled > 1 ? 'Courses' : 'Course'}{' '}
        Enrolled
      </span>
      <span className="text-sm text-muted-foreground">
        {bootcampEnrolled}
        {'   '}
        {bootcampEnrolled > 1 ? 'Bootcamps' : 'Bootcamp'} Enrolled
      </span>
    </div>
  )
}

export default DashboardUserTopProfileClient

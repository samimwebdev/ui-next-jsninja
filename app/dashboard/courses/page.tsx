'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Calendar,
  Clock,
  GraduationCap,
  Users,
  AlertTriangle,
} from 'lucide-react'
import { fetchEnrolledCourses } from '@/lib/actions/enrolled-courses'
import { EnrolledCourse, EnrolledBootcamp } from '@/types/dashboard-types'
import { formatDate } from '@/lib/bootcamp-utils'
import {
  formatCourseUrl,
  getLevelBadgeVariant,
  getNextLessonTitle,
} from '@/lib/course-utils'

function CourseCardSkeleton() {
  return (
    <Card className="h-full">
      <CardHeader>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full mt-2" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-8" />
          </div>
          <Skeleton className="h-2 w-full" />
        </div>
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
        <Skeleton className="h-6 w-32" />
      </CardContent>
    </Card>
  )
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 text-destructive">
        <AlertTriangle className="h-5 w-5 flex-shrink-0" />
        <p className="text-sm">{message}</p>
      </div>
    </Card>
  )
}

function CourseCard({ course }: { course: EnrolledCourse }) {
  return (
    <Link
      href={formatCourseUrl(
        course.slug,
        course.isExpired,
        course.progress.lastAccessedLesson
      )}
      className="block h-full"
    >
      <Card className="transition-all hover:bg-muted/50 hover:shadow-md h-full">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-2">
            <CardTitle className="text-base sm:text-lg line-clamp-2">
              {course.title}
            </CardTitle>
            <div className="flex items-center justify-between gap-2">
              <Badge
                variant={getLevelBadgeVariant(course.level)}
                className="text-xs"
              >
                {course.level}
              </Badge>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mt-2">
            Goal: {course.goal}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress Section */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="font-medium">Progress</span>
              <span className="font-semibold">
                {course.progress.percentage}%
              </span>
            </div>
            <Progress value={course.progress.percentage} className="h-2" />
          </div>

          {/* Stats Grid - Stacked on mobile, grid on larger screens */}
          <div className="space-y-2 sm:grid sm:grid-cols-2 sm:gap-2 sm:space-y-0">
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <GraduationCap className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
              <span>
                {course.progress.completedCount}/{course.progress.totalLessons}{' '}
                lessons
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <Clock className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <Users className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
              <span>{course.totalStudents} students</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <Calendar className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
              <span className="truncate">
                {formatDate(course.progress.lastAccessDate)}
              </span>
            </div>
          </div>

          {/* Next Lesson Badge */}
          <div>
            <Badge
              variant="secondary"
              className="text-xs w-full justify-center sm:w-auto"
            >
              Next: {getNextLessonTitle(course.progress.lastAccessedLesson)}
            </Badge>
          </div>

          {/* Expiry Warning */}
          {course.isExpired && (
            <Badge
              variant="destructive"
              className="w-full justify-center text-xs"
            >
              Expired on {formatDate(course.expiryDate)}
            </Badge>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}

function BootcampCard({ bootcamp }: { bootcamp: EnrolledBootcamp }) {
  // Calculate modules from lessons (assuming groups of lessons = modules)
  const estimatedModules = Math.ceil(bootcamp.progress.totalLessons / 10) // Rough estimate
  const completedModules = Math.ceil(bootcamp.progress.completedCount / 10)

  return (
    <Link
      href={formatCourseUrl(
        bootcamp.slug,
        bootcamp.isExpired,
        bootcamp.progress.lastAccessedLesson
      )}
      className="block h-full"
    >
      <Card className="transition-all hover:bg-muted/50 hover:shadow-md h-full">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-2">
            <CardTitle className="text-base sm:text-lg line-clamp-2">
              {bootcamp.title}
            </CardTitle>
            <div className="flex items-center justify-between gap-2">
              <Badge
                variant={getLevelBadgeVariant(bootcamp.level)}
                className="text-xs"
              >
                {bootcamp.level}
              </Badge>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mt-2">
            Goal: {bootcamp.goal}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress Section */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="font-medium">Progress</span>
              <span className="font-semibold">
                {bootcamp.progress.percentage}%
              </span>
            </div>
            <Progress value={bootcamp.progress.percentage} className="h-2" />
          </div>

          {/* Stats Grid - Stacked on mobile, grid on larger screens */}
          <div className="space-y-2 sm:grid sm:grid-cols-2 sm:gap-2 sm:space-y-0">
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <GraduationCap className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
              <span>
                {completedModules}/{estimatedModules} modules
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <Clock className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
              <span>{Math.ceil(parseInt(bootcamp.duration) / 7)} weeks</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <Users className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
              <span>{bootcamp.totalStudents} students</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <Calendar className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
              <span className="truncate">
                Started: {formatDate(bootcamp.startDate)}
              </span>
            </div>
          </div>

          {/* Next Lesson Badge */}
          <div>
            <Badge
              variant="secondary"
              className="text-xs w-full justify-center sm:w-auto"
            >
              Next: {getNextLessonTitle(bootcamp.progress.lastAccessedLesson)}
            </Badge>
          </div>

          {/* Expiry Warning */}
          {bootcamp.isExpired && (
            <Badge
              variant="destructive"
              className="w-full justify-center text-xs"
            >
              Expired on {formatDate(bootcamp.expiryDate)}
            </Badge>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}

export default function CoursesPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['enrolledCourses'],
    queryFn: () => fetchEnrolledCourses({ isPublicPage: false }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium">My Learning</h3>
          <p className="text-sm text-muted-foreground">
            Track your course and bootcamp progress.
          </p>
        </div>
        <ErrorMessage
          message={
            error instanceof Error ? error.message : 'Unknown error occurred'
          }
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">My Learning</h3>
        <p className="text-sm text-muted-foreground">
          Track your course and bootcamp progress.
        </p>
      </div>

      <Tabs defaultValue="courses" className="space-y-4">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="courses" className="flex-1 sm:flex-initial">
            Courses {data && `(${data?.data?.courses.length})`}
          </TabsTrigger>
          <TabsTrigger value="bootcamps" className="flex-1 sm:flex-initial">
            Bootcamps {data && `(${data?.data?.bootcamps.length})`}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="courses">
          <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
            {isLoading || !data ? (
              [...Array(4)].map((_, i) => <CourseCardSkeleton key={i} />)
            ) : data?.data.courses.length === 0 ? (
              <div className="col-span-full">
                <Card className="p-8 text-center">
                  <GraduationCap className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">
                    No courses enrolled
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Start your learning journey by enrolling in a course.
                  </p>
                </Card>
              </div>
            ) : (
              data?.data?.courses.map((course) => (
                <CourseCard key={course.documentId} course={course} />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="bootcamps">
          <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
            {isLoading ? (
              [...Array(2)].map((_, i) => <CourseCardSkeleton key={i} />)
            ) : data?.data.bootcamps.length === 0 ? (
              <div className="col-span-full">
                <Card className="p-8 text-center">
                  <GraduationCap className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">
                    No bootcamps enrolled
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Join a bootcamp for intensive, structured learning.
                  </p>
                </Card>
              </div>
            ) : (
              data?.data.bootcamps.map((bootcamp) => (
                <BootcampCard key={bootcamp.documentId} bootcamp={bootcamp} />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

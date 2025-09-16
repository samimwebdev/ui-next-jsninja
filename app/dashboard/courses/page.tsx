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
        <Skeleton className="h-4 w-full" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-8" />
          </div>
          <Skeleton className="h-2 w-full" />
        </div>
        <div className="grid grid-cols-2 gap-2">
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
        <AlertTriangle className="h-5 w-5" />
        <p>Error loading courses: {message}</p>
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
    >
      <Card className="transition-colors hover:bg-muted/50 h-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {course.title}
            <Badge variant={getLevelBadgeVariant(course.level)}>
              {course.level}
            </Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground">Goal: {course.goal}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{course.progress.percentage}%</span>
            </div>
            <Progress value={course.progress.percentage} />
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-1">
              <GraduationCap className="h-4 w-4" />
              <span>
                {course.progress.completedCount}/{course.progress.totalLessons}{' '}
                lessons
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{course.totalStudents} students</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>
                Last Accessed: {formatDate(course.progress.lastAccessDate)}
              </span>
            </div>
          </div>
          <div>
            <Badge variant="secondary">
              Next: {getNextLessonTitle(course.progress.lastAccessedLesson)}
            </Badge>
          </div>
          {course.isExpired && (
            <Badge variant="destructive" className="w-full justify-center">
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
    >
      <Card className="transition-colors hover:bg-muted/50 h-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {bootcamp.title}
            <Badge variant={getLevelBadgeVariant(bootcamp.level)}>
              {bootcamp.level}
            </Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground">Goal: {bootcamp.goal}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{bootcamp.progress.percentage}%</span>
            </div>
            <Progress value={bootcamp.progress.percentage} />
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-1">
              <GraduationCap className="h-4 w-4" />
              <span>
                {completedModules}/{estimatedModules} modules
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{Math.ceil(parseInt(bootcamp.duration) / 7)} weeks</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{bootcamp.totalStudents} students</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Started: {formatDate(bootcamp.startDate)}</span>
            </div>
          </div>
          <div>
            <Badge variant="secondary">
              Next: {getNextLessonTitle(bootcamp.progress.lastAccessedLesson)}
            </Badge>
          </div>
          {bootcamp.isExpired && (
            <Badge variant="destructive" className="w-full justify-center">
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
        <TabsList>
          <TabsTrigger value="courses">
            Courses {data && `(${data?.data?.courses.length})`}
          </TabsTrigger>
          <TabsTrigger value="bootcamps">
            Bootcamps {data && `(${data?.data?.bootcamps.length})`}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="courses">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
            {isLoading || !data ? (
              [...Array(4)].map((_, i) => <CourseCardSkeleton key={i} />)
            ) : data?.data.courses.length === 0 ? (
              <div className="col-span-full">
                <Card className="p-8 text-center">
                  <GraduationCap className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">
                    No courses enrolled
                  </h3>
                  <p className="text-muted-foreground">
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
          <div className="grid gap-6 md:grid-cols-2">
            {isLoading ? (
              [...Array(2)].map((_, i) => <CourseCardSkeleton key={i} />)
            ) : data?.data.bootcamps.length === 0 ? (
              <div className="col-span-full">
                <Card className="p-8 text-center">
                  <GraduationCap className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium mb-2">
                    No bootcamps enrolled
                  </h3>
                  <p className="text-muted-foreground">
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

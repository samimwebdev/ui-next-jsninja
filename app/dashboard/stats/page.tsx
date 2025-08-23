'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import {
  Book,
  Clock,
  GraduationCap,
  AlertTriangle,
  BarChart3,
} from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { cn } from '@/lib/utils'
import { fetchEnrolledCourses } from '@/lib/actions/enrolled-courses'
import { fetchCourseStats } from '@/lib/actions/user-progress-stats'
import {
  getTotalTimeSpent,
  processWeeklyProgress,
  processDailyActivity,
  getAssignmentStatus,
} from '@/lib/stats-utils'
import { formatDate } from '@/lib/bootcamp-utils'

function StatsCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-20 mb-2" />
        <Skeleton className="h-2 w-full" />
      </CardContent>
    </Card>
  )
}

function ChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[300px] w-full" />
      </CardContent>
    </Card>
  )
}

function TableSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {[...Array(rows)].map((_, i) => (
            <div key={i} className="flex space-x-4">
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 text-destructive">
        <AlertTriangle className="h-5 w-5" />
        <p>Error loading statistics: {message}</p>
      </div>
    </Card>
  )
}

function EmptyState({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <Card className="p-8 text-center">
      <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </Card>
  )
}

export default function StatsPage() {
  const [selectedCourseId, setSelectedCourseId] = useState<string>('')

  // Fetch enrolled courses
  const {
    data: coursesData,
    isLoading: coursesLoading,
    error: coursesError,
  } = useQuery({
    queryKey: ['enrolledCourses'],
    queryFn: fetchEnrolledCourses,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })

  // Set default course when data loads
  const courses = coursesData?.data
    ? [...coursesData.data.courses, ...coursesData.data.bootcamps]
    : []

  // Auto-select first course if none selected
  if (courses.length > 0 && !selectedCourseId) {
    setSelectedCourseId(courses[0].documentId)
  }

  // Fetch stats for selected course
  const {
    data: statsData,
    isLoading: statsLoading,
    error: statsError,
  } = useQuery({
    queryKey: ['courseStats', selectedCourseId],
    queryFn: () => fetchCourseStats(selectedCourseId),
    enabled: !!selectedCourseId,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  })

  // Show courses loading state
  if (coursesLoading) {
    return (
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Course Statistics
            </h2>
            <p className="text-muted-foreground">
              Track your progress and performance.
            </p>
          </div>
          <Skeleton className="h-10 w-[280px]" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <StatsCardSkeleton key={i} />
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>

        <TableSkeleton />
        <TableSkeleton />
      </div>
    )
  }

  // Show courses error
  if (coursesError) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Course Statistics
          </h2>
          <p className="text-muted-foreground">
            Track your progress and performance.
          </p>
        </div>
        <ErrorMessage
          message={
            coursesError instanceof Error
              ? coursesError.message
              : 'Failed to load courses'
          }
        />
      </div>
    )
  }

  // FIX: Only show empty state if courses have loaded AND there are no courses
  if (coursesData && !courses.length) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Course Statistics
          </h2>
          <p className="text-muted-foreground">
            Track your progress and performance.
          </p>
        </div>
        <EmptyState
          title="No courses enrolled"
          description="Enroll in a course to view your learning statistics and progress."
        />
      </div>
    )
  }

  const stats = statsData?.data

  // Process data for charts
  const weeklyProgress = stats?.weeklyCourseProgress.length
    ? processWeeklyProgress(stats.weeklyCourseProgress)
    : []
  const dailyActivity = Object.keys(stats?.dailyStrength || {}).length
    ? processDailyActivity(stats?.dailyStrength || {})
    : []
  const totalTimeSpent = stats?.totalLessonsWatchingTimeSpent
    ? getTotalTimeSpent(stats.totalLessonsWatchingTimeSpent)
    : '0m'

  // FIX: Better loading condition - show loading while courses OR stats are loading
  const shouldShowLoading =
    coursesLoading ||
    statsLoading ||
    (selectedCourseId && !statsData && !statsError) ||
    !coursesData // FIX: Also show loading if coursesData is not yet loaded

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Course Statistics
          </h2>
          <p className="text-muted-foreground">
            Track your progress and performance.
          </p>
        </div>

        {/* Show skeleton while courses are loading */}
        {coursesLoading || !coursesData ? (
          <Skeleton className="h-10 w-[280px]" />
        ) : (
          <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select a course" />
            </SelectTrigger>
            <SelectContent>
              {courses.map((course) => (
                <SelectItem key={course.documentId} value={course.documentId}>
                  {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Show loading state until we have both courses data and stats data */}
      {shouldShowLoading ? (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <StatsCardSkeleton key={i} />
            ))}
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <ChartSkeleton />
            <ChartSkeleton />
          </div>
          <TableSkeleton />
          <TableSkeleton />
        </>
      ) : statsError ? (
        <ErrorMessage
          message={
            statsError instanceof Error
              ? statsError.message
              : 'Failed to load course statistics'
          }
        />
      ) : !stats ? (
        <EmptyState
          title="No statistics available"
          description="Start learning to see your progress and statistics."
        />
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Modules Completed
                </CardTitle>
                <Book className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.completedModules.length}/{stats.totalModules}
                </div>
                <Progress
                  value={
                    (stats.completedModules.length /
                      Math.max(stats.totalModules, 1)) *
                    100
                  }
                  className="mt-2"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Time Spent Learning
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalTimeSpent}</div>
                <p className="text-xs text-muted-foreground">
                  Total time spent on course
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Lessons Completed
                </CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.completedLessons.length}/{stats.totalLessons}
                </div>
                <Progress
                  value={
                    (stats.completedLessons.length /
                      Math.max(stats.totalLessons, 1)) *
                    100
                  }
                  className="mt-2"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Overall Progress
                </CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.progress}%</div>
                <Progress value={stats.progress} className="mt-2" />
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid gap-6 md:grid-cols-2">
            {weeklyProgress.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={weeklyProgress}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="progress"
                        stroke="#8884d8"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Progress</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-[300px]">
                  <p className="text-muted-foreground">
                    weekly progress data available for Bootcamp
                  </p>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Daily Activity</CardTitle>
              </CardHeader>
              {dailyActivity.length > 0 ? (
                <CardContent>
                  <div className="grid grid-cols-7 gap-1">
                    {dailyActivity.map((activity, index) => (
                      <div
                        key={index}
                        className={cn(
                          'h-4 w-4 rounded-sm',
                          activity === 0 && 'bg-muted',
                          activity === 1 && 'bg-emerald-200',
                          activity === 2 && 'bg-emerald-400',
                          activity === 3 && 'bg-emerald-600'
                        )}
                        title={`Activity Level: ${activity}`}
                      />
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-end gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <div className="h-3 w-3 rounded-sm bg-muted" />
                      <span className="text-muted-foreground">No activity</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-3 w-3 rounded-sm bg-emerald-200" />
                      <span className="text-muted-foreground">Low</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-3 w-3 rounded-sm bg-emerald-400" />
                      <span className="text-muted-foreground">Medium</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-3 w-3 rounded-sm bg-emerald-600" />
                      <span className="text-muted-foreground">High</span>
                    </div>
                  </div>
                </CardContent>
              ) : (
                <CardContent className="flex items-center justify-center h-[300px]">
                  <p className="text-muted-foreground">
                    Daily activity data only available for Bootcamp
                  </p>
                </CardContent>
              )}
            </Card>
          </div>

          {/* Assignment Report */}
          {stats.assignments && stats.assignments.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Assignment Report</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Assignment</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Deadline</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.assignments.map((assignment) => {
                      const statusInfo = getAssignmentStatus(assignment)
                      return (
                        <TableRow key={assignment.documentId}>
                          <TableCell>{assignment.title}</TableCell>
                          <TableCell>{assignment.score}/100</TableCell>
                          <TableCell>
                            {formatDate(assignment.submittedAt)}
                          </TableCell>
                          <TableCell>
                            {formatDate(assignment.deadline)}
                          </TableCell>
                          <TableCell>
                            <Badge className={statusInfo.className}>
                              {statusInfo.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : null}

          {/* Quiz Report */}
          {stats.quizzes && stats.quizzes.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Quiz Report</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Quiz Name</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Completed Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stats.quizzes.map((quiz) => (
                      <TableRow key={quiz.documentId}>
                        <TableCell>{quiz.title}</TableCell>
                        <TableCell>
                          {quiz.score}/{quiz.totalScore}
                        </TableCell>
                        <TableCell>{formatDate(quiz.completedAt)}</TableCell>
                        <TableCell>
                          <Badge
                            variant={quiz.passed ? 'default' : 'destructive'}
                          >
                            {quiz.passed ? 'Passed' : 'Failed'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ) : null}
        </>
      )}
    </div>
  )
}

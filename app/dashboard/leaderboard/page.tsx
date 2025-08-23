'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Medal, Trophy, AlertTriangle, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { fetchEnrolledCourses } from '@/lib/actions/enrolled-courses'
import { fetchLeaderboard } from '@/lib/actions/leaderboard'
import {
  getInitials,
  formatProgress,
  formatScore,
  getMedalColor,
} from '@/lib/leaderboard-utils'

function LeaderboardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="h-6 w-8" />
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-12" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function UserStatsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-1">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-8 w-20" />
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
        <p className=" dark:text-destructive-foreground">{message}</p>
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
      <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </Card>
  )
}

function NotAvailableMessage() {
  return (
    <Card className="p-8 text-center">
      <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
      <h3 className="text-lg font-medium mb-2">Leaderboard Not Available</h3>
      <p className="text-muted-foreground">
        Leaderboards are only available for bootcamps and workshops, not
        individual courses.
      </p>
    </Card>
  )
}

export default function LeaderboardPage() {
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

  // Fetch leaderboard for selected course
  const {
    data: leaderboardData,
    isLoading: leaderboardLoading,
    error: leaderboardError,
  } = useQuery({
    queryKey: ['leaderboard', selectedCourseId],
    queryFn: () => fetchLeaderboard(selectedCourseId),
    enabled: !!selectedCourseId,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
    retry: 0,
  })

  // Show courses loading state
  if (!courses.length && !coursesLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Leaderboard</h2>
            <p className="text-muted-foreground">
              Track your ranking and progress across courses.
            </p>
          </div>
          <Skeleton className="h-10 w-[200px]" />
        </div>
        <UserStatsSkeleton />
        <LeaderboardSkeleton />
      </div>
    )
  }

  // Show courses error
  if (coursesError) {
    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Leaderboard</h2>
          <p className="text-muted-foreground">
            Track your ranking and progress across courses.
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

  // Show empty state if no courses
  if (!courses.length && !coursesLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Leaderboard</h2>
          <p className="text-muted-foreground">
            Track your ranking and progress across courses.
          </p>
        </div>
        <EmptyState
          title="No courses enrolled"
          description="Enroll in a bootcamp or workshop to view leaderboards and compete with other learners."
        />
      </div>
    )
  }

  const selectedCourse = courses.find((c) => c.documentId === selectedCourseId)

  const currentUserStats = leaderboardData?.data?.userScoreboard
  const leaderboard = leaderboardData?.data?.leaderboard || []

  // Check if leaderboard is not available (API returned null data)
  const isLeaderboardNotAvailable =
    leaderboardData?.data === null && leaderboardData?.error

  // Determine loading state
  const shouldShowLoading =
    coursesLoading ||
    leaderboardLoading ||
    (selectedCourseId && !leaderboardData && !leaderboardError)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Leaderboard</h2>
          <p className="text-muted-foreground">
            Track your ranking and progress across courses.
          </p>
        </div>

        {coursesLoading ? (
          <Skeleton className="h-10 w-[200px]" />
        ) : (
          <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
            <SelectTrigger className="w-[200px]">
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

      {shouldShowLoading ? (
        <>
          <UserStatsSkeleton />
          <LeaderboardSkeleton />
        </>
      ) : leaderboardError ? (
        <ErrorMessage
          message={
            leaderboardError instanceof Error
              ? leaderboardError.message
              : 'Failed to load leaderboard'
          }
        />
      ) : isLeaderboardNotAvailable ? (
        <NotAvailableMessage />
      ) : (
        <>
          {/* Current User Stats */}
          {currentUserStats && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Your Current Standing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Rank</p>
                    <p className="text-2xl font-bold">
                      #{currentUserStats.rank}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Score</p>
                    <p className="text-2xl font-bold">
                      {formatScore(currentUserStats.totalScore)}{' '}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium"> Course Progress</p>
                    <p className="text-2xl font-bold">
                      {formatProgress(currentUserStats.progress)}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Course</p>
                    <p className="text-2xl font-bold">
                      {selectedCourse?.title || currentUserStats.course}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Leaderboard Table */}
          <Card>
            <CardHeader>
              <CardTitle>
                Top{' '}
                {Math.min(leaderboard.length, 10) > 0 ? leaderboard.length : ''}
                {'  '}
                Learners
                {leaderboard.length > 0 &&
                  ` - ${selectedCourse?.title || leaderboard[0]?.course}`}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {leaderboard.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <p className="text-muted-foreground">
                    No leaderboard data available yet. Complete some lessons to
                    see rankings!
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Rank</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Score/Total Score</TableHead>
                      <TableHead>Course Progress</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaderboard.slice(0, 10).map((entry) => (
                      <TableRow
                        key={entry.userId}
                        className={
                          entry.isCurrentUser ? 'bg-primary/10 font-medium' : ''
                        }
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {entry.rank <= 3 && (
                              <Medal className={getMedalColor(entry.rank)} />
                            )}
                            {entry.rank}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage
                                src={`/images/avatar-${entry.userId}.jpg`}
                              />
                              <AvatarFallback className="text-xs">
                                {getInitials(entry.fullName)}
                              </AvatarFallback>
                            </Avatar>
                            <span>
                              {entry.fullName}
                              {entry.isCurrentUser && ' (You)'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {formatScore(entry.totalScore)} /{' '}
                          {formatScore(entry.totalAssignmentScore)}
                        </TableCell>
                        <TableCell>{formatProgress(entry.progress)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

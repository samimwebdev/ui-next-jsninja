import { Suspense } from 'react'
import {
  getTasksToReview,
  canReviewTasks,
} from '@/lib/actions/task-review-actions'
import { TaskReviewList } from '@/components/dashboard/task-review-list'
import { redirect } from 'next/navigation'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export const dynamic = 'force-dynamic'

export default async function ReviewTasksPage() {
  // Check permission first
  const hasPermission = await canReviewTasks()

  if (!hasPermission) {
    redirect('/dashboard/courses')
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Review Task Submissions
        </h1>
        <p className="text-muted-foreground">
          Review and grade student task submissions
        </p>
      </div>

      <Suspense fallback={<TaskReviewListSkeleton />}>
        <TaskReviewListWrapper />
      </Suspense>
    </div>
  )
}

async function TaskReviewListWrapper() {
  try {
    const response = await getTasksToReview()

    if (!response.data || response.data.length === 0) {
      return (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Submissions</AlertTitle>
          <AlertDescription>
            There are no task submissions to review at the moment.
          </AlertDescription>
        </Alert>
      )
    }

    return <TaskReviewList initialData={response.data} />
  } catch (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error instanceof Error
            ? error.message
            : 'Failed to load task submissions'}
        </AlertDescription>
      </Alert>
    )
  }
}

function TaskReviewListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="border rounded-lg p-6 animate-pulse bg-muted/50"
        >
          <div className="space-y-3">
            <div className="h-5 bg-muted rounded w-1/3" />
            <div className="h-4 bg-muted rounded w-1/2" />
            <div className="h-4 bg-muted rounded w-2/3" />
          </div>
        </div>
      ))}
    </div>
  )
}

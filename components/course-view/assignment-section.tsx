'use client'

import * as React from 'react'
import { use } from 'react'
import type { Assignment } from '@/types/course-view-types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  CalendarIcon,
  CheckCircle,
  Clock,
  Github,
  Globe,
  Trophy,
  XCircle,
  Code,
  ArrowRight,
  MessageSquare,
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import dynamic from 'next/dynamic'
import { strapiFetch } from '@/lib/strapi'
import { toast } from 'sonner'
import { getAuthToken } from '@/lib/auth'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'

// Dynamically import Monaco Editor to reduce initial bundle size
const Editor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[400px] bg-muted rounded-lg border">
      <div className="flex flex-col items-center gap-2">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <div className="text-sm text-muted-foreground">
          Loading code editor...
        </div>
      </div>
    </div>
  ),
})

// Add interfaces for API types
interface AssignmentSubmissionRequest {
  courseId: string
  assignmentId: string
  repoLink?: string
  liveLink?: string
  code?: string
}

interface AssignmentSubmissionResponse {
  data: {
    id: number
    documentId: string
    feedback: string | null
    submissionStatus: 'submitted' | 'pending' | 'graded'
    createdAt: string
    updatedAt: string
    publishedAt: string
    submittedDate: string
    resultScore: number | null
    repoLink: string | null
    liveLink: string | null
    code: string | null
  }
}

// Add this interface for the existing submission from promise
interface ExistingAssignmentSubmission {
  id: number
  documentId: string
  feedback: string | null
  submissionStatus: 'submitted' | 'pending' | 'graded'
  submittedDate: string
  resultScore: number | null
  repoLink: string | null
  liveLink: string | null
  code: string | null
}

interface AssignmentSectionProps {
  assignment?: Assignment
  courseId: string
  assignmentId: string
  existingSubmissionPromise: Promise<ExistingAssignmentSubmission | null>
}

// Format the expiry date
const formatExpiryDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

export function AssignmentSection({
  assignment,
  courseId,
  assignmentId,
  existingSubmissionPromise,
}: AssignmentSectionProps) {
  console.log(assignment, 'assignment in AssignmentSection')

  // Use the promise to get existing submission data
  const existingSubmission = use(existingSubmissionPromise)

  const [showSubmissionForm, setShowSubmissionForm] = React.useState(false)
  const [codeLanguage, setCodeLanguage] = React.useState('javascript')

  const submissionTypes = (assignment?.submissionType
    .toLowerCase()
    .split(',')
    .map((type) => type.trim()) || []) as Array<'code' | 'live' | 'repo'>

  const [githubRepo, setGithubRepo] = React.useState(
    submissionTypes.includes('repo') ? '' : ''
  )
  const [live, setLive] = React.useState(
    submissionTypes.includes('live') ? '' : ''
  )
  const [code, setCode] = React.useState(
    submissionTypes.includes('code') ? '' : ''
  )
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  // Language options for code editor
  const languageOptions = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'python', label: 'Python' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
  ]

  // Check if assignment is expired
  const isExpired = new Date(assignment?.dueDate || '') < new Date()

  // Handle submission with API call
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Prepare submission data
      const submissionData: AssignmentSubmissionRequest = {
        courseId,
        assignmentId,
        repoLink:
          submissionTypes.includes('repo') && githubRepo ? githubRepo : '',
        liveLink: submissionTypes.includes('live') && live ? live : '',
        code: submissionTypes.includes('code') && code ? code : '',
      }

      // Make the API call
      const response = await strapiFetch<AssignmentSubmissionResponse>(
        '/api/assignment-submissions',
        {
          method: 'POST',
          body: JSON.stringify({ data: submissionData }),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${await getAuthToken()}`,
          },
        }
      )

      // Show success toast
      toast?.success('Assignment submitted successfully!', {
        description: `Submitted on ${new Date(
          response.data.submittedDate
        ).toLocaleDateString()}`,
      })

      setShowSubmissionForm(false)
      // Trigger a page refresh to update the submission data
      window.location.reload()
    } catch (error) {
      console.error('Submission failed:', error)

      // Handle different types of errors
      let errorMessage = 'Failed to submit assignment. Please try again.'

      if (error instanceof Error) {
        if (error.message.includes('401')) {
          errorMessage = 'You are not authorized. Please log in again.'
        } else if (error.message.includes('403')) {
          errorMessage = 'You do not have permission to submit this assignment.'
        } else if (error.message.includes('404')) {
          errorMessage = 'Assignment or course not found.'
        } else if (error.message.includes('422')) {
          errorMessage = 'Invalid submission data. Please check your inputs.'
        } else {
          errorMessage = error.message
        }
      }

      toast.error('Submission Failed', {
        description: errorMessage,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Show existing submission with original markup (if exists)
  if (existingSubmission) {
    // Create submissionResult object to match original markup expectations
    const submissionResult = {
      submittedAt: existingSubmission.submittedDate,
      githubRepo: existingSubmission.repoLink,
      githubLive: existingSubmission.liveLink,
      code: existingSubmission.code,
      submissionStatus: existingSubmission.submissionStatus,
      resultScore: existingSubmission.resultScore,
      feedback: existingSubmission.feedback,
    }

    const isGraded = existingSubmission.submissionStatus === 'graded'

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{assignment?.title}</CardTitle>
                <CardDescription className="mt-2">
                  {assignment?.description}
                </CardDescription>
              </div>
              <Badge
                variant={isGraded ? 'default' : 'secondary'}
                className="flex items-center gap-1"
              >
                <CheckCircle className="h-3 w-3" />
                {submissionResult.submissionStatus}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Show different alert based on grading status */}
            {isGraded ? (
              <Alert
                className={`${
                  (submissionResult.resultScore || 0) >=
                  (assignment?.score || 0) * 0.7
                    ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900'
                    : 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-900'
                }`}
              >
                <CheckCircle
                  className={`h-4 w-4 ${
                    (submissionResult.resultScore || 0) >=
                    (assignment?.score || 0) * 0.7
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-yellow-600 dark:text-yellow-400'
                  }`}
                />
                <AlertTitle>Assignment Graded</AlertTitle>
                <AlertDescription>
                  Your assignment has been reviewed and graded.
                  {submissionResult.resultScore && assignment?.score && (
                    <>
                      {' '}
                      You scored {submissionResult.resultScore} out of{' '}
                      {assignment.score} points.
                    </>
                  )}
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertTitle>Assignment Submitted Successfully</AlertTitle>
                <AlertDescription>
                  Your work has been submitted and is now being reviewed.
                </AlertDescription>
              </Alert>
            )}

            <div className="rounded-lg border bg-card">
              <div className="flex flex-col divide-y">
                <div className="p-4 flex items-center justify-between">
                  <span className="text-sm font-medium">Submission Date</span>
                  <span className="text-sm text-muted-foreground">
                    {submissionResult?.submittedAt
                      ? new Date(submissionResult.submittedAt).toLocaleString()
                      : 'N/A'}
                  </span>
                </div>

                <div className="p-4 flex items-center justify-between">
                  <span className="text-sm font-medium">Status</span>
                  <Badge
                    variant={isGraded ? 'default' : 'secondary'}
                    className="capitalize"
                  >
                    {submissionResult.submissionStatus}
                  </Badge>
                </div>

                {submissionResult?.githubRepo && (
                  <div className="p-4 flex items-center justify-between">
                    <span className="text-sm font-medium">
                      GitHub Repository
                    </span>
                    <a
                      href={submissionResult.githubRepo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline flex items-center gap-2"
                    >
                      View Repository
                      <ArrowRight className="h-3 w-3" />
                    </a>
                  </div>
                )}

                {submissionResult?.githubLive && (
                  <div className="p-4 flex items-center justify-between">
                    <span className="text-sm font-medium">Live Demo</span>
                    <a
                      href={submissionResult.githubLive}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline flex items-center gap-2"
                    >
                      View Demo
                      <ArrowRight className="h-3 w-3" />
                    </a>
                  </div>
                )}

                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Score</span>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-2xl font-bold ${
                          isGraded
                            ? (submissionResult?.resultScore || 0) >=
                              (assignment?.score || 0) * 0.7
                              ? 'text-green-600'
                              : 'text-yellow-600'
                            : 'text-primary'
                        }`}
                      >
                        {submissionResult?.resultScore !== null
                          ? submissionResult.resultScore
                          : 'Pending'}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        / {assignment?.score}
                      </span>
                    </div>
                  </div>
                  {assignment?.score &&
                    submissionResult?.resultScore !== null && (
                      <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ease-in-out ${
                            (submissionResult.resultScore || 0) >=
                            assignment.score * 0.7
                              ? 'bg-green-500'
                              : (submissionResult.resultScore || 0) >=
                                assignment.score * 0.5
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`}
                          style={{
                            width: `${
                              ((submissionResult.resultScore || 0) /
                                assignment.score) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    )}
                </div>
              </div>
            </div>

            {/* Show feedback button if graded and feedback exists */}
            {isGraded && submissionResult?.feedback && (
              <div className="flex justify-center">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <MessageSquare className="h-4 w-4" />
                      View Instructor Feedback
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh]">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        Instructor Feedback
                      </DialogTitle>
                      <DialogDescription>
                        Detailed feedback from your instructor on{' '}
                        {assignment?.title}
                      </DialogDescription>
                    </DialogHeader>

                    <ScrollArea className="max-h-[60vh] w-full rounded-md border p-4">
                      <div className="space-y-4">
                        {/* Assignment Info */}
                        <div className="rounded-lg bg-muted/50 p-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-muted-foreground">
                                Assignment:
                              </span>
                              <p className="font-medium">{assignment?.title}</p>
                            </div>
                            <div>
                              <span className="font-medium text-muted-foreground">
                                Score:
                              </span>
                              <p className="font-medium">
                                <span
                                  className={`text-lg ${
                                    (submissionResult?.resultScore || 0) >=
                                    (assignment?.score || 0) * 0.7
                                      ? 'text-green-600'
                                      : (submissionResult?.resultScore || 0) >=
                                        (assignment?.score || 0) * 0.5
                                      ? 'text-yellow-600'
                                      : 'text-red-600'
                                  }`}
                                >
                                  {submissionResult?.resultScore}
                                </span>
                                <span className="text-muted-foreground">
                                  {' '}
                                  / {assignment?.score}
                                </span>
                              </p>
                            </div>
                            <div>
                              <span className="font-medium text-muted-foreground">
                                Submitted:
                              </span>
                              <p className="text-sm">
                                {new Date(
                                  submissionResult?.submittedAt
                                ).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <span className="font-medium text-muted-foreground">
                                Status:
                              </span>
                              <Badge variant="default" className="ml-1">
                                {submissionResult.submissionStatus}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        {/* Score Breakdown */}
                        {assignment?.score &&
                          submissionResult?.resultScore !== null && (
                            <div className="rounded-lg border p-4">
                              <h4 className="font-medium mb-3">Performance</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span>Score Percentage</span>
                                  <span className="font-medium">
                                    {Math.round(
                                      ((submissionResult?.resultScore || 0) /
                                        assignment.score) *
                                        100
                                    )}
                                    %
                                  </span>
                                </div>
                                <div className="h-2 rounded-full bg-muted overflow-hidden">
                                  <div
                                    className={`h-full transition-all duration-500 ease-in-out ${
                                      (submissionResult.resultScore || 0) >=
                                      assignment.score * 0.7
                                        ? 'bg-green-500'
                                        : (submissionResult.resultScore || 0) >=
                                          assignment.score * 0.5
                                        ? 'bg-yellow-500'
                                        : 'bg-red-500'
                                    }`}
                                    style={{
                                      width: `${
                                        ((submissionResult.resultScore || 0) /
                                          assignment.score) *
                                        100
                                      }%`,
                                    }}
                                  />
                                </div>
                                <div className="flex justify-between text-xs text-muted-foreground">
                                  <span>0</span>
                                  <span>{assignment.score}</span>
                                </div>
                              </div>
                            </div>
                          )}

                        {/* Detailed Feedback */}
                        <div className="rounded-lg border">
                          <div className="bg-muted/50 px-4 py-3 border-b">
                            <h4 className="font-medium">Detailed Feedback</h4>
                          </div>
                          <div className="p-4">
                            <div className="prose prose-sm max-w-none dark:prose-invert">
                              <div
                                className="text-sm leading-relaxed whitespace-pre-wrap"
                                style={{
                                  wordBreak: 'break-word',
                                  overflowWrap: 'break-word',
                                }}
                              >
                                {submissionResult.feedback
                                  ?.split('\n')
                                  .map((line, index) => (
                                    <p
                                      key={index}
                                      className={
                                        line.trim() === '' ? 'mb-4' : 'mb-2'
                                      }
                                    >
                                      {line}
                                    </p>
                                  ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Submission Links */}
                        {(submissionResult?.githubRepo ||
                          submissionResult?.githubLive) && (
                          <div className="rounded-lg border p-4">
                            <h4 className="font-medium mb-3">
                              Your Submission
                            </h4>
                            <div className="space-y-2">
                              {submissionResult?.githubRepo && (
                                <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                                  <div className="flex items-center gap-2">
                                    <Github className="h-4 w-4" />
                                    <span className="text-sm font-medium">
                                      Repository
                                    </span>
                                  </div>
                                  <a
                                    href={submissionResult.githubRepo}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-primary hover:underline flex items-center gap-1"
                                  >
                                    View Code
                                    <ArrowRight className="h-3 w-3" />
                                  </a>
                                </div>
                              )}
                              {submissionResult?.githubLive && (
                                <div className="flex items-center justify-between p-2 rounded bg-muted/50">
                                  <div className="flex items-center gap-2">
                                    <Globe className="h-4 w-4" />
                                    <span className="text-sm font-medium">
                                      Live Demo
                                    </span>
                                  </div>
                                  <a
                                    href={submissionResult.githubLive}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-primary hover:underline flex items-center gap-1"
                                  >
                                    View Demo
                                    <ArrowRight className="h-3 w-3" />
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
              </div>
            )}

            {submissionResult?.code && (
              <div className="rounded-lg border overflow-hidden">
                <div className="bg-muted px-4 py-2 text-sm font-medium border-b">
                  Submitted Code
                </div>
                <pre className="p-4 text-sm overflow-auto max-h-[300px] bg-muted/50">
                  <code>{submissionResult.code}</code>
                </pre>
              </div>
            )}

            {/* Show a refresh button if not graded yet */}
            {/* {!isGraded && (
              <div className="text-center">
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                  disabled={isLoading}
                >
                  {isLoading ? 'Refreshing...' : 'Check Grading Status'}
                </Button>
              </div>
            )} */}
          </CardContent>
        </Card>
      </div>
    )
  }

  // Rest of your existing component for new submissions...
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg font-semibold leading-tight">
                {assignment?.title}
              </CardTitle>
              <CardDescription className="mt-2 text-sm">
                {assignment?.description}
              </CardDescription>
            </div>
            <div className="flex flex-col gap-2 flex-shrink-0">
              <Badge
                variant={isExpired ? 'destructive' : 'outline'}
                className="flex items-center gap-1.5 px-2.5 py-1"
              >
                <Clock className="h-3 w-3" />
                {isExpired ? 'Expired' : 'Active'}
              </Badge>
              <Badge
                variant="secondary"
                className="flex items-center gap-1.5 px-2.5 py-1"
              >
                <Trophy className="h-3 w-3" />
                <span className="font-medium">{assignment?.score}</span>
                <span className="text-xs opacity-80">points</span>
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-1">
              <h3 className="text-sm font-medium">Due Date</h3>
              <div className="flex items-center text-sm text-muted-foreground">
                <CalendarIcon className="h-4 w-4 mr-2" />
                {assignment?.dueDate
                  ? formatExpiryDate(assignment?.dueDate)
                  : 'No due date set'}
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-medium">Submission Types</h3>
              <div className="flex gap-3 text-sm text-muted-foreground">
                {submissionTypes.includes('repo') && (
                  <div className="flex items-center gap-1">
                    <Github className="h-4 w-4" />
                    Repository
                  </div>
                )}
                {submissionTypes.includes('live') && (
                  <div className="flex items-center gap-1">
                    <Globe className="h-4 w-4" />
                    Live Demo
                  </div>
                )}
                {submissionTypes.includes('code') && (
                  <div className="flex items-center gap-1">
                    <Code className="h-4 w-4" />
                    Code
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Requirements</h3>
            <div className="grid gap-2">
              {assignment?.requirements?.map((req, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 rounded-lg border p-3 bg-muted/50"
                >
                  <div className="h-5 w-5 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                    {index + 1}
                  </div>
                  <p className="text-sm">{req.instruction}</p>
                </div>
              )) || []}
            </div>
          </div>

          {!showSubmissionForm ? (
            <Button
              onClick={() => setShowSubmissionForm(true)}
              className="w-full"
              disabled={isExpired}
            >
              Submit Assignment
            </Button>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="rounded-lg border">
                {/* Only show tabs if there are multiple submission types */}
                {submissionTypes.length > 1 ? (
                  <Tabs defaultValue={submissionTypes[0]}>
                    <div className="border-b bg-muted/50 px-3">
                      <TabsList className="w-full justify-start rounded-none border-b-0 bg-transparent p-0">
                        {submissionTypes.includes('repo') && (
                          <TabsTrigger
                            value="repo"
                            className="relative rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                          >
                            GitHub Submission
                          </TabsTrigger>
                        )}
                        {submissionTypes.includes('code') && (
                          <TabsTrigger
                            value="code"
                            className="relative rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                          >
                            Code Submission
                          </TabsTrigger>
                        )}
                      </TabsList>
                    </div>
                    <div className="p-4">
                      {submissionTypes.includes('repo') && (
                        <TabsContent value="repo" className="mt-0 border-0 p-0">
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="github-repo">
                                GitHub Repository URL *
                              </Label>
                              <div className="flex items-center space-x-2">
                                <Github className="h-4 w-4 text-muted-foreground" />
                                <Input
                                  id="github-repo"
                                  placeholder="https://github.com/yourusername/your-repo"
                                  value={githubRepo}
                                  onChange={(e) =>
                                    setGithubRepo(e.target.value)
                                  }
                                  required
                                />
                              </div>
                            </div>

                            {submissionTypes.includes('live') && (
                              <div className="space-y-2">
                                <Label htmlFor="github-live">
                                  Live Demo URL *
                                </Label>
                                <div className="flex items-center space-x-2">
                                  <Globe className="h-4 w-4 text-muted-foreground" />
                                  <Input
                                    id="github-live"
                                    placeholder="https://your-project.vercel.app"
                                    value={live}
                                    onChange={(e) => setLive(e.target.value)}
                                    required
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </TabsContent>
                      )}

                      {submissionTypes.includes('code') && (
                        <TabsContent value="code" className="mt-0 border-0 p-0">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="code-editor">
                                Code Submission *
                              </Label>
                              <div className="flex items-center gap-2">
                                <Label
                                  htmlFor="language-select"
                                  className="text-sm"
                                >
                                  Language:
                                </Label>
                                <Select
                                  value={codeLanguage}
                                  onValueChange={setCodeLanguage}
                                >
                                  <SelectTrigger className="w-40">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {languageOptions.map((lang) => (
                                      <SelectItem
                                        key={lang.value}
                                        value={lang.value}
                                      >
                                        {lang.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            <div className="border rounded-lg overflow-hidden">
                              <Editor
                                height="400px"
                                language={codeLanguage}
                                value={code}
                                onChange={(value) => setCode(value || '')}
                                theme="vs-dark"
                                options={{
                                  minimap: { enabled: false },
                                  fontSize: 14,
                                  padding: { top: 16, bottom: 16 },
                                  lineNumbers: 'on',
                                  roundedSelection: false,
                                  scrollBeyondLastLine: false,
                                  automaticLayout: true,
                                  tabSize: 2,
                                  wordWrap: 'on',
                                  bracketPairColorization: { enabled: true },
                                  formatOnPaste: true,
                                  formatOnType: true,
                                }}
                              />
                            </div>
                          </div>
                        </TabsContent>
                      )}
                    </div>
                  </Tabs>
                ) : (
                  // Single submission type - no tabs needed
                  <div className="p-4">
                    {submissionTypes.includes('repo') && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="github-repo">
                            GitHub Repository URL *
                          </Label>
                          <div className="flex items-center space-x-2">
                            <Github className="h-4 w-4 text-muted-foreground" />
                            <Input
                              id="github-repo"
                              placeholder="https://github.com/yourusername/your-repo"
                              value={githubRepo}
                              onChange={(e) => setGithubRepo(e.target.value)}
                              required
                            />
                          </div>
                        </div>

                        {submissionTypes.includes('live') && (
                          <div className="space-y-2">
                            <Label htmlFor="github-live">Live Demo URL *</Label>
                            <div className="flex items-center space-x-2">
                              <Globe className="h-4 w-4 text-muted-foreground" />
                              <Input
                                id="github-live"
                                placeholder="https://your-project.vercel.app"
                                value={live}
                                onChange={(e) => setLive(e.target.value)}
                                required
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {submissionTypes.includes('code') &&
                      !submissionTypes.includes('repo') && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="code-editor">
                              Code Submission *
                            </Label>
                            <div className="flex items-center gap-2">
                              <Label
                                htmlFor="language-select"
                                className="text-sm"
                              >
                                Language:
                              </Label>
                              <Select
                                value={codeLanguage}
                                onValueChange={setCodeLanguage}
                              >
                                <SelectTrigger className="w-40">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {languageOptions.map((lang) => (
                                    <SelectItem
                                      key={lang.value}
                                      value={lang.value}
                                    >
                                      {lang.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="border rounded-lg overflow-hidden">
                            <Editor
                              height="400px"
                              language={codeLanguage}
                              value={code}
                              onChange={(value) => setCode(value || '')}
                              theme="vs-dark"
                              options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                padding: { top: 16, bottom: 16 },
                                lineNumbers: 'on',
                                roundedSelection: false,
                                scrollBeyondLastLine: false,
                                automaticLayout: true,
                                tabSize: 2,
                                wordWrap: 'on',
                                bracketPairColorization: { enabled: true },
                                formatOnPaste: true,
                                formatOnType: true,
                              }}
                            />
                          </div>
                        </div>
                      )}
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowSubmissionForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Submitting...
                    </div>
                  ) : (
                    'Submit Assignment'
                  )}
                </Button>
              </div>

              {isExpired && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertTitle>Submission Closed</AlertTitle>
                  <AlertDescription>
                    This assignment has expired and can no longer be submitted.
                  </AlertDescription>
                </Alert>
              )}
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

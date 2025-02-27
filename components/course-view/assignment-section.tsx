'use client'

import * as React from 'react'
import type { Assignment } from './types/course'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
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
  ArrowRight,
  XCircle,
} from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface AssignmentSectionProps {
  assignment: Assignment
}

export function AssignmentSection({ assignment }: AssignmentSectionProps) {
  const [showSubmissionForm, setShowSubmissionForm] = React.useState(false)
  const [submissionType, setSubmissionType] = React.useState<'github' | 'code'>(
    'github'
  )
  const [githubRepo, setGithubRepo] = React.useState(
    assignment.submission?.githubRepo || ''
  )
  const [githubLive, setGithubLive] = React.useState(
    assignment.submission?.githubLive || ''
  )
  const [code, setCode] = React.useState(assignment.submission?.code || '')
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isSubmitted, setIsSubmitted] = React.useState(
    assignment.status !== 'pending'
  )
  const [submissionResult, setSubmissionResult] = React.useState<
    Assignment['submission']
  >(assignment.submission || {})
  const [score, setScore] = React.useState<number | undefined>(assignment.score)

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

  // Check if assignment is expired
  const isExpired = new Date(assignment.expiryDate) < new Date()

  // Handle submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      const submission = {
        githubRepo: submissionType === 'github' ? githubRepo : undefined,
        githubLive: submissionType === 'github' ? githubLive : undefined,
        code: submissionType === 'code' ? code : undefined,
        submittedAt: new Date().toISOString(),
      }

      setSubmissionResult(submission)
      setScore(Math.floor(Math.random() * 30) + 70) // Random score between 70-100
      setIsSubmitted(true)
      setIsSubmitting(false)
      setShowSubmissionForm(false)
    }, 1500)
  }

  if (isSubmitted) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{assignment.title}</CardTitle>
                <CardDescription className="mt-2">
                  {assignment.description}
                </CardDescription>
              </div>
              <Badge variant="default" className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Submitted
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertTitle>Assignment Submitted Successfully</AlertTitle>
              <AlertDescription>
                Your work has been submitted and is now being reviewed.
              </AlertDescription>
            </Alert>

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
                      <span className="text-2xl font-bold text-primary">
                        {score}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        / {assignment.totalScore}
                      </span>
                    </div>
                  </div>
                  {score !== undefined && (
                    <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-500 ease-in-out"
                        style={{
                          width: `${(score / assignment.totalScore) * 100}%`,
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

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
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{assignment.title}</CardTitle>
              <CardDescription className="mt-2">
                {assignment.description}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={isExpired ? 'destructive' : 'outline'}
                className="flex items-center gap-1"
              >
                <Clock className="h-3 w-3" />
                {isExpired ? 'Expired' : 'Active'}
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Trophy className="h-3 w-3" />
                {assignment.totalScore} points
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
                {formatExpiryDate(assignment.expiryDate)}
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-medium">Submission Types</h3>
              <div className="flex gap-3 text-sm text-muted-foreground">
                {assignment.submissionTypes.githubRepo && (
                  <div className="flex items-center gap-1">
                    <Github className="h-4 w-4" />
                    Repository
                  </div>
                )}
                {assignment.submissionTypes.githubLive && (
                  <div className="flex items-center gap-1">
                    <Globe className="h-4 w-4" />
                    Live Demo
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">Requirements</h3>
            <div className="grid gap-2">
              {assignment.requirements.map((req, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 rounded-lg border p-3 bg-muted/50"
                >
                  <div className="h-5 w-5 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                    {index + 1}
                  </div>
                  <p className="text-sm">{req}</p>
                </div>
              ))}
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
                <Tabs
                  defaultValue="github"
                  onValueChange={(v) =>
                    setSubmissionType(v as 'github' | 'code')
                  }
                >
                  <div className="border-b bg-muted/50 px-3">
                    <TabsList className="w-full justify-start rounded-none border-b-0 bg-transparent p-0">
                      <TabsTrigger
                        value="github"
                        className="relative rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                      >
                        GitHub Submission
                      </TabsTrigger>
                      <TabsTrigger
                        value="code"
                        className="relative rounded-none border-b-2 border-b-transparent bg-transparent px-4 pb-3 pt-2 font-semibold text-muted-foreground shadow-none transition-none data-[state=active]:border-b-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                      >
                        Code Submission
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  <div className="p-4">
                    <TabsContent value="github" className="mt-0 border-0 p-0">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="github-repo">
                            GitHub Repository URL
                          </Label>
                          <div className="flex items-center space-x-2">
                            <Github className="h-4 w-4 text-muted-foreground" />
                            <Input
                              id="github-repo"
                              placeholder="https://github.com/yourusername/your-repo"
                              value={githubRepo}
                              onChange={(e) => setGithubRepo(e.target.value)}
                              required={submissionType === 'github'}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="github-live">
                            Live Demo URL (GitHub Pages, Vercel, etc.)
                          </Label>
                          <div className="flex items-center space-x-2">
                            <Globe className="h-4 w-4 text-muted-foreground" />
                            <Input
                              id="github-live"
                              placeholder="https://your-project.vercel.app"
                              value={githubLive}
                              onChange={(e) => setGithubLive(e.target.value)}
                              required={submissionType === 'github'}
                            />
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                    <TabsContent value="code" className="mt-0 border-0 p-0">
                      <div className="space-y-2">
                        <Label htmlFor="code-editor">Code Submission</Label>
                        <Textarea
                          id="code-editor"
                          placeholder="Paste your code here..."
                          className="font-mono h-[300px]"
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                          required={submissionType === 'code'}
                        />
                      </div>
                    </TabsContent>
                  </div>
                </Tabs>
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
                  {isSubmitting ? 'Submitting...' : 'Submit'}
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

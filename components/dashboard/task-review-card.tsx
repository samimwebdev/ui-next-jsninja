'use client'

import { useState } from 'react'
import { TaskSubmission } from '@/types/task-submission-types'
import { updateTaskReview } from '@/lib/actions/task-review-actions'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Calendar,
  User,
  Mail,
  BookOpen,
  ExternalLink,
  Github,
  Globe,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface TaskReviewCardProps {
  task: TaskSubmission
  onUpdate: (updatedTask: TaskSubmission) => void
}

export function TaskReviewCard({ task, onUpdate }: TaskReviewCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [score, setScore] = useState(
    task.resultScore?.toString() || task.assignment.score.toString()
  )
  const [feedback, setFeedback] = useState(task.feedback || '')

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)

      const scoreNumber = parseFloat(score)
      if (isNaN(scoreNumber) || scoreNumber < 0 || scoreNumber > 100) {
        toast.error('Score must be between 0 and 100')
        return
      }

      if (!feedback.trim()) {
        toast.error('Feedback is required')
        return
      }

      const response = await updateTaskReview(task.documentId, {
        score: scoreNumber,
        feedback: feedback.trim(),
      })

      onUpdate(response.data)
      setIsEditing(false)
      toast.success('Task is Reviewed successfully')
    } catch (error) {
      console.error('Failed to submit review:', error)
      toast.error(
        error instanceof Error ? error.message : 'Failed to submit review'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      submitted: { variant: 'secondary' as const, icon: Clock },
      graded: { variant: 'default' as const, icon: CheckCircle2 },
      pending: { variant: 'outline' as const, icon: AlertCircle },
      rejected: { variant: 'destructive' as const, icon: XCircle },
    }

    const config = variants[status as keyof typeof variants] || variants.pending
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const isDueDatePassed = new Date(task.assignment.dueDate) < new Date()

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="overflow-hidden">
        <CollapsibleTrigger className="w-full text-left hover:bg-muted/50 transition-colors">
          <CardHeader className="bg-gradient-to-r from-muted/50 to-background">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex items-start gap-2">
                  <div className="mt-1 flex-shrink-0">
                    {isOpen ? (
                      <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-xl truncate">
                      {task.assignment.title}
                    </CardTitle>
                    <CardDescription className="flex flex-wrap items-center gap-2 text-sm mt-2">
                      <span className="flex items-center gap-1">
                        <User className="h-3.5 w-3.5" />
                        {task.user.username}
                      </span>
                      <span className="hidden sm:inline">•</span>
                      <span className="flex items-center gap-1 truncate">
                        <Mail className="h-3.5 w-3.5" />
                        {task.user.email}
                      </span>
                    </CardDescription>

                    {/* Quick info - visible when collapsed */}
                    {!isOpen && (
                      <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(task.submittedDate), 'MMM dd')}
                        </span>
                        {task.resultScore !== null && (
                          <span className="font-medium text-success">
                            Score: {task.resultScore}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {getStatusBadge(task.submissionStatus)}
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-6 pt-6">
            {/* Task Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <span className="text-muted-foreground">Submitted:</span>
                  <span className="ml-2 font-medium">
                    {format(new Date(task.submittedDate), 'MMM dd, yyyy')}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar
                  className={cn(
                    'h-4 w-4',
                    isDueDatePassed
                      ? 'text-destructive'
                      : 'text-muted-foreground'
                  )}
                />
                <div>
                  <span className="text-muted-foreground">Due Date:</span>
                  <span
                    className={cn(
                      'ml-2 font-medium',
                      isDueDatePassed && 'text-destructive'
                    )}
                  >
                    {format(new Date(task.assignment.dueDate), 'MMM dd, yyyy')}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <div>
                  <span className="text-muted-foreground">Max Score:</span>
                  <span className="ml-2 font-medium">
                    {task.assignment.score} points
                  </span>
                </div>
              </div>

              {task.resultScore !== null && (
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <div>
                    <span className="text-muted-foreground">Score:</span>
                    <span className="ml-2 font-medium text-success">
                      {task.resultScore} points
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Task Description</Label>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {task.assignment.description}
              </p>
            </div>

            {/* Submission Links */}
            {(task.repoLink || task.liveLink || task.code) && (
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Submission</Label>
                <div className="flex flex-wrap gap-2">
                  {task.repoLink && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="gap-2"
                    >
                      <a
                        href={task.repoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Github className="h-4 w-4" />
                        Repository
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  )}
                  {task.liveLink && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="gap-2"
                    >
                      <a
                        href={task.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Globe className="h-4 w-4" />
                        Live Demo
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Review Section */}
            {isEditing ? (
              <div className="space-y-4 border-t pt-4">
                <div className="space-y-2">
                  <Label htmlFor={`score-${task.documentId}`}>
                    Score (0-100)
                  </Label>
                  <Input
                    id={`score-${task.documentId}`}
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    placeholder="Enter score"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`feedback-${task.documentId}`}>
                    Feedback
                  </Label>
                  <Textarea
                    id={`feedback-${task.documentId}`}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Provide detailed feedback for the student..."
                    rows={4}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
            ) : (
              task.feedback && (
                <div className="space-y-2 border-t pt-4">
                  <Label className="text-sm font-semibold">Feedback</Label>
                  <p className="text-sm text-muted-foreground leading-relaxed bg-muted/50 p-4 rounded-lg">
                    {task.feedback}
                  </p>
                </div>
              )
            )}
          </CardContent>

          <CardFooter className="bg-muted/30 flex flex-col sm:flex-row gap-2">
            {isEditing ? (
              <>
                <Button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleSubmit()
                  }}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-gradient-ninja-primary hover:bg-gradient-ninja-reverse text-ninja-navy"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Review'}
                </Button>
                <Button
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsEditing(false)
                    setScore(
                      task.resultScore?.toString() ||
                        task.assignment.score.toString()
                    )
                    setFeedback(task.feedback || '')
                  }}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  setIsEditing(true)
                }}
                variant="outline"
                className="w-full sm:w-auto"
              >
                {task.submissionStatus === 'graded'
                  ? 'Edit Review'
                  : 'Review Task'}
              </Button>
            )}
          </CardFooter>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}

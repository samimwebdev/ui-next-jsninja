'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import type { QuizQuestion } from '@/types/course-view-types'
import { QuizDialog } from './quiz-dialog'

interface QuizSectionProps {
  quizQuestions: QuizQuestion[]
}

export function QuizSection({ quizQuestions }: QuizSectionProps) {
  const [quizOpen, setQuizOpen] = React.useState(false)
  const [quizCompleted, setQuizCompleted] = React.useState(false)
  const [quizScore, setQuizScore] = React.useState<number | null>(null)

  /* eslint-disable @typescript-eslint/no-unused-vars */
  const handleQuizComplete = (score: number) => {
    setQuizCompleted(true)
    setQuizScore(score)
  }

  return (
    <div className="space-y-6">
      {!quizCompleted ? (
        <div className="text-center p-6">
          <h3 className="text-lg font-medium mb-2">
            Ready to test your knowledge?
          </h3>
          <p className="text-muted-foreground mb-4">
            Take a quiz to check your understanding of the concepts covered in
            this lesson.
          </p>
          <Button
            onClick={() => setQuizOpen(true)}
            className="w-full sm:w-auto"
          >
            Start Quiz
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-6 rounded-lg border">
            <div className="flex flex-col items-center gap-4">
              <div className="text-5xl font-bold text-primary">
                {Math.round((quizScore! / quizQuestions.length) * 100)}%
              </div>
              <div className="text-center">
                <p className="text-lg font-medium">
                  {quizScore} correct answers out of {quizQuestions.length}{' '}
                  questions
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {quizScore === quizQuestions.length
                    ? "Excellent! You've mastered this topic!"
                    : quizScore! >= quizQuestions.length * 0.7
                    ? 'Good job! Keep practicing to improve further.'
                    : 'Keep learning! Review the material and try again.'}
                </p>
              </div>
              <div className="w-full max-w-xs bg-muted rounded-lg p-4 mt-2">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Accuracy</span>
                    <span>
                      {Math.round((quizScore! / quizQuestions.length) * 100)}%
                    </span>
                  </div>
                  <Progress
                    value={(quizScore! / quizQuestions.length) * 100}
                    className="h-2"
                  />
                </div>
              </div>
            </div>
          </div>
          <Button
            onClick={() => setQuizOpen(true)}
            className="w-full"
            variant="outline"
          >
            View Detailed Results
          </Button>
        </div>
      )}
      <QuizDialog
        open={quizOpen}
        onOpenChange={setQuizOpen}
        questions={quizQuestions || []}
      />
    </div>
  )
}

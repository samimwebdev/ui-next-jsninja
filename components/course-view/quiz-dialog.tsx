'use client'

import * as React from 'react'
import { X, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog'
import type { QuizQuestion, QuizState, QuizStorageData } from './types/course'

interface QuizDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  questions: QuizQuestion[]
}

export function QuizDialog({ open, onOpenChange, questions }: QuizDialogProps) {
  const [quizState, setQuizState] = React.useState<QuizState>('intro')
  const [currentQuestion, setCurrentQuestion] = React.useState(0)
  const [score, setScore] = React.useState(0)
  const [answers, setAnswers] = React.useState<Record<number, number[]>>({})
  const [multipleChoiceSelections, setMultipleChoiceSelections] =
    React.useState<Record<number, boolean[]>>({})
  const [visitedQuestions, setVisitedQuestions] = React.useState<number[]>([])
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [quizSubmitted, setQuizSubmitted] = React.useState(false)

  // Local storage key for this quiz
  const storageKey = 'course_quiz_data'

  // Load quiz data from localStorage on initial render
  React.useEffect(() => {
    if (open) {
      try {
        const savedData = localStorage.getItem(storageKey)
        if (savedData) {
          const parsedData: QuizStorageData = JSON.parse(savedData)

          // Only restore if it's the same quiz (based on first question)
          if (questions.length > 0) {
            setAnswers(parsedData.answers || {})
            setCurrentQuestion(parsedData.currentQuestion || 0)
            setQuizState(parsedData.quizState || 'intro')
            setVisitedQuestions(parsedData.visitedQuestions || [])

            // Initialize multiple choice selections from answers
            const mcSelections: Record<number, boolean[]> = {}
            Object.entries(parsedData.answers).forEach(([qId, answer]) => {
              const questionId = Number.parseInt(qId)
              const question = questions.find((q) => q.id === questionId)

              if (question?.type === 'multiple' && Array.isArray(answer)) {
                const selections = new Array(question.options.length).fill(
                  false
                )
                answer.forEach((idx) => {
                  selections[idx] = true
                })
                mcSelections[questionId] = selections
              }
            })
            setMultipleChoiceSelections(mcSelections)
          }
        }
      } catch (error) {
        console.error('Error loading quiz data from localStorage:', error)
      }
    }
  }, [open, questions])

  // Save quiz data to localStorage whenever relevant state changes
  React.useEffect(() => {
    if (open && quizState !== 'results') {
      try {
        const dataToSave: QuizStorageData = {
          lessonId: 'current_lesson', // You could pass the actual lessonId as a prop
          answers,
          currentQuestion,
          quizState,
          visitedQuestions,
        }
        localStorage.setItem(storageKey, JSON.stringify(dataToSave))
      } catch (error) {
        console.error('Error saving quiz data to localStorage:', error)
      }
    }
  }, [open, answers, currentQuestion, quizState, visitedQuestions])

  const startQuiz = () => {
    setQuizState('question')
    setVisitedQuestions([0])
  }

  const handleMultipleAnswer = (
    questionId: number,
    optionIndex: number,
    checked: boolean
  ) => {
    // Initialize selections array if it doesn't exist
    if (!multipleChoiceSelections[questionId]) {
      const initialSelections = new Array(
        questions.find((q) => q.id === questionId)?.options.length || 0
      ).fill(false)
      setMultipleChoiceSelections((prev) => ({
        ...prev,
        [questionId]: initialSelections,
      }))
    }

    // Update selections
    setMultipleChoiceSelections((prev) => {
      const updatedSelections = [...(prev[questionId] || [])]
      updatedSelections[optionIndex] = checked
      return {
        ...prev,
        [questionId]: updatedSelections,
      }
    })

    // Update answers based on selections
    setAnswers((prev) => {
      const currentSelections = [
        ...(multipleChoiceSelections[questionId] || []),
      ]
      currentSelections[optionIndex] = checked

      const selectedIndices = currentSelections
        .map((selected, index) => (selected ? index : -1))
        .filter((index) => index !== -1)

      return {
        ...prev,
        [questionId]: selectedIndices,
      }
    })
  }

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  const goToNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      const nextQuestion = currentQuestion + 1
      setCurrentQuestion(nextQuestion)

      // Add to visited questions if not already there
      if (!visitedQuestions.includes(nextQuestion)) {
        setVisitedQuestions((prev) => [...prev, nextQuestion])
      }
    }
  }

  const submitQuiz = () => {
    setQuizState('results')
    setQuizSubmitted(true)

    // Calculate score
    let totalScore = 0

    questions.forEach((question) => {
      const userAnswer = answers[question.id]

      if (
        question.type === 'multiple' &&
        Array.isArray(userAnswer) &&
        Array.isArray(question.correctAnswer)
      ) {
        // For multiple choice, check if arrays have the same values (order doesn't matter)
        const correctSet = new Set(question.correctAnswer)
        const userSet = new Set(userAnswer)

        if (
          correctSet.size === userSet.size &&
          [...correctSet].every((value) => userSet.has(value))
        ) {
          totalScore += 1
        }
      }
    })

    setScore(totalScore)

    // Clear localStorage when quiz is submitted
    localStorage.removeItem(storageKey)
  }

  const handleOpenChange = (open: boolean) => {
    // // Only allow closing via the close button
    // if (open === false) {
    //   return
    // }
    onOpenChange(open)
  }

  const isQuestionAnswered = (questionId: number) => {
    return answers[questionId] !== undefined
  }

  const renderQuestionContent = () => {
    const question = questions[currentQuestion]

    if (!question) return null

    return (
      <>
        <h3 className="text-lg font-medium mb-4">{question.question}</h3>

        <div className="space-y-3">
          {question.options.map((option, index) => {
            const isChecked =
              multipleChoiceSelections[question.id]?.[index] || false

            return (
              <div
                key={index}
                className="flex items-center space-x-2 rounded-md border p-3 hover:bg-accent"
              >
                <Checkbox
                  id={`q${question.id}-option-${index}`}
                  checked={isChecked}
                  onCheckedChange={(checked) =>
                    handleMultipleAnswer(question.id, index, checked === true)
                  }
                />
                <Label
                  htmlFor={`q${question.id}-option-${index}`}
                  className="flex-grow cursor-pointer"
                >
                  {option}
                </Label>
              </div>
            )
          })}
        </div>
      </>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="sm:max-w-[600px]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogClose asChild className="absolute right-4 top-4">
          {/* <button className="text-gray-500 hover:text-gray-700">
            <CircleX className="w-6 h-6" />
          </button> */}
        </DialogClose>

        {quizState === 'intro' && (
          <>
            <DialogHeader>
              <DialogTitle>Module Quiz</DialogTitle>
              <DialogDescription>
                Test your knowledge of the concepts covered in this module
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <h4 className="font-medium">Quiz Rules:</h4>
                <ul className="list-disc pl-4 space-y-1 text-sm text-muted-foreground">
                  <li>Each correct answer is worth 1 point</li>
                  <li>No points are deducted for wrong answers</li>
                  <li>You can navigate between questions before submitting</li>
                  <li>Your progress will be saved if you leave and return</li>
                  <li>Total questions: {questions.length}</li>
                </ul>
              </div>
              <Button onClick={startQuiz} className="w-full">
                Start Quiz
              </Button>
            </div>
          </>
        )}

        {quizState === 'question' && (
          <>
            <DialogHeader>
              <div className="flex justify-between items-center">
                <DialogTitle>
                  Question {currentQuestion + 1} of {questions.length}
                </DialogTitle>
              </div>
              <Progress
                value={(currentQuestion / questions.length) * 100}
                className="h-2 mt-2"
              />
            </DialogHeader>

            <div className="space-y-4 py-4">{renderQuestionContent()}</div>

            <div className="flex justify-between mt-4">
              <Button
                variant="outline"
                onClick={goToPreviousQuestion}
                disabled={currentQuestion === 0}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>

              <div className="flex gap-2">
                {currentQuestion < questions.length - 1 ? (
                  <Button variant="default" onClick={goToNextQuestion}>
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    onClick={submitQuiz}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Submit Quiz
                  </Button>
                )}
              </div>
            </div>

            {/* Question navigation dots */}
            <div className="flex justify-center gap-2 mt-4">
              {questions.map((_, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="icon"
                  className={cn(
                    'h-8 w-8 rounded-full',
                    currentQuestion === index &&
                      'bg-primary text-primary-foreground',
                    isQuestionAnswered(questions[index].id) &&
                      currentQuestion !== index &&
                      'bg-green-100 text-green-600',
                    visitedQuestions.includes(index) &&
                      !isQuestionAnswered(questions[index].id) &&
                      currentQuestion !== index &&
                      'bg-amber-100 text-amber-600'
                  )}
                  onClick={() => {
                    setCurrentQuestion(index)
                    if (!visitedQuestions.includes(index)) {
                      setVisitedQuestions((prev) => [...prev, index])
                    }
                  }}
                >
                  {index + 1}
                </Button>
              ))}
            </div>
          </>
        )}

        {quizState === 'results' && (
          <>
            <DialogHeader>
              <DialogTitle>Quiz Results</DialogTitle>
              <DialogDescription>
                You scored {score} out of {questions.length}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="p-6 rounded-lg bg-muted/50 border">
                <div className="flex flex-col items-center justify-center gap-4">
                  <div className="relative">
                    <svg className="w-24 h-24">
                      <circle
                        className="text-muted stroke-current"
                        strokeWidth="5"
                        stroke="currentColor"
                        fill="transparent"
                        r="45"
                        cx="50%"
                        cy="50%"
                      />
                      <circle
                        className="text-primary stroke-current"
                        strokeWidth="5"
                        strokeDasharray={2 * Math.PI * 45}
                        strokeDashoffset={
                          2 * Math.PI * 45 * (1 - score / questions.length)
                        }
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="45"
                        cx="50%"
                        cy="50%"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold">
                        {Math.round((score / questions.length) * 100)}%
                      </span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-medium">
                      {score} correct answers out of {questions.length}{' '}
                      questions
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {score === questions.length
                        ? "Excellent! You've mastered this topic!"
                        : score >= questions.length * 0.7
                        ? 'Good job! Keep practicing to improve further.'
                        : 'Keep learning! Review the material and try again.'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 border rounded-lg p-4">
                <h3 className="font-medium text-lg mb-2">Question Details</h3>
                {questions.map((question, index) => {
                  const userAnswer = answers[question.id]
                  let isCorrect = false

                  if (
                    question.type === 'multiple' &&
                    Array.isArray(userAnswer) &&
                    Array.isArray(question.correctAnswer)
                  ) {
                    const correctSet = new Set(question.correctAnswer)
                    const userSet = new Set(userAnswer)

                    isCorrect =
                      correctSet.size === userSet.size &&
                      [...correctSet].every((value) => userSet.has(value))
                  }

                  return (
                    <div key={index} className="space-y-2 border-b pb-4">
                      <div className="flex items-start gap-2">
                        {isCorrect ? (
                          <div className="bg-green-100 dark:bg-green-900/30 rounded-full p-1 mt-0.5">
                            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                          </div>
                        ) : (
                          <div className="bg-red-100 dark:bg-red-900/30 rounded-full p-1 mt-0.5">
                            <X className="h-4 w-4 text-red-600 dark:text-red-400" />
                          </div>
                        )}
                        <div>
                          <h4 className="font-medium">Question {index + 1}</h4>
                          <p className="text-sm text-muted-foreground">
                            {question.question}
                          </p>

                          <div className="mt-2 text-sm">
                            <span className="font-medium">Your answers: </span>
                            {Array.isArray(userAnswer) &&
                            userAnswer.length > 0 ? (
                              <ul className="list-disc pl-5 mt-1 space-y-1">
                                {(userAnswer as number[]).map((index) => (
                                  <li
                                    key={index}
                                    className={cn(
                                      Array.isArray(question.correctAnswer) &&
                                        question.correctAnswer.includes(index)
                                        ? 'text-green-600 dark:text-green-400'
                                        : 'text-red-600 dark:text-red-400'
                                    )}
                                  >
                                    {question.options[index]}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <span className="text-red-600 dark:text-red-400">
                                No answers selected
                              </span>
                            )}
                          </div>
                          {!isCorrect && (
                            <div className="mt-2 text-sm">
                              <span className="font-medium">
                                Correct answers:
                              </span>
                              <ul className="list-disc pl-5 mt-1 space-y-1 text-green-600 dark:text-green-400">
                                {Array.isArray(question.correctAnswer) &&
                                  question.correctAnswer.map((index) => (
                                    <li key={index}>
                                      {question.options[index]}
                                    </li>
                                  ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              <Button onClick={() => onOpenChange(false)} className="w-full">
                Close
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

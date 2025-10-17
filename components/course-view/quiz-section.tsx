'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQuizSubmission } from '@/hooks/use-quiz-submission'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { motion, AnimatePresence } from 'framer-motion'
import { NotebookPen, CheckCircle, XCircle, Clock } from 'lucide-react'
import { isAuthenticated } from '@/lib/auth'
import { toast } from 'sonner'
import {
  calculateQuizPercentage,
  getOptionTextById,
  getQuizStatusMessage,
} from '@/lib/utils'

// Import types
import type {
  CourseQuiz,
  CourseQuizSubmissionResponse,
} from '@/types/course-quiz-types'

// Import sub-components
import CourseQuizInstructions from './course-quiz-instructions'
import CourseQuizQuestion from './course-quiz-question'
import CourseQuizResults from '../shared/quiz/course-quiz-results'

interface QuizSectionProps {
  quiz: CourseQuiz | null
  courseSlug: string
  lessonDocumentId: string
  moduleDocumentId: string
}

export function QuizSection({
  quiz,
  courseSlug,
  lessonDocumentId,
  moduleDocumentId,
}: QuizSectionProps) {
  const router = useRouter()

  // Use React Query hook - no token needed
  const {
    existingSubmission,
    isLoading,
    isError,
    submitQuiz,
    isSubmitting,
    submitError,
  } = useQuizSubmission({
    quizId: quiz?.documentId || null,
    courseSlug,
    moduleDocumentId,
    lessonDocumentId,
  })

  // Use dynamic data or fallback
  const quizData = quiz || {
    id: 0,
    documentId: '',
    title: 'Lesson Quiz',
    instructions: 'Please complete this quiz to test your understanding.',
    passingScore: 70,
    questions: [],
  }

  // Memoize questions to prevent dependency issues
  const questions = useMemo(() => {
    return quizData.questions || []
  }, [quizData.questions])

  const [showInstructions, setShowInstructions] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[][]>(
    Array(questions.length).fill([])
  )
  const [showResults, setShowResults] = useState(false)
  const [timeLeft, setTimeLeft] = useState(questions[0]?.timeLimit || 60)
  const [isQuizStarted, setIsQuizStarted] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [submissionResults, setSubmissionResults] =
    useState<CourseQuizSubmissionResponse | null>(null)

  // Convert existing submission to result format if it exists
  useEffect(() => {
    if (existingSubmission && questions.length > 0) {
      const totalPoints = existingSubmission?.answers?.reduce((sum, answer) => {
        const question = questions.find(
          (q) => q.documentId === answer.questionId
        )
        return sum + (question?.points || 1)
      }, 0)

      const convertedResults: CourseQuizSubmissionResponse = {
        score: existingSubmission.score,
        totalScore: totalPoints,
        percentage: calculateQuizPercentage(
          existingSubmission.score,
          existingSubmission.answers,
          questions
        ),
        passed: existingSubmission.passed,
        answers: existingSubmission.answers.map((answer) => ({
          questionId: answer.questionId,
          correct: answer.correct,
          selectedAnswers: answer.userAnswer,
          correctAnswers: answer.correctAnswers,
          points: answer.points,
          explanation: answer.explanation || '',
        })),
      }

      setSubmissionResults(convertedResults)
    }
  }, [existingSubmission, questions])

  // Helper function to get selected option texts for display
  const getSelectedOptionTexts = (questionIndex: number) => {
    const selectedIds = answers[questionIndex] || []
    const question = questions[questionIndex]
    if (!question) return []

    return selectedIds.map((id) => getOptionTextById(question, id))
  }

  // Check authentication when dialog is opened
  const handleDialogOpen = async (open: boolean) => {
    const userIsAuthenticated = await isAuthenticated()
    if (open && !userIsAuthenticated) {
      const currentUrl = window.location.pathname
      toast.error(
        'You must be logged in to take the quiz. Redirecting to login...'
      )
      router.push(`/login?redirect=${encodeURIComponent(currentUrl)}`)
      return
    } else if (open && userIsAuthenticated) {
      if (existingSubmission) {
        toast.info(
          'You have already submitted this quiz. Viewing your results.'
        )
        return
      }
      setIsDialogOpen(true)
    } else {
      setIsDialogOpen(false)
    }
  }

  // Handle viewing detailed results
  const handleViewDetailedResults = () => {
    setShowInstructions(false)
    setShowResults(true)
    setIsQuizStarted(false)
    setIsDialogOpen(true)
  }

  // Handle closing quiz
  const handleCloseQuiz = () => {
    setIsDialogOpen(false)
    setShowInstructions(true)
    setShowResults(false)
    setIsQuizStarted(false)
  }

  // Function to get user's previous answers for display in results
  const getPreviousAnswerTexts = (questionIndex: number) => {
    const question = questions[questionIndex]
    if (!question || !existingSubmission) return []

    const submissionAnswer = existingSubmission.answers.find(
      (answer) => answer.questionId === question.documentId
    )

    if (!submissionAnswer) return []

    return submissionAnswer.userAnswer.map((optionId) =>
      getOptionTextById(question, optionId)
    )
  }

  // Calculate percentage for existing submissions
  const getExistingSubmissionPercentage = () => {
    if (!existingSubmission) return 0
    return calculateQuizPercentage(
      existingSubmission.score,
      existingSubmission.answers,
      questions
    )
  }

  // Get total points for existing submission
  const getExistingSubmissionTotalPoints = () => {
    if (!existingSubmission) return 0
    return existingSubmission?.answers?.reduce((sum, answer) => {
      const question = questions.find((q) => q.documentId === answer.questionId)
      return sum + (question?.points || 1)
    }, 0)
  }

  // Handle quiz submission using React Query mutation
  const handleSubmitQuiz = useCallback(() => {
    const submissionData = {
      answers: questions.map((question, index) => ({
        questionId: question.documentId,
        selectedAnswers: answers[index] || [],
      })),
    }

    submitQuiz(submissionData, {
      onSuccess: (results) => {
        setSubmissionResults(results as CourseQuizSubmissionResponse)
        setShowResults(true)
        setIsQuizStarted(false)
      },
      onError: () => {
        setShowResults(true)
        setIsQuizStarted(false)
      },
    })
  }, [questions, answers, submitQuiz])

  const handleNextQuestion = useCallback(() => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setTimeLeft(questions[currentQuestion + 1]?.timeLimit || 60)
    } else {
      handleSubmitQuiz()
    }
  }, [currentQuestion, questions, handleSubmitQuiz])

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isQuizStarted && !showResults && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            handleNextQuestion()
            return questions[currentQuestion + 1]?.timeLimit || 60
          }
          return prevTime - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [
    isQuizStarted,
    showResults,
    handleNextQuestion,
    currentQuestion,
    questions,
    timeLeft,
  ])

  const handleStartQuiz = () => {
    setShowInstructions(false)
    setIsQuizStarted(true)
    setTimeLeft(questions[0]?.timeLimit || 60)
  }

  const handleAnswer = (optionId: string) => {
    const newAnswers = [...answers]
    const currentAnswers = newAnswers[currentQuestion]
    const questionType = questions[currentQuestion]?.questionType

    if (questionType === 'singleChoice') {
      newAnswers[currentQuestion] = [optionId]
    } else if (questionType === 'multipleChoice') {
      if (currentAnswers.includes(optionId)) {
        newAnswers[currentQuestion] = currentAnswers.filter(
          (id) => id !== optionId
        )
      } else {
        newAnswers[currentQuestion] = [...currentAnswers, optionId]
      }
    }

    setAnswers(newAnswers)
  }

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setTimeLeft(questions[currentQuestion - 1]?.timeLimit || 60)
    }
  }

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  }

  const getStableKey = () => {
    if (showInstructions) return 'instructions'
    if (showResults) return 'results'
    return `question-${currentQuestion}`
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <h3 className="text-lg font-medium mb-2">Loading Quiz...</h3>
          <p className="text-muted-foreground">
            Checking for existing submissions...
          </p>
        </div>
      </div>
    )
  }

  // Error state
  if (isError) {
    return (
      <div className="space-y-6">
        <div className="text-center p-6">
          <h3 className="text-lg font-medium mb-2 text-destructive">
            Error Loading Quiz
          </h3>
          <p className="text-muted-foreground">
            Please try refreshing the page.
          </p>
        </div>
      </div>
    )
  }

  // Don't render if no quiz data
  if (!quiz || questions.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center p-6">
          <h3 className="text-lg font-medium mb-2">No Quiz Available</h3>
          <p className="text-muted-foreground">
            There is no quiz available for this lesson.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {existingSubmission || submissionResults ? (
        <div className="space-y-4">
          <div className="p-6 rounded-lg border">
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center gap-3 mb-2">
                {existingSubmission?.passed || submissionResults?.passed ? (
                  <CheckCircle className="h-8 w-8 text-green-600" />
                ) : (
                  <XCircle className="h-8 w-8 text-red-600" />
                )}
                <div className="text-5xl font-bold text-primary">
                  {Math.round(
                    submissionResults?.percentage ||
                      getExistingSubmissionPercentage()
                  )}
                  %
                </div>
              </div>
              <div className="text-center">
                <p className="text-lg font-medium">
                  {submissionResults?.score || existingSubmission?.score || 0}{' '}
                  points out of{' '}
                  {submissionResults?.totalScore ||
                    getExistingSubmissionTotalPoints()}{' '}
                  points
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {getQuizStatusMessage(
                    existingSubmission?.passed ||
                      submissionResults?.passed ||
                      false,
                    submissionResults?.percentage ||
                      getExistingSubmissionPercentage()
                  )}
                </p>
                {existingSubmission && (
                  <div className="flex items-center justify-center gap-2 mt-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>
                      Completed on{' '}
                      {new Date(
                        existingSubmission.submissionDate
                      ).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
              <div className="w-full max-w-xs bg-muted rounded-lg p-4 mt-2">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Accuracy</span>
                    <span>
                      {Math.round(
                        submissionResults?.percentage ||
                          getExistingSubmissionPercentage()
                      )}
                      %
                    </span>
                  </div>
                  <Progress
                    value={
                      submissionResults?.percentage ||
                      getExistingSubmissionPercentage()
                    }
                    className="h-2"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="text-center p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Quiz Already Completed
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
              You have already submitted this quiz. You cannot retake it.
            </p>
          </div>

          <Button
            onClick={handleViewDetailedResults}
            className="w-full"
            variant="outline"
          >
            View Detailed Results
          </Button>

          {/* Dialog for detailed results */}
          <Dialog open={isDialogOpen} onOpenChange={handleDialogOpen}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] p-0">
              <DialogHeader className="p-6 pb-0 flex-shrink-0">
                <DialogTitle className="text-2xl font-bold text-center">
                  Quiz Results - {quizData.title}
                </DialogTitle>
              </DialogHeader>
              <div className="flex-1 overflow-hidden">
                <div className="w-full max-w-3xl mx-auto shadow-lg border-2 overflow-hidden">
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}
                    className="p-6"
                  >
                    <CourseQuizResults
                      isSubmitting={false}
                      submissionError={submitError?.message || null}
                      submissionResults={submissionResults}
                      questions={questions}
                      getSelectedOptionTexts={
                        existingSubmission
                          ? getPreviousAnswerTexts
                          : getSelectedOptionTexts
                      }
                      onCloseQuiz={handleCloseQuiz}
                    />
                  </motion.div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      ) : (
        <div className="text-center p-6">
          <h3 className="text-lg font-medium mb-2">
            Ready to test your knowledge?
          </h3>
          <p className="text-muted-foreground mb-4">
            Take a quiz to check your understanding of the concepts covered in
            this lesson.
          </p>
          <Dialog open={isDialogOpen} onOpenChange={handleDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <NotebookPen className="mr-2 h-4 w-4" />
                Start Quiz
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] p-0">
              <DialogHeader className="p-6 pb-0 flex-shrink-0">
                <DialogTitle className="text-2xl font-bold text-center">
                  {quizData.title}
                </DialogTitle>
              </DialogHeader>
              <div className="flex-1 overflow-hidden">
                <div className="w-full max-w-3xl mx-auto shadow-lg border-2 overflow-hidden">
                  <AnimatePresence
                    mode="wait"
                    initial={false}
                    key={getStableKey()}
                  >
                    {showInstructions ? (
                      <motion.div
                        key="instructions"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={fadeIn}
                        className="p-6"
                      >
                        <CourseQuizInstructions
                          quizData={quizData}
                          questions={questions}
                          onStartQuiz={handleStartQuiz}
                        />
                      </motion.div>
                    ) : showResults ? (
                      <motion.div
                        key="results"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={fadeIn}
                        className="p-6"
                      >
                        <CourseQuizResults
                          isSubmitting={isSubmitting}
                          submissionError={submitError?.message || null}
                          submissionResults={submissionResults}
                          questions={questions}
                          getSelectedOptionTexts={getSelectedOptionTexts}
                          onCloseQuiz={handleCloseQuiz}
                        />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="question"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={fadeIn}
                        className="p-6"
                      >
                        <CourseQuizQuestion
                          questions={questions}
                          currentQuestion={currentQuestion}
                          answers={answers}
                          timeLeft={timeLeft}
                          isSubmitting={isSubmitting}
                          onAnswer={handleAnswer}
                          onPrevious={handlePreviousQuestion}
                          onNext={handleNextQuestion}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  )
}

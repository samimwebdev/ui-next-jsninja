'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { motion, AnimatePresence } from 'framer-motion'
import DynamicIcon from '../shared/DynamicIcon'
import { NotebookPen } from 'lucide-react'
import {
  AssessmentQuiz,
  ButtonType,
  QuizSubmissionResponse,
} from '@/types/bootcamp-page-types'
import { strapiFetch } from '@/lib/strapi'
import { getAuthToken, isAuthenticated } from '@/lib/auth'
import { toast } from 'sonner'

// Import sub-components
import QuizInstructions from '@/components/shared/quiz/quiz-instructions'
import QuizQuestion from '@/components/shared/quiz/quiz-question'
import QuizResults from '@/components/shared/quiz/quiz-result'

// Add this interface for the API response

export default function BootcampAssessment({
  btn,
  data,
  bootcampSlug,
}: {
  btn: ButtonType | null
  data: AssessmentQuiz | null
  bootcampSlug: string
}) {
  const router = useRouter()

  // Use dynamic data or fallback to static content
  const quizData = data || {
    title: 'Bootcamp Assessment',
    instructions:
      'Please complete this assessment to check your readiness for the bootcamp.',
    passingScore: 70,
    questions: [],
  }

  // Memoize questions to prevent dependency issues
  const questions = useMemo(() => {
    return quizData.questions || []
  }, [quizData.questions])

  const [showInstructions, setShowInstructions] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  // Store option IDs instead of text
  const [answers, setAnswers] = useState<string[][]>(
    Array(questions.length).fill([])
  )
  const [showResults, setShowResults] = useState(false)
  const [timeLeft, setTimeLeft] = useState(questions[0]?.timeLimit || 60)
  const [isQuizStarted, setIsQuizStarted] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionResults, setSubmissionResults] =
    useState<QuizSubmissionResponse | null>(null)
  const [submissionError, setSubmissionError] = useState<string | null>(null)

  // Helper function to get option text by ID for display purposes
  const getOptionTextById = (questionIndex: number, optionId: string) => {
    const question = questions[questionIndex]
    const option = question?.options?.find((opt) => opt.id === optionId)
    return option?.text || optionId
  }

  // Helper function to get selected option texts for display
  const getSelectedOptionTexts = (questionIndex: number) => {
    const selectedIds = answers[questionIndex] || []
    return selectedIds.map((id) => getOptionTextById(questionIndex, id))
  }

  // Check authentication when dialog is opened
  const handleDialogOpen = async (open: boolean) => {
    const userIsAuthenticated = await isAuthenticated()
    if (open && !userIsAuthenticated) {
      // Store current page URL for redirect after login
      const currentUrl = window.location.pathname

      toast.error(
        'You must be logged in to take the assessment. Redirecting to login...'
      )
      // Redirect to login instead of opening dialog
      router.push(`/login?redirect=${encodeURIComponent(currentUrl)}`)
      return
    } else if (open && userIsAuthenticated) {
      // If user is authenticated, open the dialog
      setIsDialogOpen(true)
    } else {
      // If dialog is closed, reset quiz state
      setIsDialogOpen(false)
      // resetQuizState()
    }
  }

  // // Reset quiz state
  // const resetQuizState = () => {
  //   setShowInstructions(true)
  //   setShowResults(false)
  //   setIsQuizStarted(false)
  //   setCurrentQuestion(0)
  //   setAnswers(Array(questions.length).fill([]))
  //   setTimeLeft(questions[0]?.timeLimit || 60)
  //   setSubmissionResults(null)
  //   setSubmissionError(null)
  // }

  // Wrap submitQuiz in useCallback to make it stable
  const submitQuiz = useCallback(async () => {
    setIsSubmitting(true)
    setSubmissionError(null)

    try {
      // Prepare the submission data with option IDs
      const submissionData = {
        answers: questions.map((question, index) => ({
          questionId: question.id,
          selectedAnswers: answers[index] || [], // Now contains option IDs
        })),
      }

      const results = await strapiFetch(
        `/api/bootcamps/${bootcampSlug}/assessment-quiz`,
        {
          method: 'POST',
          body: JSON.stringify(submissionData),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${await getAuthToken()}`,
          },
        }
      )
      console.log('Submission results:', results)

      // Use server response instead of client calculation
      setSubmissionResults(results as QuizSubmissionResponse)
      setShowResults(true)
      setIsQuizStarted(false)
    } catch (error) {
      console.error('Error submitting quiz:', error)
      setSubmissionError(
        error instanceof Error ? error.message : 'Failed to submit quiz'
      )
      // Still show results page but with error state
      setShowResults(true)
      setIsQuizStarted(false)
    } finally {
      setIsSubmitting(false)
    }
  }, [questions, answers, bootcampSlug])

  const handleNextQuestion = useCallback(() => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setTimeLeft(questions[currentQuestion + 1]?.timeLimit || 60)
    } else {
      // Submit quiz when all questions are answered
      submitQuiz()
    }
  }, [currentQuestion, questions, submitQuiz])

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

  // Updated handleAnswer to work with option IDs
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

  // Prevent continuous flashing by using a stable key for AnimatePresence
  const getStableKey = () => {
    if (showInstructions) return 'instructions'
    if (showResults) return 'results'
    return `question-${currentQuestion}`
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="rounded-full text-base">
          {btn?.btnIcon ? (
            <DynamicIcon
              icon={btn.btnIcon}
              width={20}
              height={20}
              className="mr-2 h-5 w-5"
            />
          ) : (
            <NotebookPen className="mr-2 h-5 w-5" />
          )}
          {btn?.btnLabel || 'Take Assessment'}
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
            <AnimatePresence mode="wait" initial={false} key={getStableKey()}>
              {showInstructions ? (
                <motion.div
                  key="instructions"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={fadeIn}
                  className="p-6"
                >
                  <QuizInstructions
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
                  <QuizResults
                    isSubmitting={isSubmitting}
                    submissionError={submissionError}
                    submissionResults={submissionResults}
                    questions={questions}
                    getSelectedOptionTexts={getSelectedOptionTexts}
                    onCloseQuiz={() => setIsDialogOpen(false)}
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
                  <QuizQuestion
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
  )
}

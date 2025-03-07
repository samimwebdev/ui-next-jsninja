'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { motion, AnimatePresence } from 'framer-motion'

import {
  Timer,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  NotebookPen,
  Award,
  AlertCircle,
} from 'lucide-react'

const questions = [
  {
    id: 1,
    question: 'What is the capital of France?',
    options: ['London', 'Berlin', 'Paris', 'Madrid'],
    correctAnswer: ['Paris'],
    type: 'single',
  },
  {
    id: 2,
    question: 'Which of the following are primary colors?',
    options: ['Red', 'Green', 'Blue', 'Yellow'],
    correctAnswer: ['Red', 'Blue', 'Yellow'],
    type: 'multiple',
  },
  {
    id: 3,
    question: "Who wrote 'Romeo and Juliet'?",
    options: [
      'Charles Dickens',
      'William Shakespeare',
      'Jane Austen',
      'Mark Twain',
    ],
    correctAnswer: ['William Shakespeare'],
    type: 'single',
  },
  // Add more questions here
]

export default function BootcampAssessment() {
  const [showInstructions, setShowInstructions] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[][]>(
    Array(questions.length).fill([])
  )
  const [showResults, setShowResults] = useState(false)
  const [timeLeft, setTimeLeft] = useState(60) // 60 seconds per question
  const [isQuizStarted, setIsQuizStarted] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleNextQuestion = useCallback(() => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setTimeLeft(60)
    } else {
      setShowResults(true)
      setIsQuizStarted(false)
    }
  }, [currentQuestion])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isQuizStarted && !showResults) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            handleNextQuestion()
            return 60
          }
          return prevTime - 1
        })
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isQuizStarted, showResults, handleNextQuestion])

  const handleStartQuiz = () => {
    setShowInstructions(false)
    setIsQuizStarted(true)
    setTimeLeft(60)
  }

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers]
    const currentAnswers = newAnswers[currentQuestion]
    const questionType = questions[currentQuestion].type

    if (questionType === 'single') {
      newAnswers[currentQuestion] = [answer]
    } else if (questionType === 'multiple') {
      if (currentAnswers.includes(answer)) {
        newAnswers[currentQuestion] = currentAnswers.filter((a) => a !== answer)
      } else {
        newAnswers[currentQuestion] = [...currentAnswers, answer]
      }
    }

    setAnswers(newAnswers)
  }

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setTimeLeft(60)
    }
  }

  const calculateScore = () => {
    return answers.reduce((score, answer, index) => {
      const correctAnswer = questions[index].correctAnswer
      const isCorrect =
        answer.length === correctAnswer.length &&
        answer.every((a) => correctAnswer.includes(a))
      return isCorrect ? score + 1 : score
    }, 0)
  }

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.3 } },
  }

  // Prevent continuous flashing by using a stable key for AnimatePresence
  const getStableKey = () => {
    if (showInstructions) return "instructions"
    if (showResults) return "results"
    return `question-${currentQuestion}`
  }

  const QuizContent = () => (
    <Card className="w-full max-w-3xl mx-auto shadow-lg border-2 overflow-hidden">
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
            <CardHeader className="pb-4">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <AlertCircle className="h-8 w-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-center text-primary">
                Quiz Instructions
              </CardTitle>
              <CardDescription className="text-center text-base mt-2">
                Complete this assessment to check your suitability for the
                bootcamp
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-center text-lg">
                Please read the following instructions carefully before starting
                the quiz:
              </p>
              <div className="bg-secondary/20 rounded-lg p-4">
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <Timer className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>
                      You will have 60 seconds to answer each question.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>
                      Use the navigation buttons to move between questions.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>
                      For multiple-choice questions, you can select multiple
                      answers.
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Award className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>
                      Your final score will be displayed at the end of the quiz.
                    </span>
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="justify-center pt-4">
              <Button
                onClick={handleStartQuiz}
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 px-8 rounded-full"
              >
                Start Quiz
              </Button>
            </CardFooter>
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
            <CardHeader className="pb-4">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-primary/10">
                  <Award className="h-8 w-8 text-primary" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold text-center text-primary">
                Quiz Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <p className="text-5xl font-bold mb-4">
                  {calculateScore()} / {questions.length}
                </p>
                <div className="relative pt-4">
                  <Progress
                    value={(calculateScore() / questions.length) * 100}
                    className="w-full h-4 rounded-full"
                  />
                  <p className="mt-2 text-sm text-muted-foreground">
                    {calculateScore() === questions.length
                      ? "Perfect score! You're ready for the bootcamp!"
                      : calculateScore() >= questions.length / 2
                      ? "Good job! You're on the right track."
                      : "Keep learning! There's room for improvement."}
                  </p>
                </div>
              </div>
              <div className="mt-8 space-y-6">
                {questions.map((q, index) => {
                  const isCorrect =
                    JSON.stringify(answers[index].sort()) ===
                    JSON.stringify(q.correctAnswer.sort())
                  return (
                    <div
                      key={q.id}
                      className={`p-5 rounded-lg border ${
                        isCorrect
                          ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900'
                          : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-900'
                      }`}
                    >
                      <p className="font-semibold text-lg mb-3">{q.question}</p>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">Your answer:</span>
                        <span className="ml-2">
                          {answers[index].join(', ')}
                        </span>
                        {isCorrect ? (
                          <CheckCircle className="ml-2 text-green-500" />
                        ) : (
                          <XCircle className="ml-2 text-red-500" />
                        )}
                      </div>
                      {!isCorrect && (
                        <p className="text-green-600 dark:text-green-400 mt-1 flex items-center gap-2">
                          <span className="font-medium">Correct answer:</span>{' '}
                          {q.correctAnswer.join(', ')}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
            <CardFooter className="justify-center pt-6">
              <Button
                onClick={() => setIsDialogOpen(false)}
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 px-8 rounded-full"
              >
                Close Quiz
              </Button>
            </CardFooter>
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
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold text-center text-primary">
                Question {currentQuestion + 1} of {questions.length}
              </CardTitle>
              <div className="flex flex-col space-y-3 mt-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm font-medium">
                    {Math.round(
                      (currentQuestion / (questions.length - 1)) * 100
                    )}
                    %
                  </span>
                </div>
                <Progress
                  value={(currentQuestion / (questions.length - 1)) * 100}
                  className="w-full h-2 rounded-full"
                />
                <div className="flex items-center justify-end mt-1 text-amber-600 dark:text-amber-400">
                  <Timer className="mr-2 h-4 w-4" />
                  <span className="font-medium">{timeLeft}s remaining</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-8 py-4">
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                <p className="text-xl font-semibold">
                  {questions[currentQuestion].question}
                </p>
              </div>
              {questions[currentQuestion].type === 'single' ? (
                <RadioGroup
                  value={answers[currentQuestion][0] || ''}
                  onValueChange={(value) => handleAnswer(value)}
                  className="space-y-3"
                >
                  {questions[currentQuestion].options.map((option) => (
                    <div
                      key={option}
                      className="flex items-center space-x-2 p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 cursor-pointer"
                      onClick={() => handleAnswer(option)}
                    >
                      <RadioGroupItem value={option} id={option} />
                      <Label
                        htmlFor={option}
                        className="flex-grow cursor-pointer font-medium"
                      >
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              ) : (
                <div className="space-y-3">
                  {questions[currentQuestion].options.map((option) => (
                    <div
                      key={option}
                      className={`flex items-center space-x-2 p-4 rounded-lg border ${
                        answers[currentQuestion].includes(option)
                          ? 'border-primary bg-primary/5'
                          : 'border-border'
                      } hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 cursor-pointer`}
                      onClick={() => handleAnswer(option)}
                    >
                      <Checkbox
                        checked={answers[currentQuestion].includes(option)}
                        onCheckedChange={() => handleAnswer(option)}
                        className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      />
                      <Label className="flex-grow cursor-pointer font-medium">
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <CardFooter className="justify-between p-4 border-t">
              <Button
                onClick={handlePreviousQuestion}
                variant="outline"
                disabled={currentQuestion === 0}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button
                onClick={handleNextQuestion}
                className="flex items-center gap-1"
              >
                {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="rounded-full text-base">
          <NotebookPen className="mr-2 h-5 w-5" />
          Take Assessment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold text-center">
            Bootcamp Readiness Assessment
          </DialogTitle>
        </DialogHeader>
        <QuizContent />
      </DialogContent>
    </Dialog>
  )
}

'use client'

import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
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

import {
  Timer,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  NotebookPen,
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

  const QuizContent = () => (
    <Card className="w-full max-w-3xl mx-auto quiz-card p-6">
      {showInstructions ? (
        <>
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold text-center text-primary">
              Quiz Instructions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-lg">
              Please read the following instructions carefully before starting
              the quiz:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-4">
              <li>You will have 60 seconds to answer each question.</li>
              <li>Use the navigation buttons to move between questions.</li>
              <li>
                For multiple-choice questions, you can select multiple answers.
              </li>
              <li>
                Your final score will be displayed at the end of the quiz.
              </li>
            </ul>
          </CardContent>
          <CardFooter className="justify-center pt-4">
            <Button
              onClick={handleStartQuiz}
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Start Quiz
            </Button>
          </CardFooter>
        </>
      ) : showResults ? (
        <>
          <CardHeader className="pb-4">
            <CardTitle className="text-3xl font-bold text-center text-primary">
              Quiz Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <p className="text-5xl font-bold mb-4">
                {calculateScore()} / {questions.length}
              </p>
              <Progress
                value={(calculateScore() / questions.length) * 100}
                className="w-full h-4"
              />
            </div>
            <div className="mt-8 space-y-6">
              {questions.map((q, index) => (
                <div key={q.id} className="p-4 rounded-lg bg-secondary/30">
                  <p className="font-semibold text-lg mb-2">{q.question}</p>
                  <p className="flex items-center">
                    <span className="font-medium">Your answer:</span>
                    <span className="ml-2">{answers[index].join(', ')}</span>
                    {JSON.stringify(answers[index].sort()) ===
                    JSON.stringify(q.correctAnswer.sort()) ? (
                      <CheckCircle className="ml-2 text-green-500" />
                    ) : (
                      <XCircle className="ml-2 text-red-500" />
                    )}
                  </p>
                  {JSON.stringify(answers[index].sort()) !==
                    JSON.stringify(q.correctAnswer.sort()) && (
                    <p className="text-green-500 mt-1">
                      <span className="font-medium">Correct answer:</span>{' '}
                      {q.correctAnswer.join(', ')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="justify-center pt-4">
            <Button
              onClick={() => setIsDialogOpen(false)}
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Close Quiz
            </Button>
          </CardFooter>
        </>
      ) : (
        <>
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-bold text-center text-primary">
              Question {currentQuestion + 1} of {questions.length}
            </CardTitle>
            <div className="flex items-center justify-between mt-4">
              <Progress
                value={(currentQuestion / questions.length) * 100}
                className="w-full max-w-xs quiz-progress"
              />
              <div className="quiz-timer">
                <Timer className="mr-2 h-4 w-4" />
                <span className="font-medium">{timeLeft}s</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-xl font-semibold">
              {questions[currentQuestion].question}
            </p>
            {questions[currentQuestion].type === 'single' ? (
              <RadioGroup
                value={answers[currentQuestion][0] || ''}
                onValueChange={(value) => handleAnswer(value)}
                className="space-y-3"
              >
                {questions[currentQuestion].options.map((option) => (
                  <div
                    key={option}
                    className="flex items-center space-x-2 p-3 rounded-lg quiz-option"
                  >
                    <RadioGroupItem value={option} id={option} />
                    <Label
                      htmlFor={option}
                      className="flex-grow cursor-pointer"
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
                    className="flex items-center space-x-2 p-3 rounded-lg quiz-option"
                  >
                    <Checkbox
                      id={option}
                      checked={answers[currentQuestion].includes(option)}
                      onCheckedChange={() => handleAnswer(option)}
                    />
                    <label
                      htmlFor={option}
                      className="flex-grow text-sm font-medium leading-none cursor-pointer"
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="justify-between pt-4">
            <Button
              onClick={handlePreviousQuestion}
              disabled={currentQuestion === 0}
              size="lg"
              variant="outline"
              className="w-28"
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Previous
            </Button>
            <Button
              onClick={handleNextQuestion}
              size="lg"
              className="w-28 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}{' '}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </>
      )}
    </Card>
  )

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className="rounded-full text-base shadow-none"
        >
          <NotebookPen className="!h-5 !w-5" /> Take Assessment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[700px] lg:max-w-[900px] xl:max-w-[1000px]">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-center">
            Take Quiz to check whether suitable or Not
          </DialogTitle>
        </DialogHeader>
        <QuizContent />
      </DialogContent>
    </Dialog>
  )
}

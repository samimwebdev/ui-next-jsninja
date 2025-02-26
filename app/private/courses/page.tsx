'use client'

import * as React from 'react'
import {
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  Search,
  CheckCircle,
  X,
  FileText,
  Video,
  Download,
  Star,
  Link,
  FileCode,
  BookOpen,
  Circle,
} from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

interface BaseLessonType {
  id: string
  title: string
  duration: string
  completed: boolean
  type: 'video' | 'text' // Added type property
}

interface Lesson extends BaseLessonType {
  url: string
}

interface Module {
  id: string
  title: string
  duration: string
  lessons: Lesson[]
  isActive?: boolean
  completed?: boolean
}

interface ActionButton {
  icon: React.ComponentType<{ className?: string }>
  label: string
  content: {
    title: string
    description: string
    body: React.ReactNode
  }
}

const initialModules: Module[] = [
  {
    id: 'm0',
    title: 'Module 0 - Introduction to course',
    duration: '06:47:58 hours',
    completed: true,
    lessons: [
      {
        id: '0.1',
        title: '0.1 Course Overview and Setup',
        duration: '15:30 minutes',
        completed: true,
        url: 'https://example.com/video1.mp4',
        type: 'video',
      },
      {
        id: '0.2',
        title: '0.2 Development Environment Setup',
        duration: '20:45 minutes',
        completed: true,
        url: 'https://example.com/text1.html',
        type: 'text',
      },
    ],
  },
  {
    id: 'm1',
    title: 'Module 1 - Getting started ',
    duration: '07:52:12 hours',
    completed: true,
    lessons: [
      {
        id: '1.1',
        title: '1.1 Introduction to React Components',
        duration: '25:15 minutes',
        completed: true,
        url: 'https://example.com/video3.mp4',
        type: 'video',
      },
      {
        id: '1.2',
        title: '1.2 JSX Fundamentals',
        duration: '28:40 minutes',
        completed: true,
        url: 'https://example.com/text2.html',
        type: 'text',
      },
      {
        id: '1.3',
        title: '1.3 Props and Components',
        duration: '32:20 minutes',
        completed: true,
        url: 'https://example.com/video5.mp4',
        type: 'video',
      },
    ],
  },
  {
    id: 'm2',
    title: 'Module 2 - Going Deep into React: Adding Interactivity',
    duration: '06:26:18 hours',
    isActive: true,
    completed: false,
    lessons: [
      {
        id: '2.1',
        title: '2.1 Responding to Events - Adding Event Handlers',
        duration: '22:30 minutes',
        completed: true,
        url: 'https://example.com/video6.mp4',
        type: 'video',
      },
      {
        id: '2.2',
        title: '2.2 Responding to Events - Event Propagation',
        duration: '26:45 minutes',
        completed: true,
        url: 'https://example.com/text3.html',
        type: 'text',
      },
      {
        id: '2.3',
        title: "2.3 Understanding State: A Component's Memory",
        duration: '26:13 minutes',
        completed: true,
        url: 'https://example.com/video8.mp4',
        type: 'video',
      },
      {
        id: '2.4',
        title: '2.4 How state works in React - A deep dive',
        duration: '18:25 minutes',
        completed: true,
        url: 'https://example.com/text4.html',
        type: 'text',
      },
      {
        id: '2.5',
        title: '2.5 How Rendering works',
        duration: '14:23 minutes',
        completed: true,
        url: 'https://example.com/video10.mp4',
        type: 'video',
      },
      {
        id: '2.6',
        title: '2.6 State as a Snapshot',
        duration: '24:42 minutes',
        completed: true,
        url: 'https://example.com/text5.html',
        type: 'text',
      },
    ],
  },
  {
    id: 'm3',
    title: 'Module 3 - Managing State',
    duration: '05:30:00 hours',
    completed: false,
    lessons: [
      {
        id: '3.1',
        title: '3.1 State Management Fundamentals',
        duration: '28:15 minutes',
        completed: false,
        url: 'https://example.com/video12.mp4',
        type: 'video',
      },
      {
        id: '3.2',
        title: '3.2 Using Context API',
        duration: '32:45 minutes',
        completed: false,
        url: 'https://example.com/text6.html',
        type: 'text',
      },
      {
        id: '3.3',
        title: '3.3 Reducers and Complex State',
        duration: '35:20 minutes',
        completed: false,
        url: 'https://example.com/video14.mp4',
        type: 'video',
      },
    ],
  },
]

const actionButtons: ActionButton[] = [
  {
    icon: Star,
    label: 'Community',
    content: {
      title: 'Join Our Community',
      description: 'Connect with fellow learners and share your journey',
      body: (
        <div className="space-y-4">
          <p>
            Join our vibrant community of React developers! Share your
            experiences, ask questions, and collaborate with peers who are on
            the same learning journey.
          </p>
          <div className="space-y-2">
            <h4 className="font-medium">Community Features:</h4>
            <ul className="list-disc pl-4 space-y-1">
              <li>Discussion forums</li>
              <li>Code sharing</li>
              <li>Project showcases</li>
              <li>Peer reviews</li>
              <li>Study groups</li>
            </ul>
          </div>
        </div>
      ),
    },
  },
  {
    icon: FileText,
    label: 'Related Guidelines',
    content: {
      title: 'Related Guidelines',
      description: 'Important information and resources for this lesson',
      body: (
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">Prerequisites:</h4>
            <ul className="list-disc pl-4 space-y-1">
              <li>Basic JavaScript knowledge</li>
              <li>Understanding of ES6+ features</li>
              <li>Familiarity with DOM manipulation</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Additional Resources:</h4>
            <ul className="list-disc pl-4 space-y-1">
              <li>React Documentation</li>
              <li>MDN Web Docs</li>
              <li>Practice Exercises</li>
            </ul>
          </div>
        </div>
      ),
    },
  },
  {
    icon: Download,
    label: 'Video Download',
    content: {
      title: 'Download Options',
      description: 'Choose your preferred video quality',
      body: (
        <div className="space-y-4">
          <div className="grid gap-2">
            <Button variant="outline" className="w-full justify-between">
              <span>HD Quality (720p)</span>
              <span className="text-muted-foreground">1.2 GB</span>
            </Button>
            <Button variant="outline" className="w-full justify-between">
              <span>Medium Quality (480p)</span>
              <span className="text-muted-foreground">720 MB</span>
            </Button>
            <Button variant="outline" className="w-full justify-between">
              <span>Low Quality (360p)</span>
              <span className="text-muted-foreground">400 MB</span>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Note: Downloads are available for enrolled students only
          </p>
        </div>
      ),
    },
  },
]

interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number[] // All questions are multiple choice
  type: 'multiple' // All questions are multiple choice
}

const videoDescription = {
  title:
    '2.10 Project Tutorial- Tasker: Streamlining Success with React-Powered Task Management',
  subtitle: 'Tasker - A simple task management system for everyone.',
  description: `Tasker is an intuitive task management system designed for everyone. It enables easy creation and management of tasks with features such as task creation (title, desc, tags, due date, priority, owner), task listing, powerful search with 'debounce' for an enhanced experience, task categorization (by tag, priority, owner), marking tasks as favorites, tracking and updating task status, task editing, and efficient task deletion. Simplify your task management with Tasker.`,
  features: [
    'Task Creation(title, desc, tags, due date, priority, owner)',
    'Listing the tasks',
    "Search: Ability to search by entering keywords that matches one or more tasks. Implement 'debounce' technique for improved search experience.",
    'Categorising the tasks(by tag, priority, owner)',
    'Marking a Task as favorite',
    'Tracking and update the task status',
    'Edit the tasks',
    'Delete one or more tasks',
  ],
}

// Resources section data
const resources = [
  {
    title: 'React Documentation',
    description: 'Official React documentation for components and hooks',
    type: 'documentation',
    url: 'https://reactjs.org/docs/getting-started.html',
    icon: FileCode,
  },
  {
    title: 'Event Handling in React',
    description:
      'A comprehensive guide to handling events in React applications',
    type: 'article',
    url: 'https://example.com/react-events-article',
    icon: FileText,
  },
  {
    title: 'React State Management Tutorial',
    description: 'Video tutorial on state management patterns in React',
    type: 'video',
    url: 'https://example.com/state-management-video',
    icon: Video,
  },
  {
    title: 'React Hooks Cheatsheet',
    description: 'Quick reference guide for React hooks',
    type: 'cheatsheet',
    url: 'https://example.com/hooks-cheatsheet',
    icon: BookOpen,
  },
  {
    title: 'GitHub Repository',
    description: 'Source code for the examples in this lesson',
    type: 'code',
    url: 'https://github.com/example/react-events-demo',
    icon: Link,
  },
]

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question:
      'Which of the following are main purposes of the Tasker application? (Select all that apply)',
    options: [
      'Social media management',
      'Task management and organization',
      'Video streaming',
      'Task categorization',
    ],
    correctAnswer: [1, 3],
    type: 'multiple',
  },
  {
    id: 2,
    question:
      'Which features help in improving search performance? (Select all that apply)',
    options: [
      'Task deletion',
      'Task categorization',
      'Debounce technique',
      'Task marking',
    ],
    correctAnswer: [1, 2],
    type: 'multiple',
  },
  {
    id: 3,
    question: 'Select all the features available in the Tasker application:',
    options: [
      'Task Creation',
      'Video Editing',
      'Task Categorization',
      'Image Filtering',
      'Marking Tasks as Favorite',
    ],
    correctAnswer: [0, 2, 4],
    type: 'multiple',
  },
  {
    id: 4,
    question:
      'What are the benefits of using the debounce technique in search? (Select all that apply)',
    options: [
      'Reduces server load',
      'Improves user experience',
      'Prevents unnecessary API calls',
      'Increases search speed',
    ],
    correctAnswer: [0, 1, 2],
    type: 'multiple',
  },
]

interface CurrentContent {
  moduleId: string
  lessonId: string
  title: string
  description?: string
  type: 'video' | 'text'
}

type QuizState = 'intro' | 'question' | 'results'

// Type for quiz data to be stored in localStorage
interface QuizStorageData {
  lessonId: string
  answers: Record<number, number[]>
  currentQuestion: number
  quizState: QuizState
  visitedQuestions: number[]
}

function QuizDialog({
  open,
  onOpenChange,
  questions,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  questions: QuizQuestion[]
}) {
  const [quizState, setQuizState] = React.useState<QuizState>('intro')
  const [currentQuestion, setCurrentQuestion] = React.useState(0)
  const [score, setScore] = React.useState(0)
  const [answers, setAnswers] = React.useState<Record<number, number[]>>({})
  const [multipleChoiceSelections, setMultipleChoiceSelections] =
    React.useState<Record<number, boolean[]>>({})
  const [visitedQuestions, setVisitedQuestions] = React.useState<number[]>([])
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
    // Only allow closing via the close button
    if (open === false) {
      return
    }
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
          <Button variant="ghost" size="icon">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
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
              <div className="p-4 rounded-lg bg-muted">
                <div className="flex items-center justify-center gap-4">
                  <div className="text-4xl font-bold">
                    {Math.round((score / questions.length) * 100)}%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {score} correct answers
                    <br />
                    out of {questions.length} questions
                  </div>
                </div>
              </div>
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
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
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                        ) : (
                          <X className="h-5 w-5 text-red-500 mt-0.5" />
                        )}
                        <div>
                          <h4 className="font-medium">Question {index + 1}</h4>
                          <p className="text-sm text-muted-foreground">
                            {question.question}
                          </p>

                          <div className="mt-1 text-sm">
                            <span className="font-medium">Your answers: </span>
                            {Array.isArray(userAnswer) &&
                            userAnswer.length > 0 ? (
                              <ul className="list-disc pl-5 mt-1">
                                {(userAnswer as number[]).map((index) => (
                                  <li
                                    key={index}
                                    className={cn(
                                      Array.isArray(question.correctAnswer) &&
                                        question.correctAnswer.includes(index)
                                        ? 'text-green-500'
                                        : 'text-red-500'
                                    )}
                                  >
                                    {question.options[index]}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <span className="text-red-500">
                                No answers selected
                              </span>
                            )}
                          </div>
                          {!isCorrect && (
                            <div className="mt-1 text-sm text-green-500">
                              <span className="font-medium">
                                Correct answers:{' '}
                              </span>
                              <ul className="list-disc pl-5 mt-1">
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

export default function CourseViewer() {
  const [search, setSearch] = React.useState('')
  const [openModules, setOpenModules] = React.useState<string[]>(['m2'])
  const [quizOpen, setQuizOpen] = React.useState(false)
  const [quizCompleted, setQuizCompleted] = React.useState(false)
  const [quizScore, setQuizScore] = React.useState<number | null>(null)
  const [currentContent, setCurrentContent] = React.useState<CurrentContent>({
    moduleId: 'm2',
    lessonId: '2.1',
    title: '2.1 Responding to Events - Adding Event Handlers',
    description: 'Learn how to handle events in React components effectively.',
    type: 'video',
  })
  const [modules, setModules] = React.useState<Module[]>(initialModules)

  // Calculate progress
  const calculateProgress = () => {
    let completedLessons = 0
    let totalLessons = 0
    let completedModules = 0

    modules.forEach((module) => {
      if (module.completed) {
        completedModules++
      }
      module.lessons.forEach((lesson) => {
        totalLessons++
        if (lesson.completed) {
          completedLessons++
        }
      })
    })

    return {
      completedLessons,
      totalLessons,
      completedModules,
      totalModules: modules.length,
      percentage: Math.round((completedLessons / totalLessons) * 100) || 0,
    }
  }

  const { completedLessons, totalLessons, percentage, completedModules } =
    calculateProgress()

  // Search functionality
  const [filteredModules, setFilteredModules] = React.useState(modules)

  React.useEffect(() => {
    if (!search.trim()) {
      setFilteredModules(modules)
      return
    }

    const searchLower = search.toLowerCase()
    const filtered = modules
      .map((module) => {
        // Check if module title matches
        const moduleMatches = module.title.toLowerCase().includes(searchLower)

        // Filter lessons that match search
        const filteredLessons = module.lessons.filter((lesson) =>
          lesson.title.toLowerCase().includes(searchLower)
        )

        // If module matches or has matching lessons, include it
        if (moduleMatches || filteredLessons.length > 0) {
          // If module matches, return all lessons, otherwise only matching lessons
          return {
            ...module,
            lessons: moduleMatches ? module.lessons : filteredLessons,
          }
        }

        return null
      })
      .filter(Boolean) as Module[]

    setFilteredModules(filtered)

    // Open modules that have matching content
    const modulesToOpen = filtered.map((m) => m.id)
    setOpenModules((prev) => {
      const newOpen = [...new Set([...prev, ...modulesToOpen])]
      return newOpen
    })
  }, [search, modules])

  const toggleModule = (moduleId: string) => {
    setOpenModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    )
  }

  const handleContentSelect = (moduleId: string, lesson: Lesson) => {
    setCurrentContent({
      moduleId,
      lessonId: lesson.id,
      title: lesson.title,
      description: `Duration: ${lesson.duration}`,
      type: lesson.type,
    })

    // Check if all lessons in the module are completed
    const currentModule = modules.find((m) => m.id === moduleId)
    if (currentModule && currentModule.lessons.every((l) => l.completed)) {
      // Update module completion status
      const updatedModules = modules.map((m) =>
        m.id === moduleId ? { ...m, completed: true } : m
      )
      // Update modules state (you'll need to lift this state up)
      setModules(updatedModules)
    }
  }

  const findNextAndPreviousLessons = () => {
    const allLessons: { moduleId: string; lesson: Lesson }[] = []
    modules.forEach((module) => {
      module.lessons.forEach((lesson) => {
        allLessons.push({ moduleId: module.id, lesson: lesson as Lesson })
      })
    })

    const currentIndex = allLessons.findIndex(
      ({ moduleId, lesson }) =>
        moduleId === currentContent.moduleId &&
        lesson.id === currentContent.lessonId
    )

    return {
      previous: currentIndex > 0 ? allLessons[currentIndex - 1] : null,
      next:
        currentIndex < allLessons.length - 1
          ? allLessons[currentIndex + 1]
          : null,
    }
  }

  const { previous, next } = findNextAndPreviousLessons()

  const handleQuizComplete = (score: number) => {
    setQuizCompleted(true)
    setQuizScore(score)
  }

  return (
    <div className="min-h-screen bg-background text-foreground max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] lg:gap-6">
        {/* Content Section */}
        <div className="relative flex flex-col">
          {currentContent.type === 'video' ? (
            <div className="aspect-video bg-black">
              <video
                key={currentContent.lessonId} // Force video reload when source changes
                className="h-full w-full"
                poster="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-iRgtZAuF10taOZ9NwvdNIoxB3rUiSK.png"
                controls
              >
                <source src="#" type="video/mp4" />
              </video>
            </div>
          ) : (
            <div className="aspect-video bg-muted flex items-center justify-center p-8 overflow-auto">
              <div className="prose dark:prose-invert max-w-none w-full">
                <h1 className="text-2xl font-bold mb-4">
                  {currentContent.title}
                </h1>
                <p className="text-muted-foreground mb-4">
                  This is a text-based lecture that contains important
                  information about the topic.
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam euismod, nisl eget aliquam ultricies, nunc nisl aliquet
                  nunc, quis aliquam nisl nunc, quis aliquam nisl nunc quis
                  nisl. Nullam euismod, nisl eget aliquam ultricies, nunc nisl
                  aliquet nunc, quis aliquam nisl nunc quis nisl.
                </p>
                <h2 className="text-xl font-bold mt-6 mb-3">Key Concepts</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Understanding event propagation in React</li>
                  <li>Handling synthetic events</li>
                  <li>Event delegation patterns</li>
                  <li>Performance considerations</li>
                </ul>
                <h2 className="text-xl font-bold mt-6 mb-3">Code Example</h2>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code>{`function handleClick(event) {
  event.preventDefault();
  event.stopPropagation();
  console.log('Button clicked!');
}

function MyComponent() {
  return (
    <button onClick={handleClick}>
      Click Me
    </button>
  );
}`}</code>
                </pre>
              </div>
            </div>
          )}
          {/* Description , resource and Quiz section*/}
          <div className="flex items-center gap-2 p-4 border-b">
            {actionButtons.map((action, index) => (
              <Dialog key={index}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex flex-1 items-center gap-2 text-muted-foreground hover:text-foreground"
                  >
                    <action.icon className="h-4 w-4" />
                    {action.label}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{action.content.title}</DialogTitle>
                    <DialogDescription>
                      {action.content.description}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="mt-4">{action.content.body}</div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
          <div className="p-8">
            <h1 className="text-2xl font-bold mb-3">{currentContent.title}</h1>
            <p className="text-muted-foreground mb-8">
              {currentContent.description}
            </p>

            {/* Content Tabs */}
            <Tabs defaultValue="description" className="mt-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">Video Description</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="quiz">Quiz</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-4 space-y-4">
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
                    {videoDescription.description}
                  </p>

                  <h3 className="text-lg font-semibold mt-6 mb-3">Features:</h3>
                  <ul className="space-y-2 list-disc pl-6">
                    {videoDescription.features.map((feature, index) => (
                      <li key={index} className="text-muted-foreground">
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="resources" className="mt-4 space-y-4">
                <div className="grid gap-4">
                  {resources.map((resource, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="bg-primary/10 p-2 rounded-md text-primary">
                        <resource.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{resource.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {resource.description}
                        </p>
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline mt-1 inline-block"
                        >
                          View Resource
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="quiz" className="mt-4">
                <div className="space-y-6">
                  {!quizCompleted ? (
                    <div className="text-center p-6">
                      <h3 className="text-lg font-medium mb-2">
                        Ready to test your knowledge?
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Take a quiz to check your understanding of the concepts
                        covered in this lesson.
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
                            {Math.round(
                              (quizScore! / quizQuestions.length) * 100
                            )}
                            %
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-medium">
                              {quizScore} correct answers out of{' '}
                              {quizQuestions.length} questions
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
                                  {Math.round(
                                    (quizScore! / quizQuestions.length) * 100
                                  )}
                                  %
                                </span>
                              </div>
                              <Progress
                                value={
                                  (quizScore! / quizQuestions.length) * 100
                                }
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
                </div>
                <QuizDialog
                  open={quizOpen}
                  onOpenChange={setQuizOpen}
                  questions={quizQuestions || []}
                />
              </TabsContent>
            </Tabs>

            {/* Navigation Buttons prev and next lecture */}
            <div className="flex justify-between items-center pt-6 mt-6 border-t">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() =>
                  previous &&
                  handleContentSelect(previous.moduleId, previous.lesson)
                }
                disabled={!previous}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous Lesson
              </Button>
              <Button
                variant="default"
                className="flex items-center gap-2"
                onClick={() =>
                  next && handleContentSelect(next.moduleId, next.lesson)
                }
                disabled={!next}
              >
                Next Lesson
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar module and lecture label */}
        <div className="border-l bg-card">
          {/* Search */}
          <div className="p-2 border-b">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search in course"
                className="pl-10 py-6 h-11 bg-background"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Progress */}
          <div className="p-4 border-b bg-background/50">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">
                  {completedLessons}/{totalLessons} lessons completed
                </span>
                <span className="text-muted-foreground">
                  {completedModules}/{modules.length} modules
                </span>
              </div>
              <Progress value={percentage} className="h-2" />
              <p className="text-xs text-muted-foreground text-right">
                Overall Progress: {percentage}%
              </p>
            </div>
          </div>

          {/* Modules List */}
          <div className="overflow-auto h-[calc(100vh-180px)]">
            {filteredModules.length > 0 ? (
              filteredModules.map((module) => (
                <Collapsible
                  key={module.id}
                  open={openModules.includes(module.id)}
                  onOpenChange={() => toggleModule(module.id)}
                  className="border-b"
                >
                  <CollapsibleTrigger className="flex w-full items-start justify-between py-5 px-6 hover:bg-accent transition-colors">
                    <div className="flex items-center gap-3">
                      {module.completed ? (
                        <CheckCircle className="h-6 w-6 text-emerald-500 flex-shrink-0 min-w-[24px] min-h-[24px] self-start" />
                      ) : (
                        <Circle className="h-6 w-6" />
                      )}
                      <div className="text-sm text-left w-full">
                        <h3 className="font-medium text-base mb-1 break-words">
                          {module.title}
                        </h3>
                        <p className="text-muted-foreground">
                          {module.duration}
                        </p>
                      </div>
                    </div>
                    {openModules.includes(module.id) ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
                    )}
                  </CollapsibleTrigger>
                  <CollapsibleContent className="bg-accent/50">
                    {module.lessons.map((lesson) => (
                      <Button
                        key={lesson.id}
                        variant="ghost"
                        className={cn(
                          'w-full justify-start gap-3 py-4 px-6 font-normal hover:bg-accent pl-14 relative transition-all duration-200 h-auto',
                          lesson.completed && 'text-emerald-500',
                          currentContent.lessonId === lesson.id &&
                            "bg-primary/10 dark:bg-primary/20 border-l-4 border-primary font-medium shadow-sm before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-primary before:content-['']"
                        )}
                        onClick={() =>
                          handleContentSelect(module.id, lesson as Lesson)
                        }
                      >
                        <div className="self-start mt-1">
                          {lesson.completed ? (
                            <CheckCircle className="h-6 w-6 shrink-0" />
                          ) : lesson.type === 'video' ? (
                            <Video className="h-6 w-6 shrink-0 text-muted-foreground" />
                          ) : (
                            <FileText className="h-6 w-6 shrink-0 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex flex-col items-start gap-1 text-left">
                          <p className="text-sm leading-normal break-words">
                            {lesson.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {lesson.duration}
                          </p>
                        </div>
                      </Button>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              ))
            ) : (
              <div className="p-8 text-center">
                <p className="text-muted-foreground">
                  No modules match your search
                </p>
                <Button
                  variant="link"
                  onClick={() => setSearch('')}
                  className="mt-2"
                >
                  Clear search
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

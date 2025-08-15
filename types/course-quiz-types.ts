export interface CourseQuizQuestion {
  id: number
  documentId: string
  title: string
  options: Array<{
    id: string
    text: string
  }>
  points: number
  difficulty: string
  text: string
  timeLimit: number
  tags: string
  questionType: 'singleChoice' | 'multipleChoice'
}

export interface CourseQuiz {
  id: number
  documentId: string
  title: string
  passingScore: number
  instructions: string
  questions: CourseQuizQuestion[]
}

export interface CourseQuizSubmissionResponse {
  score: number
  totalScore: number
  percentage: number
  passed: boolean
  answers: Array<{
    questionId: string | number
    correct: boolean
    selectedAnswers: string[] // Changed from userAnswer to selectedAnswers for consistency
    correctAnswers: string[]
    points: number
    explanation?: string
  }>
}

// Add new interface for existing submission check
export interface ExistingQuizSubmission {
  id: number
  documentId: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  locale: null
  submissionDate: string
  score: number
  passed: boolean
  answers: Array<{
    questionId: string
    correct: boolean
    explanation: string | null
    points: number
    correctAnswers: string[]
    userAnswer: string[] // This stays as userAnswer since it comes from server
  }>
  timeSpent: number | null
  attempts: number
}

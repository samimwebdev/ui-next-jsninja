import type React from "react"
export interface BaseLessonType {
  id: string
  title: string
  duration: string
  completed: boolean
  type: "video" | "text"
}

export interface Lesson extends BaseLessonType {
  url: string
}

export interface Module {
  id: string
  title: string
  duration: string
  lessons: Lesson[]
  isActive?: boolean
  completed?: boolean
}

export interface CurrentContent {
  moduleId: string
  lessonId: string
  title: string
  description?: string
  type: "video" | "text"
}

export interface ActionButton {
  icon: React.ComponentType<{ className?: string }>
  label: string
  content: {
    title: string
    description: string
    body: React.ReactNode
  }
}

export interface Resource {
  title: string
  description: string
  type: string
  url: string
  icon: React.ComponentType<{ className?: string }>
}

export interface VideoDescription {
  title: string
  subtitle: string
  description: string
  features: string[]
}

export interface QuizQuestion {
  id: number
  question: string
  options: string[]
  correctAnswer: number[]
  type: "multiple"
}

export type QuizState = "intro" | "question" | "results"

export interface QuizStorageData {
  lessonId: string
  answers: Record<number, number[]>
  currentQuestion: number
  quizState: QuizState
  visitedQuestions: number[]
}

export interface Assignment {
  title: string
  description: string
  totalScore: number
  expiryDate: string
  requirements: string[]
  submissionTypes: {
    githubRepo: boolean
    githubLive: boolean
    codeEditor: boolean
  }
  status: "pending" | "submitted" | "graded"
  score?: number
  feedback?: string
  submission?: {
    githubRepo?: string
    githubLive?: string
    code?: string
    submittedAt?: string
  }
}


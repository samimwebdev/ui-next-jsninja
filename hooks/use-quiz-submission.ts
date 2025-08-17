import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getQuizSubmission,
  submitQuiz,
  type QuizSubmissionData,
} from '@/app/course-view/[slug]/actions'

interface QuizSubmissionResponse {
  score: number
  totalScore: number
  percentage: number
  passed: boolean
  answers: {
    questionId: string | number
    correct: boolean
    correctAnswers: string[]
    points: number
    userAnswer?: string[] | undefined
    selectedAnswers?: string[] | undefined
    explanation?: string | undefined
  }[]
}

// Define the mutation options type
interface SubmitQuizOptions {
  onSuccess?: (data: QuizSubmissionResponse) => void
  onError?: (error: Error) => void
}

interface UseQuizSubmissionParams {
  quizId: string | null
  courseSlug: string
  moduleDocumentId: string
  lessonDocumentId: string
  enabled?: boolean
}

export function useQuizSubmission({
  quizId,
  courseSlug,
  moduleDocumentId,
  lessonDocumentId,
  enabled = true,
}: UseQuizSubmissionParams) {
  const queryClient = useQueryClient()

  // Query for existing submission using server action
  const query = useQuery({
    queryKey: ['quiz-submission', quizId],
    queryFn: async () => {
      if (!quizId) return null
      return await getQuizSubmission(
        courseSlug,
        moduleDocumentId,
        lessonDocumentId,
        quizId
      )
    },
    enabled: enabled && !!quizId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })

  // Mutation for submitting quiz using server action
  const submitMutation = useMutation({
    mutationFn: async (submissionData: QuizSubmissionData) => {
      if (!quizId) throw new Error('Missing quiz ID')
      return await submitQuiz(
        courseSlug,
        moduleDocumentId,
        lessonDocumentId,
        quizId,
        submissionData
      )
    },
    onSuccess: (data) => {
      // Invalidate and update the cache
      queryClient.invalidateQueries({ queryKey: ['quiz-submission', quizId] })
      queryClient.setQueryData(['quiz-submission', quizId], data)
      toast.success('Quiz submitted successfully!')
    },
    onError: (error) => {
      toast.error('Failed to submit quiz')
      console.error('Quiz submission error:', error)
    },
  })

  // Create a wrapper function that accepts options
  const submitQuizMutation = (
    submissionData: QuizSubmissionData,
    options?: SubmitQuizOptions
  ) => {
    submitMutation.mutate(submissionData, {
      onSuccess: (data) => {
        options?.onSuccess?.(data)
      },
      onError: (error) => {
        options?.onError?.(error)
      },
    })
  }

  return {
    existingSubmission: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    submitQuiz: submitQuizMutation,
    isSubmitting: submitMutation.isPending,
    submitError: submitMutation.error,
  }
}

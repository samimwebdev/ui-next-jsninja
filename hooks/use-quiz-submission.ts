import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { strapiFetch } from '@/lib/strapi'
import { toast } from 'sonner'
import type {
  ExistingQuizSubmission,
  CourseQuizSubmissionResponse,
} from '@/types/course-quiz-types'

interface SubmissionData {
  answers: {
    questionId: string
    selectedAnswers: string[]
  }[]
}

export function useQuizSubmission({
  quizId,
  courseSlug,
  moduleDocumentId,
  lessonDocumentId,
  token,
  enabled = true,
}: {
  quizId: string | null
  courseSlug: string
  moduleDocumentId: string
  lessonDocumentId: string
  token: string | null
  enabled?: boolean
}) {
  const queryClient = useQueryClient()

  console.log({ token }, 'token inside useQuizSubmission')

  // Query for existing submission
  const query = useQuery({
    queryKey: ['quiz-submission', lessonDocumentId, quizId, moduleDocumentId],
    queryFn: async (): Promise<ExistingQuizSubmission | null> => {
      if (!quizId || !token) return null

      const apiUrl = `/api/course-view/${courseSlug}/${moduleDocumentId}/${lessonDocumentId}/${quizId}/assessment-quiz`

      try {
        return await strapiFetch<ExistingQuizSubmission>(apiUrl, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      } catch (error) {
        console.log('No existing quiz submission found', error)
        return null
      }
    },
    enabled: enabled && !!quizId && !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })

  // Mutation for submitting quiz
  const submitMutation = useMutation({
    mutationFn: async (
      submissionData: SubmissionData
    ): Promise<CourseQuizSubmissionResponse> => {
      if (!token || !quizId) throw new Error('Missing required data')

      const apiUrl = `/api/course-view/${courseSlug}/${moduleDocumentId}/${lessonDocumentId}/${quizId}/assessment-quiz`

      return await strapiFetch<CourseQuizSubmissionResponse>(apiUrl, {
        method: 'POST',
        body: JSON.stringify(submissionData),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
    },
    onSuccess: (data) => {
      // Invalidate and update the cache
      queryClient.invalidateQueries({
        queryKey: [
          'quiz-submission',
          lessonDocumentId,
          quizId,
          moduleDocumentId,
        ],
      })

      // Set the data immediately for instant UI update
      queryClient.setQueryData(
        ['quiz-submission', lessonDocumentId, quizId, moduleDocumentId],
        data
      )

      toast.success('Quiz submitted successfully!')
    },
    onError: (error) => {
      toast.error('Failed to submit quiz')
      console.error('Quiz submission error:', error)
    },
  })

  return {
    existingSubmission: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    submitQuiz: submitMutation.mutate,
    isSubmitting: submitMutation.isPending,
    submitError: submitMutation.error,
  }
}

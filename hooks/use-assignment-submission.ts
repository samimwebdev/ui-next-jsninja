import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { strapiFetch } from '@/lib/strapi'
import { toast } from 'sonner'

interface ExistingAssignmentSubmission {
  id: number
  documentId: string
  feedback: string | null
  submissionStatus: 'submitted' | 'pending' | 'graded'
  submittedDate: string
  resultScore: number | null
  repoLink: string | null
  liveLink: string | null
  code: string | null
}

// Define interfaces for API types
interface AssignmentSubmissionRequest {
  courseId: string
  assignmentId: string
  repoLink?: string
  liveLink?: string
  code?: string
}

interface AssignmentSubmissionResponse {
  data: ExistingAssignmentSubmission
}

// Define the mutation options type
interface SubmitAssignmentOptions {
  onSuccess?: (data: AssignmentSubmissionResponse) => void
  onError?: (error: Error) => void
}

interface UseAssignmentSubmissionParams {
  assignmentId: string | null
  courseId: string
  token: string | null
  enabled?: boolean
}

export function useAssignmentSubmission({
  assignmentId,
  courseId,
  token,
  enabled = true,
}: UseAssignmentSubmissionParams) {
  const queryClient = useQueryClient()

  // Query for existing submission
  const query = useQuery({
    queryKey: ['assignment-submission', assignmentId],
    queryFn: async (): Promise<ExistingAssignmentSubmission | null> => {
      if (!assignmentId || !token) return null

      const queryParams = new URLSearchParams({
        courseId: courseId || '',
        assignmentId: assignmentId,
      }).toString()

      try {
        const response = await strapiFetch<{
          data: ExistingAssignmentSubmission
        }>(`/api/assignment-submissions?${queryParams}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        return response.data
      } catch (error) {
        console.log('No existing assignment submission found', error)
        return null
      }
    },
    enabled: enabled && !!assignmentId && !!token,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })

  // Mutation for submitting assignment
  const submitMutation = useMutation({
    mutationFn: async (
      submissionData: AssignmentSubmissionRequest
    ): Promise<AssignmentSubmissionResponse> => {
      if (!token) throw new Error('Missing auth token')

      return await strapiFetch<AssignmentSubmissionResponse>(
        '/api/assignment-submissions',
        {
          method: 'POST',
          body: JSON.stringify({ data: submissionData }),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )
    },
    onSuccess: (data) => {
      // Invalidate and update the cache
      queryClient.invalidateQueries({
        queryKey: ['assignment-submission', assignmentId],
      })
      queryClient.setQueryData(
        ['assignment-submission', assignmentId],
        data.data
      )

      toast.success('Assignment submitted successfully!')
    },
    onError: (error) => {
      toast.error('Failed to submit assignment')
      console.error('Assignment submission error:', error)
    },
  })

  // Create a wrapper function that accepts options
  const submitAssignment = (
    submissionData: AssignmentSubmissionRequest,
    options?: SubmitAssignmentOptions
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
    submitAssignment,
    isSubmitting: submitMutation.isPending,
    submitError: submitMutation.error,
  }
}

// Export types for use in components
export type { ExistingAssignmentSubmission, AssignmentSubmissionRequest }

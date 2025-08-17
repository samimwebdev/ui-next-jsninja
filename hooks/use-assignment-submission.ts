import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getAssignmentSubmission,
  submitAssignment,
  type ExistingAssignmentSubmission,
  type AssignmentSubmissionRequest,
} from '@/app/course-view/[slug]/actions'

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
  enabled?: boolean
}

export function useAssignmentSubmission({
  assignmentId,
  courseId,
  enabled = true,
}: UseAssignmentSubmissionParams) {
  const queryClient = useQueryClient()

  // Query for existing submission using server action
  const query = useQuery({
    queryKey: ['assignment-submission', assignmentId],
    queryFn: async (): Promise<ExistingAssignmentSubmission | null> => {
      if (!assignmentId) return null
      return await getAssignmentSubmission(courseId, assignmentId)
    },
    enabled: enabled && !!assignmentId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })

  // Mutation for submitting assignment using server action
  const submitMutation = useMutation({
    mutationFn: async (submissionData: AssignmentSubmissionRequest) => {
      return await submitAssignment(submissionData)
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
  const submitAssignmentMutation = (
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
    submitAssignment: submitAssignmentMutation,
    isSubmitting: submitMutation.isPending,
    submitError: submitMutation.error,
  }
}

// Export types for use in components
export type { ExistingAssignmentSubmission, AssignmentSubmissionRequest }

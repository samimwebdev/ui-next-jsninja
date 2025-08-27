'use client'

import { useState } from 'react'
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import {
  Pencil,
  Trash,
  Star,
  Plus,
  AlertTriangle,
  MessageSquare,
  Loader2,
  Lock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
// import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import {
  fetchReviews,
  createReview,
  updateReview,
  deleteReview,
} from '@/lib/actions/review'
import { CreateReviewData, UpdateReviewData } from '@/types/review-types'
import {
  stripHtmlTags,
  formatReviewDate,
  truncateText,
} from '@/lib/review-utils'

// Updated Yup validation schema with designation
const reviewFormSchema = yup.object({
  course: yup.string().required('Please select a course'),
  rating: yup.string().required('Please select a rating'),
  designation: yup
    .string()
    .required('Designation is required')
    .min(2, 'Designation must be at least 2 characters')
    .max(100, 'Designation must not exceed 100 characters'),
  comment: yup
    .string()
    .min(10, 'Comment must be at least 10 characters long')
    .max(500, 'Comment must not exceed 500 characters')
    .required('Comment is required'),
})

type ReviewFormValues = yup.InferType<typeof reviewFormSchema>

function ReviewCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-4" />
          ))}
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </CardContent>
    </Card>
  )
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <Card className="border-destructive/20 bg-destructive/5">
      <CardContent className="pt-6">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <div>
            <h3 className="font-medium text-destructive">
              Error Loading Reviews
            </h3>
            <p className="text-sm text-destructive/80 mt-1">{message}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function EmptyState() {
  return (
    <Card className="border-dashed border-2">
      <CardContent className="pt-12 pb-12 text-center">
        <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-xl font-semibold mb-2">No reviews yet</h3>
        <p className="text-muted-foreground max-w-sm mx-auto">
          Share your experience with courses you have completed to help other
          learners.
        </p>
      </CardContent>
    </Card>
  )
}

export default function ReviewsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null)
  const [deleteReviewId, setDeleteReviewId] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const {
    data: reviewsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['reviews'],
    queryFn: fetchReviews,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  })

  // Create review mutation
  const createReviewMutation = useMutation({
    mutationFn: createReview,
    onSuccess: () => {
      toast.success('Success', {
        description: 'Your review has been successfully added.',
      })
      setIsDialogOpen(false)
      form.reset()
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
    },
    onError: (error: Error) => {
      toast.error('Error', {
        description:
          error.message || 'Failed to create review. Please try again.',
      })
    },
  })

  // Update review mutation
  const updateReviewMutation = useMutation({
    mutationFn: updateReview,
    onSuccess: () => {
      toast.success('Success', {
        description: 'Your review has been successfully updated.',
      })
      setIsDialogOpen(false)
      setEditingReviewId(null)
      form.reset()
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
    },
    onError: (error: Error) => {
      toast.error('Error', {
        description:
          error.message || 'Failed to update review. Please try again.',
      })
    },
  })

  // Delete review mutation
  const deleteReviewMutation = useMutation({
    mutationFn: deleteReview,
    onSuccess: () => {
      toast.success('Success', {
        description: 'Your review has been successfully deleted.',
      })
      setDeleteReviewId(null)
      queryClient.invalidateQueries({ queryKey: ['reviews'] })
    },
    onError: (error: Error) => {
      toast.error('Error', {
        description:
          error.message || 'Failed to delete review. Please try again.',
      })
    },
  })

  const form = useForm<ReviewFormValues>({
    resolver: yupResolver(reviewFormSchema),
    defaultValues: {
      course: '',
      rating: '',
      designation: '',
      comment: '',
    },
  })

  const reviews = reviewsData?.data.reviews || []
  const enrolledCourses = reviewsData?.data.enrolledCourses || []

  const handleEdit = (review: (typeof reviews)[0]) => {
    // Prevent editing if review is approved
    if (review.reviewApproved) {
      toast.error('Cannot Edit', {
        description: 'This review has been approved and cannot be edited.',
      })
      return
    }

    setEditingReviewId(review.documentId)
    form.reset({
      course: review.course.documentId,
      rating: review.rating.toString(),
      designation: review.designation || '', // Handle empty designation
      comment: stripHtmlTags(review.reviewDetails),
    })
    setIsDialogOpen(true)
  }

  const handleDeleteClick = (reviewId: string) => {
    const review = reviews.find((r) => r.documentId === reviewId)

    // Prevent deletion if review is approved
    if (review?.reviewApproved) {
      toast.error('Cannot Delete', {
        description: 'This review has been approved and cannot be deleted.',
      })
      return
    }

    setDeleteReviewId(reviewId)
  }

  const handleDeleteConfirm = () => {
    if (deleteReviewId) {
      deleteReviewMutation.mutate(deleteReviewId)
    }
  }

  const handleAddNew = () => {
    setEditingReviewId(null)
    form.reset({
      course: '',
      rating: '',
      designation: '',
      comment: '',
    })
    setIsDialogOpen(true)
  }

  const onSubmit = async (data: ReviewFormValues) => {
    if (editingReviewId) {
      // Update existing review
      const updateData: UpdateReviewData = {
        documentId: editingReviewId,
        content: data.comment,
        rating: parseInt(data.rating),
        designation: data.designation,
      }
      updateReviewMutation.mutate(updateData)
    } else {
      // Create new review
      const createData: CreateReviewData = {
        courseId: data.course,
        rating: parseInt(data.rating),
        designation: data.designation,
        content: data.comment,
      }
      createReviewMutation.mutate(createData)
    }
  }

  const isSubmitting =
    createReviewMutation.isPending || updateReviewMutation.isPending

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Reviews</h3>
            <p className="text-sm text-muted-foreground">
              Manage your course reviews.
            </p>
          </div>
          <Button onClick={handleAddNew}>
            <Plus className="mr-2 h-4 w-4" />
            Add Review
          </Button>
        </div>
        <ErrorMessage
          message={
            error instanceof Error ? error.message : 'Failed to load reviews'
          }
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Reviews</h3>
          <p className="text-sm text-muted-foreground">
            Manage your course reviews.
          </p>
        </div>
        <Button onClick={handleAddNew} disabled={isLoading}>
          <Plus className="mr-2 h-4 w-4" />
          Add Review
        </Button>
      </div>

      {/* Stats */}
      {/* {!isLoading && reviews.length > 0 && (
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span>
              {reviews.length} Review
              {reviews.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            <span>
              {reviews.filter((r) => r.reviewApproved).length} Approved
            </span>
          </div>
        </div>
      )} */}

      {/* Fixed loading condition to prevent flash */}
      {isLoading || !reviewsData ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <ReviewCardSkeleton key={i} />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <EmptyState />
      ) : (
        <TooltipProvider>
          <div className="grid gap-4 md:grid-cols-2">
            {reviews.map((review) => (
              <Card key={review.documentId}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-base">
                          {review.course.title}
                        </CardTitle>
                        {/* {review.reviewApproved ? (
                          <Badge
                            variant="outline"
                            className="text-xs bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                          >
                            Approved
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800"
                          >
                            Pending
                          </Badge>
                        )} */}
                      </div>
                      <CardDescription>
                        {formatReviewDate(review.createdAt)}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Edit Button with conditional tooltip */}
                      {review.reviewApproved ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled
                              className="opacity-50 cursor-not-allowed"
                            >
                              <Lock className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Review is approved and cannot be edited</p>
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(review)}
                          disabled={deleteReviewMutation.isPending}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}

                      {/* Delete Button with conditional tooltip */}
                      {review.reviewApproved ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled
                              className="opacity-50 cursor-not-allowed"
                            >
                              <Lock className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Review is approved and cannot be deleted</p>
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(review.documentId)}
                          disabled={deleteReviewMutation.isPending}
                        >
                          {deleteReviewMutation.isPending &&
                          deleteReviewId === review.documentId ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating
                            ? 'fill-primary text-primary'
                            : 'text-muted-foreground'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-muted-foreground">
                      {review.rating}/5
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {truncateText(stripHtmlTags(review.reviewDetails), 150)}
                  </p>

                  {/* Additional info */}
                  <div className="mt-3 pt-3 border-t border-muted/50">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>By {review.reviewerName}</span>
                      {review.designation && <span>{review.designation}</span>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TooltipProvider>
      )}

      {/* Add/Edit Review Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingReviewId ? 'Edit Review' : 'Add Review'}
            </DialogTitle>
            <DialogDescription>
              Share your thoughts about the course to help other learners.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="course"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Course</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoading || !!editingReviewId} // Disable course selection when editing
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a course" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {enrolledCourses.map((course) => (
                          <SelectItem
                            key={course.courseId}
                            value={course.courseId}
                          >
                            {course.courseName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Show rating field for both create and edit */}
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select rating" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <SelectItem key={rating} value={rating.toString()}>
                            <div className="flex items-center gap-2">
                              <div className="flex gap-1">
                                {Array.from({ length: rating }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className="h-3 w-3 fill-primary text-primary"
                                  />
                                ))}
                              </div>
                              <span>
                                {rating} {rating === 1 ? 'Star' : 'Stars'}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Added designation field */}
              <FormField
                control={form.control}
                name="designation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Designation</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Software Developer at XYZ, Student in Dhaka University, etc."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Your current role or profession (2-100 characters).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Review</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Share your experience with this course..."
                        className="resize-none min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Your review should be between 10 and 500 characters.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {editingReviewId ? 'Updating...' : 'Submitting...'}
                    </>
                  ) : editingReviewId ? (
                    'Update Review'
                  ) : (
                    'Submit Review'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteReviewId}
        onOpenChange={() => setDeleteReviewId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Review</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this review? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteReviewMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleteReviewMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteReviewMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

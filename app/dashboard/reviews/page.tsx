'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Pencil, Trash, Star, Plus } from 'lucide-react'
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
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

const reviewFormSchema = z.object({
  course: z.string().min(1, 'Please select a course'),
  rating: z.string().min(1, 'Please select a rating'),
  comment: z
    .string()
    .min(10, 'Comment must be at least 10 characters long')
    .max(500, 'Comment must not exceed 500 characters'),
})

type ReviewFormValues = z.infer<typeof reviewFormSchema>

// Mock data
const initialReviews = [
  {
    id: '1',
    course: 'React Masterclass',
    rating: 5,
    comment: 'Excellent course! The instructor explains everything clearly.',
    date: '2024-02-20',
  },
  {
    id: '2',
    course: 'Node.js Advanced',
    rating: 4,
    comment: 'Very informative content. Could use more practical examples.',
    date: '2024-01-15',
  },
]

export default function ReviewsPage() {
  const [reviews, setReviews] = useState(initialReviews)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null)

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      course: '',
      rating: '',
      comment: '',
    },
  })

  const handleEdit = (review: (typeof initialReviews)[0]) => {
    setEditingReviewId(review.id)
    form.reset({
      course: review.course,
      rating: review.rating.toString(),
      comment: review.comment,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setReviews(reviews.filter((review) => review.id !== id))
    toast.success('Success', {
      description: 'Your review has been successfully deleted.',
    })
  }

  const onSubmit = (data: ReviewFormValues) => {
    if (editingReviewId) {
      // Update existing review
      setReviews(
        reviews.map((review) =>
          review.id === editingReviewId
            ? {
                ...review,
                course: data.course,
                rating: Number.parseInt(data.rating),
                comment: data.comment,
              }
            : review
        )
      )
      toast.success('Success ', {
        description: 'Your review has been successfully updated.',
      })
    } else {
      // Add new review
      setReviews([
        ...reviews,
        {
          id: String(Date.now()),
          ...data,
          rating: Number.parseInt(data.rating),
          date: new Date().toISOString().split('T')[0],
        },
      ])
      toast.success('Success ', {
        description: 'Your review has been successfully added.',
      })
    }
    setIsDialogOpen(false)
    setEditingReviewId(null)
    form.reset()
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
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Review
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{review.course}</CardTitle>
                  <CardDescription>{review.date}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(review)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(review.id)}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1 mb-2">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">{review.comment}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingReviewId ? 'Edit Review' : 'Add Review'}
            </DialogTitle>
            <DialogDescription>
              Share your thoughts about the course.
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
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a course" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="React Masterclass">
                          React Masterclass
                        </SelectItem>
                        <SelectItem value="Node.js Advanced">
                          Node.js Advanced
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                            {rating} {rating === 1 ? 'Star' : 'Stars'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comment</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Write your review..."
                        className="resize-none"
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
                <Button type="submit">
                  {editingReviewId ? 'Update Review' : 'Submit Review'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

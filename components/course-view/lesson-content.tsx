import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Assignment, Resource } from '@/types/course-view-types'
import { ResourceList } from './resource-list'
import { QuizSection } from './quiz-section'
import { AssignmentSection } from './assignment-section'
import { CurrentContent } from '@/types/course-view-types'
import type {
  CourseQuiz,
  ExistingQuizSubmission,
} from '@/types/course-quiz-types'
import { strapiFetch } from '@/lib/strapi'
import { getAuthToken } from '@/lib/auth'

interface LessonContentProps {
  currentContent: CurrentContent
  resources: Resource[]
  quiz: CourseQuiz | null
  assignment?: Assignment
  courseSlug: string
  moduleDocumentId: string
}

// Interface for existing assignment submission
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

// Helper function to create quiz submission promise
function createQuizSubmissionPromise(
  quiz: CourseQuiz | null,
  courseSlug: string,
  moduleDocumentId: string,
  lessonId: string
): Promise<ExistingQuizSubmission | null> {
  if (!quiz?.documentId) {
    return Promise.resolve(null)
  }

  const apiUrl = `/api/course-view/${courseSlug}/${moduleDocumentId}/${lessonId}/${quiz.documentId}/assessment-quiz`

  return getAuthToken().then((token) => {
    if (!token) return null // If no token, no need to make the call

    return strapiFetch<ExistingQuizSubmission | null>(apiUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).catch((error) => {
      // This will catch 401/403 errors if the token is invalid
      console.log('No existing quiz submission found:', error.message)
      return null
    })
  })
}

// Helper function to create assignment submission promise
function createAssignmentSubmissionPromise(
  assignment: Assignment | undefined,
  courseId: string
): Promise<ExistingAssignmentSubmission | null> {
  if (!assignment?.documentId) {
    return Promise.resolve(null)
  }

  const query = new URLSearchParams({
    courseId: courseId || '',
    assignmentId: assignment.documentId,
  }).toString()

  return getAuthToken().then((token) => {
    if (!token) return null // If no token, no need to make the call

    return strapiFetch<{ data: ExistingAssignmentSubmission }>(
      `/api/assignment-submissions?${query}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((response) => response.data)
      .catch((error) => {
        // This will catch 401/403 errors if the token is invalid
        console.log('No existing assignment submission found:', error.message)
        return null
      })
  })
}

export function LessonContent({
  currentContent,
  resources,
  quiz,
  assignment,
  courseSlug,
  moduleDocumentId,
}: LessonContentProps) {
  // Create promises directly without hooks for SSR compatibility
  const existingQuizSubmissionPromise = createQuizSubmissionPromise(
    quiz,
    courseSlug,
    moduleDocumentId,
    currentContent.lessonId || ''
  )

  const existingAssignmentSubmissionPromise = createAssignmentSubmissionPromise(
    assignment,
    currentContent.courseId || ''
  )

  return (
    <>
      {currentContent.type === 'video' ? (
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-3">{currentContent.title}</h1>

          {/* Content Tabs */}
          <Tabs defaultValue="description" className="mt-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="description">Video Description</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="quiz">Quiz</TabsTrigger>
              <TabsTrigger value="assignment">Assignment</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-4 space-y-4">
              <div className="prose dark:prose-invert max-w-none">
                {currentContent.content?.length < 1 ? (
                  <p className="whitespace-pre-line text-muted-foreground">
                    No description available for this video.
                  </p>
                ) : (
                  <p
                    className="text-muted-foreground leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: currentContent.content }}
                  />
                )}
              </div>
            </TabsContent>

            <TabsContent value="resources" className="mt-4 space-y-4">
              {resources.length === 0 ? (
                <div className="text-muted-foreground">
                  No resources available for this lesson.
                </div>
              ) : (
                <ResourceList resources={resources} />
              )}
            </TabsContent>

            <TabsContent value="quiz" className="mt-4">
              <QuizSection
                quiz={quiz}
                courseSlug={courseSlug}
                lessonDocumentId={currentContent.lessonId || ''}
                moduleDocumentId={moduleDocumentId}
                existingSubmissionPromise={existingQuizSubmissionPromise}
              />
            </TabsContent>

            <TabsContent value="assignment" className="mt-4">
              {assignment ? (
                <AssignmentSection
                  assignment={assignment}
                  courseId={currentContent.courseId}
                  assignmentId={assignment.documentId}
                  existingSubmissionPromise={
                    existingAssignmentSubmissionPromise
                  }
                />
              ) : (
                <div className="text-muted-foreground">
                  No assignment available for this lesson.
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      ) : null}
    </>
  )
}

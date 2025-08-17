'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Assignment, Resource } from '@/types/course-view-types'
import { ResourceList } from './resource-list'
import { QuizSection } from './quiz-section'
import { AssignmentSection } from './assignment-section'
import { CurrentContent } from '@/types/course-view-types'
import type { CourseQuiz } from '@/types/course-quiz-types'

interface LessonContentProps {
  currentContent: CurrentContent
  resources: Resource[]
  quiz: CourseQuiz | null
  assignment?: Assignment
  courseSlug: string
  moduleDocumentId: string
  token: string | null
}

export function LessonContent({
  currentContent,
  resources,
  quiz,
  assignment,
  courseSlug,
  moduleDocumentId,
  token,
}: LessonContentProps) {
  return (
    <>
      {currentContent.type === 'video' ? (
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-3">{currentContent.title}</h1>

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
                token={token}
              />
            </TabsContent>

            <TabsContent value="assignment" className="mt-4">
              {assignment ? (
                <AssignmentSection
                  assignment={assignment}
                  courseId={currentContent.courseId}
                  assignmentId={assignment.documentId}
                  token={token}
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

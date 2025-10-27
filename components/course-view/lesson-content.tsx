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
}

export function LessonContent({
  currentContent,
  resources,
  quiz,
  assignment,
  courseSlug,
  moduleDocumentId,
}: LessonContentProps) {
  return (
    <>
      {currentContent.type === 'video' ? (
        <div className="p-4 sm:p-6 md:p-8">
          <h1 className="text-xl sm:text-2xl font-bold mb-3">
            {currentContent.title}
          </h1>

          <Tabs defaultValue="description" className="mt-4 sm:mt-6">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
              <TabsTrigger
                value="description"
                className="text-xs sm:text-sm py-2.5 sm:py-2"
              >
                <span className="hidden sm:inline">Video Description</span>
                <span className="sm:hidden">Description</span>
              </TabsTrigger>
              <TabsTrigger
                value="resources"
                className="text-xs sm:text-sm py-2.5 sm:py-2"
              >
                Resources
              </TabsTrigger>
              <TabsTrigger
                value="quiz"
                className="text-xs sm:text-sm py-2.5 sm:py-2"
              >
                Quiz
              </TabsTrigger>
              <TabsTrigger
                value="assignment"
                className="text-xs sm:text-sm py-2.5 sm:py-2"
              >
                Assignment
              </TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="mt-4 space-y-4">
              <div className="prose dark:prose-invert max-w-none prose-sm sm:prose-base">
                {currentContent.content?.length < 1 ? (
                  <p className="whitespace-pre-line text-sm sm:text-base text-muted-foreground">
                    No description available for this video.
                  </p>
                ) : (
                  <div
                    className="text-sm sm:text-base text-muted-foreground leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: currentContent.content }}
                  />
                )}
              </div>
            </TabsContent>

            <TabsContent value="resources" className="mt-4 space-y-4">
              {resources.length === 0 ? (
                <div className="text-sm sm:text-base text-muted-foreground">
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
              />
            </TabsContent>

            <TabsContent value="assignment" className="mt-4">
              {assignment ? (
                <AssignmentSection
                  assignment={assignment}
                  courseId={currentContent.courseId}
                  assignmentId={assignment.documentId}
                />
              ) : (
                <div className="text-sm sm:text-base text-muted-foreground">
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

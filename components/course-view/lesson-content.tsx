'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type {
  Assignment,
  QuizQuestion,
  Resource,
} from '@/types/course-view-types'
import { ResourceList } from './resource-list'
import { QuizSection } from './quiz-section'
import { AssignmentSection } from './assignment-section'
import { CurrentContent } from '@/types/course-view-types'

interface LessonContentProps {
  currentContent: CurrentContent
  resources: Resource[]
  quizQuestions: QuizQuestion[]
  assignment?: Assignment
}

export function LessonContent({
  currentContent,
  resources,
  quizQuestions,
  assignment,
}: LessonContentProps) {
  return (
    <>
      {currentContent.type === 'video' ? (
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-3">{currentContent.title}</h1>

          {/* <p className="text-muted-foreground mb-8">{currentContent.content}</p> */}

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
                {currentContent.content.length < 1 ? (
                  <p className="whitespace-pre-line text-muted-foreground">
                    No description available for this video.
                  </p>
                ) : (
                  <p
                    className="text-muted-foreground leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: currentContent.content }}
                  />
                )}

                {/* <h3 className="text-lg font-semibold mt-6 mb-3">Features:</h3>
            <p>{videoDescription}</p> */}
                {/* <ul className="space-y-2 list-disc pl-6">
              {videoDescription.features?.map((feature, index) => (
                <li key={index} className="text-muted-foreground">
                  {feature}
                </li>
              ))}
            </ul> */}
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
              {quizQuestions.length > 0 ? (
                <QuizSection quizQuestions={quizQuestions} />
              ) : (
                <div className="text-muted-foreground">
                  No quiz available for this lesson.
                </div>
              )}
            </TabsContent>

            <TabsContent value="assignment" className="mt-4">
              {assignment ? (
                <AssignmentSection
                  assignment={assignment}
                  courseId={currentContent.courseId} // This should now work correctly
                  assignmentId={assignment.documentId}
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

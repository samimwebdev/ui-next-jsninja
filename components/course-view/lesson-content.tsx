'use client'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type {
  Assignment,
  CurrentContent,
  QuizQuestion,
  Resource,
  VideoDescription,
} from './types/course'
import { ResourceList } from './resource-list'
import { QuizSection } from './quiz-section'
import { AssignmentSection } from './assignment-section'

interface LessonContentProps {
  currentContent: CurrentContent
  videoDescription: VideoDescription
  resources: Resource[]
  quizQuestions: QuizQuestion[]
  assignment: Assignment
}

export function LessonContent({
  currentContent,
  videoDescription,
  resources,
  quizQuestions,
  assignment,
}: LessonContentProps) {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-3">{currentContent.title}</h1>
      <p className="text-muted-foreground mb-8">{currentContent.description}</p>

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
            <p className="text-muted-foreground leading-relaxed">
              {videoDescription.description}
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3">Features:</h3>
            <ul className="space-y-2 list-disc pl-6">
              {videoDescription.features.map((feature, index) => (
                <li key={index} className="text-muted-foreground">
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="resources" className="mt-4 space-y-4">
          <ResourceList resources={resources} />
        </TabsContent>

        <TabsContent value="quiz" className="mt-4">
          <QuizSection quizQuestions={quizQuestions} />
        </TabsContent>

        <TabsContent value="assignment" className="mt-4">
          <AssignmentSection assignment={assignment} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
